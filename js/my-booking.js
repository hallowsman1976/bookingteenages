async function initMyBooking() {
    try {
        await liff.init({ liffId: CONFIG.LIFF_ID });
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            const profile = await liff.getProfile();
            loadBookings(profile.userId);
        }
    } catch (err) { console.error(err); }
}

async function loadBookings(userId) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('line_user_id', userId)
        .eq('status', 'pending')
        .order('booking_date', { ascending: true });

    const container = document.getElementById('booking-list');
    if (data.length === 0) {
        document.getElementById('no-booking').classList.remove('hidden');
        return;
    }

    data.forEach(item => {
        const dateThai = new Date(item.booking_date).toLocaleDateString('th-TH', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });
        
        const card = document.createElement('div');
        card.className = "booking-card p-6 shadow-md border border-white relative";
        card.innerHTML = `
            <div class="mb-3">
                <span class="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">รอรับบริการ</span>
            </div>
            <h3 class="font-bold text-lg text-gray-800">${item.service_type}</h3>
            <p class="text-gray-600 text-sm mt-1">🗓️ วันอังคารที่ ${dateThai}</p>
            <p class="text-gray-600 text-sm">⏰ เวลา ${item.booking_time} น.</p>
            <div class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-400 font-light">ชื่อผู้จอง: ${item.full_name}</p>
            </div>
            <button onclick="cancelBooking('${item.id}', '${item.full_name}', '${item.service_type}', '${dateThai}')" 
                class="mt-4 w-full py-2 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors">
                ยกเลิกนัดหมาย
            </button>
        `;
        container.appendChild(card);
    });
}

async function cancelBooking(id, name, service, date) {
    const { value: reason } = await Swal.fire({
        title: 'ยกเลิกนัดหมาย?',
        text: "คุณต้องการยกเลิกการนัดหมายนี้ใช่หรือไม่?",
        input: 'text',
        inputPlaceholder: 'ระบุเหตุผล (ถ้ามี)',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ยืนยันการยกเลิก',
        cancelButtonText: 'ปิด'
    });

    if (reason !== undefined) {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled', cancel_reason: reason || 'ไม่ระบุ' })
            .eq('id', id);

        if (!error) {
            // แจ้ง Admin ผ่าน Edge Function
            await fetch(CONFIG.LINE_NOTIFY_FUNCTION_URL, {
                method: 'POST',
                body: JSON.stringify({
                    type: "booking_cancelled",
                    payload: { full_name: name, service_type: service, date_thai: date, reason: reason || 'ไม่ระบุ' }
                })
            });

            Swal.fire('สำเร็จ', 'ยกเลิกนัดหมายเรียบร้อยแล้ว', 'success').then(() => location.reload());
        }
    }
}

initMyBooking();
