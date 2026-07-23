document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('shapey-contact-form');
    const formFeedback = document.getElementById('contact-feedback');

    // Pre-fill from calculator if URL query parameters exist
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('material') && document.getElementById('material-choice')) {
        document.getElementById('material-choice').value = urlParams.get('material');
    }
    if (urlParams.has('details') && document.getElementById('project-details')) {
        document.getElementById('project-details').value = urlParams.get('details');
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const material = document.getElementById('material-choice') ? document.getElementById('material-choice').value : 'Friendly PLA (Bio-Starch)';
            const details = document.getElementById('project-details') ? document.getElementById('project-details').value.trim() : '3D Print Request';

            const currentLang = localStorage.getItem('shapey_lang') || 'en';

            if (!name || !email) {
                formFeedback.textContent = currentLang === 'en' ? 'Oops! Please fill in your name and email so we can reach you.' : 'দুঃখিত! অনুগ্রহ করে আপনার নাম ও ইমেইল ঠিকানা দিন।';
                formFeedback.style.color = '#FF7E67';
                return;
            }

            // Parse price from details if calculated, otherwise mark as Quote Requested
            let estPrice = '৳1,200 (Quote Required)';
            const priceMatch = details.match(/৳[0-9,]+/);
            if (priceMatch) {
                estPrice = priceMatch[0];
            }

            // Create new order record for Admin Panel & Google Sheets Sync
            const newOrder = {
                id: 'KC-' + Date.now().toString(36).toUpperCase(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                name: name,
                email: email,
                material: material,
                details: details || 'Custom 3D Print Request',
                status: 'Pending',
                estimatedPrice: estPrice
            };

            const existingOrders = JSON.parse(localStorage.getItem('kiras_orders') || '[]');
            existingOrders.unshift(newOrder);
            localStorage.setItem('kiras_orders', JSON.stringify(existingOrders));

            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlT_uFe-8zMu_LFpMZsGRQPaQuzcIxFZfmFa195FMp1b0IFJP-blzHYoFSv-nj_cs/exec';

            // Send live data via URL parameters cleanly
            const params = new URLSearchParams({
                id: newOrder.id,
                date: newOrder.date,
                name: newOrder.name,
                email: newOrder.email,
                material: newOrder.material,
                details: newOrder.details,
                estimatedPrice: newOrder.estimatedPrice,
                status: newOrder.status
            });

            const getUrl = GOOGLE_SHEET_URL + '?' + params.toString();
            
            // Single reliable submit to Google Sheet
            try {
                fetch(getUrl, { mode: 'no-cors' });
            } catch (err) {
                const beacon = new Image();
                beacon.src = getUrl;
            }

            const successMsg = typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang].msg_success ? translations[currentLang].msg_success : 'Yay! Your idea payload has been received. We will email your soft-3D quote shortly!';

            formFeedback.innerHTML = `<div>${successMsg}</div><div style="font-size:0.85rem; color:var(--c-accent); margin-top:0.4rem;">✓ Live Synced to Google Sheet & Admin Panel (Order ID: ${newOrder.id})</div>`;
            formFeedback.style.color = '#88A47C';
            contactForm.reset();
        });
    }
});
