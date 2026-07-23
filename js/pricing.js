document.addEventListener('DOMContentLoaded', () => {
    const faqRows = document.querySelectorAll('.faq-row');
    const PLUS_PATH = "M12 7 L12 17 M7 12 L17 12";
    const SMILE_PATH = "M7 10 Q12 18 17 10";

    faqRows.forEach(row => {
        const headerBtn = row.querySelector('.faq-header');
        const bodyEl = row.querySelector('.faq-body');
        const pathEl = row.querySelector('.plus-path');

        if (headerBtn) {
            headerBtn.addEventListener('click', () => {
                const isOpen = row.classList.contains('open');

                faqRows.forEach(r => {
                    r.classList.remove('open');
                    if (r.querySelector('.faq-body')) r.querySelector('.faq-body').style.maxHeight = null;
                    const otherPath = r.querySelector('.plus-path');
                    if (otherPath) otherPath.setAttribute('d', PLUS_PATH);
                });

                if (!isOpen) {
                    row.classList.add('open');
                    bodyEl.style.maxHeight = bodyEl.scrollHeight + "px";
                    if (pathEl) pathEl.setAttribute('d', SMILE_PATH);
                }
            });
        }
    });
});
