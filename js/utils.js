/**
 * Click to Care : Utility Functions
 * รวมฟังก์ชันเสริมสำหรับจัดการวันที่ และการแสดงผลภาษาไทย
 */

const utils = {
    /**
     * แปลงวันที่ ISO (2026-05-14) เป็นรูปแบบภาษาไทยเต็ม
     * @param {string} dateString 
     * @returns {string} วันอังคารที่ 14 พฤษภาคม 2569
     */
    formatDateThai: (dateString) => {
        const options = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', options);
    },

    /**
     * แปลงวันที่ ISO เป็นรูปแบบสั้น (14 พ.ค. 69)
     * @param {string} dateString 
     */
    formatDateThaiShort: (dateString) => {
        const options = { 
            day: 'numeric', 
            month: 'short', 
            year: '2-digit' 
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', options);
    },

    /**
     * ตรวจสอบว่าเป็นวันอังคารหรือไม่
     * @param {string} dateString 
     */
    isTuesday: (dateString) => {
        const date = new Date(dateString);
        return date.getDay() === 2;
    },

    /**
     * ดึงชื่อเดือนภาษาไทย
     */
    getThaiMonth: (monthIndex) => {
        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        return months[monthIndex];
    },

    /**
     * ฟังก์ชันสำหรับคัดลอกข้อความ (เช่น คัดลอกเลขนัดหมาย)
     */
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    },

    /**
     * ตรวจสอบความถูกต้องของเบอร์โทรศัพท์มือถือไทย (10 หลัก)
     */
    validatePhone: (phone) => {
        const re = /^0[0-9]{8,9}$/;
        return re.test(phone);
    },

    /**
     * แสดง Loading Overlay
     */
    showLoading: () => {
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.classList.remove('hidden');
    },

    /**
     * ซ่อน Loading Overlay
     */
    hideLoading: () => {
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.classList.add('hidden');
    },

    /**
     * ฟังก์ชันหน่วงเวลา (Debounce) สำหรับ Search Input
     */
    debounce: (func, wait) => {
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
};

// ป้องกันการเรียกใช้ตัวแปรซ้ำ
window.utils = utils;
