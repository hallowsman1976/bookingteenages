// =====================================================
// supabase/functions/line-notify/index.ts
// Supabase Edge Function สำหรับส่งข้อความ LINE Messaging API
//
// Environment Variables ที่ต้องตั้งค่าใน Supabase Dashboard:
//   LINE_CHANNEL_ACCESS_TOKEN  - Channel Access Token จาก LINE Developers
//   ADMIN_LINE_ID              - LINE User ID หรือ Group ID ของ Admin
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// =====================================================
// Type Definitions
// =====================================================
interface BookingCreatedPayload {
  type: "booking_created";
  booking: {
    full_name: string;
    age: number;
    phone: string;
    address: string;
    service_type: string;
    booking_date: string;
    booking_date_thai: string;
    booking_time: string;
  };
}

interface BookingCancelledPayload {
  type: "booking_cancelled";
  booking: {
    full_name: string;
    service_type: string;
    booking_date: string;
    booking_date_thai: string;
    booking_time: string;
    cancel_reason: string;
  };
}

type NotifyPayload = BookingCreatedPayload | BookingCancelledPayload;

// =====================================================
// สร้างข้อความสำหรับ booking_created
// =====================================================
function buildBookingCreatedMessage(booking: BookingCreatedPayload["booking"]): string {
  return (
    `📌 มีรายการจองคิวใหม่\n` +
    `คลินิกวัยรุ่น รพ.นิคมคำสร้อย\n\n` +
    `👤 ชื่อ-สกุล: ${booking.full_name}\n` +
    `🎂 อายุ: ${booking.age} ปี\n` +
    `📞 เบอร์ติดต่อ: ${booking.phone}\n` +
    `🏠 ที่อยู่: ${booking.address}\n\n` +
    `🩺 บริการ: ${booking.service_type}\n` +
    `📅 วันที่นัด: ${booking.booking_date_thai}\n` +
    `⏰ เวลา: ${booking.booking_time} น.\n\n` +
    `สถานะ: รอรับบริการ`
  );
}

// =====================================================
// สร้างข้อความสำหรับ booking_cancelled
// =====================================================
function buildBookingCancelledMessage(
  booking: BookingCancelledPayload["booking"]
): string {
  return (
    `⚠️ มีการยกเลิกคิว\n` +
    `คลินิกวัยรุ่น รพ.นิคมคำสร้อย\n\n` +
    `👤 ชื่อ-สกุล: ${booking.full_name}\n` +
    `🩺 บริการ: ${booking.service_type}\n` +
    `📅 วันที่นัดเดิม: ${booking.booking_date_thai}\n` +
    `⏰ เวลาเดิม: ${booking.booking_time} น.\n\n` +
    `เหตุผลการยกเลิก: ${booking.cancel_reason || "ไม่ระบุ"}`
  );
}

// =====================================================
// ส่งข้อความผ่าน LINE Messaging API
// =====================================================
async function sendLineMessage(
  accessToken: string,
  toId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        to: toId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("LINE API Error:", response.status, errorBody);
      return { success: false, error: `LINE API Error: ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("sendLineMessage error:", err);
    return { success: false, error: String(err) };
  }
}

// =====================================================
// CORS Headers
// =====================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// =====================================================
// Main Handler
// =====================================================
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // รับเฉพาะ POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // ดึง Environment Variables
    const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
    const ADMIN_LINE_ID = Deno.env.get("ADMIN_LINE_ID");

    // ตรวจสอบ Environment Variables
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      console.error("LINE_CHANNEL_ACCESS_TOKEN not set");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!ADMIN_LINE_ID) {
      console.error("ADMIN_LINE_ID not set");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const payload: NotifyPayload = await req.json();

    if (!payload.type || !payload.booking) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // สร้างข้อความตาม type
    let message: string;

    if (payload.type === "booking_created") {
      message = buildBookingCreatedMessage(
        (payload as BookingCreatedPayload).booking
      );
    } else if (payload.type === "booking_cancelled") {
      message = buildBookingCancelledMessage(
        (payload as BookingCancelledPayload).booking
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Unknown notification type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ส่งข้อความ
    const result = await sendLineMessage(
      LINE_CHANNEL_ACCESS_TOKEN,
      ADMIN_LINE_ID,
      message
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
