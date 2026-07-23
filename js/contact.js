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
