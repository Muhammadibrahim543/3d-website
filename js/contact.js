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

    // Check for live customizer snapshot payload ONLY if navigated with customizer query parameter
    let pendingCustomOrder = null;
    const isFromCustomizer = (urlParams.get('from') === 'customizer' || urlParams.get('type') === 'custom_order');
    if (isFromCustomizer) {
        try {
            const storedPending = localStorage.getItem('kiras_pending_custom_order');
            if (storedPending) {
                pendingCustomOrder = JSON.parse(storedPending);
            }
        } catch(e) {}
    }

    const fileUploadGroup = document.getElementById('file-upload-group');
    const previewContainer = document.getElementById('customizer-preview-container');

    if (isFromCustomizer && pendingCustomOrder && previewContainer) {
        // Hide standard file requirement when ordering an active customizer design
        if (fileUploadGroup) fileUploadGroup.style.display = 'none';

        const rawPrice = pendingCustomOrder.price || '৳80';
        const formattedPrice = rawPrice.toString().startsWith('৳') ? rawPrice : `৳${rawPrice}`;

        previewContainer.innerHTML = `
            <div class="customizer-order-preview-card" style="background:#181621; color:#FFFFFF; padding:1.4rem; border-radius:24px; margin-bottom:1.8rem; text-align:center; border:2px solid var(--c-primary); box-shadow: 0 12px 32px rgba(0,0,0,0.3);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                    <div style="font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; color:var(--c-primary); font-weight:700;">🎨 Your 3D Customizer Design</div>
                    <button type="button" id="btn-cancel-custom-order" class="clay-btn btn-sm" style="background:rgba(255,255,255,0.1); color:#FF8A75; border-radius:10px; font-size:0.75rem; padding:0.3rem 0.7rem;" title="Clear design and open standard contact form">✕ Cancel / Standard Inquiry</button>
                </div>
                
                <div style="background:#121019; padding:0.8rem; border-radius:18px; display:inline-block; max-width:100%; margin:0.3rem 0;">
                    <img src="${pendingCustomOrder.snapshot}" alt="3D Custom Model Preview" style="max-width:100%; max-height:220px; height:auto; border-radius:12px; display:block; margin:0 auto; object-fit:contain;">
                </div>
                
                <div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:0.6rem; margin-top:0.8rem; font-size:0.9rem; font-family:var(--f-head); background:rgba(255,255,255,0.05); padding:0.7rem 1rem; border-radius:16px;">
                    <span><strong>Text:</strong> <span style="color:var(--c-accent);">${pendingCustomOrder.text || 'Custom'}</span></span>
                    <span><strong>Model:</strong> ${pendingCustomOrder.model || 'LEGO Keychain'}</span>
                    <span><strong>Color:</strong> ${pendingCustomOrder.color || 'Multi-Color'}</span>
                    <span><strong>Total:</strong> <strong style="color:var(--c-primary); font-size:1.15rem;">${formattedPrice}</strong></span>
                </div>

                <div style="display:flex; gap:0.8rem; margin-top:1.2rem; flex-wrap:wrap;">
                    <a id="btn-whatsapp-direct" href="#" target="_blank" rel="noopener noreferrer" class="clay-btn btn-coral" style="background:#25D366; color:#FFF; flex:1; min-width:200px; font-size:0.95rem; gap:0.5rem; justify-content:center;">
                        💬 Order via WhatsApp
                    </a>
                    <a href="customize.html" class="clay-btn btn-cream" style="flex:0.8; font-size:0.95rem; justify-content:center;">
                        ✏️ Edit in 3D
                    </a>
                </div>
            </div>
        `;

        // Configure WhatsApp direct message link
        const btnWa = document.getElementById('btn-whatsapp-direct');
        if (btnWa) {
            const waMsg = `Hi Studio Kira's Creation! I want to order my customized 3D design:\n\n• Text: ${pendingCustomOrder.text || 'Custom'}\n• Model: ${pendingCustomOrder.model || 'LEGO Keychain'}\n• Color: ${pendingCustomOrder.color || 'Multi-Color'}\n• Quoted Price: ${formattedPrice}\n\nPlease confirm my order!`;
            btnWa.href = `https://wa.me/8801793500131?text=${encodeURIComponent(waMsg)}`;
        }

        // Cancel / Clear custom order handler
        const btnCancel = document.getElementById('btn-cancel-custom-order');
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                localStorage.removeItem('kiras_pending_custom_order');
                window.location.href = 'contact.html';
            });
        }
    } else if (fileUploadGroup) {
        fileUploadGroup.style.display = 'block';
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

            // Parse price from details if calculated, otherwise mark as Quote Required
            let estPrice = (currentLang === 'bn' ? 'কোটেশন প্রয়োজন' : 'Quote Required');
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

            // Clear pending customizer order after submission
            localStorage.removeItem('kiras_pending_custom_order');

            // Construct Rich Order Confirmation Card
            const waDirectMsg = `Hi Studio Kira's Creation! I just placed an order:\n\n• Order ID: ${newOrder.id}\n• Name: ${newOrder.name}\n• Material/Specs: ${newOrder.material}\n• Price: ${newOrder.estimatedPrice}\n• Details: ${newOrder.details}\n\nPlease confirm my 3D order!`;

            const formCard = contactForm.closest('.clay-card');
            if (formCard) {
                formCard.style.background = 'transparent';
                formCard.style.boxShadow = 'none';
                formCard.style.border = 'none';
                formCard.style.padding = '0';
            }

            if (previewContainer) previewContainer.style.display = 'none';
            contactForm.style.display = 'none';

            formFeedback.innerHTML = `
                <div class="clay-card order-confirmation-card" style="background:var(--c-bg-card); border:2px solid #88A47C; padding:2rem; border-radius:28px; text-align:center; box-shadow:0 20px 50px rgba(136,164,124,0.25);">
                    <div style="font-size:3.5rem; margin-bottom:0.4rem;">✅</div>
                    <h2 style="color:var(--c-accent); font-family:var(--f-head); margin-bottom:0.4rem;">Order Confirmed!</h2>
                    <p style="color:var(--c-text-muted); font-size:0.95rem; margin-bottom:1.2rem;">Thank you, <strong style="color:var(--c-text);">${escapeHtml(name)}</strong>! Your 3D order payload has been received.</p>
                    
                    <!-- Order ID Badge -->
                    <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(136,164,124,0.15); color:var(--c-accent); padding:0.5rem 1.2rem; border-radius:20px; font-weight:700; font-family:var(--f-head); margin-bottom:1.5rem; border:1px dashed var(--c-accent);">
                        <span>Order Reference: <strong>${newOrder.id}</strong></span>
                    </div>

                    ${newOrder.snapshot ? `
                    <!-- Custom 3D Design Snapshot Preview -->
                    <div style="background:#121019; padding:1rem; border-radius:20px; margin-bottom:1.5rem; border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:var(--c-primary); font-weight:700; margin-bottom:0.5rem;">🎨 Your Custom 3D Design</div>
                        <img src="${newOrder.snapshot}" alt="Custom 3D Nameplate Design" style="max-width:100%; height:auto; border-radius:12px; display:block; margin:0 auto; box-shadow:0 8px 24px rgba(0,0,0,0.5);">
                    </div>
                    ` : ''}

                    <!-- Receipt Info Grid -->
                    <div style="background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.06); border-radius:20px; padding:1.2rem; margin-bottom:1.5rem; text-align:left; font-size:0.92rem; line-height:1.7;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                            <span style="color:var(--c-text-muted);">Customer:</span>
                            <strong>${escapeHtml(name)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                            <span style="color:var(--c-text-muted);">Email:</span>
                            <strong>${escapeHtml(email)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                            <span style="color:var(--c-text-muted);">Material / Specs:</span>
                            <strong>${escapeHtml(material)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                            <span style="color:var(--c-text-muted);">Quoted Amount:</span>
                            <strong style="color:var(--c-primary); font-size:1.05rem;">${escapeHtml(estPrice)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--c-text-muted);">Status:</span>
                            <span style="color:var(--c-accent); font-weight:700;">✓ Live Synced to Admin Panel</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display:flex; flex-direction:column; gap:0.8rem;">
                        <a href="https://wa.me/8801793500131?text=${encodeURIComponent(waDirectMsg)}" target="_blank" rel="noopener noreferrer" class="clay-btn btn-coral btn-block" style="background:#25D366; color:#FFF; font-size:1.05rem; justify-content:center;">
                            💬 Send Receipt to WhatsApp
                        </a>
                        <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
                            <a href="customize.html" class="clay-btn btn-cream" style="flex:1; justify-content:center;">🎨 Design Another</a>
                            <a href="tel:+8801793500131" class="clay-btn btn-cream" style="flex:1; justify-content:center;">📞 Call Studio</a>
                        </div>
                    </div>
                </div>
            `;
            contactForm.reset();
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }
});
