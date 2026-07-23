document.addEventListener('DOMContentLoaded', () => {
    const calcMaterial = document.getElementById('calc-material');
    const calcWeight = document.getElementById('calc-weight');
    const weightVal = document.getElementById('calc-weight-val');
    const calcInfill = document.getElementById('calc-infill');
    const infillVal = document.getElementById('calc-infill-val');
    const calcQty = document.getElementById('calc-qty');
    const calcResolution = document.getElementById('calc-resolution');
    const calcRush = document.getElementById('calc-rush');

    const displayPrice = document.getElementById('calc-total-price');
    const displayTime = document.getElementById('calc-print-time');
    const displayDiscount = document.getElementById('calc-discount-badge');
    const btnSendQuote = document.getElementById('btn-send-quote');

    if (!calcMaterial || !displayPrice) return;

    // Rates in BDT (৳ per gram) - PLA+ set to ৳5/gram as requested
    const rates = {
        'PLA': 5.00,
        'ABS': 7.00,
        'Resin': 12.00,
        'CarbonFiber': 16.00
    };

    function calculate() {
        const mat = calcMaterial.value;
        const weight = parseInt(calcWeight.value, 10);
        const infill = parseInt(calcInfill.value, 10);
        const qty = parseInt(calcQty.value, 10) || 1;
        const res = calcResolution ? parseFloat(calcResolution.value) : 1.0;
        const isRush = calcRush ? calcRush.checked : false;

        if (weightVal) weightVal.textContent = weight + 'g';
        if (infillVal) infillVal.textContent = infill + '%';

        // Update slider track fill
        if (calcWeight) {
            const wPct = ((weight - 10) / (1000 - 10)) * 100;
            calcWeight.style.background = `linear-gradient(to right, #FF8A75 0%, #FF5E5E ${wPct}%, rgba(142, 132, 120, 0.2) ${wPct}%, rgba(142, 132, 120, 0.2) 100%)`;
        }
        if (calcInfill) {
            const iPct = ((infill - 10) / (100 - 10)) * 100;
            calcInfill.style.background = `linear-gradient(to right, #9B99E2 0%, #7B78D8 ${iPct}%, rgba(142, 132, 120, 0.2) ${iPct}%, rgba(142, 132, 120, 0.2) 100%)`;
        }

        // Material cost = Weight * Rate
        const baseMatCost = weight * (rates[mat] || 5.00);
        
        // Infill density factor: 100% infill adds up to 30% material density multiplier
        const infillMultiplier = 1 + ((infill - 20) / 100) * 0.35;
        
        // Base machine operation & slice fee: ৳150 per unit
        const baseCostPerUnit = (baseMatCost * infillMultiplier * res) + 150;

        let discountRate = 1.0;
        if (qty >= 25) {
            discountRate = 0.75;
            if (displayDiscount) displayDiscount.textContent = '২৫% ব্যাচ প্রোডাকশন ডিসকাউন্ট প্রযোজ্য!';
        } else if (qty >= 10) {
            discountRate = 0.85;
            if (displayDiscount) displayDiscount.textContent = '১৫% বাল্ক ডিসকাউন্ট প্রযোজ্য!';
        } else {
            if (displayDiscount) displayDiscount.textContent = 'স্ট্যান্ডার্ড রেট (বিকাশ / নগদ পেমেন্ট গ্রহণযোগ্য)';
        }

        let total = Math.round(baseCostPerUnit * qty * discountRate);
        if (isRush) total += 350;

        // Estimated Print Hours
        const totalHours = Math.max(1, Math.round(((weight * (infill / 40) * res * qty) / 30)));

        displayPrice.textContent = '৳' + total.toLocaleString('en-US');
        if (displayTime) displayTime.textContent = totalHours + ' ঘণ্টা (' + Math.ceil(totalHours / 24) + ' দিনের মধ্যে ডেলিভারি)';
    }

    // Attach Event Listeners
    [calcMaterial, calcWeight, calcInfill, calcQty, calcResolution, calcRush].forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
            input.addEventListener('change', calculate);
        }
    });

    if (btnSendQuote) {
        btnSendQuote.addEventListener('click', (e) => {
            e.preventDefault();
            const matName = calcMaterial.options[calcMaterial.selectedIndex].text;
            const weight = calcWeight.value;
            const infill = calcInfill.value;
            const qty = calcQty.value;
            const price = displayPrice.textContent;

            const details = `কোটেশন হিসাব: ${price} (পরিমাণ: ${qty} টি, ওজন: ${weight}g, ইনফিল: ${infill}%, ফিলামেন্ট: ${matName})`;
            window.location.href = `contact.html?material=${encodeURIComponent(matName)}&details=${encodeURIComponent(details)}`;
        });
    }

    calculate();
});
