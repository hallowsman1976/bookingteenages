import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const LINE_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
const ADMIN_ID = Deno.env.get("ADMIN_LINE_ID");

serve(async (req) => {
  const { type, payload } = await req.json();

  let message = "";
  if (type === "booking_created") {
    message = `📌 มีรายการจองคิวใหม่\n👤 ชื่อ: ${payload.full_name}\n📞 โทร: ${payload.phone}\n🩺 บริการ: ${payload.service_type}\n📅 วันที่: ${payload.date_thai}\n⏰ เวลา: ${payload.booking_time}`;
  } else if (type === "booking_cancelled") {
    message = `⚠️ มีการยกเลิกคิว\n👤 ชื่อ: ${payload.full_name}\n📅 วันที่: ${payload.date_thai}\nเหตุผล: ${payload.reason}`;
  }

  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LINE_TOKEN}`
    },
    body: JSON.stringify({
      to: ADMIN_ID,
      messages: [{ type: "text", text: message }]
    })
  });

  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
})
