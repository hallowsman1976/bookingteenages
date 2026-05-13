const SERVICES = [
    { id: 1, name: "รับบริการฝังยาคุมกำเนิด", emoji: "💊" },
    { id: 2, name: "รับบริการถอดยาฝังคุมกำเนิด", emoji: "🩹" },
    { id: 3, name: "รับบริการถอดและฝังยาคุมกำเนิด", emoji: "🔄" },
    { id: 4, name: "รับบริการล้างแผล", emoji: "🧼" },
    { id: 5, name: "รับคำปรึกษาการคุมกำเนิด", emoji: "💬" }
];

const TIME_SLOTS = ["09.00-09.30", "09.30-10.00", "10.00-10.30", "10.30-11.00", "11.00-11.30", "13.00-13.30", "13.30-14.00", "14.00-14.30", "14.30-15.00"];

let selectedService = "";
let userProfile = null;

// Initialize LIFF
async function initLIFF() {
    try {
        await liff.init({ liffId: CONFIG.LIFF_ID });
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            userProfile = await liff.getProfile();
            renderServices();
            renderTuesdays();
        }
    } catch (err) {
        console.error("LIFF Error", err);
    }
}

// Render รายการบริการ
function renderServices() {
    const container = document.getElementById('service-options');
    SERVICES.forEach(s => {
        const div = document.createElement('div');
        div.className = "bg-white p-4 rounded-2xl shadow-sm border-2 border-transparent cursor-pointer hover:border-blue-400 transition-all flex items-center space-x-4";
        div.innerHTML = `<span class="text-2xl">${s.emoji}</span><span class="font-medium text-gray-700">${s.name}</span>`;
        div.onclick = () => {
            selectedService = s.name;
            document.querySelectorAll('#service-options div').forEach(el => el.classList.remove('border-blue-500', 'bg-blue-50'));
            div.classList.add('border-blue-500', 'bg-blue-50');
            document.getElementById('step-2').classList.remove('hidden');
        };
        container.appendChild(div);
    });
}

// สร้าง Dropdown วันอังคาร
function renderTuesdays() {
    const select = document.getElementById('booking-date');
    const dates = [];
    let d = new Date();
    while (dates.length < 8) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() === 2) { // วันอังคาร
            const value = d.toISOString().split('T')[0];
            const text = d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            const option = new Option(text, value);
            select.add(option);
            dates.push(value);
        }
    }

    select.addEventListener('change', async (e) => {
        if (!e.target.value) return;
        showLoading(true);
        const slots = await checkAvailableSlots(e.target.value);
        renderTimeSlots(slots);
        showLoading(false);
    });
}

// ตรวจสอบเวลาว่างจาก Supabase
async function checkAvailableSlots(date) {
    const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)
        .eq('status', 'pending');
    
    if (error) return TIME_SLOTS;
    const booked = data.map(b => b.booking_time);
    return TIME_SLOTS.map(t => ({ time: t, isFull: booked.includes(t) }));
}

function renderTimeSlots(slots) {
    const container = document.getElementById('time-slots-container');
    container.innerHTML = "";
    slots.forEach(s => {
        const btn = document.createElement('button');
        btn.disabled = s.isFull;
        btn.className = `p-3 rounded-xl text-sm font-medium transition-all ${s.isFull ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 shadow-sm hover:bg-blue-500 hover:text-white'}`;
        btn.innerText = s.isFull ? `${s.time} (เต็ม)` : s.time;
        btn.onclick = () => {
            window.selectedTime = s.time;
            document.querySelectorAll('#time-slots-container button').forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
            btn.classList.add('bg-blue-600', 'text-white');
            document.getElementById('step-3').classList.remove('hidden');
        };
        container.appendChild(btn);
    });
}

// บันทึกข้อมูล
document.getElementById('btn-submit').onclick = async () => {
    const fullName = document.getElementById('full_name').value;
    const age = parseInt(document.getElementById('age').value);
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const date = document.getElementById('booking-date').value;
    const consent = document.getElementById('consent').checked;

    // Validation
    if (!fullName || !age || !phone || !address || !window.selectedTime) {
        return Swal.fire("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
    }
    if (age < 10 || age > 59) return Swal.fire("อายุไม่ถูกต้อง", "กรุณาระบุอายุระหว่าง 10-59 ปี", "warning");
    if (phone.length < 9) return Swal.fire("เบอร์โทรไม่ถูกต้อง", "กรุณาตรวจสอบเบอร์ติดต่อ", "warning");
    if (!consent) return Swal.fire("ยินยอมข้อมูล", "กรุณาติ๊กยินยอมให้ใช้ข้อมูลเพื่อการนัดหมาย", "warning");

    showLoading(true);
    
    // บันทึกลง Supabase
    const { error } = await supabase.from('bookings').insert([{
        line_user_id: userProfile.userId,
        line_display_name: userProfile.displayName,
        full_name: fullName,
        age: age,
        phone: phone,
        address: address,
        service_type: selectedService,
        booking_date: date,
        booking_time: window.selectedTime,
        status: 'pending'
    }]);

    if (error) {
        showLoading(false);
        if (error.code === '23505') return Swal.fire("ขออภัย", "ช่วงเวลานี้ถูกจองไปแล้วในขณะที่คุณกำลังทำรายการ กรุณาเลือกเวลาอื่น", "error");
        return Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่", "error");
    }

    // เรียก Edge Function ส่งแจ้งเตือน Admin
    await fetch(CONFIG.LINE_NOTIFY_FUNCTION_URL, {
        method: 'POST',
        body: JSON.stringify({
            type: "booking_created",
            payload: {
                full_name: fullName,
                phone: phone,
                service_type: selectedService,
                date_thai: document.getElementById('booking-date').options[document.getElementById('booking-date').selectedIndex].text,
                booking_time: window.selectedTime,
                age: age,
                address: address
            }
        })
    });

    showLoading(false);
    Swal.fire("จองคิวสำเร็จ!", "เจ้าหน้าที่จะรอรับบริการตามวันและเวลาที่นัดหมาย", "success").then(() => {
        liff.closeWindow();
    });
};

function showLoading(show) {
    document.getElementById('loading-overlay').classList.toggle('hidden', !show);
}

initLIFF();
