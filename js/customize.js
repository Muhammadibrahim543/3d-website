document.addEventListener('DOMContentLoaded', () => {
    const inputName = document.getElementById('cust-text');
    const fontOptions = document.getElementById('font-options');
    const colorSwatches = document.getElementById('color-swatches');
    const templateOptions = document.getElementById('template-options');
    const finishOptions = document.getElementById('finish-options');
    const inputThickness = document.getElementById('cust-thickness');
    const valThickness = document.getElementById('val-thickness');

    const nameplate3D = document.getElementById('nameplate-3d');
    const stageCard = document.getElementById('customizer-stage-card');
    const btnToggleBed = document.getElementById('btn-toggle-bed');
    const btnResetView = document.getElementById('btn-reset-view');
    const buildPlateGrid = document.getElementById('build-plate-grid');
    const stageSurface = document.getElementById('stage-surface');

    const displayPrice = document.getElementById('cust-price');
    const displaySpecs = document.getElementById('cust-specs');
    const btnOrder = document.getElementById('btn-order-custom');

    if (!inputName || !nameplate3D) return;

    // State Variables
    let currentTemplate = 'keyring'; // 'keyring' | 'deskstand' | 'pettag' | 'badge'
    let currentFont = "'Lobster', cursive";
    let currentColor = '#2979FF';
    let currentColorName = 'Ocean Blue';
    let currentRate = 5.0;
    let currentFinish = 'standard'; // 'standard' | 'silk' | 'satin' | 'neon'
    let isBuildPlateVisible = false;

    // Camera 3D Orbit Angles
    let rotX = 12;
    let rotY = -15;

    // --- Helper: Darken Hex Color ---
    function darkenColor(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) - amt,
            G = (num >> 8 & 0x00FF) - amt,
            B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).padStart(6, '0');
    }

    // --- Helper: Get Template Name Label ---
    function getTemplateLabel(tpl) {
        switch(tpl) {
            case 'deskstand': return 'Desk Stand';
            case 'pettag': return 'Pet Tag';
            case 'badge': return 'Badge Plaque';
            default: return 'Keyring';
        }
    }

    // --- Update Preview ---
    function updatePreview() {
        const text = inputName.value.trim() || 'Name';
        const thickness = parseInt(inputThickness.value, 10);
        const upperText = text.toUpperCase();

        // 1. Update Sliders & Specifications UI
        valThickness.textContent = thickness + 'mm';
        const min = parseInt(inputThickness.min, 10) || 3;
        const max = parseInt(inputThickness.max, 10) || 10;
        const pct = ((thickness - min) / (max - min)) * 100;
        inputThickness.style.background = `linear-gradient(to right, #FF8A75 0%, #FF5E5E ${pct}%, rgba(142, 132, 120, 0.2) ${pct}%, rgba(142, 132, 120, 0.2) 100%)`;

        const numLetters = text.length;
        const letterFee = 22 * numLetters;
        const thicknessMultiplier = thickness / 4.0;
        const matMultiplier = currentRate / 5.0;

        let templateMultiplier = 1.0;
        if (currentTemplate === 'deskstand') templateMultiplier = 1.35;
        else if (currentTemplate === 'badge') templateMultiplier = 1.25;
        else if (currentTemplate === 'pettag') templateMultiplier = 0.9;

        const total = Math.round((120 + letterFee) * thicknessMultiplier * matMultiplier * templateMultiplier);
        
        displayPrice.textContent = '৳' + total.toLocaleString('en-US');
        displaySpecs.textContent = `${getTemplateLabel(currentTemplate)} • ${currentColorName} PLA • ${thickness}mm Thick • ${numLetters} Letters`;

        // 2. Clear & Prepare 3D Scene
        nameplate3D.className = 'nameplate-3d finish-' + currentFinish;
        nameplate3D.innerHTML = '';
        
        // Sizer element to measure exact text dimensions
        const sizer = document.createElement('span');
        sizer.className = 'layer-sizer';
        sizer.textContent = upperText;
        sizer.style.fontFamily = currentFont;
        nameplate3D.appendChild(sizer);

        // Helper function to build 2.5D SVG Layers
        function createSVGLayer(className, color, strokeW, isText, zPos, extraClass) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", className);
            if (extraClass) svg.classList.add(extraClass);
            
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
            
            // Render 3D Template Accessories on Base Plate Layers
            if (!isText) {
                if (currentTemplate === 'keyring') {
                    // Left mounting keyring hole
                    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    ring.setAttribute("cx", "-20");
                    ring.setAttribute("cy", "50%");
                    ring.setAttribute("r", "9");
                    ring.setAttribute("fill", "transparent");
                    ring.setAttribute("stroke", color);
                    ring.setAttribute("stroke-width", "10");
                    svg.appendChild(ring);
                } else if (currentTemplate === 'pettag') {
                    // Top centered loop for pet tags
                    const topLoop = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    topLoop.setAttribute("cx", "50%");
                    topLoop.setAttribute("cy", "-16");
                    topLoop.setAttribute("r", "8");
                    topLoop.setAttribute("fill", "transparent");
                    topLoop.setAttribute("stroke", color);
                    topLoop.setAttribute("stroke-width", "8");
                    svg.appendChild(topLoop);
                } else if (currentTemplate === 'deskstand') {
                    // Extruded bottom wedge base block for table display
                    const standBase = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    standBase.setAttribute("x", "-15%");
                    standBase.setAttribute("y", "68%");
                    standBase.setAttribute("width", "130%");
                    standBase.setAttribute("height", "28");
                    standBase.setAttribute("rx", "8");
                    standBase.setAttribute("fill", color);
                    standBase.setAttribute("stroke", color);
                    standBase.setAttribute("stroke-width", "4");
                    svg.appendChild(standBase);
                } else if (currentTemplate === 'badge') {
                    // Outer rectangular frame plaque border
                    const frame = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    frame.setAttribute("x", "-10%");
                    frame.setAttribute("y", "-15%");
                    frame.setAttribute("width", "120%");
                    frame.setAttribute("height", "130%");
                    frame.setAttribute("rx", "16");
                    frame.setAttribute("fill", "transparent");
                    frame.setAttribute("stroke", color);
                    frame.setAttribute("stroke-width", "8");
                    svg.appendChild(frame);
                }
            }
            
            return svg;
        }

        // Generate 3D Base Plastic Layers
        const baseThickness = Math.max(4, Math.floor(thickness * 1.5));
        const sideColor = darkenColor(currentColor, 15);
        const strokeWidth = (currentTemplate === 'badge') ? 32 : 24;
        
        for (let i = 0; i < baseThickness; i++) {
            const col = (i === baseThickness - 1) ? currentColor : sideColor;
            const extra = (i === 0) ? 'layer-base-bottom' : (i === baseThickness - 1 ? 'layer-base-top' : '');
            const svg = createSVGLayer('layer-base', col, strokeWidth, false, i, extra);
            nameplate3D.appendChild(svg);
        }

        // Generate 3D Raised Text Layers
        const textThickness = Math.max(3, Math.floor(thickness * 0.8));
        const topTextColor = (currentFinish === 'neon') ? '#70FFFA' : (currentFinish === 'silk' ? '#FFF3D1' : '#F5F0E8');
        for (let i = 0; i < textThickness; i++) {
            const col = (i === textThickness - 1) ? topTextColor : '#d4ccbb';
            const extra = (i === textThickness - 1) ? 'layer-text-top' : 'layer-text-side';
            const zPos = baseThickness + i;
            const svg = createSVGLayer('layer-text', col, 0, true, zPos, extra);
            nameplate3D.appendChild(svg);
        }

        // Apply 3D Transform Angle
        apply3DRotation();
    }

    // --- Apply 3D Transformation ---
    function apply3DRotation() {
        if (nameplate3D) {
            nameplate3D.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
    }

    // --- Template Selector Event Listeners ---
    if (templateOptions) {
        templateOptions.querySelectorAll('.template-option').forEach(opt => {
            opt.addEventListener('click', () => {
                templateOptions.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                currentTemplate = opt.getAttribute('data-template');
                updatePreview();
            });
        });
    }

    // --- Font Selection Event Listeners ---
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

    // --- Color Selection Event Listeners ---
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

    // --- Finish Selection Event Listeners ---
    if (finishOptions) {
        finishOptions.querySelectorAll('.finish-option').forEach(opt => {
            opt.addEventListener('click', () => {
                finishOptions.querySelectorAll('.finish-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                currentFinish = opt.getAttribute('data-finish');
                updatePreview();
            });
        });
    }

    // --- Build Plate & View Toggle ---
    if (btnToggleBed) {
        btnToggleBed.addEventListener('click', () => {
            isBuildPlateVisible = !isBuildPlateVisible;
            if (isBuildPlateVisible) {
                btnToggleBed.classList.add('active');
                btnToggleBed.innerHTML = '✨ Floating View';
                if (buildPlateGrid) buildPlateGrid.style.display = 'flex';
                if (stageSurface) stageSurface.style.opacity = '0.2';
            } else {
                btnToggleBed.classList.remove('active');
                btnToggleBed.innerHTML = '🏁 Build Plate';
                if (buildPlateGrid) buildPlateGrid.style.display = 'none';
                if (stageSurface) stageSurface.style.opacity = '1';
            }
        });
    }

    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            rotX = 12;
            rotY = -15;
            apply3DRotation();
        });
    }

    // --- Mobile & Desktop Smooth 3D Touch Orbit Physics ---
    if (stageCard && nameplate3D) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startRotX = 12, startRotY = -15;

        // Mouse Events
        stageCard.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startRotX = rotX;
            startRotY = rotY;
            stageCard.classList.add('grabbing');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            rotY = startRotY + (deltaX * 0.4);
            rotX = Math.max(-60, Math.min(60, startRotX - (deltaY * 0.4)));
            apply3DRotation();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                stageCard.classList.remove('grabbing');
            }
        });

        // Touch Events for Mobile (Smooth Orbit Gesture)
        stageCard.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startRotX = rotX;
                startRotY = rotY;
            }
        }, { passive: true });

        stageCard.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - touchStartY || (touch.clientY - startY);

            // Rotate 3D Preview smoothly
            rotY = startRotY + (deltaX * 0.5);
            rotX = Math.max(-60, Math.min(60, startRotX - (deltaY * 0.5)));
            apply3DRotation();

            if (e.cancelable) e.preventDefault();
        }, { passive: false });

        stageCard.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // Slider inputs
    inputName.addEventListener('input', updatePreview);
    inputThickness.addEventListener('input', updatePreview);

    // --- SVG Snapshot Generator for Orders & Cart ---
    function generateSnapshotSVG() {
        const text = inputName.value.trim() || 'CUSTOM NAME';
        const upperText = text.toUpperCase();
        const fontEl = fontOptions ? fontOptions.querySelector('.font-option.active') : null;
        const fontName = fontEl ? fontEl.getAttribute('data-font') : currentFont;
        const fontDisplayName = fontEl && fontEl.querySelector('small') ? fontEl.querySelector('small').textContent : 'Lobster';

        const sizer = document.querySelector('.layer-sizer');
        const textWidth = sizer ? (sizer.offsetWidth || (upperText.length * 28)) : (upperText.length * 28);
        const svgWidth = Math.max(340, textWidth + 90);
        const svgHeight = 160;

        let extraAccessory = '';
        if (currentTemplate === 'keyring') {
            extraAccessory = `<circle cx="-${textWidth/2 + 20}" cy="0" r="9" fill="none" stroke="${currentColor}" stroke-width="10" />`;
        } else if (currentTemplate === 'pettag') {
            extraAccessory = `<circle cx="0" cy="-45" r="8" fill="none" stroke="${currentColor}" stroke-width="8" />`;
        } else if (currentTemplate === 'deskstand') {
            extraAccessory = `<rect x="-${svgWidth/2.5}" y="35" width="${svgWidth/1.25}" height="20" rx="6" fill="${currentColor}" />`;
        }

        const svgDoc = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="-${svgWidth/2} -${svgHeight/2} ${svgWidth} ${svgHeight}">
            <rect x="-${svgWidth/2}" y="-${svgHeight/2}" width="${svgWidth}" height="${svgHeight}" rx="24" fill="#181621" />
            <g transform="translate(0, 0)">
                ${extraAccessory}
                <text x="0" y="0" text-anchor="middle" dominant-baseline="central" dy="0.05em" 
                      fill="${currentColor}" stroke="${currentColor}" stroke-width="24" stroke-linejoin="round"
                      font-family="${fontName}, sans-serif" font-size="44" font-weight="800">
                    ${upperText}
                </text>
            </g>
            <g transform="translate(-2, -4)">
                <text x="0" y="0" text-anchor="middle" dominant-baseline="central" dy="0.05em" 
                      fill="#F5F0E8" font-family="${fontName}, sans-serif" font-size="44" font-weight="800">
                    ${upperText}
                </text>
            </g>
        </svg>`;

        return {
            snapshotUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgDoc),
            fontDisplayName: fontDisplayName
        };
    }

    // --- Order & Cart Buttons ---
    if (btnOrder) {
        btnOrder.addEventListener('click', async () => {
            const text = inputName.value.trim() || 'Custom Name';
            const thickness = inputThickness.value;
            const price = displayPrice.textContent;
            
            const snapData = generateSnapshotSVG();
            const user = window.KiraAuth ? window.KiraAuth.getCurrentUser() : null;

            if (user) {
                const orderId = 'KC-' + Date.now().toString(36).toUpperCase();
                const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const orderTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const specsStr = `${getTemplateLabel(currentTemplate)} • ${currentColorName} PLA • ${thickness}mm • ${snapData.fontDisplayName}`;
                
                const newOrder = {
                    id: orderId,
                    date: orderDate,
                    time: orderTime,
                    name: user.name,
                    email: user.email,
                    items: [], 
                    details: `MakerLab Live Customizer Order:\n- Template: ${getTemplateLabel(currentTemplate)}\n- Name/Text: ${text}\n- Font Style: ${snapData.fontDisplayName}\n- Material: ${currentColorName} PLA (${currentFinish})\n- Thickness: ${thickness}mm\n- Price: ${price}`,
                    status: 'Pending',
                    estimatedPrice: price,
                    snapshot: snapData.snapshotUrl,
                    material: specsStr
                };

                let orders = [];
                try {
                    orders = JSON.parse(localStorage.getItem('kiras_orders')) || [];
                } catch(e) {}
                orders.unshift(newOrder);
                localStorage.setItem('kiras_orders', JSON.stringify(orders));

                const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlT_uFe-8zMu_LFpMZsGRQPaQuzcIxFZfmFa195FMp1b0IFJP-blzHYoFSv-nj_cs/exec';
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
                
                btnOrder.innerHTML = '⏳ Processing...';
                btnOrder.disabled = true;

                try {
                    await fetch(GOOGLE_SHEET_URL + '?' + params.toString(), { mode: 'no-cors' });
                } catch(err) {
                    const beacon = new Image();
                    beacon.src = GOOGLE_SHEET_URL + '?' + params.toString();
                }

                if (window.showToast) showToast(`Order ${orderId} placed successfully!`);
                
                const waMsg = `Hi Studio Kira's Creation! I have placed an INSTANT order (${orderId}):\n\nCustomer: ${user.name} (${user.email})\n\nOrder Details:\n${newOrder.details}\n\nPlease confirm my order!`;
                
                setTimeout(() => {
                    window.location.href = `account.html#orders`;
                    window.open(`https://wa.me/8801793500131?text=${encodeURIComponent(waMsg)}`, '_blank');
                }, 1000);

            } else {
                const pendingCustomOrder = {
                    template: getTemplateLabel(currentTemplate),
                    text: text,
                    font: snapData.fontDisplayName,
                    color: currentColorName,
                    thickness: thickness,
                    price: price,
                    snapshot: snapData.snapshotUrl
                };

                localStorage.setItem('kiras_pending_custom_order', JSON.stringify(pendingCustomOrder));

                const details = `MakerLab Live Customizer Order:\n- Template: ${getTemplateLabel(currentTemplate)}\n- Name/Text: ${text}\n- Font Style: ${snapData.fontDisplayName}\n- Base Color: ${currentColorName}\n- Thickness: ${thickness}mm\n- Quoted Price: ${price}`;

                window.location.href = `contact.html?from=customizer&material=${encodeURIComponent(currentColorName + ' PLA')}&details=${encodeURIComponent(details)}`;
            }
        });
    }

    // Add to Cart
    const btnAddCart = document.getElementById('btn-add-cart-custom');
    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            const text = inputName.value.trim() || 'Custom Name';
            const thickness = inputThickness.value;
            const price = displayPrice.textContent;
            const snapData = generateSnapshotSVG();

            const cartItem = {
                title: `Custom 3D ${getTemplateLabel(currentTemplate)}: "${text}"`,
                specs: `${currentColorName} PLA • ${thickness}mm • ${snapData.fontDisplayName}`,
                price: price,
                quantity: 1,
                image: snapData.snapshotUrl
            };

            if (window.KiraCart) {
                KiraCart.addItem(cartItem);
            }
        });
    }

    // Save Preset
    const btnSavePreset = document.getElementById('btn-save-preset-custom');
    if (btnSavePreset) {
        btnSavePreset.addEventListener('click', () => {
            const text = inputName.value.trim() || 'Custom Name';
            const thickness = inputThickness.value;
            const price = displayPrice.textContent;
            const snapData = generateSnapshotSVG();

            const presetData = {
                template: getTemplateLabel(currentTemplate),
                text: text,
                font: snapData.fontDisplayName,
                fontCss: currentFont,
                color: currentColorName,
                colorHex: currentColor,
                colorRate: currentRate,
                thickness: thickness,
                price: price,
                snapshot: snapData.snapshotUrl
            };

            if (window.KiraAuth) {
                KiraAuth.savePreset(presetData);
            }
        });
    }

    // Hydrate from URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('text')) {
        inputName.value = urlParams.get('text');
    }
    if (urlParams.has('thickness')) {
        inputThickness.value = urlParams.get('thickness');
    }

    // Initial render
    updatePreview();
    if (document.fonts) {
        document.fonts.ready.then(updatePreview);
    }
});
