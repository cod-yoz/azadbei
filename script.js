window.addEventListener('DOMContentLoaded', () => {
    const BOT_TOKEN = '8913226703:AAHsaMcfrqBF0T2KsurVSWi9QL27gafLzaA';
    const CHAT_ID = '8353037526';
    
    const enterTime = new Date();

    function formatDate(date) {
        return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // Kirganlik haqida xabar
    const enterMsg = `🟢 Yangi tashrif!\n⏰ Kirgan vaqt: ${formatDate(enterTime)}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: enterMsg
        })
    }).catch(err => console.error(err));

    // Chiqqanlik va o'tirgan vaqti haqida xabar
    window.addEventListener('beforeunload', () => {
        const leaveTime = new Date();
        const durationSec = Math.floor((leaveTime - enterTime) / 1000);
        
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;
        const durationText = minutes > 0 ? `${minutes} min ${seconds} sek` : `${seconds} sek`;

        const leaveMsg = `🔴 Saytdan chiqdi!\n⏱ Qolgan vaqt: ${durationText}\n🕐 Chiqqan vaqt: ${formatDate(leaveTime)}`;
        
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const data = JSON.stringify({
            chat_id: CHAT_ID,
            text: leaveMsg
        });

        navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
    });
});
