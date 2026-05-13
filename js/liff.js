// =====================================================
// js/liff.js
// จัดการ LIFF SDK และดึงข้อมูลผู้ใช้ LINE
// =====================================================

// เก็บข้อมูลผู้ใช้ LINE ที่ดึงมาได้
let lineUserProfile = null;

// =====================================================
// เริ่มต้น LIFF และดึงข้อมูลผู้ใช้
// =====================================================
async function initLiff() {
  try {
    showLoading("กำลังเชื่อมต่อ LINE...");

    // เริ่มต้น LIFF SDK
    await liff.init({ liffId: CONFIG.LIFF_ID });

    // ตรวจสอบว่า Login แล้วหรือยัง
    if (!liff.isLoggedIn()) {
      // ยังไม่ได้ Login ให้ redirect ไปหน้า Login
      liff.login();
      return null;
    }

    // ดึงข้อมูลโปรไฟล์ LINE
    const profile = await liff.getProfile();
    lineUserProfile = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || null,
    };

    hideLoading();
    return lineUserProfile;
  } catch (err) {
    hideLoading();
    console.error("LIFF init error:", err);

    // ถ้าไม่ได้รันใน LINE environment ให้ใช้ mock สำหรับ dev/test
    if (isDevelopmentMode()) {
      console.warn("ใช้ mock profile สำหรับการทดสอบ");
      lineUserProfile = getMockProfile();
      return lineUserProfile;
    }

    showError(
      "เกิดข้อผิดพลาด",
      "ไม่สามารถเชื่อมต่อ LINE ได้ กรุณาเปิดผ่าน LINE OA"
    );
    return null;
  }
}

// =====================================================
// ตรวจสอบว่าอยู่ใน Development Mode หรือไม่
// (เปิด localhost หรือไม่ได้อยู่ใน LINE browser)
// =====================================================
function isDevelopmentMode() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:"
  );
}

// =====================================================
// Mock Profile สำหรับทดสอบบน Browser (ไม่ใช่ LINE)
// =====================================================
function getMockProfile() {
  return {
    userId: "Utest1234567890abcdef",
    displayName: "ผู้ใช้ทดสอบ",
    pictureUrl: null,
  };
}

// =====================================================
// ดึงข้อมูลผู้ใช้ปัจจุบัน
// =====================================================
function getCurrentUser() {
  return lineUserProfile;
}

// =====================================================
// ออกจากระบบ LINE
// =====================================================
function logoutLiff() {
  if (liff.isLoggedIn()) {
    liff.logout();
  }
}

// =====================================================
// เปิด URL ภายนอกใน LINE browser
// =====================================================
function openExternalUrl(url) {
  if (liff.isInClient()) {
    liff.openWindow({ url, external: true });
  } else {
    window.open(url, "_blank");
  }
}
