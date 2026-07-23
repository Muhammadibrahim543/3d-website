document.addEventListener('DOMContentLoaded', () => {
    const inputName = document.getElementById('cust-text');
    const fontOptions = document.getElementById('font-options');
    const colorSwatches = document.getElementById('color-swatches');
    const inputThickness = document.getElementById('cust-thickness');
    const valThickness = document.getElementById('val-thickness');

    const nameplate3D = document.getElementById('nameplate-3d');
    const stageCard = document.querySelector('.customizer-stage-card');

    const displayPrice = document.getElementById('cust-price');
    const displaySpecs = document.getElementById('cust-specs');
    const btnOrder = document.getElementById('btn-order-custom');

    if (!inputName || !nameplate3D) return;

    // State
    let currentFont = "'Chewy', cursive";
    let currentColor = '#2979FF';
    let currentColorName = 'Ocean Blue';
    let currentRate = 5.0;

    // --- Helper: Darken Hex Color ---
    function darkenColor(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) - amt,
            G = (num >> 8 & 0x00FF) - amt,
            B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).padStart(6, '0');
    }

    // --- Update Preview ---
    function updatePreview() {
        const text = inputName.value.trim() || 'Name';
        const thickness = parseInt(inputThickness.value, 10);
        const upperText = text.toUpperCase();

        // 1. Update UI (Sliders, Prices)
        valThickness.textContent = thickness + 'mm';
        const min = parseInt(inputThickness.min, 10) || 3;
        const max = parseInt(inputThickness.max, 10) || 10;
        const pct = ((thickness - min) / (max - min)) * 100;
        inputThickness.style.background = `linear-gradient(to right, #FF8A75 0%, #FF5E5E ${pct}%, rgba(142, 132, 120, 0.2) ${pct}%, rgba(142, 132, 120, 0.2) 100%)`;

        const numLetters = text.length;
        const letterFee = 22 * numLetters;
        const thicknessMultiplier = thickness / 4.0;
        const matMultiplier = currentRate / 5.0;
        const total = Math.round((120 + letterFee) * thicknessMultiplier * matMultiplier);
        
        displayPrice.textContent = '৳' + total.toLocaleString('en-US');
        displaySpecs.textContent = `${currentColorName} PLA • ${thickness}mm Thick • ${numLetters} Letters`;

        // 2. Generate 2.5D DOM Layers
        nameplate3D.innerHTML = '';
        
        // Add sizer (invisible, provides container dimensions)
        const sizer = document.createElement('span');
        sizer.className = 'layer-sizer';
        sizer.textContent = upperText;
        sizer.style.fontFamily = currentFont;
        nameplate3D.appendChild(sizer);

        // Force a layout to get the text width
        const textWidth = sizer.offsetWidth || (upperText.length * 30);
        
        // Helper to create SVG layers perfectly aligned
        function createSVGLayer(className, color, strokeW, isText, zPos, extraClass) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", className);
            if (extraClass) svg.classList.add(extraClass);
            
            // Fix visibility and centering issues across browsers
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.overflow = 'visible';
            svg.style.transform = `translateZ(${zPos}px)`;
            
            const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.setAttribute("x", "50%");
            txt.setAttribute("y", "50%");
            txt.setAttribute("text-anchor", "middle");
            // dy=0.05em helps vertically align text in SVG better than dominant-baseline alone
            txt.setAttribute("dominant-baseline", "central");
            txt.setAttribute("dy", "0.05em"); 
            txt.textContent = upperText;
            txt.style.fontFamily = currentFont;
            
            if (isText) {
                txt.setAttribute("fill", color);
            } else {
                txt.setAttribute("fill", color);
                txt.setAttribute("stroke", color);
                txt.setAttribute("stroke-width", strokeW);
                txt.setAttribute("stroke-linejoin", "round");
            }
            svg.appendChild(txt);
            
            // If it's a base layer, add the integrated keyring hole to the left
            if (!isText) {
                const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                // The SVG width equals the text width. So x=0 is exactly the left edge of the text.
                // Place the hole 20px outside the left edge.
                const ringX = -20; 
                ring.setAttribute("cx", ringX);
                ring.setAttribute("cy", "50%");
                ring.setAttribute("r", "9"); // 18px diameter center hole
                ring.setAttribute("fill", "transparent");
                ring.setAttribute("stroke", color);
                ring.setAttribute("stroke-width", "10"); // thick 10px plastic ring
                svg.appendChild(ring);
            }
            
            return svg;
        }

        // Base plate layers
        const baseThickness = Math.max(4, Math.floor(thickness * 1.5));
        const sideColor = darkenColor(currentColor, 15);
        const strokeWidth = 24; // Creates 12px scalloped padding around text
        
        for (let i = 0; i < baseThickness; i++) {
            const col = (i === baseThickness - 1) ? currentColor : sideColor;
            const extra = (i === 0) ? 'layer-base-bottom' : (i === baseThickness - 1 ? 'layer-base-top' : '');
            const svg = createSVGLayer('layer-base', col, strokeWidth, false, i, extra);
            nameplate3D.appendChild(svg);
        }

        // Text layers (White text on top)
        const textThickness = Math.max(3, Math.floor(thickness * 0.8));
        for (let i = 0; i < textThickness; i++) {
            const col = (i === textThickness - 1) ? '#F5F0E8' : '#d4ccbb';
            const extra = (i === textThickness - 1) ? 'layer-text-top' : 'layer-text-side';
            const zPos = baseThickness + i;
            const svg = createSVGLayer('layer-text', col, 0, true, zPos, extra);
            nameplate3D.appendChild(svg);
        }
    }

    // --- Font Selection ---
    if (fontOptions) {
        fontOptions.querySelectorAll('.font-option').forEach(opt => {
            opt.addEventListener('click', () => {
                fontOptions.querySelectorAll('.font-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                currentFont = opt.getAttribute('data-font');
                updatePreview();
            });
        });
    }

    // --- Color Selection ---
    if (colorSwatches) {
        colorSwatches.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorSwatches.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                currentColor = swatch.getAttribute('data-color');
                currentColorName = swatch.getAttribute('data-name');
                currentRate = parseFloat(swatch.getAttribute('data-rate'));
                updatePreview();
            });
        });
    }

    // --- 3D Tilt (Mouse Parallax) ---
    if (stageCard && nameplate3D) {
        stageCard.addEventListener('mousemove', (e) => {
            const rect = stageCard.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);

            const rotateY = (x / (rect.width / 2)) * 25;
            const rotateX = -(y / (rect.height / 2)) * 20;

            nameplate3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        stageCard.addEventListener('mouseleave', () => {
            nameplate3D.style.transform = 'rotateX(8deg) rotateY(-8deg)';
        });

        // Touch support for mobile — Smart Gesture Detection (Allows natural page scrolling)
        let touchStartX = 0;
        let touchStartY = 0;
        let isHorizontalDrag = false;

        stageCard.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isHorizontalDrag = false;
            }
        }, { passive: true });

        stageCard.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            // If user moves horizontally more than vertically, rotate 3D preview and block horizontal swipe navigation
            if (!isHorizontalDrag && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
                isHorizontalDrag = true;
            }

            if (isHorizontalDrag) {
                if (e.cancelable) e.preventDefault();
                const rect = stageCard.getBoundingClientRect();
                const x = touch.clientX - rect.left - (rect.width / 2);
                const y = touch.clientY - rect.top - (rect.height / 2);

                const rotateY = (x / (rect.width / 2)) * 25;
                const rotateX = -(y / (rect.height / 2)) * 20;

                nameplate3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        }, { passive: false });

        stageCard.addEventListener('touchend', () => {
            nameplate3D.style.transform = 'rotateX(8deg) rotateY(-8deg)';
            isHorizontalDrag = false;
        });
    }

    // --- Event Listeners ---
    inputName.addEventListener('input', updatePreview);
    inputThickness.addEventListener('input', updatePreview);

    // --- Order Button ---
    if (btnOrder) {
        btnOrder.addEventListener('click', () => {
            const text = inputName.value.trim() || 'Custom Name';
            const fontEl = fontOptions.querySelector('.font-option.active');
            const fontName = fontEl ? fontEl.querySelector('small').textContent : 'Fredoka';
            const thickness = inputThickness.value;
            const price = displayPrice.textContent;

            const details = `Live Customizer Order:\n- Name/Text: ${text}\n- Font: ${fontName}\n- Base Color: ${currentColorName}\n- Thickness: ${thickness}mm\n- Quoted Price: ${price}`;

            window.location.href = `contact.html?material=${encodeURIComponent(currentColorName + ' PLA')}&details=${encodeURIComponent(details)}`;
        });
    }

    // Initialize
    updatePreview();
    if (document.fonts) {
        document.fonts.ready.then(updatePreview);
    }
});
