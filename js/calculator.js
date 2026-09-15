document.addEventListener('DOMContentLoaded', () => {
    const calcMaterial = document.getElementById('calc-material');
    const calcWeight = document.getElementById('calc-weight');
    const weightVal = document.getElementById('calc-weight-val');
    const calcInfill = document.getElementById('calc-infill');
    const infillVal = document.getElementById('calc-infill-val');
    const calcQty = document.getElementById('calc-qty');
    const calcResolution = document.getElementById('calc-resolution');
    const calcComplexity = document.getElementById('calc-complexity');

    const displayPrice = document.getElementById('calc-total-price');
    const displayDiscount = document.getElementById('calc-discount-badge');
    const btnSendQuote = document.getElementById('btn-send-quote');
    const btnAddCartEstimate = document.getElementById('btn-add-cart-estimate');

    if (!calcMaterial || !displayPrice) return;

    // Internal studio rates:
    // Bambu Lab PLA+ ৳2000/kg = ৳2.00/g
    // Machine running cost = ৳70.00/hour
    const filamentRates = {
        'PLA': 2.00,
        'SilkPLA': 2.50,
        'PETG': 2.50
    };
    const MACHINE_HOURLY_RATE = 70.0;

    function calculate() {
        const mat = calcMaterial.value;
        const weight = parseInt(calcWeight.value, 10) || 10;
        const infill = parseInt(calcInfill.value, 10) || 20;
        const qty = parseInt(calcQty.value, 10) || 1;
        const res = calcResolution ? parseFloat(calcResolution.value) : 1.0;
        const complexity = calcComplexity ? parseFloat(calcComplexity.value) : 1.0;

        if (weightVal) weightVal.textContent = weight + 'g';
        if (infillVal) infillVal.textContent = infill + '%';

        // Update slider track fill
        if (calcWeight) {
            const minW = parseInt(calcWeight.min, 10) || 5;
            const maxW = parseInt(calcWeight.max, 10) || 500;
            const wPct = Math.max(0, Math.min(100, ((weight - minW) / (maxW - minW)) * 100));
            calcWeight.style.background = `linear-gradient(to right, #FF8A75 0%, #FF5E5E ${wPct}%, rgba(142, 132, 120, 0.2) ${wPct}%, rgba(142, 132, 120, 0.2) 100%)`;
        }
        if (calcInfill) {
            const minI = parseInt(calcInfill.min, 10) || 10;
            const maxI = parseInt(calcInfill.max, 10) || 100;
            const iPct = Math.max(0, Math.min(100, ((infill - minI) / (maxI - minI)) * 100));
            calcInfill.style.background = `linear-gradient(to right, #9B99E2 0%, #7B78D8 ${iPct}%, rgba(142, 132, 120, 0.2) ${iPct}%, rgba(142, 132, 120, 0.2) 100%)`;
        }

        // Internal calculation logic
        const unitMatRate = filamentRates[mat] || 2.00;
        const infillFactor = 1 + ((infill - 20) / 100) * 0.35;
        const effectiveWeight = weight * infillFactor;
        const materialCost = effectiveWeight * unitMatRate;

        // Print speed model based on complexity (g/hr):
        // Basic: ~20g/hr | Functional: ~15g/hr | Complex Art/Miniature: ~11g/hr
        const speedGramsPerHour = Math.max(8.0, 20.0 / complexity);
        const printHours = Math.max(0.22, (effectiveWeight / speedGramsPerHour) * res);
        const machineCost = printHours * MACHINE_HOURLY_RATE;

        // Base operational cost: material + machine time + preparation/handling fee
        const baseCost = materialCost + machineCost + 20.0;

        // Tiered commercial margin: scales from 1.35x (small keychains) to 1.55x (heavy/complex prints with higher failure risk)
        const marginMultiplier = effectiveWeight > 60 ? 1.55 : (effectiveWeight > 20 ? 1.45 : 1.35);
        let unitPrice = Math.max(50, Math.round(baseCost * marginMultiplier));

        // Ensure 10g standard keychain stays at standard ৳80-85 baseline
        if (weight <= 10 && complexity <= 1.0 && mat === 'PLA' && infill <= 20) {
            unitPrice = Math.min(unitPrice, 85);
        }

        let discountRate = 1.0;
        if (qty >= 25) {
            discountRate = 0.75;
            if (displayDiscount) displayDiscount.textContent = '🎉 ২৫% ব্যাচ প্রোডাকশন ডিসকাউন্ট প্রযোজ্য!';
        } else if (qty >= 10) {
            discountRate = 0.85;
            if (displayDiscount) displayDiscount.textContent = '🎉 ১৫% বাল্ক ডিসকাউন্ট প্রযোজ্য!';
        } else {
            if (displayDiscount) displayDiscount.textContent = 'স্ট্যান্ডার্ড রেট (বিকাশ / নগদ পেমেন্ট গ্রহণযোগ্য)';
        }

        const total = Math.round(unitPrice * qty * discountRate);

        // Display ONLY final price to customer
        displayPrice.textContent = '৳' + total.toLocaleString('en-US');
    }

    // Attach Event Listeners
    [calcMaterial, calcWeight, calcInfill, calcQty, calcResolution, calcComplexity].forEach(input => {
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

            const details = `কোটেশন হিসাব: ${price} (পরিমাণ: ${qty} টি, ওজন: ${weight}g, ইনফিল: ${infill}%, ম্যাটেরিয়াল: ${matName})`;
            window.location.href = `contact.html?material=${encodeURIComponent(matName)}&details=${encodeURIComponent(details)}`;
        });
    }

    if (btnAddCartEstimate) {
        btnAddCartEstimate.addEventListener('click', (e) => {
            e.preventDefault();
            const matName = calcMaterial.options[calcMaterial.selectedIndex].text;
            const weight = calcWeight.value;
            const infill = calcInfill.value;
            const qty = parseInt(calcQty.value, 10) || 1;
            const priceText = displayPrice.textContent.replace('৳', '').replace(/,/g, '').trim();
            const price = parseInt(priceText, 10) || 80;

            if (window.KiraCart) {
                KiraCart.addItem({
                    title: `Custom 3D Print (${matName})`,
                    specs: `${weight}g • ${infill}% Infill • ${qty} Unit(s)`,
                    price: price,
                    quantity: qty,
                    image: 'images/torii_gate_lamp.webp'
                });
            }
        });
    }

    calculate();
});
