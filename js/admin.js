/**
 * Click to Care : Admin Logic
 * จัดการรายการจอง, เปลี่ยนสถานะ และ Export ข้อมูล
 */

let allBookings = [];

// 1. เริ่มต้นโหลดข้อมูล
async function initAdmin() {
    // ในระบบจริงควรมีระบบ Login ตรวจสอบ Session ที่นี่
    // showLoading(true);
    await fetchBookings();
    setupEventListeners();
    // showLoading(false);
}

// 2. ดึงข้อมูลจาก Supabase
async function fetchBookings() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: true });

    if (error) {
        console.error('Error fetching bookings:', error);
        return;
    }

    allBookings = data;
    renderStats();
    renderTable(allBookings);
}

// 3. แสดงผลสถิติ (Cards)
function renderStats() {
    const statsContainer = document.getElementById('stats');
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        today: allBookings.filter(b => b.booking_date === today).length,
        total: allBookings.length,
        pending: allBookings.filter(b => b.status === 'pending').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length
    };

    const cards = [
        { label: 'คิววันนี้', value: stats.today, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'คิวรอรับบริการ', value: stats.pending, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'ยกเลิกแล้ว', value: stats.cancelled, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'รวมทั้งหมด', value: stats.total, color: 'text-gray-600', bg: 'bg-gray-50' }
    ];

    statsContainer.innerHTML = cards.map(c => `
        <div class="${c.bg} p-4 rounded-2xl shadow-sm border border-white">
            <p class="text-xs text-gray-500 mb-1">${c.label}</p>
            <p class="text-2xl font-bold ${c.color}">${c.value}</p>
        </div>
    `).join('');
}

// 4. แสดงผลตารางรายการ
function renderTable(data) {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';

    data.forEach(item => {
        const dateThai = new Date(item.booking_date).toLocaleDateString('th-TH', {
            day: '2-digit', month: 'short', year: '2-digit'
        });

        const statusLabel = {
            pending: { text: 'รอรับบริการ', class: 'status-pending' },
            completed: { text: 'เสร็จสิ้น', class: 'status-completed' },
            cancelled: { text: 'ยกเลิก', class: 'status-cancelled' },
            no_show: { text: 'ไม่มา', class: 'status-no_show' }
        };

        const currentStatus = statusLabel[item.status] || statusLabel.pending;

        const tr = document.createElement('tr');
        tr.className = "border-b hover:bg-gray-50 transition-colors";
        tr.innerHTML = `
            <td class="p-4">
                <div class="text-sm font-medium text-gray-900">${dateThai}</div>
                <div class="text-xs text-gray-500">${item.booking_time} น.</div>
            </td>
            <td class="p-4">
                <div class="text-sm font-medium">${item.full_name}</div>
                <div class="text-xs text-blue-600">${item.phone}</div>
            </td>
            <td class="p-4">
                <div class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block">
                    ${item.service_type}
                </div>
            </td>
            <td class="p-4">
                <span class="badge ${currentStatus.class}">${currentStatus.text}</span>
            </td>
            <td class="p-4">
                <select onchange="updateStatus('${item.id}', this.value)" class="text-xs p-1 border rounded bg-white">
                    <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>รอรับบริการ</option>
                    <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>เสร็จสิ้น</option>
                    <option value="no_show" ${item.status === 'no_show' ? 'selected' : ''}>ไม่มา</option>
                    <option value="cancelled" ${item.status === 'cancelled' ? 'selected' : ''}>ยกเลิก</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. อัปเดตสถานะการจอง
async function updateStatus(id, newStatus) {
    const { isConfirmed } = await Swal.fire({
        title: 'ยืนยันการเปลี่ยนสถานะ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    });

    if (!isConfirmed) {
        fetchBookings(); // คืนค่าเดิมใน Select
        return;
    }

    const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        Swal.fire('ผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้', 'error');
    } else {
        Swal.fire({
            title: 'อัปเดตแล้ว',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
        fetchBookings();
    }
}

// 6. ระบบค้นหาและตัวกรอง
function setupEventListeners() {
    const searchInput = document.getElementById('search');
    const statusFilter = document.getElementById('filter-status');

    const filterData = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusTerm = statusFilter.value;

        const filtered = allBookings.filter(item => {
            const matchSearch = item.full_name.toLowerCase().includes(searchTerm) || 
                               item.phone.includes(searchTerm);
            const matchStatus = statusTerm === "" || item.status === statusTerm;
            return matchSearch && matchStatus;
        });

        renderTable(filtered);
    };

    searchInput.addEventListener('input', filterData);
    statusFilter.addEventListener('change', filterData);
}

// 7. Export ข้อมูลเป็น CSV (รองรับภาษาไทย)
function exportCSV() {
    if (allBookings.length === 0) return;

    let csvContent = "\uFEFF"; // BOM เพื่อให้ Excel อ่านภาษาไทยได้
    csvContent += "วันที่,เวลา,ชื่อ-นามสกุล,อายุ,เบอร์โทร,บริการ,สถานะ,เหตุผลการยกเลิก\n";

    allBookings.forEach(item => {
        const row = [
            item.booking_date,
            item.booking_time,
            item.full_name,
            item.age,
            item.phone,
            item.service_type,
            item.status,
            item.cancel_reason || '-'
        ].join(",");
        csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// เรียกใช้งานเมื่อโหลดหน้า
initAdmin();
