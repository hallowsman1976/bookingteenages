// =====================================================
// js/admin.js
// Logic สำหรับหน้า Admin Dashboard (admin.html)
// =====================================================

let allBookings = [];
let filteredBookings = [];
let adminUser = null;

// =====================================================
// เริ่มต้นหน้า Admin
// =====================================================
function initAdminPage() {
  // ตรวจสอบ session
  adminUser = getAdminSession();

  if (!adminUser) {
    showLoginSection();
    return;
  }

  showDashboardSection();
  loadDashboardData();
}

// =====================================================
// แสดงส่วน Login
// =====================================================
function showLoginSection() {
  document.getElementById("loginSection")?.classList.remove("hidden");
  document.getElementById("dashboardSection")?.classList.add("hidden");
}

// =====================================================
// แสดงส่วน Dashboard
// =====================================================
function showDashboardSection() {
  document.getElementById("loginSection")?.classList.add("hidden");
  document.getElementById("dashboardSection")?.classList.remove("hidden");

  // แสดงชื่อ admin
  const adminNameEl = document.getElementById("adminName");
  if (adminNameEl && adminUser) {
    adminNameEl.textContent = adminUser.full_name || adminUser.username;
  }
}

// =====================================================
// Login Admin
// =====================================================
async function handleAdminLogin(e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!username || !password) {
    showWarning("กรุณากรอกข้อมูล", "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
    return;
  }

  showLoading("กำลังเข้าสู่ระบบ...");

  const result = await adminLogin(username, password);

  hideLoading();

  if (!result.success) {
    showError("เข้าสู่ระบบไม่สำเร็จ", result.message);
    return;
  }

  adminUser = result.admin;
  showDashboardSection();
  await loadDashboardData();
}

// =====================================================
// Logout
// =====================================================
function handleLogout() {
  Swal.fire({
    title: "ออกจากระบบ",
    text: "คุณต้องการออกจากระบบหรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ออกจากระบบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed) {
      clearAdminSession();
      showLoginSection();
    }
  });
}

