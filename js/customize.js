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
    const btnResetView = document.getElementById('btn-reset-view');
    const templateBadge = document.getElementById('stage-template-badge');

    const displayPrice = document.getElementById('cust-price');
    const displaySpecs = document.getElementById('cust-specs');
    const btnOrder = document.getElementById('btn-order-custom');

    if (!inputName || !nameplate3D) return;

    // State Variables
    let currentTemplate = 'keyring';
    let currentFont = "'Lobster', cursive";
    let currentColor = '#2979FF';
    let currentColorName = 'Ocean Blue';
    let currentRate = 5.0;
    let currentFinish = 'standard';

    // Camera 3D Orbit Angles
    let rotX = 15;
    let rotY = -20;

    // --- Helper: Darken Hex Color ---
    function darkenColor(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) - amt,
            G = (num >> 8 & 0x00FF) - amt,
            B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).padStart(6, '0');
    }

    // --- Helper: Lighten Hex Color ---
    function lightenColor(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = Math.min(255, (num >> 16) + amt),
            G = Math.min(255, (num >> 8 & 0x00FF) + amt),
            B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).padStart(6, '0');
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
    function getTemplateEmoji(tpl) {
        switch(tpl) {
            case 'deskstand': return '🏆';
            case 'pettag': return '🏷️';
            case 'badge': return '🛡️';
            default: return '🔑';
        }
    }

    // ===== CORE: Build Thick 3D Nameplate with CSS Layers =====
    function updatePreview() {
        const text = inputName.value.trim() || 'Name';
        const thickness = parseInt(inputThickness.value, 10);
        const upperText = text.toUpperCase();

        // Update slider track fill
        valThickness.textContent = thickness + 'mm';
        const min = parseInt(inputThickness.min, 10) || 3;
        const max = parseInt(inputThickness.max, 10) || 10;
        const pct = ((thickness - min) / (max - min)) * 100;
        inputThickness.style.background = `linear-gradient(to right, #FF8A75 0%, #FF5E5E ${pct}%, rgba(142, 132, 120, 0.2) ${pct}%, rgba(142, 132, 120, 0.2) 100%)`;

        // Pricing
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

        // Update template badge
        if (templateBadge) {
            templateBadge.textContent = `${getTemplateEmoji(currentTemplate)} ${getTemplateLabel(currentTemplate).toUpperCase()}`;
        }

        // === Clear & Build 3D Scene ===
        nameplate3D.className = 'nameplate-3d finish-' + currentFinish;
        nameplate3D.innerHTML = '';

        // Sizer element (hidden) to measure text width
        const sizer = document.createElement('span');
        sizer.className = 'layer-sizer';
        sizer.textContent = upperText;
        sizer.style.fontFamily = currentFont;
        nameplate3D.appendChild(sizer);

        // Helper: Create a single <div> text layer at a given Z position
        function createTextLayer(opts) {
            const div = document.createElement('div');
            div.className = opts.className || '';
            if (opts.extraClass) div.classList.add(opts.extraClass);
            div.textContent = upperText;
            div.style.cssText = `
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                font-size: clamp(2.8rem, 7vw, 5rem);
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 3px;
                white-space: nowrap;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: translateZ(${opts.z}px);
                font-family: ${currentFont};
                color: ${opts.color || 'transparent'};
                -webkit-text-stroke: ${opts.stroke || '0px transparent'};
                paint-order: stroke fill;
            `;
            return div;
        }

        // ---- MEASURE TEXT ----
        const sizerWidth = sizer.offsetWidth;
        const sizerHeight = sizer.offsetHeight;
        let plateWidth = sizerWidth + 80;
        let plateHeight = sizerHeight + 50;
        
        if (currentTemplate === 'badge') {
            plateWidth += 20;
            plateHeight += 20;
        } else if (currentTemplate === 'deskstand') {
            plateWidth += 40;
        }

        // ---- BASE PLATE: solid rounded rectangle ----
        const baseLayers = Math.max(6, Math.floor(thickness * 2.0));
        const sideColor = darkenColor(currentColor, 18);
        const topColor = currentColor;
        const bottomColor = darkenColor(currentColor, 30);

        for (let i = 0; i < baseLayers; i++) {
            let col;
            if (i === 0) col = bottomColor;
            else if (i === baseLayers - 1) col = topColor;
            else col = sideColor;

            const div = document.createElement('div');
            div.className = 'layer-base ' + ((i === 0) ? 'layer-base-bottom' : (i === baseLayers - 1 ? 'layer-base-top' : ''));
            div.style.cssText = `
                position: absolute;
                width: ${plateWidth}px;
                height: ${plateHeight}px;
                background: ${col};
                border-radius: 20px;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%) translateZ(${i * 1.5}px);
            `;
            
            if (currentTemplate === 'badge' && i === baseLayers - 1) {
                div.style.border = `4px solid ${lightenColor(col, 20)}`;
            }

            nameplate3D.appendChild(div);
            addTemplateAccessory(nameplate3D, col, i * 1.5, plateWidth, plateHeight);
        }

        // ---- RAISED TEXT: lighter/contrasting on top ----
        const textLayers = Math.max(5, Math.floor(thickness * 1.2));
        const textTopColor = (currentFinish === 'neon') ? '#70FFFA' : (currentFinish === 'silk' ? '#FFF3D1' : '#F5F0E8');
        const textSideColor = (currentFinish === 'neon') ? '#35AA9E' : '#d4ccbb';
        const textBottomColor = darkenColor(textSideColor, 10);

        const baseTopZ = baseLayers * 1.5;
        for (let i = 0; i < textLayers; i++) {
            let col;
            if (i === 0) col = textBottomColor;
            else if (i === textLayers - 1) col = textTopColor;
            else col = textSideColor;

            const extraCls = (i === textLayers - 1) ? 'layer-text-top' : 'layer-text-side';
            const layer = createTextLayer({
                className: 'layer-text',
                extraClass: extraCls,
                z: baseTopZ + (i * 1.5),
                color: col,
                stroke: '0px transparent'
            });
            nameplate3D.appendChild(layer);
        }

        apply3DRotation();
    }

    // Add template-specific 3D accessories as sibling divs
    function addTemplateAccessory(scene, color, zPos, pW, pH) {
        if (currentTemplate === 'keyring') {
            // Keyring hole on the left
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: absolute;
                width: 30px; height: 30px;
                border: 8px solid ${color};
                border-radius: 50%;
                top: 50%; left: 50%;
                transform: translate(-${pW/2 + 25}px, -50%) translateZ(${zPos}px);
            `;
            scene.appendChild(ring);
        } else if (currentTemplate === 'pettag') {
            // Top centered D-ring loop
            const loop = document.createElement('div');
            loop.style.cssText = `
                position: absolute;
                width: 24px; height: 28px;
                border: 8px solid ${color};
                border-radius: 12px;
                top: 50%; left: 50%;
                transform: translate(-50%, -${pH/2 + 20}px) translateZ(${zPos}px);
            `;
            scene.appendChild(loop);
        } else if (currentTemplate === 'deskstand') {
            // Bottom wedge base block
            const stand = document.createElement('div');
            stand.style.cssText = `
                position: absolute;
                width: ${pW + 20}px; height: 24px;
                background: ${color};
                top: 50%; left: 50%;
                border-radius: 6px;
                transform: translate(-50%, ${pH/2 - 5}px) translateZ(${zPos}px);
            `;
            scene.appendChild(stand);
        }
    }

    // --- Apply 3D Transformation ---
    function apply3DRotation() {
        if (nameplate3D) {
            nameplate3D.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
    }

    // --- Mouse & Touch Interaction for 3D Stage ---
    let isDragging = false;
    let startX, startY;
    
    if (stageCard) {
        stageCard.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            startY = e.pageY;
            stageCard.style.cursor = 'grabbing';
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
            stageCard.style.cursor = '';
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.pageX - startX;
            const dy = e.pageY - startY;
            rotY += dx * 0.4;
            rotX -= dy * 0.4;
            
            // Limit rotX to avoid flipping upside down
            if (rotX > 70) rotX = 70;
            if (rotX < -70) rotX = -70;
            
            startX = e.pageX;
            startY = e.pageY;
            apply3DRotation();
        });
        
        // Touch events
        stageCard.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const dx = e.touches[0].pageX - startX;
            const dy = e.touches[0].pageY - startY;
            rotY += dx * 0.6;
            rotX -= dy * 0.6;
            if (rotX > 70) rotX = 70;
            if (rotX < -70) rotX = -70;
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            apply3DRotation();
        });
    }

    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            rotX = 15;
            rotY = -20;
            apply3DRotation();
        });
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

    // --- Font Selection (Font Pills) ---
    if (fontOptions) {
        fontOptions.querySelectorAll('.font-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                fontOptions.querySelectorAll('.font-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFont = pill.getAttribute('data-font');
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

    // --- Finish Selection ---
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

    // --- Reset View ---
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            rotX = 15;
            rotY = -20;
            apply3DRotation();
        });
    }

    // ===== Smooth 3D Orbit Drag =====
    if (stageCard && nameplate3D) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startRotX = 15, startRotY = -20;

        // Mouse
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

        // Touch
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
            const deltaY = touch.clientY - startY;
            rotY = startRotY + (deltaX * 0.5);
            rotX = Math.max(-60, Math.min(60, startRotX - (deltaY * 0.5)));
            apply3DRotation();
            if (e.cancelable) e.preventDefault();
        }, { passive: false });

        stageCard.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // Slider & text input
    inputName.addEventListener('input', updatePreview);
    inputThickness.addEventListener('input', updatePreview);

    // --- SVG Snapshot Generator for Orders & Cart ---
    function generateSnapshotSVG() {
        const text = inputName.value.trim() || 'CUSTOM NAME';
        const upperText = text.toUpperCase();
        const fontEl = fontOptions ? fontOptions.querySelector('.font-pill.active') : null;
        const fontName = fontEl ? fontEl.getAttribute('data-font') : currentFont;
        const fontDisplayName = fontEl && fontEl.querySelector('.fp-name') ? fontEl.querySelector('.fp-name').textContent : 'Lobster';

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
