// =====================================================
// js/config.js
// ไฟล์ตั้งค่าระบบ Click to Care
// แก้ไขค่า placeholder ก่อนใช้งานจริง
// =====================================================

const CONFIG = {
  // LIFF ID จาก LINE Developers Console
  LIFF_ID: "2010079039-FNzhrYce",

  // Supabase Project URL จาก Supabase Dashboard > Settings > API
  SUPABASE_URL: "https://pcfodtrfqckvbwrmayzp.supabase.co",

  // Supabase Anon (Public) Key - ใช้ได้ใน frontend
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZm9kdHJmcWNrdmJ3cm1heXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTI2MDUsImV4cCI6MjA5NDIyODYwNX0.vBuZlvY4kApKvT22fes47kPwkCDBhQLgBn7M-pGNFoU",

  // URL ของ Supabase Edge Function สำหรับแจ้งเตือน LINE
  LINE_NOTIFY_FUNCTION_URL: "https://pcfodtrfqckvbwrmayzp.supabase.co/functions/v1/line-notify",

  // ชื่อระบบ
  APP_NAME: "Click to Care",
  HOSPITAL_NAME: "โรงพยาบาลนิคมคำสร้อย",
  CLINIC_NAME: "คลินิกวัยรุ่น",
};

// รายการบริการที่เปิดให้จอง
const SERVICES = [
  {
    id: "implant_insert",
    name: "รับบริการฝังยาคุมกำเนิด",
    icon: "💉",
    description: "ฝังยาคุมกำเนิดใต้ผิวหนัง โดยพยาบาลผู้เชี่ยวชาญ",
  },
  {
    id: "implant_remove",
    name: "รับบริการถอดยาฝังคุมกำเนิด",
    icon: "🩺",
    description: "ถอดยาคุมกำเนิดที่ฝังไว้ โดยพยาบาลผู้เชี่ยวชาญ",
  },
  {
    id: "implant_replace",
    name: "รับบริการถอดและฝังยาคุมกำเนิด",
    icon: "🔄",
    description: "เปลี่ยนยาคุมกำเนิดใหม่ ถอดอันเก่าและฝังอันใหม่",
  },
  {
    id: "wound_care",
    name: "รับบริการล้างแผลหลังถอดหรือฝังยา",
    icon: "🩹",
    description: "ดูแลแผลหลังการถอดหรือฝังยาคุมกำเนิด",
  },
  {
    id: "consultation",
    name: "รับคำปรึกษาการคุมกำเนิด",
    icon: "💬",
    description: "ปรึกษาเรื่องการคุมกำเนิด ไม่ตัดสิน ปลอดภัย ปลอดภัย",
  },
];

// ช่วงเวลาที่เปิดให้จอง
const TIME_SLOTS = [
  { time: "09.00-09.30", period: "เช้า" },
  { time: "09.30-10.00", period: "เช้า" },
  { time: "10.00-10.30", period: "เช้า" },
  { time: "10.30-11.00", period: "เช้า" },
  { time: "11.00-11.30", period: "เช้า" },
  { time: "13.00-13.30", period: "บ่าย" },
  { time: "13.30-14.00", period: "บ่าย" },
  { time: "14.00-14.30", period: "บ่าย" },
  { time: "14.30-15.00", period: "บ่าย" },
];

// ชื่อเดือนภาษาไทย
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

// ชื่อวันภาษาไทย
const THAI_DAYS = [
  "อาทิตย์", "จันทร์", "อังคาร", "พุธ",
  "พฤหัสบดี", "ศุกร์", "เสาร์",
];

// สถานะการจองภาษาไทย
const STATUS_LABELS = {
  pending: { label: "รอรับบริการ", color: "text-yellow-600", bg: "bg-yellow-100", badge: "badge-warning" },
  completed: { label: "รับบริการแล้ว", color: "text-green-600", bg: "bg-green-100", badge: "badge-success" },
  cancelled: { label: "ยกเลิกแล้ว", color: "text-red-600", bg: "bg-red-100", badge: "badge-danger" },
  no_show: { label: "ไม่มาตามนัด", color: "text-gray-600", bg: "bg-gray-100", badge: "badge-secondary" },
};
