// =====================================================
// js/booking.js
// Logic สำหรับหน้าจองคิว (booking.html)
// =====================================================

// สถานะการจองปัจจุบัน
let bookingState = {
  lineUserId: null,
  lineDisplayName: null,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
};

// =====================================================
// เริ่มต้นหน้า Booking
// =====================================================
async function initBookingPage() {
  showLoading("กำลังเตรียมระบบ...");

  // เริ่มต้น LIFF
  const user = await initLiff();
  if (!user) {
    hideLoading();
    return;
  }

  bookingState.lineUserId = user.userId;
  bookingState.lineDisplayName = user.displayName;

  // แสดงชื่อผู้ใช้
  const userNameEl = document.getElementById("userName");
  if (userNameEl) userNameEl.textContent = user.displayName;

  // สร้างการ์ดบริการ
  renderServiceCards();

  // สร้างรายการวันอังคาร
  renderDateOptions();

  hideLoading();
}

// =====================================================
// สร้างการ์ดบริการให้เลือก
// =====================================================
function renderServiceCards() {
  const container = document.getElementById("serviceCards");
  if (!container) return;

  container.innerHTML = "";
  SERVICES.forEach((service) => {
    const card = document.createElement("div");
    card.className =
      "service-card cursor-pointer rounded-2xl border-2 border-transparent bg-white p-4 shadow-sm transition-all duration-200 hover:border-cyan-400 hover:shadow-md";
    card.dataset.serviceId = service.id;
    card.dataset.serviceName = service.name;

    card.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-3xl">${service.icon}</span>
        <div class="flex-1">
          <p class="font-semibold text-gray-800 text-sm leading-snug">${service.name}</p>
          <p class="text-xs text-gray-500 mt-1">${service.description}</p>
        </div>
        <div class="check-icon hidden w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>
    `;

    card.addEventListener("click", () => selectService(service.id, service.name, card));
    container.appendChild(card);
  });
}

// =====================================================
// เลือกบริการ
// =====================================================
function selectService(serviceId, serviceName, cardEl) {
  // ล้างการเลือกเดิม
  document.querySelectorAll(".service-card").forEach((c) => {
    c.classList.remove("border-cyan-500", "bg-cyan-50", "selected");
    c.querySelector(".check-icon")?.classList.add("hidden");
  });

  // เลือกการ์ดใหม่
  cardEl.classList.add("border-cyan-500", "bg-cyan-50", "selected");
  cardEl.querySelector(".check-icon")?.classList.remove("hidden");

  bookingState.selectedService = serviceId;

  // เลื่อนไปส่วนเลือกวันที่
  setTimeout(() => {
    document.getElementById("dateSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
}

// =====================================================
// สร้างรายการวันอังคารให้เลือก
// =====================================================
function renderDateOptions() {
  const container = document.getElementById("dateOptions");
  if (!container) return;

  const tuesdays = getNextTuesdays(8);
  container.innerHTML = "";

  tuesdays.forEach((tuesday) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "date-btn w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50";
    btn.dataset.date = tuesday.isoDate;
    btn.textContent = tuesday.thaiLabel;

    btn.addEventListener("click", () => selectDate(tuesday.isoDate, btn));
    container.appendChild(btn);
  });
}

// =====================================================
// เลือกวันที่
// =====================================================
async function selectDate(dateStr, btnEl) {
  // ล้างการเลือกเดิม
  document.querySelectorAll(".date-btn").forEach((b) => {
    b.classList.remove("border-cyan-500", "bg-cyan-50", "selected");
  });

  // เลือกวันใหม่
  btnEl.classList.add("border-cyan-500", "bg-cyan-50", "selected");
  bookingState.selectedDate = dateStr;
  bookingState.selectedTime = null;

  // โหลดช่วงเวลาว่าง
  await loadAvailableSlots(dateStr);

  // เลื่อนไปส่วนเลือกเวลา
  setTimeout(() => {
    document.getElementById("timeSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
}

// =====================================================
// โหลดช่วงเวลาว่างของวันที่เลือก
// =====================================================
async function loadAvailableSlots(dateStr) {
  const container = document.getElementById("timeSlots");
  const noSlotMsg = document.getElementById("noSlotMessage");
  if (!container) return;

  container.innerHTML = `
    <div class="col-span-2 text-center py-4 text-gray-400">
      <svg class="animate-spin w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      กำลังตรวจสอบช่วงเวลาว่าง...
    </div>
  `;

  // ดึงช่วงเวลาที่ถูกจองแล้ว
  const bookedSlots = await getBookedSlots(dateStr);

  container.innerHTML = "";

  let morningSlots = [];
  let afternoonSlots = [];

  TIME_SLOTS.forEach((slot) => {
    const isBooked = bookedSlots.includes(slot.time);
    if (slot.period === "เช้า") {
      morningSlots.push({ ...slot, isBooked });
    } else {
      afternoonSlots.push({ ...slot, isBooked });
    }
  });

  const allBooked =
    morningSlots.every((s) => s.isBooked) &&
    afternoonSlots.every((s) => s.isBooked);

  if (allBooked) {
    container.innerHTML = "";
    if (noSlotMsg) {
      noSlotMsg.classList.remove("hidden");
    }
    return;
  }

  if (noSlotMsg) noSlotMsg.classList.add("hidden");

  // แสดงช่วงเช้า
  const morningHeader = document.createElement("div");
  morningHeader.className = "col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2";
  morningHeader.textContent = "☀️ ช่วงเช้า";
  container.appendChild(morningHeader);

  morningSlots.forEach((slot) => renderTimeSlotBtn(slot, container));

  // แสดงช่วงบ่าย
  const afternoonHeader = document.createElement("div");
  afternoonHeader.className = "col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3";
  afternoonHeader.textContent = "🌤️ ช่วงบ่าย";
  container.appendChild(afternoonHeader);

  afternoonSlots.forEach((slot) => renderTimeSlotBtn(slot, container));
}

// =====================================================
// สร้างปุ่มช่วงเวลา
// =====================================================
function renderTimeSlotBtn(slot, container) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.time = slot.time;

  if (slot.isBooked) {
    btn.className =
      "time-slot-btn rounded-xl border-2 border-gray-200 bg-gray-100 py-3 text-sm text-gray-400 cursor-not-allowed";
    btn.disabled = true;
    btn.innerHTML = `
      <div class="font-medium">${slot.time}</div>
      <div class="text-xs mt-1">เต็มแล้ว</div>
    `;
  } else {
    btn.className =
      "time-slot-btn rounded-xl border-2 border-cyan-200 bg-white py-3 text-sm text-cyan-700 font-medium cursor-pointer transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-50";
    btn.innerHTML = `
      <div class="font-semibold">${slot.time}</div>
      <div class="text-xs mt-1 text-green-500">ว่าง</div>
    `;
    btn.addEventListener("click", () => selectTime(slot.time, btn));
  }

  container.appendChild(btn);
}

// =====================================================
// เลือกช่วงเวลา
// =====================================================
function selectTime(timeStr, btnEl) {
  // ล้างการเลือกเดิม
  document.querySelectorAll(".time-slot-btn:not(:disabled)").forEach((b) => {
    b.classList.remove("border-cyan-500", "bg-cyan-100", "selected");
  });

  // เลือกเวลาใหม่
  btnEl.classList.add("border-cyan-500", "bg-cyan-100", "selected");
  bookingState.selectedTime = timeStr;

  // เลื่อนไปส่วนกรอกข้อมูล
  setTimeout(() => {
    document.getElementById("formSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
}

// =====================================================
// Validate ข้อมูลฟอร์ม
// =====================================================
function validateBookingForm() {
  const fullName = document.getElementById("fullName")?.value.trim();
  const age = document.getElementById("age")?.value.trim();
  const address = document.getElementById("address")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const consent = document.getElementById("consent")?.checked;

  if (!bookingState.selectedService) {
    showWarning("กรุณาเลือกบริการ", "กรุณาเลือกประเภทบริการที่ต้องการ");
    return false;
  }

  if (!bookingState.selectedDate) {
    showWarning("กรุณาเลือกวันที่", "กรุณาเลือกวันอังคารที่ต้องการรับบริการ");
    return false;
  }

  if (!isTuesday(bookingState.selectedDate)) {
    showError("วันที่ไม่ถูกต้อง", "กรุณาเลือกเฉพาะวันอังคารเท่านั้น");
    return false;
  }

  if (bookingState.selectedDate < getTodayISO()) {
    showError("วันที่ไม่ถูกต้อง", "ไม่สามารถเลือกวันที่ย้อนหลังได้");
    return false;
  }

  if (!bookingState.selectedTime) {
    showWarning("กรุณาเลือกช่วงเวลา", "กรุณาเลือกช่วงเวลาที่ต้องการรับบริการ");
    return false;
  }

  if (!fullName) {
    showWarning("กรุณากรอกชื่อ-สกุล", "");
    document.getElementById("fullName")?.focus();
    return false;
  }

  if (!age || !validateAge(age)) {
    showWarning("กรุณากรอกอายุให้ถูกต้อง", "อายุต้องอยู่ในช่วง 10-59 ปี");
    document.getElementById("age")?.focus();
    return false;
  }

  if (!address) {
    showWarning("กรุณากรอกที่อยู่", "");
    document.getElementById("address")?.focus();
    return false;
  }

  if (!phone || !validatePhone(phone)) {
    showWarning("กรุณากรอกเบอร์ติดต่อให้ถูกต้อง", "เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก");
    document.getElementById("phone")?.focus();
    return false;
  }

  if (!consent) {
    showWarning(
      "กรุณายินยอมให้ใช้ข้อมูลเพื่อการนัดหมาย",
      "กรุณาอ่านและยืนยันการยินยอมก่อนดำเนินการ"
    );
    return false;
  }

  return true;
}

// =====================================================
// แสดง Modal ยืนยันก่อนบันทึก
// =====================================================
async function showBookingConfirm() {
  if (!validateBookingForm()) return;

  const fullName = document.getElementById("fullName").value.trim();
  const age = document.getElementById("age").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const serviceName = getServiceName(bookingState.selectedService);
  const dateLabel = formatThaiDate(bookingState.selectedDate);

  const result = await Swal.fire({
    title: "ยืนยันการจองคิว",
    html: `
      <div class="text-left text-sm space-y-2">
        <div class="bg-cyan-50 rounded-lg p-3 space-y-1">
          <p><span class="font-semibold">ชื่อ-สกุล:</span> ${fullName}</p>
          <p><span class="font-semibold">อายุ:</span> ${age} ปี</p>
          <p><span class="font-semibold">เบอร์:</span> ${phone}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-3 space-y-1">
          <p><span class="font-semibold">บริการ:</span> ${serviceName}</p>
          <p><span class="font-semibold">วันที่:</span> ${dateLabel}</p>
          <p><span class="font-semibold">เวลา:</span> ${bookingState.selectedTime} น.</p>
        </div>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "✅ ยืนยันการจอง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#06b6d4",
    cancelButtonColor: "#6b7280",
  });

  if (result.isConfirmed) {
    await submitBooking(fullName, age, address, phone);
  }
}

