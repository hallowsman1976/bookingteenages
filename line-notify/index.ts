import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const LINE_TOKEN = Deno.env.get("49y0dihrSoF9i7A4giCgC9vUVYZZBWJT8l1tJcKyWOXOAgI8faUFvv/Xa6UMSPeguLhQPT4N6CbGmzCdzdHpG6WktXT9skOEM/zulVzozOptl7oviRqTuBLJT0mzCj4a1Fj+hHCuSZVFD60gjKs22QdB04t89/1O/w1cDnyilFU=");
const ADMIN_ID = Deno.env.get("Ud2bee991b81bf2d7fa473e9ddf924119");

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
