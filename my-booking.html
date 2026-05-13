// =====================================================
// js/my-booking.js
// Logic สำหรับหน้าตรวจสอบ/ยกเลิกคิว (my-booking.html)
// =====================================================

let currentUser = null;
let myBookingsList = [];

// =====================================================
// เริ่มต้นหน้า My Booking
// =====================================================
async function initMyBookingPage() {
  showLoading("กำลังโหลดข้อมูล...");

  // เริ่มต้น LIFF
  const user = await initLiff();
  if (!user) {
    hideLoading();
    return;
  }

  currentUser = user;

  // แสดงชื่อผู้ใช้
  const userNameEl = document.getElementById("userName");
  if (userNameEl) userNameEl.textContent = user.displayName;

  // โหลดรายการจอง
  await loadMyBookings();

  hideLoading();
}

// =====================================================
// โหลดรายการจองของฉัน
// =====================================================
async function loadMyBookings() {
  const container = document.getElementById("bookingList");
  const emptyState = document.getElementById("emptyState");

  if (!container) return;

  showLoading("กำลังโหลดรายการจอง...");

  const result = await getMyBookings(currentUser.userId);

  hideLoading();

  if (!result.success) {
    showError("เกิดข้อผิดพลาด", "ไม่สามารถโหลดรายการได้ กรุณาลองใหม่");
    return;
  }

  myBookingsList = result.data || [];

  if (myBookingsList.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  // แสดงรายการจอง
  container.innerHTML = "";
  myBookingsList.forEach((booking) => {
    container.appendChild(renderBookingCard(booking));
  });
}

// =====================================================
// สร้าง Card แสดงข้อมูลการจอง
// =====================================================
function renderBookingCard(booking) {
  const card = document.createElement("div");
  card.className = "booking-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden";
  card.dataset.bookingId = booking.id;

  const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS["pending"];
  const dateLabel = formatThaiDate(booking.booking_date);
  const createdLabel = formatThaiDateTime(booking.created_at);

  card.innerHTML = `
    <!-- Header -->
    <div class="bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl">${getServiceIcon(booking.service_type) || "🏥"}</span>
        <div>
          <p class="text-white font-semibold text-sm leading-tight">${booking.service_type}</p>
          <p class="text-cyan-100 text-xs">จองเมื่อ ${createdLabel}</p>
        </div>
      </div>
      <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}">
        ${statusInfo.label}
      </span>
    </div>

    <!-- Body -->
    <div class="p-4 space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-1">📅 วันที่นัด</p>
          <p class="text-sm font-semibold text-gray-700 leading-snug">${dateLabel}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-1">⏰ เวลา</p>
          <p class="text-sm font-semibold text-gray-700">${booking.booking_time} น.</p>
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl p-3 space-y-1">
        <div class="flex gap-2 text-sm">
          <span class="text-gray-400">👤</span>
          <span class="text-gray-700">${booking.full_name}</span>
        </div>
        <div class="flex gap-2 text-sm">
          <span class="text-gray-400">📞</span>
          <span class="text-gray-700">${booking.phone}</span>
        </div>
      </div>

      ${
        booking.status === "pending"
          ? `
        <button
          onclick="confirmCancelBooking('${booking.id}')"
          class="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm transition-all duration-200 hover:bg-red-100 active:scale-95"
        >
          🗑️ ยกเลิกการจองนี้
        </button>
      `
          : booking.cancel_reason
          ? `
        <div class="bg-red-50 rounded-xl p-3">
          <p class="text-xs text-red-400">เหตุผลการยกเลิก</p>
          <p class="text-sm text-red-600 mt-1">${booking.cancel_reason}</p>
        </div>
      `
          : ""
      }
    </div>
  `;

  return card;
}

// =====================================================
// ยืนยันการยกเลิกคิว
// =====================================================
async function confirmCancelBooking(bookingId) {
  // ขอเหตุผลการยกเลิก
  const { value: cancelReason, isConfirmed } = await Swal.fire({
    title: "🗑️ ยกเลิกการจอง",
    html: `
      <p class="text-sm text-gray-600 mb-3">กรุณาระบุเหตุผลการยกเลิก (ไม่บังคับ)</p>
      <textarea
        id="cancelReasonInput"
        class="swal2-textarea w-full"
        placeholder="เช่น ติดธุระ ไม่สะดวก หรือเหตุอื่นๆ"
        rows="3"
        style="font-family: 'Mitr', sans-serif; font-size: 14px;"
      ></textarea>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยันยกเลิก",
    cancelButtonText: "ไม่ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    preConfirm: () => {
      return document.getElementById("cancelReasonInput").value.trim() || "ไม่ระบุ";
    },
  });

  if (!isConfirmed) return;

  // ดำเนินการยกเลิก
  showLoading("กำลังยกเลิกการจอง...");

  const booking = myBookingsList.find((b) => b.id === bookingId);
  const result = await cancelBooking(bookingId, currentUser.userId, cancelReason);

  if (!result.success) {
    hideLoading();
    showError("ไม่สามารถยกเลิกได้", result.message || "กรุณาลองใหม่อีกครั้ง");
    return;
  }

  // ส่งแจ้งเตือน Admin ผ่าน LINE Messaging API
  await sendLineNotification({
    type: "booking_cancelled",
    booking: {
      full_name: result.booking.full_name,
      service_type: result.booking.service_type,
      booking_date: result.booking.booking_date,
      booking_date_thai: formatThaiDate(result.booking.booking_date),
      booking_time: result.booking.booking_time,
      cancel_reason: cancelReason,
    },
  });

  hideLoading();

  await showSuccess("ยกเลิกคิวสำเร็จ", "ช่วงเวลาดังกล่าวจะถูกเปิดให้จองได้อีกครั้ง");

  // โหลดรายการใหม่
  await loadMyBookings();
}

// =====================================================
// เริ่มต้นเมื่อ DOM พร้อม
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  initMyBookingPage();

  // ปุ่มรีเฟรช
  document.getElementById("btnRefresh")?.addEventListener("click", loadMyBookings);
});
