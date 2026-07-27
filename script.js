document.addEventListener('DOMContentLoaded', () => {
  // Skill barlarining foizini chiqarib to'ldirish animationi
  setTimeout(() => {
    document.querySelectorAll('.fill').forEach(el => {
      const targetWidth = el.getAttribute('data-w');
      if (targetWidth) {
        el.style.width = targetWidth + '%';
      }
    });
  }, 200);

  // Karta raqamidan nusxa olish mantiqi
  const cardBox = document.getElementById('cardCopy');
  const toast = document.getElementById('toast');
  const pill = document.getElementById('copyPill');
  const copyText = document.getElementById('copyText');
  const cardNumberEl = document.getElementById('cardNumber');

  if (cardBox && cardNumberEl) {
    cardBox.addEventListener('click', async () => {
      const rawNumber = cardNumberEl.textContent.trim();
      const cleanNumber = rawNumber.replace(/\s/g, '');

      try {
        await navigator.clipboard.writeText(cleanNumber);
      } catch (err) {
        // Eski brauzerlar uchun zaxira (fallback) nusxalash yo'li
        const textArea = document.createElement('textarea');
        textArea.value = cleanNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // UI holatini nusxalanganiga o'zgartirish
      if (pill) pill.classList.add('copied');
      if (copyText) copyText.textContent = 'Nusxalandi!';
      if (toast) toast.classList.add('show');

      // 1.8 soniyadan so'ng dastlabki holatiga qaytarish
      setTimeout(() => {
        if (pill) pill.classList.remove('copied');
        if (copyText) copyText.textContent = 'Nusxa olish';
        if (toast) toast.classList.remove('show');
      }, 1800);
    });
  }
});