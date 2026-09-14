// ============================================================
// MAKERWORLD / OPENSCAD REAL 3D SOLID CAD ENGINE (Three.js WebGL)
// Kira's Creation Soft-3D Studio // High-Fidelity Parametric Customizer
// ============================================================

window.toggleScadAccordion = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('open');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Control Handles ---
    const inputName = document.getElementById('cust-text');
    const scadSelect = document.getElementById('scad-model-select');
    const fontOptions = document.getElementById('font-options');
    const colorSwatches = document.getElementById('color-swatches');
    const finishOptions = document.getElementById('finish-options');

    // Steppers & Sliders
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

    const elHoleSizeNum = document.getElementById('scad-hole-size');
    const elHoleSizeSlider = document.getElementById('scad-hole-size-slider');

    const elHoleXNum = document.getElementById('scad-hole-x');
    const elHoleXSlider = document.getElementById('scad-hole-x-slider');

    const elHoleYNum = document.getElementById('scad-hole-y');
    const elHoleYSlider = document.getElementById('scad-hole-y-slider');

    // Action & Stage Handles
    const stageCard = document.getElementById('customizer-stage-card');
    const canvas = document.getElementById('three-canvas');
    const spinner = document.getElementById('three-loading-spinner');
    const btnResetView = document.getElementById('btn-reset-view');
    const btnExportStl = document.getElementById('btn-export-stl');
    const btnViewScad = document.getElementById('btn-view-scad');
    const templateBadge = document.getElementById('stage-template-badge');

    // Modal Handles
    const scadModal = document.getElementById('scad-modal');
    const btnCloseScadModal = document.getElementById('btn-close-scad-modal');
    const scadCodeArea = document.getElementById('scad-code-area');
    const btnCopyScad = document.getElementById('btn-copy-scad');
    const btnDownloadScad = document.getElementById('btn-download-scad');

    // Pricing & Cart Handles
    const displayPrice = document.getElementById('cust-price');
    const displaySpecs = document.getElementById('cust-specs');
    const btnAddToCart = document.getElementById('btn-add-cart-custom');
    const btnOrder = document.getElementById('btn-order-custom');
    const btnSavePreset = document.getElementById('btn-save-preset-custom');
    const btnResetScad = document.getElementById('btn-scad-reset');
    const btnUndoScad = document.getElementById('btn-scad-undo');
    const btnGenerateScad = document.getElementById('btn-scad-generate');

    if (!canvas || typeof THREE === 'undefined') {
        console.error('Three.js or target canvas missing.');
        return;
    }

    // --- State Variables ---
    let currentTemplate = 'lego';
    let currentFontKey = 'helvetiker';
    let currentColor = '#D32F2F';
    let currentColorName = 'Ruby Red';
    let currentRate = 7.0;
    let currentFinish = 'standard';

    let currentModelGroup = null;
    let stateHistory = [];

    function saveHistoryState() {
        stateHistory.push({
            template: currentTemplate,
            text: inputName ? inputName.value : 'LEGO',
            font: currentFontKey,
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

    // ============================================================
    // 1. THREE.JS SCENE, CAMERA, RENDERER & ORBIT CONTROLS
    // ============================================================
    const scene = new THREE.Scene();

    const stageWidth = stageCard.clientWidth || 560;
    const stageHeight = stageCard.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(38, stageWidth / stageHeight, 1, 1000);
    const defaultCamPos = new THREE.Vector3(0, -90, 150);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stageWidth, stageHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't let user look underneath build plate
    controls.minDistance = 35;
    controls.maxDistance = 320;
    controls.target.set(0, 0, 0);

    // Resize Handler
    function onWindowResize() {
        const w = stageCard.clientWidth || 560;
        const h = stageCard.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onWindowResize);

    // ============================================================
    // 2. STUDIO LIGHTING & BAMBU-STYLE BUILD PLATE
    // ============================================================
    // Ambient light - balanced for true color saturation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // Key light (warm studio key)
    const keyLight = new THREE.DirectionalLight(0xfff6ec, 1.15);
    keyLight.position.set(65, 85, 120);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 400;
    const shadowD = 90;
    keyLight.shadow.camera.left = -shadowD;
    keyLight.shadow.camera.right = shadowD;
    keyLight.shadow.camera.top = shadowD;
    keyLight.shadow.camera.bottom = -shadowD;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill light (cool fill for depth)
    const fillLight = new THREE.DirectionalLight(0xc8dcff, 0.45);
    fillLight.position.set(-70, -50, 80);
    scene.add(fillLight);

    // Rim light (highlight bevels and silhouette)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    rimLight.position.set(0, -90, -30);
    scene.add(rimLight);

    // Bambu-Style Textured Build Plate
    const buildPlateGroup = new THREE.Group();

    // Subtle plate bed rectangle
    const bedGeo = new THREE.PlaneGeometry(180, 150);
    const bedMat = new THREE.MeshStandardMaterial({
        color: 0x14121a,
        roughness: 0.95,
        metalness: 0.1
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.z = -0.3;
    bedMesh.receiveShadow = true;
    buildPlateGroup.add(bedMesh);

    // Grid helper on plate
    const grid = new THREE.GridHelper(160, 16, 0x443b5e, 0x221d30);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -0.15;
    buildPlateGroup.add(grid);

    scene.add(buildPlateGroup);

    // ============================================================
    // 3. FONT MANAGEMENT (Instant Pre-Compiled Typefaces)
    // ============================================================
    const fontLoader = new THREE.FontLoader();
    const fonts = {};

    if (window.FONT_HELVETIKER_BOLD) {
        fonts['helvetiker'] = fontLoader.parse(window.FONT_HELVETIKER_BOLD);
    }
    if (window.FONT_OPTIMER_BOLD) {
        fonts['optimer'] = fontLoader.parse(window.FONT_OPTIMER_BOLD);
    }

    function getActiveFont() {
        return fonts[currentFontKey] || fonts['helvetiker'];
    }

    // ============================================================
    // 4. PBR MATERIAL FACTORY
    // ============================================================
    function getBaseMaterial() {
        const col = new THREE.Color(currentColor);
        if (currentFinish === 'silk') {
            return new THREE.MeshStandardMaterial({
                color: col,
                roughness: 0.22,
                metalness: 0.68
            });
        } else if (currentFinish === 'satin') {
            return new THREE.MeshPhysicalMaterial({
                color: col,
                roughness: 0.24,
                metalness: 0.12,
                clearcoat: 0.85,
                clearcoatRoughness: 0.15
            });
        } else if (currentFinish === 'neon') {
            return new THREE.MeshStandardMaterial({
                color: col,
                roughness: 0.35,
                emissive: col,
                emissiveIntensity: 0.18
            });
        }
        // Standard Matte PLA
        return new THREE.MeshStandardMaterial({
            color: col,
            roughness: 0.65,
            metalness: 0.05
        });
    }

    function getLegoAccentMaterial() {
        return new THREE.MeshStandardMaterial({
            color: 0xE5C158, // Vibrant LEGO Yellow
            roughness: 0.40,
            metalness: 0.05
        });
    }

    function getTextMaterial() {
        // High contrast crisp white or dark depending on base color
        const isYellow = currentColor === '#E5C158';
        const textColor = isYellow ? 0x111111 : 0xFFFFFF;
        return new THREE.MeshStandardMaterial({
            color: textColor,
            roughness: 0.35,
            metalness: 0.05
        });
    }

    // ============================================================
    // 5. PARAMETRIC SOLID CAD GEOMETRY GENERATORS
    // ============================================================

    // --- Helper: Compute Text 2D Shapes & Dimensions ---
    function getTextShapesAndBounds(text, size) {
        const font = getActiveFont();
        if (!font) return { shapes: [], bounds: { minX: -20, maxX: 20, minY: -5, maxY: 15, width: 40, height: 20, centerY: 5 } };

        const shapes = font.generateShapes(text, size);
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        shapes.forEach(shape => {
            const pts = shape.getPoints();
            pts.forEach(pt => {
                if (pt.x < minX) minX = pt.x;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.y < minY) minY = pt.y;
                if (pt.y > maxY) maxY = pt.y;
            });
        });

        if (!isFinite(minX)) {
            minX = -20; maxX = 20; minY = -5; maxY = 15;
        }

        const width = maxX - minX;
        const height = maxY - minY;
        const centerY = (minY + maxY) / 2;

        return { shapes, bounds: { minX, maxX, minY, maxY, width, height, centerY } };
    }

    // --- Model 1: LEGO Keychain.scad ---
    function buildLegoKeychain(params) {
        const group = new THREE.Group();
        const text = (params.text || 'LEGO').trim() || 'LEGO';
        const { shapes: fontShapes, bounds } = getTextShapesAndBounds(text, params.textSize);

        const pad = Math.max(3.5, params.outlineSize);
        const holeSize = Math.max(3.0, params.holeSize);
        const holeRadius = holeSize / 2;
        const holeOuterRadius = holeRadius + pad;

        // Eyelet center clearly protruding on the left
        const eyeletDist = holeOuterRadius + pad * 0.7 + Math.max(0, params.holeX);
        const eyeletX = bounds.minX - eyeletDist;
        const eyeletY = bounds.centerY + params.holeY;

        // Outer pill envelope around text
        const pillLeftX = bounds.minX - pad * 0.6;
        const pillRightX = bounds.maxX + pad * 0.8;
        const pillH = bounds.height + pad * 2.2;
        const pillR = pillH / 2;
        const pillTopY = bounds.centerY + pillR;
        const pillBotY = bounds.centerY - pillR;

        // 1. Unified Base Plate Contour (Solid Red)
        const baseShape = new THREE.Shape();
        baseShape.moveTo(eyeletX, eyeletY + holeOuterRadius);
        // Outer arc around eyelet (from top through left to bottom)
        baseShape.absarc(eyeletX, eyeletY, holeOuterRadius, Math.PI / 2, -Math.PI / 2, false);
        // Tangent line to bottom of pill
        baseShape.lineTo(pillLeftX, pillBotY);
        // Across bottom to right pill cap
        baseShape.lineTo(pillRightX - pillR, pillBotY);
        // Right rounded cap
        baseShape.absarc(pillRightX - pillR, bounds.centerY, pillR, -Math.PI / 2, Math.PI / 2, false);
        // Across top to left
        baseShape.lineTo(pillLeftX, pillTopY);
        // Tangent back to eyelet top
        baseShape.lineTo(eyeletX, eyeletY + holeOuterRadius);

        // Through-Hole for Keychain Loop
        const holePath = new THREE.Path();
        holePath.absarc(eyeletX, eyeletY, holeRadius, 0, Math.PI * 2, true);
        baseShape.holes.push(holePath);

        // Extrude Base Plate
        const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
            depth: params.baseThick,
            bevelEnabled: true,
            bevelThickness: 0.45,
            bevelSize: 0.4,
            bevelSegments: 3
        });
        const baseMesh = new THREE.Mesh(baseGeo, getBaseMaterial());
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // 2. Yellow LEGO Accent Inset (Rounded Box strictly around text, NOT touching eyelet)
        const aPadX = 3.5;
        const aPadY = 3.2;
        const aLeft = bounds.minX - aPadX;
        const aRight = bounds.maxX + aPadX;
        const aTop = bounds.maxY + aPadY;
        const aBot = bounds.minY - aPadY;
        const aCornerR = Math.min(6, (aTop - aBot) / 3);

        const accentShape = new THREE.Shape();
        accentShape.moveTo(aLeft + aCornerR, aBot);
        accentShape.lineTo(aRight - aCornerR, aBot);
        accentShape.absarc(aRight - aCornerR, aBot + aCornerR, aCornerR, -Math.PI / 2, 0, false);
        accentShape.lineTo(aRight, aTop - aCornerR);
        accentShape.absarc(aRight - aCornerR, aTop - aCornerR, aCornerR, 0, Math.PI / 2, false);
        accentShape.lineTo(aLeft + aCornerR, aTop);
        accentShape.absarc(aLeft + aCornerR, aTop - aCornerR, aCornerR, Math.PI / 2, Math.PI, false);
        accentShape.lineTo(aLeft, aBot + aCornerR);
        accentShape.absarc(aLeft + aCornerR, aBot + aCornerR, aCornerR, Math.PI, -Math.PI / 2, false);

        const accentGeo = new THREE.ExtrudeGeometry(accentShape, {
            depth: 0.7,
            bevelEnabled: true,
            bevelThickness: 0.25,
            bevelSize: 0.25,
            bevelSegments: 2
        });
        const accentMesh = new THREE.Mesh(accentGeo, getLegoAccentMaterial());
        accentMesh.position.z = params.baseThick;
        accentMesh.castShadow = true;
        group.add(accentMesh);

        // 3. Raised 3D Letters (White with beveled edges)
        const letterGeo = new THREE.ExtrudeGeometry(fontShapes, {
            depth: params.letterThick,
            bevelEnabled: true,
            bevelThickness: 0.35,
            bevelSize: 0.25,
            bevelSegments: 3
        });
        const letterMesh = new THREE.Mesh(letterGeo, getTextMaterial());
        letterMesh.position.z = params.baseThick + 0.7;
        letterMesh.castShadow = true;
        group.add(letterMesh);

        // Center entire group at origin (0, 0, 0)
        const totalMinX = eyeletX - holeOuterRadius;
        const totalMaxX = pillRightX;
        group.position.set(-(totalMinX + totalMaxX) / 2, -bounds.centerY, 0);

        return group;
    }

    // --- Model 2: Customizable Name Tag.scad ---
    function buildNameTag(params) {
        const group = new THREE.Group();
        const text = (params.text || 'NAME').trim() || 'NAME';
        const { shapes: fontShapes, bounds } = getTextShapesAndBounds(text, params.textSize);

        const padX = 14 + params.outlineSize * 1.8;
        const padY = 8 + params.outlineSize * 1.4;
        const width = Math.max(70, bounds.width + padX * 2);
        const height = Math.max(34, bounds.height + padY * 2);
        const cornerR = 6;

        const w2 = width / 2;
        const h2 = height / 2;

        // Beveled Rounded Rectangle
        const shape = new THREE.Shape();
        shape.moveTo(-w2 + cornerR, -h2);
        shape.lineTo(w2 - cornerR, -h2);
        shape.absarc(w2 - cornerR, -h2 + cornerR, cornerR, -Math.PI / 2, 0, false);
        shape.lineTo(w2, h2 - cornerR);
        shape.absarc(w2 - cornerR, h2 - cornerR, cornerR, 0, Math.PI / 2, false);
        shape.lineTo(-w2 + cornerR, h2);
        shape.absarc(-w2 + cornerR, h2 - cornerR, cornerR, Math.PI / 2, Math.PI, false);
        shape.lineTo(-w2, -h2 + cornerR);
        shape.absarc(-w2 + cornerR, -h2 + cornerR, cornerR, Math.PI, -Math.PI / 2, false);

        // Oval Lanyard Slot Hole (Top Center)
        const slotW = 14;
        const slotH = 4;
        const slotY = h2 - 6;
        const slotR = slotH / 2;
        const slotPath = new THREE.Path();
        slotPath.moveTo(-slotW / 2 + slotR, slotY - slotR);
        slotPath.lineTo(slotW / 2 - slotR, slotY - slotR);
        slotPath.absarc(slotW / 2 - slotR, slotY, slotR, -Math.PI / 2, Math.PI / 2, false);
        slotPath.lineTo(-slotW / 2 + slotR, slotY + slotR);
        slotPath.absarc(-slotW / 2 + slotR, slotY, slotR, Math.PI / 2, -Math.PI / 2, false);
        shape.holes.push(slotPath);

        const baseGeo = new THREE.ExtrudeGeometry(shape, {
            depth: params.baseThick,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.5,
            bevelSegments: 3
        });
        const baseMesh = new THREE.Mesh(baseGeo, getBaseMaterial());
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Raised Text
        const letterGeo = new THREE.ExtrudeGeometry(fontShapes, {
            depth: params.letterThick,
            bevelEnabled: true,
            bevelThickness: 0.3,
            bevelSize: 0.2,
            bevelSegments: 2
        });
        const letterMesh = new THREE.Mesh(letterGeo, getTextMaterial());
        const textCenterX = (bounds.minX + bounds.maxX) / 2;
        const textCenterY = (bounds.minY + bounds.maxY) / 2;
        letterMesh.position.set(-textCenterX, -textCenterY - 2.5, params.baseThick);
        letterMesh.castShadow = true;
        group.add(letterMesh);

        return group;
    }

    // --- Model 3: Desk Stand Trophy.scad ---
    function buildDeskStand(params) {
        const group = new THREE.Group();
        const text = (params.text || 'TROPHY').trim() || 'TROPHY';
        const { shapes: fontShapes, bounds } = getTextShapesAndBounds(text, params.textSize);

        const plaqueW = Math.max(75, bounds.width + 30);
        const plaqueH = Math.max(42, bounds.height + 24);
        const footW = plaqueW + 20;
        const footD = 34;
        const footH = 8;

        // 1. Weighted Foot Pedestal
        const footGeo = new THREE.BoxGeometry(footW, footD, footH);
        const footMesh = new THREE.Mesh(footGeo, getBaseMaterial());
        footMesh.position.set(0, 0, footH / 2);
        footMesh.castShadow = true;
        footMesh.receiveShadow = true;
        group.add(footMesh);

        // 2. Upright Trophy Plaque with Beveled Arch
        const pw2 = plaqueW / 2;
        const pShape = new THREE.Shape();
        pShape.moveTo(-pw2, 0);
        pShape.lineTo(pw2, 0);
        pShape.lineTo(pw2 - 4, plaqueH - 8);
        pShape.absarc(0, plaqueH - 8, pw2 - 4, 0, Math.PI, false);
        pShape.lineTo(-pw2, 0);

        const plaqueGeo = new THREE.ExtrudeGeometry(pShape, {
            depth: params.baseThick + 1.5,
            bevelEnabled: true,
            bevelThickness: 0.6,
            bevelSize: 0.6,
            bevelSegments: 3
        });
        const plaqueMesh = new THREE.Mesh(plaqueGeo, getBaseMaterial());
        // Stand upright tilted slightly back
        plaqueMesh.rotation.x = Math.PI / 2 - 0.14;
        plaqueMesh.position.set(0, -2, footH - 1);
        plaqueMesh.castShadow = true;
        group.add(plaqueMesh);

        // 3. Raised 3D Letters (Silk Gold Look)
        const letterGeo = new THREE.ExtrudeGeometry(fontShapes, {
            depth: params.letterThick,
            bevelEnabled: true,
            bevelThickness: 0.35,
            bevelSize: 0.25,
            bevelSegments: 2
        });
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            roughness: 0.25,
            metalness: 0.75
        });
        const letterMesh = new THREE.Mesh(letterGeo, goldMat);
        const textCenterX = (bounds.minX + bounds.maxX) / 2;
        const textCenterY = (bounds.minY + bounds.maxY) / 2;
        letterMesh.position.set(-textCenterX, (plaqueH / 2) - textCenterY - 2, params.baseThick + 1.5);
        letterMesh.castShadow = true;
        plaqueMesh.add(letterMesh);

        // Center trophy visually at origin
        group.position.set(0, 4, -plaqueH * 0.35);

        return group;
    }

    // --- Model 4: Badge Plaque Shield.scad ---
    function buildBadgeShield(params) {
        const group = new THREE.Group();
        const text = (params.text || 'SHIELD').trim() || 'SHIELD';
        const { shapes: fontShapes, bounds } = getTextShapesAndBounds(text, params.textSize);

        const shieldW = Math.max(68, bounds.width + 24 + params.outlineSize * 2);
        const shieldH = shieldW * 1.25;
        const sw2 = shieldW / 2;

        // Shield Contour
        const sShape = new THREE.Shape();
        sShape.moveTo(-sw2, shieldH / 2);
        sShape.lineTo(0, shieldH / 2 + 5);
        sShape.lineTo(sw2, shieldH / 2);
        sShape.quadraticCurveTo(sw2, -shieldH * 0.1, 0, -shieldH / 2);
        sShape.quadraticCurveTo(-sw2, -shieldH * 0.1, -sw2, shieldH / 2);

        // Mounting Hole
        const holePath = new THREE.Path();
        holePath.absarc(0, shieldH / 2 - 5, 2.5, 0, Math.PI * 2, true);
        sShape.holes.push(holePath);

        const baseGeo = new THREE.ExtrudeGeometry(sShape, {
            depth: params.baseThick,
            bevelEnabled: true,
            bevelThickness: 0.55,
            bevelSize: 0.55,
            bevelSegments: 3
        });
        const baseMesh = new THREE.Mesh(baseGeo, getBaseMaterial());
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Raised Shield Border Rim
        const rimShape = new THREE.Shape();
        const rScale = 0.88;
        const rsw2 = sw2 * rScale;
        const rsh = shieldH * rScale;
        rimShape.moveTo(-rsw2, rsh / 2);
        rimShape.lineTo(0, rsh / 2 + 4);
        rimShape.lineTo(rsw2, rsh / 2);
        rimShape.quadraticCurveTo(rsw2, -rsh * 0.1, 0, -rsh / 2);
        rimShape.quadraticCurveTo(-rsw2, -rsh * 0.1, -rsw2, rsh / 2);

        const innerHole = new THREE.Path();
        const iScale = 0.79;
        const isw2 = sw2 * iScale;
        const ish = shieldH * iScale;
        innerHole.moveTo(-isw2, ish / 2);
        innerHole.lineTo(0, ish / 2 + 3);
        innerHole.lineTo(isw2, ish / 2);
        innerHole.quadraticCurveTo(isw2, -ish * 0.1, 0, -ish / 2);
        innerHole.quadraticCurveTo(-isw2, -ish * 0.1, -isw2, ish / 2);
        rimShape.holes.push(innerHole);

        const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
            depth: 0.7,
            bevelEnabled: true,
            bevelThickness: 0.25,
            bevelSize: 0.25,
            bevelSegments: 2
        });
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xE5C158, roughness: 0.35, metalness: 0.5 });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        rimMesh.position.z = params.baseThick;
        rimMesh.castShadow = true;
        group.add(rimMesh);

        // Raised Text
        const letterGeo = new THREE.ExtrudeGeometry(fontShapes, {
            depth: params.letterThick,
            bevelEnabled: true,
            bevelThickness: 0.35,
            bevelSize: 0.25,
            bevelSegments: 2
        });
        const letterMesh = new THREE.Mesh(letterGeo, getTextMaterial());
        const textCenterX = (bounds.minX + bounds.maxX) / 2;
        const textCenterY = (bounds.minY + bounds.maxY) / 2;
        letterMesh.position.set(-textCenterX, -textCenterY - 2, params.baseThick + 0.4);
        letterMesh.castShadow = true;
        group.add(letterMesh);

        return group;
    }

    // ============================================================
    // 6. MODEL DISPATCHER & RENDER TRIGGER
    // ============================================================
    function renderSolidModel() {
        if (spinner) spinner.style.display = 'flex';

        // Read all current parameters
        const params = {
            text: inputName ? inputName.value.trim() : 'LEGO',
            textSize: elTextSizeNum ? parseFloat(elTextSizeNum.value) : 18,
            baseThick: elBaseThickNum ? parseFloat(elBaseThickNum.value) : 1.5,
            letterThick: inputThickness ? parseFloat(inputThickness.value) : 3.0,
            outlineSize: elOutlineNum ? parseFloat(elOutlineNum.value) : 4.5,
            holeSize: elHoleSizeNum ? parseFloat(elHoleSizeNum.value) : 5.0,
            holeX: elHoleXNum ? parseFloat(elHoleXNum.value) : 3.0,
            holeY: elHoleYNum ? parseFloat(elHoleYNum.value) : 0.0,
            spaceWidth: elSpaceWidthNum ? parseFloat(elSpaceWidthNum.value) : 1.0
        };

        // Remove previous model from scene
        if (currentModelGroup) {
            scene.remove(currentModelGroup);
            // Dispose geometries and materials
            currentModelGroup.traverse(child => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                        else child.material.dispose();
                    }
                }
            });
            currentModelGroup = null;
        }

        // Build new Solid 3D CAD model
        if (currentTemplate === 'lego') {
            currentModelGroup = buildLegoKeychain(params);
        } else if (currentTemplate === 'nametag') {
            currentModelGroup = buildNameTag(params);
        } else if (currentTemplate === 'deskstand') {
            currentModelGroup = buildDeskStand(params);
        } else if (currentTemplate === 'badge') {
            currentModelGroup = buildBadgeShield(params);
        }

        if (currentModelGroup) {
            scene.add(currentModelGroup);
        }

        updatePricing(params);

        if (spinner) {
            setTimeout(() => { spinner.style.display = 'none'; }, 80);
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // ============================================================
    // 7. PRICING & WEIGHT CALCULATION
    // ============================================================
    function updatePricing(params) {
        const textLen = (params.text || 'LEGO').length;
        const totalThick = params.baseThick + params.letterThick;
        const volEst = Math.round(textLen * 1.8 * totalThick * (params.outlineSize * 0.4 + 1));
        const estGrams = Math.max(12, Math.round(volEst * 0.28));

        let finishMul = 1.0;
        if (currentFinish === 'silk') finishMul = 1.25;
        if (currentFinish === 'satin') finishMul = 1.20;
        if (currentFinish === 'neon') finishMul = 1.30;

        const baseFee = currentTemplate === 'deskstand' ? 450 : 250;
        const calculatedPrice = Math.round((baseFee + (estGrams * currentRate)) * finishMul);

        if (displayPrice) {
            displayPrice.textContent = `৳${calculatedPrice}`;
        }
        if (displaySpecs) {
            const modelNames = {
                lego: 'LEGO Keychain.scad',
                nametag: 'Customizable Name Tag.scad',
                deskstand: 'Desk Stand Trophy.scad',
                badge: 'Badge Plaque Shield.scad'
            };
            displaySpecs.textContent = `${modelNames[currentTemplate]} • ${currentColorName} • ~${estGrams}g PLA • ${params.baseThick}mm Base`;
        }
    }

    // ============================================================
    // 8. STL EXPORT (Direct 3D Print File Download)
    // ============================================================
    function downloadSTL() {
        if (!currentModelGroup || typeof THREE.STLExporter === 'undefined') {
            alert('3D Mesh not ready yet.');
            return;
        }

        const exporter = new THREE.STLExporter();
        const result = exporter.parse(currentModelGroup, { binary: true });
        const blob = new Blob([result], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const textClean = (inputName ? inputName.value : 'model').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        link.download = `${textClean}_${currentTemplate}_print_ready.stl`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    if (btnExportStl) {
        btnExportStl.addEventListener('click', downloadSTL);
    }

    // ============================================================
    // 9. OPENSCAD CODE GENERATOR & MODAL
    // ============================================================
    function generateOpenSCADCode() {
        const text = inputName ? inputName.value.trim() : 'LEGO';
        const textSize = elTextSizeNum ? elTextSizeNum.value : '18';
        const baseThick = elBaseThickNum ? elBaseThickNum.value : '1.5';
        const letterThick = inputThickness ? inputThickness.value : '3.0';
        const outlineSize = elOutlineNum ? elOutlineNum.value : '4.5';
        const holeSize = elHoleSizeNum ? elHoleSizeNum.value : '5.0';
        const holeX = elHoleXNum ? elHoleXNum.value : '3.0';
        const holeY = elHoleYNum ? elHoleYNum.value : '0.0';

        if (currentTemplate === 'lego') {
            return `// ============================================================
// Parametric LEGO Keychain — Generated by Kira's Creation Studio
// Compatible with OpenSCAD, MakerWorld & Bambu Studio
// ============================================================

nome = "${text}";
texto_tamanho = ${textSize};
base_espessura = ${baseThick};
letra_espessura = ${letterThick};
borda_tamanho = ${outlineSize};
buraco_diametro = ${holeSize};
buraco_x = ${holeX};
buraco_y = ${holeY};
fonte = "Fredoka:style=Bold";

module base_plate() {
    difference() {
        union() {
            // Pill contour around text
            offset(r = borda_tamanho) {
                text(nome, size = texto_tamanho, font = fonte, halign = "center", valign = "center");
            }
            // Ring eyelet for keychain
            translate([-len(nome) * texto_tamanho * 0.38 - buraco_x, buraco_y])
                circle(d = buraco_diametro + borda_tamanho * 2);
        }
        // Hollow through-hole
        translate([-len(nome) * texto_tamanho * 0.38 - buraco_x, buraco_y])
            circle(d = buraco_diametro);
    }
}

// 3D Rendering (Dual Extrusion Ready)
color("${currentColor}") linear_extrude(height = base_espessura) base_plate();

color("#E5C158") translate([0, 0, base_espessura]) linear_extrude(height = 0.6)
    offset(r = max(1, borda_tamanho - 1.5))
        text(nome, size = texto_tamanho, font = fonte, halign = "center", valign = "center");

color("#FFFFFF") translate([0, 0, base_espessura + 0.6]) linear_extrude(height = letra_espessura)
    text(nome, size = texto_tamanho, font = fonte, halign = "center", valign = "center");
`;
        } else if (currentTemplate === 'nametag') {
            return `// ============================================================
// Customizable Name Tag.scad
// ============================================================

nome = "${text}";
tamanho = ${textSize};
espessura = ${baseThick};
relevo = ${letterThick};
borda = ${outlineSize};

module tag_plate() {
    difference() {
        minkowski() {
            square([len(nome)*tamanho*0.7 + borda*2, tamanho*1.8 + borda*2], center=true);
            circle(r=5);
        }
        // Lanyard Slot
        translate([0, (tamanho*1.8 + borda*2)/2 - 3])
            minkowski() { square([10, 2], center=true); circle(r=1.5); }
    }
}

color("${currentColor}") linear_extrude(height = espessura) tag_plate();
color("#FFFFFF") translate([0, -2, espessura]) linear_extrude(height = relevo)
    text(nome, size = tamanho, halign = "center", valign = "center");
`;
        } else if (currentTemplate === 'deskstand') {
            return `// ============================================================
// Desk Stand Trophy.scad
// ============================================================

title = "${text}";
size = ${textSize};
base_h = ${baseThick};

// Pedestal
color("${currentColor}") translate([0, 0, 4]) cube([len(title)*size*0.8 + 30, 32, 8], center=true);

// Plaque
translate([0, -2, 8]) rotate([-10, 0, 0]) {
    color("${currentColor}") linear_extrude(height = base_h + 1.5)
        square([len(title)*size*0.7 + 20, size*2 + 15], center=true);
    color("#FFD700") translate([0, 0, base_h + 1.5]) linear_extrude(height = ${letterThick})
        text(title, size = size, halign = "center", valign = "center");
}
`;
        } else {
            return `// ============================================================
// Badge Plaque Shield.scad
// ============================================================

title = "${text}";
size = ${textSize};
base_h = ${baseThick};

module shield() {
    difference() {
        polygon(points=[[-35, 40], [0, 45], [35, 40], [0, -45]]);
        translate([0, 36]) circle(r=2.5);
    }
}

color("${currentColor}") linear_extrude(height = base_h) shield();
color("#FFD700") translate([0, 0, base_h]) linear_extrude(height = 0.6) offset(r=-4) shield();
color("#FFFFFF") translate([0, 0, base_h + 0.6]) linear_extrude(height = ${letterThick})
    text(title, size = size, halign = "center", valign = "center");
`;
        }
    }

    if (btnViewScad && scadModal && scadCodeArea) {
        btnViewScad.addEventListener('click', () => {
            scadCodeArea.value = generateOpenSCADCode();
            scadModal.style.display = 'flex';
        });
        if (btnCloseScadModal) {
            btnCloseScadModal.addEventListener('click', () => {
                scadModal.style.display = 'none';
            });
        }
        if (btnCopyScad) {
            btnCopyScad.addEventListener('click', () => {
                navigator.clipboard.writeText(scadCodeArea.value).then(() => {
                    btnCopyScad.textContent = '✅ Copied!';
                    setTimeout(() => { btnCopyScad.textContent = '📋 Copy Code'; }, 1800);
                });
            });
        }
        if (btnDownloadScad) {
            btnDownloadScad.addEventListener('click', () => {
                const blob = new Blob([scadCodeArea.value], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${currentTemplate}_custom.scad`;
                link.click();
                URL.revokeObjectURL(link.href);
            });
        }
    }

    // ============================================================
    // 10. CONTROLS SYNCHRONIZATION & EVENT LISTENERS
    // ============================================================
    function syncControl(numEl, sliderEl, callback) {
        if (!numEl || !sliderEl) return;
        numEl.addEventListener('input', () => {
            sliderEl.value = numEl.value;
            saveHistoryState();
            callback();
        });
        sliderEl.addEventListener('input', () => {
            numEl.value = sliderEl.value;
            callback();
        });
        sliderEl.addEventListener('change', () => {
            saveHistoryState();
        });
    }

    function setupStepper(minusBtnId, plusBtnId, inputEl, sliderEl, step, callback) {
        const minusBtn = document.getElementById(minusBtnId);
        const plusBtn = document.getElementById(plusBtnId);
        if (minusBtn && inputEl) {
            minusBtn.addEventListener('click', () => {
                const cur = parseFloat(inputEl.value) || 0;
                const min = parseFloat(inputEl.min) || 0;
                const next = Math.max(min, cur - step);
                inputEl.value = next.toFixed(1).replace(/\.0$/, '');
                if (sliderEl) sliderEl.value = inputEl.value;
                saveHistoryState();
                callback();
            });
        }
        if (plusBtn && inputEl) {
            plusBtn.addEventListener('click', () => {
                const cur = parseFloat(inputEl.value) || 0;
                const max = parseFloat(inputEl.max) || 100;
                const next = Math.min(max, cur + step);
                inputEl.value = next.toFixed(1).replace(/\.0$/, '');
                if (sliderEl) sliderEl.value = inputEl.value;
                saveHistoryState();
                callback();
            });
        }
    }

    // Text Input
    if (inputName) {
        inputName.addEventListener('input', () => {
            renderSolidModel();
        });
        inputName.addEventListener('change', () => {
            saveHistoryState();
        });
    }

    // Steppers & Sliders Sync
    syncControl(elOutlineNum, elOutlineSlider, renderSolidModel);
    setupStepper('btn-minus-outline', 'btn-plus-outline', elOutlineNum, elOutlineSlider, 0.5, renderSolidModel);

    syncControl(elBaseThickNum, elBaseThickSlider, renderSolidModel);
    setupStepper('btn-minus-basethick', 'btn-plus-basethick', elBaseThickNum, elBaseThickSlider, 0.5, renderSolidModel);

    syncControl(elTextSizeNum, elTextSizeSlider, renderSolidModel);
    setupStepper('btn-minus-textsize', 'btn-plus-textsize', elTextSizeNum, elTextSizeSlider, 1.0, renderSolidModel);

    syncControl(elSpaceWidthNum, elSpaceWidthSlider, renderSolidModel);
    setupStepper('btn-minus-space', 'btn-plus-space', elSpaceWidthNum, elSpaceWidthSlider, 0.5, renderSolidModel);

    syncControl(inputThickness, elLetterThickSlider, renderSolidModel);
    setupStepper('btn-minus-thick', 'btn-plus-thick', inputThickness, elLetterThickSlider, 0.5, renderSolidModel);

    syncControl(elHoleSizeNum, elHoleSizeSlider, renderSolidModel);
    setupStepper('btn-minus-holesize', 'btn-plus-holesize', elHoleSizeNum, elHoleSizeSlider, 0.5, renderSolidModel);

    syncControl(elHoleXNum, elHoleXSlider, renderSolidModel);
    setupStepper('btn-minus-holex', 'btn-plus-holex', elHoleXNum, elHoleXSlider, 0.5, renderSolidModel);

    syncControl(elHoleYNum, elHoleYSlider, renderSolidModel);
    setupStepper('btn-minus-holey', 'btn-plus-holey', elHoleYNum, elHoleYSlider, 0.5, renderSolidModel);

    // Color Swatches
    if (colorSwatches) {
        colorSwatches.addEventListener('click', (e) => {
            const btn = e.target.closest('.color-swatch');
            if (!btn) return;
            colorSwatches.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color || '#D32F2F';
            currentColorName = btn.dataset.name || 'Ruby Red';
            currentRate = parseFloat(btn.dataset.rate) || 7.0;
            saveHistoryState();
            renderSolidModel();
        });
    }

    // Surface Finishes
    if (finishOptions) {
        finishOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.finish-option');
            if (!btn) return;
            finishOptions.querySelectorAll('.finish-option').forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            currentFinish = btn.dataset.finish || 'standard';
            saveHistoryState();
            renderSolidModel();
        });
    }

    // Font Options
    if (fontOptions) {
        fontOptions.addEventListener('click', (e) => {
            const pill = e.target.closest('.font-pill');
            if (!pill) return;
            fontOptions.querySelectorAll('.font-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            // Toggle between helvetiker and optimer font
            currentFontKey = currentFontKey === 'helvetiker' ? 'optimer' : 'helvetiker';
            saveHistoryState();
            renderSolidModel();
        });
    }

    // SCAD Model Selector
    if (scadSelect) {
        scadSelect.addEventListener('change', () => {
            currentTemplate = scadSelect.value;
            const badgeTexts = {
                lego: '🔑 KEYRING',
                nametag: '🏷️ NAME TAG',
                deskstand: '🏆 TROPHY',
                badge: '🛡️ SHIELD'
            };
            if (templateBadge) templateBadge.textContent = badgeTexts[currentTemplate] || '🧊 3D MODEL';
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 0);
            controls.update();
            saveHistoryState();
            renderSolidModel();
        });
    }

    // Reset Camera View Button
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 0);
            controls.update();
        });
    }

    // Undo Last Change
    if (btnUndoScad) {
        btnUndoScad.addEventListener('click', () => {
            if (stateHistory.length > 1) {
                stateHistory.pop(); // current
                const prev = stateHistory[stateHistory.length - 1];
                if (prev) {
                    currentTemplate = prev.template;
                    if (scadSelect) scadSelect.value = prev.template;
                    if (inputName) inputName.value = prev.text;
                    currentColor = prev.color;
                    currentColorName = prev.colorName;
                    currentFinish = prev.finish;
                    if (elOutlineNum) { elOutlineNum.value = prev.outline; if (elOutlineSlider) elOutlineSlider.value = prev.outline; }
                    if (elBaseThickNum) { elBaseThickNum.value = prev.baseThick; if (elBaseThickSlider) elBaseThickSlider.value = prev.baseThick; }
                    if (elTextSizeNum) { elTextSizeNum.value = prev.textSize; if (elTextSizeSlider) elTextSizeSlider.value = prev.textSize; }
                    if (inputThickness) { inputThickness.value = prev.letterThick; if (elLetterThickSlider) elLetterThickSlider.value = prev.letterThick; }
                    renderSolidModel();
                }
            }
        });
    }

    // Reset to Defaults
    if (btnResetScad) {
        btnResetScad.addEventListener('click', () => {
            if (inputName) inputName.value = 'LEGO';
            if (elOutlineNum) { elOutlineNum.value = '4.5'; if (elOutlineSlider) elOutlineSlider.value = '4.5'; }
            if (elBaseThickNum) { elBaseThickNum.value = '1.5'; if (elBaseThickSlider) elBaseThickSlider.value = '1.5'; }
            if (elTextSizeNum) { elTextSizeNum.value = '18'; if (elTextSizeSlider) elTextSizeSlider.value = '18'; }
            if (inputThickness) { inputThickness.value = '3.0'; if (elLetterThickSlider) elLetterThickSlider.value = '3.0'; }
            if (elHoleSizeNum) { elHoleSizeNum.value = '5.0'; if (elHoleSizeSlider) elHoleSizeSlider.value = '5.0'; }
            if (elHoleXNum) { elHoleXNum.value = '3.0'; if (elHoleXSlider) elHoleXSlider.value = '3.0'; }
            if (elHoleYNum) { elHoleYNum.value = '0.0'; if (elHoleYSlider) elHoleYSlider.value = '0.0'; }
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 0);
            controls.update();
            saveHistoryState();
            renderSolidModel();
        });
    }

    if (btnGenerateScad) {
        btnGenerateScad.addEventListener('click', () => {
            renderSolidModel();
        });
    }

    // ============================================================
    // 11. CART & ORDER INTEGRATION
    // ============================================================
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            // Render one clean frame to snapshot
            renderer.render(scene, camera);
            const snapshot = renderer.domElement.toDataURL('image/webp', 0.85);

            const priceText = displayPrice ? displayPrice.textContent.replace('৳', '') : '350';
            const price = parseInt(priceText, 10) || 350;

            const modelTitles = {
                lego: 'LEGO Keychain.scad',
                nametag: 'Customizable Name Tag.scad',
                deskstand: 'Desk Stand Trophy.scad',
                badge: 'Badge Plaque Shield.scad'
            };

            const item = {
                id: 'custom-' + Date.now(),
                title: `${modelTitles[currentTemplate]} ("${inputName ? inputName.value : 'Custom'}")`,
                price: price,
                quantity: 1,
                image: snapshot,
                specs: {
                    model: modelTitles[currentTemplate],
                    text: inputName ? inputName.value : '',
                    color: currentColorName,
                    finish: currentFinish,
                    thickness: `${elBaseThickNum ? elBaseThickNum.value : 1.5}mm base + ${inputThickness ? inputThickness.value : 3.0}mm text`
                }
            };

            if (window.KiraCart) {
                window.KiraCart.addItem(item);
            } else {
                alert(`Added "${item.title}" to cart!`);
            }
        });
    }

    if (btnOrder) {
        btnOrder.addEventListener('click', () => {
            if (btnAddToCart) btnAddToCart.click();
            window.location.href = 'contact.html?type=custom_order';
        });
    }

    // Save Initial State & Initial Render
    saveHistoryState();
    renderSolidModel();
});