// =====================================================
// โหลดข้อมูล Dashboard
// =====================================================
async function loadDashboardData() {
  showLoading("กำลังโหลดข้อมูล...");

  const filters = getActiveFilters();
  const result = await getAllBookings(filters);

  hideLoading();

  if (!result.success) {
    showError("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
    return;
  }

  allBookings = result.data || [];
  filteredBookings = [...allBookings];

  // กรองด้วย search keyword
  applySearchFilter();
  updateSummaryCards();
  renderBookingsTable();
}

// =====================================================
// ดึงค่า filter ปัจจุบัน
// =====================================================
function getActiveFilters() {
  return {
    status: document.getElementById("filterStatus")?.value || "all",
    date: document.getElementById("filterDate")?.value || "",
    service: document.getElementById("filterService")?.value || "all",
  };
}

// =====================================================
// กรองด้วย Search Keyword
// =====================================================
function applySearchFilter() {
  const keyword = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";

  if (!keyword) {
    filteredBookings = [...allBookings];
  } else {
    filteredBookings = allBookings.filter((b) =>
      (b.full_name || "").toLowerCase().includes(keyword) ||
      (b.phone || "").includes(keyword) ||
      (b.service_type || "").toLowerCase().includes(keyword) ||
      (b.address || "").toLowerCase().includes(keyword)
    );
  }

  renderBookingsTable();
  updateSummaryCards();
}

// =====================================================
// อัปเดต Summary Cards
// =====================================================
function updateSummaryCards() {
  const today = getTodayISO();

  const todayCount = allBookings.filter((b) => b.booking_date === today && b.status === "pending").length;
  const totalCount = allBookings.length;
  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const cancelledCount = allBookings.filter((b) => b.status === "cancelled").length;
  const completedCount = allBookings.filter((b) => b.status === "completed").length;

  const el = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  el("countToday", todayCount);
  el("countTotal", totalCount);
  el("countPending", pendingCount);
  el("countCancelled", cancelledCount);
  el("countCompleted", completedCount);
  el("countFiltered", filteredBookings.length);
}

// =====================================================
// Render ตารางรายการจอง
// =====================================================
function renderBookingsTable() {
  const tbody = document.getElementById("bookingsTableBody");
  const emptyState = document.getElementById("tableEmptyState");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (filteredBookings.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  filteredBookings.forEach((booking, index) => {
    const row = createTableRow(booking, index + 1);
    tbody.appendChild(row);
  });
}

// =====================================================
// สร้างแถวตาราง
// =====================================================
function createTableRow(booking, no) {
  const tr = document.createElement("tr");
  tr.className = "border-b border-gray-100 hover:bg-gray-50 transition-colors";

  const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS["pending"];
  const dateLabel = formatThaiDateShort(booking.booking_date);

  tr.innerHTML = `
    <td class="px-3 py-3 text-center text-sm text-gray-500">${no}</td>
    <td class="px-3 py-3">
      <div class="font-medium text-gray-800 text-sm">${booking.full_name}</div>
      <div class="text-xs text-gray-400">${booking.line_display_name || "-"}</div>
    </td>
    <td class="px-3 py-3 text-sm text-gray-600 hidden md:table-cell">${booking.phone}</td>
    <td class="px-3 py-3 hidden lg:table-cell">
      <div class="text-sm text-gray-700">${booking.service_type}</div>
    </td>
    <td class="px-3 py-3">
      <div class="text-sm font-medium text-gray-700">${dateLabel}</div>
      <div class="text-xs text-gray-500">${booking.booking_time} น.</div>
    </td>
    <td class="px-3 py-3">
      <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}">
        ${statusInfo.label}
      </span>
    </td>
    <td class="px-3 py-3">
      <div class="flex gap-1 flex-wrap">
        <button
          onclick="showBookingDetail('${booking.id}')"
          class="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
        >
          ดู
        </button>
        ${
          booking.status === "pending"
            ? `
          <button
            onclick="changeStatus('${booking.id}', 'completed')"
            class="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition"
          >
            มาแล้ว
          </button>
          <button
            onclick="changeStatus('${booking.id}', 'no_show')"
            class="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition"
          >
            ไม่มา
          </button>
          <button
            onclick="changeStatus('${booking.id}', 'cancelled')"
            class="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition"
          >
            ยกเลิก
          </button>
        `
            : ""
        }
      </div>
    </td>
  `;

  return tr;
}

// =====================================================
// แสดงรายละเอียดการจอง
// =====================================================
function showBookingDetail(bookingId) {
  const booking = allBookings.find((b) => b.id === bookingId);
  if (!booking) return;

  const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS["pending"];

  Swal.fire({
    title: "รายละเอียดการจอง",
    html: `
      <div class="text-left text-sm space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">ชื่อ-สกุล</p>
            <p class="font-semibold">${booking.full_name}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">อายุ</p>
            <p class="font-semibold">${booking.age} ปี</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">เบอร์ติดต่อ</p>
            <p class="font-semibold">${booking.phone}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">LINE</p>
            <p class="font-semibold text-xs">${booking.line_display_name || "-"}</p>
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-2">
          <p class="text-xs text-gray-400">ที่อยู่</p>
          <p class="font-semibold">${booking.address}</p>
        </div>
        <div class="bg-cyan-50 rounded-lg p-2 space-y-1">
          <p class="text-xs text-cyan-400">ข้อมูลนัดหมาย</p>
          <p><span class="text-gray-500">บริการ:</span> <strong>${booking.service_type}</strong></p>
          <p><span class="text-gray-500">วันที่:</span> <strong>${formatThaiDate(booking.booking_date)}</strong></p>
          <p><span class="text-gray-500">เวลา:</span> <strong>${booking.booking_time} น.</strong></p>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-gray-500">สถานะ:</p>
          <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}">
            ${statusInfo.label}
          </span>
        </div>
        ${
          booking.cancel_reason
            ? `
          <div class="bg-red-50 rounded-lg p-2">
            <p class="text-xs text-red-400">เหตุผลยกเลิก</p>
            <p class="text-red-600">${booking.cancel_reason}</p>
          </div>
        `
            : ""
        }
        <p class="text-xs text-gray-400 text-right">จองเมื่อ ${formatThaiDateTime(booking.created_at)}</p>
      </div>
    `,
    confirmButtonText: "ปิด",
    confirmButtonColor: "#06b6d4",
    width: "90%",
    customClass: { popup: "rounded-2xl" },
  });
}

// =====================================================
// เปลี่ยนสถานะการจอง
// =====================================================
async function changeStatus(bookingId, newStatus) {
  const statusInfo = STATUS_LABELS[newStatus];
  const booking = allBookings.find((b) => b.id === bookingId);
  if (!booking) return;

  const result = await Swal.fire({
    title: `เปลี่ยนสถานะเป็น "${statusInfo.label}"`,
    text: `ยืนยันการเปลี่ยนสถานะของ ${booking.full_name}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#06b6d4",
    cancelButtonColor: "#6b7280",
  });

  if (!result.isConfirmed) return;

  showLoading("กำลังอัปเดต...");

  const updateResult = await updateBookingStatus(bookingId, newStatus);

  hideLoading();

  if (!updateResult.success) {
    showError("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้");
    return;
  }

  // อัปเดต local data
  const idx = allBookings.findIndex((b) => b.id === bookingId);
  if (idx !== -1) allBookings[idx].status = newStatus;

  applySearchFilter();
  updateSummaryCards();

  Swal.fire({
    icon: "success",
    title: "อัปเดตสำเร็จ",
    timer: 1500,
    showConfirmButton: false,
  });
}

// =====================================================
// Export CSV
// =====================================================
function handleExportCSV() {
  const data = filteredBookings.length > 0 ? filteredBookings : allBookings;
  const today = getTodayISO();
  exportToCSV(data, `bookings_${today}.csv`);
}

// =====================================================
// Populate Service Filter Dropdown
// =====================================================
function populateServiceFilter() {
  const select = document.getElementById("filterService");
  if (!select) return;

  SERVICES.forEach((service) => {
    const opt = document.createElement("option");
    opt.value = service.name;
    opt.textContent = service.name;
    select.appendChild(opt);
  });
}

// =====================================================
// เริ่มต้นเมื่อ DOM พร้อม
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  initAdminPage();
  populateServiceFilter();

  // Form Login
  document.getElementById("loginForm")?.addEventListener("submit", handleAdminLogin);

  // ปุ่ม Logout
  document.getElementById("btnLogout")?.addEventListener("click", handleLogout);
  document.getElementById("btnLogoutMobile")?.addEventListener("click", handleLogout);

  // ปุ่ม Export CSV
  document.getElementById("btnExportCSV")?.addEventListener("click", handleExportCSV);

  // ปุ่ม Refresh
  document.getElementById("btnRefreshData")?.addEventListener("click", loadDashboardData);

  // Search input (debounce)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(applySearchFilter, 300));
  }

  // Filters
  ["filterStatus", "filterDate", "filterService"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", loadDashboardData);
  });
});
