// ตัวอย่าง Logic การสร้างวันที่เฉพาะวันอังคาร
function getUpcomingTuesdays() {
    const tuesdays = [];
    let d = new Date();
    while (tuesdays.length < 8) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() === 2) { // 2 = Tuesday
            tuesdays.push(new Date(d));
        }
    }
    return tuesdays;
}

// ฟังก์ชันตรวจสอบเวลาว่าง
async function checkAvailableSlots(date) {
    const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)
        .eq('status', 'pending');
    
    if (error) return [];
    const bookedSlots = data.map(b => b.booking_time);
    return TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
}
