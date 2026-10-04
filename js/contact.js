document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('shapey-contact-form');
    const feedback = document.getElementById('contact-feedback');
    const query = new URLSearchParams(location.search);
    const isCart = query.get('from') === 'cart';
    const isCustom = query.get('from') === 'customizer' || query.get('type') === 'custom_order';
    const tr = (en, bn) => localStorage.getItem('shapey_lang') === 'bn' ? bn : en;
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    let pending = null, busy = false, completed = false, uploadedFile = null;
    let orderId = 'KC-' + crypto.randomUUID();
    try { if (isCustom) pending = JSON.parse(localStorage.getItem('kiras_pending_custom_order') || 'null'); } catch (e) {}
    const items = isCart ? KiraCart.getItems() : [];
    const buying = isCart || Boolean(pending);
    if (isCart && !items.length || isCustom && !pending) {
        feedback.textContent = tr('Your design or cart is empty. Please start again.', 'ডিজাইন বা কার্ট পাওয়া যায়নি। আবার শুরু করুন।');
        form.hidden = true; return;
    }
    if (query.has('details')) document.getElementById('project-details').value = query.get('details');
    if (query.has('material')) {
        const select = document.getElementById('material-choice');
        const value = query.get('material');
        const match = [...select.options].find(o => o.value === value || o.text === value);
        if (match) select.value = match.value;
    }
    const summary = document.getElementById('checkout-summary');
    const preview = document.getElementById('customizer-preview-container');
    const fileInput = document.getElementById('contact-file');
    const button = form.querySelector('[type=submit]');
    if (buying) {
        button.removeAttribute('data-i18n');
        button.textContent = tr('Place Order', 'অর্ডার পাঠান');
        document.querySelector('[data-i18n=contact_headline]').textContent = tr('Complete Your Order', 'অর্ডারের তথ্য দিন');
    }
    let subtotal = 0;
    if (isCart) {
        subtotal = KiraCart.getTotalPrice();
        summary.innerHTML = `<div class="clay-card" style="padding:1rem;">${items.map(i => `<p>${escape(i.quantity)} × ${escape(i.title)} — ${escape(KiraDB.money.format(i.numPrice * i.quantity))}</p>`).join('')}<strong>${tr('Products total', 'পণ্যের মোট দাম')}: ${escape(KiraDB.money.format(subtotal))}</strong><p>${tr('Delivery fee will be confirmed by the studio before payment.', 'পেমেন্টের আগে ডেলিভারি চার্জ স্টুডিও থেকে নিশ্চিত করা হবে।')}</p></div>`;
    } else if (pending) {
        subtotal = KiraDB.money.parse(pending.price);
        preview.innerHTML = `<div class="clay-card" style="padding:1rem;"><img src="${escape(pending.snapshot)}" alt="Custom design" style="max-width:100%;max-height:220px;"><p>${escape(pending.text)} • ${escape(pending.model)} • ${escape(pending.color)}</p><strong>${escape(KiraDB.money.format(subtotal))}</strong><p>${tr('Delivery fee will be confirmed before payment.', 'পেমেন্টের আগে ডেলিভারি চার্জ নিশ্চিত করা হবে।')}</p><a href="customize.html" class="clay-btn btn-sm">${tr('Edit design', 'ডিজাইন পরিবর্তন')}</a> <button type="button" id="cancel-custom-order" class="clay-btn btn-sm">${tr('Cancel', 'বাতিল')}</button></div>`;
        document.getElementById('cancel-custom-order').onclick = () => { localStorage.removeItem('kiras_pending_custom_order'); location.href = 'contact.html'; };
        document.getElementById('file-upload-group').hidden = true;
    } else {
        document.getElementById('payment-method-group').hidden = true;
        const match = document.getElementById('project-details').value.match(/৳[০-৯0-9,]+(?:\.[0-9]{1,2})?/);
        subtotal = match ? KiraDB.money.parse(match[0]) : 0;
    }
    await window.KiraAuth?.ready;
    const user = window.KiraAuth?.getCurrentUser();
    for (const [id, value] of [['contact-name', user?.name], ['contact-email', user?.email], ['contact-phone', user?.phone], ['contact-address', user?.address]]) {
        if (value && !document.getElementById(id).value) document.getElementById(id).value = value;
    }
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || completed || !form.reportValidity()) return;
        busy = true; button.disabled = true; feedback.style.color = 'var(--c-text)';
        feedback.textContent = tr('Saving your request…', 'আপনার তথ্য সংরক্ষণ হচ্ছে…');
        try {
            KiraDB.requireCloud();
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const address = document.getElementById('contact-address').value.trim();
            const normalizedPhone = phone.replace(/[০-৯]/g, n => '০১২৩৪৫৬৭৮৯'.indexOf(n)).replace(/[\s()-]/g, '');
            if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(normalizedPhone)) throw new Error(tr('Enter a valid Bangladesh mobile number.', 'সঠিক বাংলাদেশের মোবাইল নম্বর দিন।'));
            if (!address) throw new Error(tr('Enter your shipping address.', 'ডেলিভারির ঠিকানা দিন।'));
            const file = fileInput.files[0];
            let fileUrl = pending?.modelFileUrl || null;
            if (file) {
                KiraDB.storage.validate(file, file.name);
                if (!uploadedFile || uploadedFile.file !== file) uploadedFile = { file, url: await KiraDB.storage.uploadModel(file, file.name) };
                fileUrl = uploadedFile.url;
            }
            if (pending && !fileUrl) throw new Error(tr('Please return to the customizer and upload the model again.', 'কাস্টমাইজারে ফিরে মডেলটি আবার পাঠান।'));
            if (isCart && JSON.stringify(KiraCart.getItems()) !== JSON.stringify(items)) throw new Error(tr('Your cart changed. Reload checkout to review it.', 'কার্ট পরিবর্তন হয়েছে। checkout রিলোড করে যাচাই করুন।'));
            const details = document.getElementById('project-details').value.trim();
            const material = document.getElementById('material-choice').value;
            const itemDetails = items.map(i => `${i.quantity} × ${i.title} (${KiraDB.formatSpecs(i.specs)})`).join('\n');
            const record = await KiraDB.orders.create({
                id: orderId, name, email, phone, address, subtotal, deliveryFee: 0,
                paymentMethod: buying ? document.getElementById('contact-payment').value : 'quote',
                notes: [buying ? 'Order request; delivery fee requires confirmation.' : 'Quote request.', material, itemDetails, details].filter(Boolean).join('\n'),
                items, customSpecs: pending, modelFileUrl: fileUrl
            });
            completed = true;
            if (isCart) KiraCart.clear();
            if (pending) localStorage.removeItem('kiras_pending_custom_order');
            form.hidden = true; preview.hidden = true; summary.hidden = true;
            const message = `Order ${record.id}\n${name}\n${phone}\n${address}\n${itemDetails || pending?.text || details}\nProducts total: ${KiraDB.money.format(record.subtotal)}`;
            feedback.innerHTML = `<div class="clay-card" style="padding:1.5rem;overflow-wrap:anywhere;"><h2>✓ ${buying ? tr('Order Request Received', 'অর্ডারের অনুরোধ পেয়েছি') : tr('Quote Request Received', 'কোটেশনের অনুরোধ পেয়েছি')}</h2><p>${tr('Reference', 'রেফারেন্স')}: <strong>${escape(record.id)}</strong></p><p>${escape(name)} • ${escape(phone)}</p><p>${escape(address)}</p><p>${tr('Products amount', 'পণ্যের দাম')}: ${record.subtotal ? escape(KiraDB.money.format(record.subtotal)) : tr('Quote required', 'কোটেশন প্রয়োজন')}</p><p>${tr('The studio will confirm delivery charges and payment. Payment is not yet confirmed.', 'স্টুডিও ডেলিভারি চার্জ ও পেমেন্ট নিশ্চিত করবে। পেমেন্ট এখনও নিশ্চিত হয়নি।')}</p><a class="clay-btn btn-coral" href="https://wa.me/8801793500131?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">${tr('Contact Studio', 'স্টুডিওতে যোগাযোগ')}</a></div>`;
        } catch (error) {
            console.error('Request not confirmed:', error);
            feedback.style.color = '#C63D32';
            feedback.textContent = `${tr('Not saved. Your information is kept; please retry.', 'সেভ হয়নি। আপনার তথ্য রাখা আছে; আবার চেষ্টা করুন।')} ${error.message || ''}`;
        } finally { busy = false; button.disabled = completed; }
    });
});