// =====================================================
// บันทึกการจองลง Supabase
// =====================================================
async function submitBooking(fullName, age, address, phone) {
  showLoading("กำลังบันทึกการจอง...");

  // ตรวจสอบซ้ำอีกครั้งก่อนบันทึก (ป้องกัน race condition)
  const bookedSlots = await getBookedSlots(bookingState.selectedDate);
  if (bookedSlots.includes(bookingState.selectedTime)) {
    hideLoading();
    showError(
      "ช่วงเวลานี้ถูกจองแล้ว",
      "กรุณาเลือกช่วงเวลาอื่น"
    );
    await loadAvailableSlots(bookingState.selectedDate);
    bookingState.selectedTime = null;
    return;
  }

  const bookingData = {
    line_user_id: bookingState.lineUserId,
    line_display_name: bookingState.lineDisplayName,
    full_name: fullName,
    age: parseInt(age),
    address,
    phone,
    service_type: getServiceName(bookingState.selectedService),
    booking_date: bookingState.selectedDate,
    booking_time: bookingState.selectedTime,
    status: "pending",
  };

  const result = await createBooking(bookingData);

  if (!result.success) {
    hideLoading();
    showError("ไม่สามารถบันทึกข้อมูลได้", result.message || "กรุณาลองใหม่อีกครั้ง");
    return;
  }

  // ส่งแจ้งเตือน Admin ผ่าน LINE Messaging API
  await sendLineNotification({
    type: "booking_created",
    booking: {
      full_name: fullName,
      age: parseInt(age),
      phone,
      address,
      service_type: getServiceName(bookingState.selectedService),
      booking_date: bookingState.selectedDate,
      booking_date_thai: formatThaiDate(bookingState.selectedDate),
      booking_time: bookingState.selectedTime,
    },
  });

  hideLoading();

  // แสดงผลสำเร็จ
  await Swal.fire({
    icon: "success",
    title: "🎉 จองคิวสำเร็จ!",
    html: `
      <div class="text-sm space-y-1 text-gray-600">
        <p>บริการ: <strong>${getServiceName(bookingState.selectedService)}</strong></p>
        <p>วันที่: <strong>${formatThaiDate(bookingState.selectedDate)}</strong></p>
        <p>เวลา: <strong>${bookingState.selectedTime} น.</strong></p>
        <p class="text-xs text-gray-400 mt-3">กรุณามาตามวันและเวลาที่นัดหมาย</p>
      </div>
    `,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#06b6d4",
  });

  // กลับไปหน้าแรก
  window.location.href = "index.html";
}

// =====================================================
// เริ่มต้นเมื่อ DOM พร้อม
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  initBookingPage();

  // ปุ่มยืนยันการจอง
  document.getElementById("btnConfirmBooking")?.addEventListener("click", showBookingConfirm);
});
