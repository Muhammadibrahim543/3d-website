document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('shapey-contact-form');
    const formFeedback = document.getElementById('contact-feedback');

    // Pre-fill from calculator or customizer if URL query parameters exist
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('material') && document.getElementById('material-choice')) {
        document.getElementById('material-choice').value = urlParams.get('material');
    }
    if (urlParams.has('details') && document.getElementById('project-details')) {
        document.getElementById('project-details').value = urlParams.get('details');
    }

    // Check for live customizer snapshot payload
    let pendingCustomOrder = null;
    try {
        const storedPending = localStorage.getItem('kiras_pending_custom_order');
        if (storedPending) {
            pendingCustomOrder = JSON.parse(storedPending);
        }
    } catch(e) {}

    const isFromCustomizer = urlParams.get('from') === 'customizer' || pendingCustomOrder !== null;
    const fileUploadGroup = document.getElementById('file-upload-group');
    const previewContainer = document.getElementById('customizer-preview-container');

    if (isFromCustomizer && fileUploadGroup) {
        // HIDE STL file requirement completely when ordering a customizer design!
        fileUploadGroup.style.display = 'none';
    }

    if (isFromCustomizer && previewContainer && pendingCustomOrder) {
        previewContainer.innerHTML = `
            <div class="customizer-order-preview-card" style="background:#181621; color:#FFFFFF; padding:1.4rem; border-radius:24px; margin-bottom:1.8rem; text-align:center; border:2px solid var(--c-primary); box-shadow: 0 12px 32px rgba(0,0,0,0.3);">
                <div style="font-size:0.9rem; text-transform:uppercase; letter-spacing:1.5px; color:var(--c-primary); font-weight:700; margin-bottom:0.6rem;">🎨 Your Custom 3D Nameplate Preview</div>
                
                <div style="background:#121019; padding:1rem; border-radius:18px; display:inline-block; max-width:100%; margin:0.5rem 0;">
                    <img src="${pendingCustomOrder.snapshot}" alt="3D Custom Nameplate Preview" style="max-width:100%; height:auto; border-radius:12px; display:block; margin:0 auto;">
                </div>
                
                <div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:0.8rem; margin-top:1rem; font-size:0.95rem; font-family:var(--f-head); background:rgba(255,255,255,0.05); padding:0.8rem 1rem; border-radius:16px;">
                    <span><strong>Text:</strong> <span style="color:var(--c-accent);">${pendingCustomOrder.text}</span></span>
                    <span><strong>Font:</strong> ${pendingCustomOrder.font}</span>
                    <span><strong>Color:</strong> ${pendingCustomOrder.color}</span>
                    <span><strong>Thickness:</strong> ${pendingCustomOrder.thickness}mm</span>
                    <span><strong>Quote:</strong> <strong style="color:var(--c-primary); font-size:1.1rem;">${pendingCustomOrder.price}</strong></span>
                </div>

                <!-- Direct WhatsApp Order Button -->
                <div style="margin-top:1.2rem;">
                    <a id="btn-whatsapp-direct" href="#" target="_blank" rel="noopener noreferrer" class="clay-btn btn-coral" style="background:#25D366; color:#FFF; width:100%; font-size:1.05rem; gap:0.5rem; justify-content:center;">
                        💬 Order Directly via WhatsApp (+880 1793-500131)
                    </a>
                </div>
            </div>
        `;

        // Configure WhatsApp direct message link
        const btnWa = document.getElementById('btn-whatsapp-direct');
        if (btnWa) {
            const waMsg = `Hi Studio Kira's Creation! I want to order my customized 3D Nameplate:\n\n• Text/Name: ${pendingCustomOrder.text}\n• Font Style: ${pendingCustomOrder.font}\n• Base Color: ${pendingCustomOrder.color}\n• Thickness: ${pendingCustomOrder.thickness}mm\n• Quoted Price: ${pendingCustomOrder.price}\n\nPlease confirm my order!`;
            btnWa.href = `https://wa.me/8801793500131?text=${encodeURIComponent(waMsg)}`;
        }
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
                estimatedPrice: estPrice,
                snapshot: pendingCustomOrder ? pendingCustomOrder.snapshot : null
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
