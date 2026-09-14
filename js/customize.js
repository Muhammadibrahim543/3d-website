// ============================================================
// MAKERWORLD OPENSCAD PARAMETRIC 3D MODEL MAKER ENGINE (js/customize.js)
// ============================================================

window.toggleScadAccordion = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('open');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inputs & Control Elements
    const inputName = document.getElementById('cust-text');
    const scadSelect = document.getElementById('scad-model-select');
    const fontOptions = document.getElementById('font-options');
    const colorSwatches = document.getElementById('color-swatches');
    const finishOptions = document.getElementById('finish-options');

    // Stepper & Slider Element Handles
    const elOutlineNum = document.getElementById('scad-outline-size');
    const elOutlineSlider = document.getElementById('scad-outline-slider');

    const elBaseThickNum = document.getElementById('scad-base-thick');
    const elBaseThickSlider = document.getElementById('scad-base-thick-slider');

    const elTextSizeNum = document.getElementById('scad-text-size');
    const elTextSizeSlider = document.getElementById('scad-text-size-slider');

    const elSpaceWidthNum = document.getElementById('scad-space-width');
    const elSpaceWidthSlider = document.getElementById('scad-space-width-slider');

    const inputThickness = document.getElementById('cust-thickness');
    const elLetterThickSlider = document.getElementById('scad-letter-thick-slider');
    const valThickness = document.getElementById('val-thickness');

    const elHoleYNum = document.getElementById('scad-hole-y');
    const elHoleYSlider = document.getElementById('scad-hole-y-slider');

    // 3D Scene Handles
    const nameplate3D = document.getElementById('nameplate-3d');
    const stageCard = document.getElementById('customizer-stage-card');
    const btnResetView = document.getElementById('btn-reset-view');
    const templateBadge = document.getElementById('stage-template-badge');

    // Pricing & Actions
    const displayPrice = document.getElementById('cust-price');
    const displaySpecs = document.getElementById('cust-specs');
    const btnOrder = document.getElementById('btn-order-custom');
    const btnResetScad = document.getElementById('btn-scad-reset');
    const btnUndoScad = document.getElementById('btn-scad-undo');
    const btnGenerateScad = document.getElementById('btn-scad-generate');

    if (!inputName || !nameplate3D) return;

    // State Variables
    let currentTemplate = 'lego'; // 'lego', 'nametag', 'deskstand', 'badge'
    let currentFont = "'Fredoka', sans-serif";
    let currentColor = '#D32F2F';
    let currentColorName = 'Ruby Red';
    let currentRate = 7.0;
    let currentFinish = 'standard';

    // Camera 3D Orbit Angles
    let rotX = 18;
    let rotY = -22;

    // History Stack for Undo
    let stateHistory = [];

    function saveHistoryState() {
        stateHistory.push({
            template: currentTemplate,
            text: inputName.value,
            font: currentFont,
            color: currentColor,
            colorName: currentColorName,
            finish: currentFinish,
            outline: elOutlineNum ? elOutlineNum.value : '4.5',
            baseThick: elBaseThickNum ? elBaseThickNum.value : '1.5',
            textSize: elTextSizeNum ? elTextSizeNum.value : '18',
            spaceWidth: elSpaceWidthNum ? elSpaceWidthNum.value : '1.0',
            letterThick: inputThickness ? inputThickness.value : '3.0',
            holeSize: elHoleSizeNum ? elHoleSizeNum.value : '5.0',
            holeX: elHoleXNum ? elHoleXNum.value : '3.0',
            holeY: elHoleYNum ? elHoleYNum.value : '0.0'
        });
        if (stateHistory.length > 25) stateHistory.shift();
    }

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

    // --- Helper: Synchronize Stepper & Range Slider Pairs ---
    function setupParamSync(numEl, sliderEl, minusBtnId, plusBtnId) {
        if (!numEl) return;
        const minusBtn = document.getElementById(minusBtnId);
        const plusBtn = document.getElementById(plusBtnId);

        function applyVal(val) {
            let v = parseFloat(val);
            const min = parseFloat(numEl.min || 0);
            const max = parseFloat(numEl.max || 100);
            if (isNaN(v)) v = min;
            if (v < min) v = min;
            if (v > max) v = max;

            numEl.value = v;
            if (sliderEl) sliderEl.value = v;

            saveHistoryState();
            updatePreview();
        }

        numEl.addEventListener('input', () => applyVal(numEl.value));
        if (sliderEl) {
            sliderEl.addEventListener('input', () => applyVal(sliderEl.value));
        }

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                const step = parseFloat(numEl.step || 1);
                applyVal(parseFloat(numEl.value || 0) - step);
            });
        }
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const step = parseFloat(numEl.step || 1);
                applyVal(parseFloat(numEl.value || 0) + step);
            });
        }
    }

    // Connect All 7 Stepper-Slider Groups
    setupParamSync(elOutlineNum, elOutlineSlider, 'btn-minus-outline', 'btn-plus-outline');
    setupParamSync(elBaseThickNum, elBaseThickSlider, 'btn-minus-basethick', 'btn-plus-basethick');
    setupParamSync(elTextSizeNum, elTextSizeSlider, 'btn-minus-textsize', 'btn-plus-textsize');
    setupParamSync(elSpaceWidthNum, elSpaceWidthSlider, 'btn-minus-space', 'btn-plus-space');
    setupParamSync(inputThickness, elLetterThickSlider, 'btn-minus-thick', 'btn-plus-thick');
    setupParamSync(elHoleSizeNum, elHoleSizeSlider, 'btn-minus-holesize', 'btn-plus-holesize');
    setupParamSync(elHoleXNum, elHoleXSlider, 'btn-minus-holex', 'btn-plus-holex');
    setupParamSync(elHoleYNum, elHoleYSlider, 'btn-minus-holey', 'btn-plus-holey');

    // ===== CORE: Build Parametric OpenSCAD Multi-Layer 3D Engine =====
    function updatePreview() {
        const text = inputName.value.trim() || 'LEGO';
        const upperText = text.toUpperCase();

        const outlineSize = parseFloat(elOutlineNum ? elOutlineNum.value : 4.5);
        const baseThick = parseFloat(elBaseThickNum ? elBaseThickNum.value : 1.5);
        const textSize = parseFloat(elTextSizeNum ? elTextSizeNum.value : 18);
        const spaceWidth = parseFloat(elSpaceWidthNum ? elSpaceWidthNum.value : 1.0);
        const letterThick = parseFloat(inputThickness ? inputThickness.value : 3.0);
        const holeSize = parseFloat(elHoleSizeNum ? elHoleSizeNum.value : 5.0);
        const holeX = parseFloat(elHoleXNum ? elHoleXNum.value : 3.0);
        const holeY = parseFloat(elHoleYNum ? elHoleYNum.value : 0.0);

        if (valThickness) valThickness.textContent = letterThick + 'mm';

        // --- Calculate Pricing ---
        const numLetters = text.length;
        const letterFee = 20 * numLetters;
        const thickMultiplier = letterThick / 3.0;
        const brimMultiplier = 1.0 + (outlineSize * 0.05);
        const matMultiplier = currentRate / 5.0;

        let modelName = 'LEGO Keychain.scad';
        if (currentTemplate === 'nametag') modelName = 'Customizable Name Tag.scad';
        else if (currentTemplate === 'deskstand') modelName = 'Desk Stand Trophy.scad';
        else if (currentTemplate === 'badge') modelName = 'Badge Plaque Shield.scad';

        const total = Math.round((140 + letterFee) * thickMultiplier * brimMultiplier * matMultiplier);
        
        displayPrice.textContent = '৳' + total.toLocaleString('en-US');
        displaySpecs.textContent = `${modelName} • ${currentColorName} PLA • ${letterThick}mm Letter • ${outlineSize}mm Brim`;

        if (templateBadge) {
            templateBadge.textContent = `🧱 ${modelName.toUpperCase()}`;
        }

        // Clear 3D Stage Container
        nameplate3D.className = 'nameplate-3d finish-' + currentFinish;
        nameplate3D.innerHTML = '';

        // Dynamic Sizing & Positioning Parameters
        const charWidth = (currentFont.includes('Lobster') || currentFont.includes('Pacifico')) ? 24 : 34;
        const estTextWidth = Math.max(140, upperText.length * charWidth * (textSize / 18) + (spaceWidth * upperText.length * 4));
        const svgW = Math.max(380, estTextWidth + (outlineSize * 24) + (holeSize * 12) + 140);
        const svgH = Math.max(160, (textSize * 4) + (outlineSize * 16) + 50);

        nameplate3D.style.width = svgW + 'px';
        nameplate3D.style.height = svgH + 'px';

        const cx = (svgW / 2) + 25;
        const cy = svgH / 2;
        const fontStyle = (currentTemplate === 'lego') ? 'italic' : 'normal';

        // Keyring Hole Position
        const holeRadiusOuter = (holeSize * 2.4) + (outlineSize * 2.2) + 8;
        const holeRadiusInner = (holeSize * 1.6);
        const holeXPos = (cx - estTextWidth / 2) - (holeX * 3.0) - holeRadiusOuter + 6;
        const holeYPos = cy - (holeY * 3.0);

        // Helper to append 3D SVG Layer
        function addSvgLayer(svgContent, zPos, dropShadow = false) {
            const div = document.createElement('div');
            div.className = 'layer-3d-svg';
            div.style.cssText = `
                width: ${svgW}px;
                height: ${svgH}px;
                transform: translateZ(${zPos}px);
                filter: ${dropShadow ? 'drop-shadow(0 15px 25px rgba(0,0,0,0.65))' : 'none'};
            `;
            div.innerHTML = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" style="overflow:visible;">${svgContent}</svg>`;
            nameplate3D.appendChild(div);
        }

        // ==========================================
        // 1. LEGO KEYCHAIN MODEL (AUTHENTIC MULTI-LAYER BUBBLE CONTOURS)
        // ==========================================
        if (currentTemplate === 'lego') {
            const baseColor = currentColor; // e.g. Red
            const yellowColor = '#FFD700';  // authentic LEGO Yellow
            const blackColor = '#111111';   // authentic LEGO Black stroke

            // --- A. Red Extruded Base Bubble Layers ---
            const baseCount = Math.max(5, Math.floor(baseThick * 2.5));
            let zCurrent = 0;

            for (let i = 0; i < baseCount; i++) {
                const col = (i === 0) ? darkenColor(baseColor, 28) : (i === baseCount - 1 ? baseColor : darkenColor(baseColor, 15));
                const isBottom = (i === 0);

                const svgContent = `
                    <!-- Keychain Ring Outer Base Circle -->
                    <circle cx="${holeXPos}" cy="${holeYPos}" r="${holeRadiusOuter}" fill="${col}" stroke="${col}" stroke-width="${outlineSize * 3}" />
                    <!-- Text Contoured Bubble Base Outline -->
                    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
                          font-family="${currentFont}" font-size="${textSize * 2.4}px" font-weight="900" font-style="${fontStyle}"
                          letter-spacing="${spaceWidth * 2.5}px" fill="${col}" stroke="${col}" stroke-width="${outlineSize * 7 + 20}"
                          stroke-linejoin="round" stroke-linecap="round">${upperText}</text>
                    <!-- Keychain Hole Cutout -->
                    <circle cx="${holeXPos}" cy="${holeYPos}" r="${holeRadiusInner}" fill="#14121d" />
                `;
                addSvgLayer(svgContent, zCurrent, isBottom);
                zCurrent += 1.4;
            }

            // --- B. Yellow Inner Contour Accent Layers ---
            const yellowCount = 3;
            for (let i = 0; i < yellowCount; i++) {
                const svgContent = `
                    <!-- Keyring Yellow Accent Ring -->
                    <circle cx="${holeXPos}" cy="${holeYPos}" r="${holeRadiusOuter - 2}" fill="none" stroke="${yellowColor}" stroke-width="${outlineSize * 2 + 4}" />
                    <!-- Text Yellow Inner Contour -->
                    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
                          font-family="${currentFont}" font-size="${textSize * 2.4}px" font-weight="900" font-style="${fontStyle}"
                          letter-spacing="${spaceWidth * 2.5}px" fill="none" stroke="${yellowColor}" stroke-width="${outlineSize * 4 + 10}"
                          stroke-linejoin="round" stroke-linecap="round">${upperText}</text>
                `;
                addSvgLayer(svgContent, zCurrent, false);
                zCurrent += 1.2;
            }

            // --- C. Black Shadow Contour Accent Layers ---
            const blackCount = 3;
            for (let i = 0; i < blackCount; i++) {
                const svgContent = `
                    <!-- Keyring Black Accent Ring -->
                    <circle cx="${holeXPos}" cy="${holeYPos}" r="${holeRadiusOuter - outlineSize * 1.5}" fill="none" stroke="${blackColor}" stroke-width="3.5" />
                    <!-- Text Black Inner Shadow Outline -->
                    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
                          font-family="${currentFont}" font-size="${textSize * 2.4}px" font-weight="900" font-style="${fontStyle}"
                          letter-spacing="${spaceWidth * 2.5}px" fill="${blackColor}" stroke="${blackColor}" stroke-width="${outlineSize * 1.8 + 4}"
                          stroke-linejoin="round" stroke-linecap="round">${upperText}</text>
                `;
                addSvgLayer(svgContent, zCurrent, false);
                zCurrent += 1.2;
            }

            // --- D. Top 3D Extruded White Text Layers ---
            const textCount = Math.max(5, Math.floor(letterThick * 2.2));
            const sideTextColor = (currentFinish === 'neon') ? '#35AA9E' : '#DCDCDC';
            const topTextColor = (currentFinish === 'neon') ? '#70FFFA' : (currentFinish === 'silk' ? '#FFF3D1' : '#FFFFFF');

            for (let i = 0; i < textCount; i++) {
                const isTop = (i === textCount - 1);
                const col = isTop ? topTextColor : sideTextColor;

                const svgContent = `
                    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
                          font-family="${currentFont}" font-size="${textSize * 2.4}px" font-weight="900" font-style="${fontStyle}"
                          letter-spacing="${spaceWidth * 2.5}px" fill="${col}" stroke="${col}" stroke-width="1.2">${upperText}</text>
                `;
                addSvgLayer(svgContent, zCurrent, false);
                zCurrent += 1.2;
            }
        }
        // ==========================================
        // 2. OTHER MODELS (NAMETAG, DESKSTAND, BADGE)
        // ==========================================
        else {
            const baseColor = currentColor;
            const baseCount = Math.max(5, Math.floor(baseThick * 2.5));
            let zCurrent = 0;

            // Extruded Base Plate
            for (let i = 0; i < baseCount; i++) {
                const col = (i === 0) ? darkenColor(baseColor, 28) : (i === baseCount - 1 ? baseColor : darkenColor(baseColor, 15));
                const isBottom = (i === 0);

                let extraGraphic = '';
                if (currentTemplate === 'deskstand') {
                    // Trophy Pedestal Stand below plate
                    extraGraphic = `<rect x="${cx - estTextWidth/2 - 30}" y="${cy + textSize * 1.2}" width="${estTextWidth + 60}" height="22" rx="6" fill="${darkenColor(baseColor, 35)}" stroke="${col}" stroke-width="3" />`;
                } else if (currentTemplate === 'badge') {
                    // Shield Crest Border Trim
                    extraGraphic = `<rect x="${cx - estTextWidth/2 - 25}" y="${cy - textSize * 1.5}" width="${estTextWidth + 50}" height="${textSize * 3}" rx="14" fill="none" stroke="${lightenColor(baseColor, 30)}" stroke-width="5" />`;
                }

                const svgContent = `
                    ${(currentTemplate === 'nametag') ? `
                        <circle cx="${holeXPos}" cy="${holeYPos}" r="${holeRadiusOuter}" fill="${col}" stroke="${col}" stroke-width="${outlineSize * 2}" />
                        <circle cx="${holeXPos}" cy="${holeYPos}" r="${holeRadiusInner}" fill="#14121d" />
                    ` : ''}
                    <rect x="${cx - estTextWidth/2 - 20 - outlineSize * 2}" y="${cy - textSize * 1.3 - outlineSize * 2}" 
                          width="${estTextWidth + 40 + outlineSize * 4}" height="${textSize * 2.6 + outlineSize * 4}" 
                          rx="16" fill="${col}" stroke="${darkenColor(col, 15)}" stroke-width="${outlineSize * 2}" />
                    ${extraGraphic}
                `;
                addSvgLayer(svgContent, zCurrent, isBottom);
                zCurrent += 1.4;
            }

            // Top Raised Text Layers
            const textCount = Math.max(5, Math.floor(letterThick * 2.2));
            const sideTextColor = (currentFinish === 'silk') ? '#D5B242' : '#E8E8E8';
            const topTextColor = (currentFinish === 'silk') ? '#FFE680' : '#FFFFFF';

            for (let i = 0; i < textCount; i++) {
                const isTop = (i === textCount - 1);
                const col = isTop ? topTextColor : sideTextColor;

                const svgContent = `
                    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
                          font-family="${currentFont}" font-size="${textSize * 2.4}px" font-weight="900" font-style="${fontStyle}"
                          letter-spacing="${spaceWidth * 2.5}px" fill="${col}" stroke="${col}" stroke-width="1.2">${upperText}</text>
                `;
                addSvgLayer(svgContent, zCurrent, false);
                zCurrent += 1.2;
            }
        }

        apply3DRotation();
    }

    // --- Apply 3D Rotation ---
    function apply3DRotation() {
        if (nameplate3D) {
            nameplate3D.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
    }

    // --- SCAD Model Selection Dropdown ---
    if (scadSelect) {
        scadSelect.addEventListener('change', (e) => {
            currentTemplate = e.target.value;
            saveHistoryState();

            if (currentTemplate === 'lego') {
                currentFont = "'Fredoka', sans-serif";
                currentColor = '#D32F2F';
                currentColorName = 'Ruby Red';
                if (elOutlineNum) elOutlineNum.value = 4.5;
                if (elOutlineSlider) elOutlineSlider.value = 4.5;
            } else if (currentTemplate === 'nametag') {
                currentFont = "'Lobster', cursive";
                currentColor = '#2979FF';
                currentColorName = 'Ocean Blue';
            } else if (currentTemplate === 'deskstand') {
                currentFont = "'Orbitron', sans-serif";
                currentColor = '#E5C158';
                currentColorName = 'Silk Gold';
            } else if (currentTemplate === 'badge') {
                currentFont = "'Righteous', cursive";
                currentColor = '#7B1FA2';
                currentColorName = 'Royal Purple';
            }
            updatePreview();
        });
    }

    // --- Font Selection ---
    if (fontOptions) {
        fontOptions.querySelectorAll('.font-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                fontOptions.querySelectorAll('.font-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFont = pill.getAttribute('data-font');
                saveHistoryState();
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
                saveHistoryState();
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
                saveHistoryState();
                updatePreview();
            });
        });
    }

    // --- Text Input Listener ---
    inputName.addEventListener('input', () => {
        saveHistoryState();
        updatePreview();
    });

    // --- Action Bar: Reset Defaults ---
    if (btnResetScad) {
        btnResetScad.addEventListener('click', () => {
            inputName.value = 'LEGO';
            if (elOutlineNum) elOutlineNum.value = 4.5;
            if (elOutlineSlider) elOutlineSlider.value = 4.5;
            if (elBaseThickNum) elBaseThickNum.value = 1.5;
            if (elBaseThickSlider) elBaseThickSlider.value = 1.5;
            if (elTextSizeNum) elTextSizeNum.value = 18;
            if (elTextSizeSlider) elTextSizeSlider.value = 18;
            if (elSpaceWidthNum) elSpaceWidthNum.value = 1.0;
            if (elSpaceWidthSlider) elSpaceWidthSlider.value = 1.0;
            if (inputThickness) inputThickness.value = 3.0;
            if (elLetterThickSlider) elLetterThickSlider.value = 3.0;
            if (elHoleSizeNum) elHoleSizeNum.value = 5.0;
            if (elHoleSizeSlider) elHoleSizeSlider.value = 5.0;
            if (elHoleXNum) elHoleXNum.value = 3.0;
            if (elHoleXSlider) elHoleXSlider.value = 3.0;
            if (elHoleYNum) elHoleYNum.value = 0.0;
            if (elHoleYSlider) elHoleYSlider.value = 0.0;

            rotX = 18;
            rotY = -22;
            saveHistoryState();
            updatePreview();
        });
    }

    // --- Action Bar: Undo ---
    if (btnUndoScad) {
        btnUndoScad.addEventListener('click', () => {
            if (stateHistory.length > 1) {
                stateHistory.pop(); // Remove current
                const prev = stateHistory[stateHistory.length - 1];
                if (prev) {
                    if (scadSelect) scadSelect.value = prev.template;
                    currentTemplate = prev.template;
                    inputName.value = prev.text;
                    currentFont = prev.font;
                    currentColor = prev.color;
                    currentColorName = prev.colorName;
                    currentFinish = prev.finish;

                    if (elOutlineNum) elOutlineNum.value = prev.outline;
                    if (elOutlineSlider) elOutlineSlider.value = prev.outline;
                    if (elBaseThickNum) elBaseThickNum.value = prev.baseThick;
                    if (elBaseThickSlider) elBaseThickSlider.value = prev.baseThick;
                    if (elTextSizeNum) elTextSizeNum.value = prev.textSize;
                    if (elTextSizeSlider) elTextSizeSlider.value = prev.textSize;
                    if (elSpaceWidthNum) elSpaceWidthNum.value = prev.spaceWidth;
                    if (elSpaceWidthSlider) elSpaceWidthSlider.value = prev.spaceWidth;
                    if (inputThickness) inputThickness.value = prev.letterThick;
                    if (elLetterThickSlider) elLetterThickSlider.value = prev.letterThick;
                    if (elHoleSizeNum) elHoleSizeNum.value = prev.holeSize;
                    if (elHoleSizeSlider) elHoleSizeSlider.value = prev.holeSize;
                    if (elHoleXNum) elHoleXNum.value = prev.holeX;
                    if (elHoleXSlider) elHoleXSlider.value = prev.holeX;
                    if (elHoleYNum) elHoleYNum.value = prev.holeY || 0.0;
                    if (elHoleYSlider) elHoleYSlider.value = prev.holeY || 0.0;

                    updatePreview();
                }
            }
        });
    }

    // --- Action Bar: ✨ Generate Button ---
    if (btnGenerateScad) {
        btnGenerateScad.addEventListener('click', () => {
            if (stageCard) {
                stageCard.classList.add('stage-generating');
                setTimeout(() => {
                    stageCard.classList.remove('stage-generating');
                }, 600);
            }
            updatePreview();
        });
    }

    // --- Reset Camera View ---
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            rotX = 18;
            rotY = -22;
            apply3DRotation();
        });
    }

    // ===== Smooth Mouse & Touch 3D Orbit Controls =====
    if (stageCard && nameplate3D) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startRotX = 18, startRotY = -22;

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
            rotY = startRotY + (deltaX * 0.45);
            rotX = Math.max(-65, Math.min(65, startRotX - (deltaY * 0.45)));
            apply3DRotation();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                stageCard.classList.remove('grabbing');
            }
        });

        // Touch Interaction
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
            rotY = startRotY + (deltaX * 0.55);
            rotX = Math.max(-65, Math.min(65, startRotX - (deltaY * 0.55)));
            apply3DRotation();
            if (e.cancelable) e.preventDefault();
        }, { passive: false });

        stageCard.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

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
