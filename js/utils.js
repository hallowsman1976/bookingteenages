// =====================================================
// js/utils.js
// ฟังก์ชันช่วยเหลือทั่วไป
// =====================================================

// แปลงวันที่เป็นภาษาไทย พ.ศ.
function formatThaiDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.
  const dayName = THAI_DAYS[date.getDay()];
  return `วัน${dayName}ที่ ${day} ${month} ${year}`;
}

// แปลงวันที่สั้นๆ ภาษาไทย
function formatThaiDateShort(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

// แปลงวันที่และเวลาเป็นภาษาไทย
function formatThaiDateTime(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

// ตรวจสอบว่าวันที่เป็นวันอังคารหรือไม่
function isTuesday(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.getDay() === 2; // 2 = วันอังคาร
}

// สร้างรายการวันอังคารล่วงหน้า 8 สัปดาห์
function getNextTuesdays(weeks = 8) {
  const tuesdays = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // เริ่มจากวันนี้หรือวันอังคารถัดไป
  const start = new Date(today);

  // หาวันอังคารแรกที่ >= วันนี้
  const dayOfWeek = start.getDay();
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;
  start.setDate(start.getDate() + daysUntilTuesday);

  for (let i = 0; i < weeks; i++) {
    const tuesday = new Date(start);
    tuesday.setDate(start.getDate() + i * 7);

    // แปลงเป็น ISO date string (YYYY-MM-DD)
    const isoDate = tuesday.toISOString().split("T")[0];
    tuesdays.push({
      isoDate,
      thaiLabel: formatThaiDate(isoDate),
    });
  }

  return tuesdays;
}

// Validate เบอร์โทรศัพท์ (9-10 หลัก)
function validatePhone(phone) {
  const phoneRegex = /^[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/-/g, "").trim());
}

// Validate อายุ (10-59 ปี)
function validateAge(age) {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 10 && ageNum <= 59;
}

// แสดง Loading Overlay
function showLoading(message = "กำลังโหลด...") {
  const overlay = document.getElementById("loadingOverlay");
  const msg = document.getElementById("loadingMessage");
  if (overlay) {
    if (msg) msg.textContent = message;
    overlay.classList.remove("hidden");
  }
}

// ซ่อน Loading Overlay
function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

// แสดง SweetAlert2 สำเร็จ
function showSuccess(title, text = "") {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#06b6d4",
    fontFamily: "'Mitr', sans-serif",
  });
}

// แสดง SweetAlert2 ข้อผิดพลาด
function showError(title, text = "") {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#ef4444",
  });
}

// แสดง SweetAlert2 แจ้งเตือน
function showWarning(title, text = "") {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#f59e0b",
  });
}

// แสดง SweetAlert2 ยืนยัน
function showConfirm(title, text = "", confirmText = "ยืนยัน", cancelText = "ยกเลิก") {
  return Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });
}

// Export ข้อมูลเป็น CSV
function exportToCSV(data, filename = "bookings.csv") {
  if (!data || data.length === 0) {
    showWarning("ไม่มีข้อมูล", "ไม่มีรายการที่จะ Export");
    return;
  }

  // หัวตาราง CSV ภาษาไทย
  const headers = [
    "ลำดับ", "ชื่อ-สกุล", "อายุ", "ที่อยู่", "เบอร์ติดต่อ",
    "ประเภทบริการ", "วันที่นัด", "เวลา", "สถานะ",
    "เหตุผลยกเลิก", "LINE Display Name", "วันที่จอง",
  ];

  const rows = data.map((item, index) => [
    index + 1,
    item.full_name || "",
    item.age || "",
    item.address || "",
    item.phone || "",
    item.service_type || "",
    item.booking_date || "",
    item.booking_time || "",
    STATUS_LABELS[item.status]?.label || item.status || "",
    item.cancel_reason || "",
    item.line_display_name || "",
    formatThaiDateTime(item.created_at),
  ]);

  // สร้าง CSV content
  const csvContent =
    "\uFEFF" + // BOM สำหรับภาษาไทยใน Excel
    [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  // Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// แปลง ISO date เป็น YYYY-MM-DD
function toISODateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// วันนี้ในรูปแบบ YYYY-MM-DD
function getTodayISO() {
  return toISODateString(new Date());
}

// ดึงชื่อบริการจาก id
function getServiceName(serviceId) {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service ? service.name : serviceId;
}

// ดึง icon บริการจาก id
function getServiceIcon(serviceId) {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service ? service.icon : "🏥";
}

// Debounce function สำหรับ search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
