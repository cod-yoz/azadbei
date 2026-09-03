window.addEventListener('DOMContentLoaded', () => {
    const BOT_TOKEN = '8913226703:AAHsaMcfrqBF0T2KsurVSWi9QL27gafLzaA';
    const CHAT_ID = '8353037526';
    
    // --- 1. KO'RISHLAR SONINI HISOBLash QISMI ---
    const BACKEND_URL = 'https://counter-azadbei-portfolio.onrender.com';

    fetch(`${BACKEND_URL}/api/view`, {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        const viewElement = document.getElementById('view-count');
        if (viewElement) {
            viewElement.innerText = `${data.count} - odam`;
        }
    })
    .catch(err => {
        console.error('Xatolik:', err);
        const viewElement = document.getElementById('view-count');
        if (viewElement) {
            viewElement.innerText = '0';
        }
    });

    // --- 2. TELEGRAM BOTGA XABAR YUBORISH QISMI ---
    const enterTime = new Date();

    function formatDate(date) {
        return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // Qurilma turini aniqlash
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Planshet 📱";
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "Telefon 📱";
        return "Kompyuter 💻";
    }

    // Sistema va brauzer
    function getBrowserAndOS() {
        const ua = navigator.userAgent;
        let browser = "Noma'lum brauzer";
        let os = "Noma'lum sistema";

        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1) os = "MacOS";
        else if (ua.indexOf("Linux") !== -1) os = "Linux";
        else if (ua.indexOf("Android") !== -1) os = "Android";
        else if (ua.indexOf("like Mac") !== -1) os = "iOS (iPhone/iPad)";

        if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
        else if (ua.indexOf("Safari") !== -1) browser = "Safari";
        else if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
        else if (ua.indexOf("Edge") !== -1) browser = "Microsoft Edge";

        return `${os} / ${browser}`;
    }

    const device = getDeviceType();
    const systemInfo = getBrowserAndOS();
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const userLanguage = navigator.language || navigator.userLanguage;
    const referrer = document.referrer ? document.referrer : "To'g'ridan-to'g'ri kirgan";

    // Batareya ma'lumotini olish va xabarni yuborish
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            sendVisitorData(battery);
        }).catch(() => {
            sendVisitorData(null);
        });
    } else {
        sendVisitorData(null);
    }

    function sendVisitorData(battery) {
        let batteryInfo = "Ma'lum emas 🔋";
        if (battery) {
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? "Zaryadga ulangan ⚡" : "Zaryadda emas 🔋";
            batteryInfo = `${level}% (${charging})`;
        }

        const enterMsg = `🟢 Yangi tashrif!\n` +
                         `📱 Qurilma: ${device}\n` +
                         `💻 Sistema/Brauzer: ${systemInfo}\n` +
                         `🔋 Batareya: ${batteryInfo}\n` +
                         `📐 Ekran: ${screenResolution}\n` +
                         `🌐 Til: ${userLanguage}\n` +
                         `🔗 Manba: ${referrer}\n` +
                         `⏰ Vaqt: ${formatDate(enterTime)}`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: enterMsg })
        }).catch(err => console.error(err));
    }

    // Chiqqanlik va o'tirgan vaqti haqida xabar
    window.addEventListener('beforeunload', () => {
        const leaveTime = new Date();
        const durationSec = Math.floor((leaveTime - enterTime) / 1000);
        
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;
        const durationText = minutes > 0 ? `${minutes} min ${seconds} sek` : `${seconds} sek`;

        const leaveMsg = `🔴 Saytdan chiqdi!\n📱 Qurilma: ${device}\n⏱ Qolgan vaqt: ${durationText}\n🕐 Chiqqan vaqt: ${formatDate(leaveTime)}`;
        
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const data = JSON.stringify({
            chat_id: CHAT_ID,
            text: leaveMsg
        });

        navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
    });
});
