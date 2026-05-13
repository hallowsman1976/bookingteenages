// =====================================================
// js/supabase-client.js
// เริ่มต้น Supabase Client
// =====================================================

// สร้าง Supabase Client จาก config
const supabaseClient = supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

// =====================================================
// ฟังก์ชันดึงช่วงเวลาที่ถูกจองแล้วในวันที่กำหนด
// =====================================================
async function getBookedSlots(bookingDate) {
  try {
    const { data, error } = await supabaseClient
      .from("bookings")
      .select("booking_time")
      .eq("booking_date", bookingDate)
      .eq("status", "pending");

    if (error) throw error;
    return data.map((b) => b.booking_time);
  } catch (err) {
    console.error("getBookedSlots error:", err);
    return [];
  }
}

// =====================================================
// ฟังก์ชันสร้างการจองใหม่
// =====================================================
async function createBooking(bookingData) {
  try {
    const { data, error } = await supabaseClient
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("createBooking error:", err);

    // ตรวจสอบ error จาก unique index (จองซ้ำ)
    if (err.code === "23505") {
      return {
        success: false,
        message: "ช่วงเวลานี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น",
      };
    }
    return {
      success: false,
      message: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
}

// =====================================================
// ฟังก์ชันดึงการจองของผู้ใช้ปัจจุบัน (เฉพาะ pending)
// =====================================================
async function getMyBookings(lineUserId) {
  try {
    const { data, error } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("line_user_id", lineUserId)
      .eq("status", "pending")
      .order("booking_date", { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("getMyBookings error:", err);
    return { success: false, data: [], message: err.message };
  }
}

// =====================================================
// ฟังก์ชันยกเลิกการจอง
// =====================================================
async function cancelBooking(bookingId, lineUserId, cancelReason) {
  try {
    // ตรวจสอบว่าเป็นรายการของผู้ใช้คนนี้จริงๆ
    const { data: booking, error: fetchError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("line_user_id", lineUserId)
      .eq("status", "pending")
      .single();

    if (fetchError || !booking) {
      return {
        success: false,
        message: "ไม่พบรายการจองหรือไม่มีสิทธิ์ยกเลิก",
      };
    }

    // อัปเดตสถานะเป็น cancelled
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({
        status: "cancelled",
        cancel_reason: cancelReason || "ไม่ระบุ",
      })
      .eq("id", bookingId)
      .eq("line_user_id", lineUserId);

    if (updateError) throw updateError;
    return { success: true, booking };
  } catch (err) {
    console.error("cancelBooking error:", err);
    return {
      success: false,
      message: "ไม่สามารถยกเลิกได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
}

// =====================================================
// ฟังก์ชันดึงรายการจองทั้งหมด (สำหรับ Admin)
// =====================================================
async function getAllBookings(filters = {}) {
  try {
    let query = supabaseClient
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: true });

    // Filter ตามสถานะ
    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    // Filter ตามวันที่
    if (filters.date) {
      query = query.eq("booking_date", filters.date);
    }

    // Filter ตามประเภทบริการ
    if (filters.service && filters.service !== "all") {
      query = query.eq("service_type", filters.service);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("getAllBookings error:", err);
    return { success: false, data: [], message: err.message };
  }
}

// =====================================================
// ฟังก์ชันอัปเดตสถานะการจอง (Admin)
// =====================================================
async function updateBookingStatus(bookingId, newStatus) {
  try {
    const { error } = await supabaseClient
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    return { success: false, message: err.message };
  }
}

// =====================================================
// ฟังก์ชันส่ง LINE Notification ผ่าน Edge Function
// =====================================================
async function sendLineNotification(payload) {
  try {
    const response = await fetch(CONFIG.LINE_NOTIFY_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("LINE notify error:", result);
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error("sendLineNotification error:", err);
    return { success: false };
  }
}

// =====================================================
// ฟังก์ชัน Login Admin
// =====================================================
async function adminLogin(username, password) {
  try {
    // ดึงข้อมูล admin จาก username
    const { data, error } = await supabaseClient
      .from("admins")
      .select("id, username, full_name, role, password_hash")
      .eq("username", username)
      .single();

    if (error || !data) {
      return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    // ตรวจสอบรหัสผ่านด้วย bcrypt
    // หมายเหตุ: ใช้ bcryptjs library ใน frontend
    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) {
      return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    // เก็บ session ใน sessionStorage
    const adminSession = {
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      role: data.role,
      loginAt: new Date().toISOString(),
    };
    sessionStorage.setItem("adminSession", JSON.stringify(adminSession));
    return { success: true, admin: adminSession };
  } catch (err) {
    console.error("adminLogin error:", err);
    return { success: false, message: "เกิดข้อผิดพลาด กรุณาลองใหม่" };
  }
}

// ตรวจสอบ Admin Session
function getAdminSession() {
  try {
    const session = sessionStorage.getItem("adminSession");
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

// ล้าง Admin Session
function clearAdminSession() {
  sessionStorage.removeItem("adminSession");
}
