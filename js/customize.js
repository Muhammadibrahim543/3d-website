// ============================================================
// MAKERWORLD / OPENSCAD REAL 3D SOLID CAD ENGINE (Three.js WebGL)
// Kira's Creation Soft-3D Studio // 4-Layer Parametric Bubble Customizer
// Total Height: 6.0 mm (0->3.2 Red, 3.2->4.2 Yellow, 4.2->5.2 Black, 5.2->6.0 White)
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
    const btnExport3mf = document.getElementById('btn-export-3mf');
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
    const btnResetScad = document.getElementById('btn-scad-reset');
    const btnUndoScad = document.getElementById('btn-scad-undo');
    const btnDownload3mfPanel = document.getElementById('btn-download-3mf-panel');
    const btnDownloadStlPanel = document.getElementById('btn-download-stl-panel');

    if (!canvas || typeof THREE === 'undefined') {
        console.error('Three.js or target canvas missing.');
        return;
    }

    // --- State Variables ---
    let currentTemplate = 'lego'; // 'lego', 'nametag'
    let currentFont = "'Nunito', sans-serif";
    let currentColor = '#D01012';
    let currentColorName = 'LEGO Red';
    let currentRate = 7.0;
    let currentFinish = 'standard';

    let currentModelGroup = null;
    let stateHistory = [];

    function saveHistoryState() {
        stateHistory.push({
            template: currentTemplate,
            text: inputName ? inputName.value : 'LEGO',
            font: currentFont,
            color: currentColor,
            colorName: currentColorName,
            finish: currentFinish,
            outline: elOutlineNum ? elOutlineNum.value : '4.5',
            baseThick: elBaseThickNum ? elBaseThickNum.value : '3.2',
            textSize: elTextSizeNum ? elTextSizeNum.value : '18',
            spaceWidth: elSpaceWidthNum ? elSpaceWidthNum.value : '1.0',
            letterThick: inputThickness ? inputThickness.value : '0.8',
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
    camera.up.set(0, 0, 1); // Z is UP (CAD & 3D Printing standard)
    const defaultCamPos = new THREE.Vector3(0, -95, 140);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stageWidth, stageHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    // Allow full 360° omnidirectional inspection (0° top view to 180° underside view)
    controls.minPolarAngle = 0.001;
    controls.maxPolarAngle = Math.PI - 0.001;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.minDistance = 25;
    controls.maxDistance = 350;
    controls.target.set(0, 0, 3);

    // Responsive Touch & Mouse Speeds (Smooth, natural 1:1 finger tracking & pinch)
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 1.15;
    controls.panSpeed = 0.8;
    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
    };
    controls.update();

    function onWindowResize() {
        const w = stageCard.clientWidth || 560;
        const h = stageCard.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(onWindowResize, 150);
    });
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
            onWindowResize();
        });
        ro.observe(stageCard);
    }

    // ============================================================
    // 2. STUDIO LIGHTING & BAMBU-STYLE BUILD PLATE
    // ============================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf2, 0.85);
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

    const fillLight = new THREE.DirectionalLight(0xd4e2ff, 0.35);
    fillLight.position.set(-70, -50, 80);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(0, -90, -30);
    scene.add(rimLight);

    // Underside inspection light (illuminates the bottom red base plate when rotated underneath)
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.45);
    bottomLight.position.set(0, 40, -100);
    scene.add(bottomLight);

    // Build Plate
    const buildPlateGroup = new THREE.Group();
    const bedGeo = new THREE.PlaneGeometry(180, 150);
    const bedMat = new THREE.MeshStandardMaterial({
        color: 0x14121a,
        roughness: 0.95,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.z = -0.3;
    bedMesh.receiveShadow = true;
    buildPlateGroup.add(bedMesh);

    const grid = new THREE.GridHelper(160, 16, 0x443b5e, 0x221d30);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -0.15;
    buildPlateGroup.add(grid);
    scene.add(buildPlateGroup);

    // ============================================================
    // 3. PBR MATERIAL FACTORY
    // ============================================================
    function getBaseMaterial() {
        let hex = currentColor;
        if (currentColor && currentColor.toLowerCase() === '#d32f2f') {
            hex = '#D01012';
        }
        const col = new THREE.Color(hex);
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
        return new THREE.MeshStandardMaterial({
            color: col,
            roughness: 0.32,
            metalness: 0.04
        });
    }

    // ============================================================
    // 4. HIGH-PRECISION 2D VECTOR CONTOUR TRACER & CHAIKIN SMOOTHING
    // ============================================================
    function chaikinSmooth(pts, iterations = 2) {
        if (!pts || pts.length < 3) return pts || [];
        let current = pts;
        for (let it = 0; it < iterations; it++) {
            const next = [];
            const len = current.length;
            for (let i = 0; i < len; i++) {
                const p0 = current[i];
                const p1 = current[(i + 1) % len];
                next.push({
                    x: 0.75 * p0.x + 0.25 * p1.x,
                    y: 0.75 * p0.y + 0.25 * p1.y
                });
                next.push({
                    x: 0.25 * p0.x + 0.75 * p1.x,
                    y: 0.25 * p0.y + 0.75 * p1.y
                });
            }
            current = next;
        }
        return current;
    }

    function simplifyPoly(pts, epsilon = 1.0) {
        if (!pts || pts.length <= 2) return pts || [];
        let maxDist = 0, index = 0;
        const start = pts[0], end = pts[pts.length - 1];
        const dx = end.x - start.x, dy = end.y - start.y;
        const lenSq = dx * dx + dy * dy;

        for (let i = 1; i < pts.length - 1; i++) {
            let dist = 0;
            if (lenSq === 0) {
                dist = Math.hypot(pts[i].x - start.x, pts[i].y - start.y);
            } else {
                const t = Math.max(0, Math.min(1, ((pts[i].x - start.x) * dx + (pts[i].y - start.y) * dy) / lenSq));
                dist = Math.hypot(pts[i].x - (start.x + t * dx), pts[i].y - (start.y + t * dy));
            }
            if (dist > maxDist) {
                maxDist = dist;
                index = i;
            }
        }

        if (maxDist > epsilon) {
            const left = simplifyPoly(pts.slice(0, index + 1), epsilon);
            const right = simplifyPoly(pts.slice(index), epsilon);
            return left.slice(0, left.length - 1).concat(right);
        }
        return [start, end];
    }

    // Marching Squares Vector Contour Tracer with Full Hole Topology Support
    function marchingSquaresContours(isSolid, minX, maxX, minY, maxY, step = 1) {
        const segments = [];
        for (let y = minY; y <= maxY; y += step) {
            for (let x = minX; x <= maxX; x += step) {
                const tl = isSolid(x, y) ? 8 : 0;
                const tr = isSolid(x + step, y) ? 4 : 0;
                const br = isSolid(x + step, y + step) ? 2 : 0;
                const bl = isSolid(x, y + step) ? 1 : 0;
                const caseId = tl | tr | br | bl;
                if (caseId === 0 || caseId === 15) continue;

                const N = { x: x + step * 0.5, y: y };
                const E = { x: x + step,       y: y + step * 0.5 };
                const S = { x: x + step * 0.5, y: y + step };
                const W = { x: x,              y: y + step * 0.5 };

                switch (caseId) {
                    case 1:  segments.push({ p1: S, p2: W }); break;
                    case 2:  segments.push({ p1: E, p2: S }); break;
                    case 3:  segments.push({ p1: E, p2: W }); break;
                    case 4:  segments.push({ p1: N, p2: E }); break;
                    case 5:
                        segments.push({ p1: N, p2: E });
                        segments.push({ p1: S, p2: W });
                        break;
                    case 6:  segments.push({ p1: N, p2: S }); break;
                    case 7:  segments.push({ p1: N, p2: W }); break;
                    case 8:  segments.push({ p1: W, p2: N }); break;
                    case 9:  segments.push({ p1: S, p2: N }); break;
                    case 10:
                        segments.push({ p1: W, p2: N });
                        segments.push({ p1: E, p2: S });
                        break;
                    case 11: segments.push({ p1: E, p2: N }); break;
                    case 12: segments.push({ p1: W, p2: E }); break;
                    case 13: segments.push({ p1: S, p2: E }); break;
                    case 14: segments.push({ p1: W, p2: S }); break;
                }
            }
        }

        const key = p => Math.round(p.x * 10) + ',' + Math.round(p.y * 10);
        const segMap = new Map();
        segments.forEach(seg => {
            const k = key(seg.p1);
            if (!segMap.has(k)) segMap.set(k, []);
            segMap.get(k).push(seg);
        });

        const used = new Set();
        const polygons = [];

        segments.forEach(firstSeg => {
            if (used.has(firstSeg)) return;
            const poly = [firstSeg.p1];
            let cur = firstSeg;
            used.add(cur);

            let count = 0;
            while (count++ < 30000) {
                poly.push(cur.p2);
                const nextKey = key(cur.p2);
                const candidates = segMap.get(nextKey);
                let next = null;
                if (candidates) {
                    for (let cand of candidates) {
                        if (!used.has(cand)) {
                            next = cand;
                            break;
                        }
                    }
                }
                if (!next) break;
                used.add(next);
                cur = next;
                if (key(cur.p2) === key(poly[0])) break;
            }
            if (poly.length >= 4) polygons.push(poly);
        });

        return polygons;
    }

    // High-Resolution Multi-Contour & Hole Extractor with Dynamic Letter Spacing & Sizing
    async function extractTextContours(text, fontStr, spaceWidth = 1.0, textSize = 18) {
        // Wait for fonts to load so canvas renders correctly
        await document.fonts.ready;

        const W = 3600;
        const H = 900;
        const cvs = document.createElement('canvas');
        cvs.width = W;
        cvs.height = H;
        const ctx = cvs.getContext('2d', { willReadFrequently: true });

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const weight = (fontStr && fontStr.includes('Baloo')) ? '800' : '900';
        ctx.font = `${weight} 120px ${fontStr || "'Nunito', sans-serif"}`;

        // Dynamic letter spacing (1.0 = standard; 0 -> tighter; >1 -> wider)
        const extraSpacePx = (spaceWidth - 1.0) * 14.0;
        if ('letterSpacing' in ctx) {
            ctx.letterSpacing = `${Math.round(extraSpacePx)}px`;
        }

        // LEGO-style italic tilt: ~12° right-leaning shear
        // Top of letters lean right, bottom stays — matches LEGO logo aesthetic
        const skewAngle = 12 * Math.PI / 180; // 12 degrees
        const skew = Math.tan(skewAngle);
        ctx.transform(1, 0, -skew, 1, (H / 2) * skew, 0);

        // Cute, softly rounded pill edges matching MakerLab reference:
        // A subtle 6px round stroke rounds all stroke caps and corner fillets
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(text, W / 2, H / 2);
        ctx.fillText(text, W / 2, H / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

        const imgData = ctx.getImageData(0, 0, W, H);
        const data = imgData.data;

        // 1. Find tight bounding box
        let minX = W, maxX = 0, minY = H, maxY = 0;
        for (let y = 0; y < H; y++) {
            const rowOffset = y * W;
            for (let x = 0; x < W; x++) {
                if (data[(rowOffset + x) * 4 + 3] > 80) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (minX >= maxX || minY >= maxY) {
            return { paths: [], outerPaths: [], exPolys: [], bounds: { minX: 0, maxX: 100, minY: 0, maxY: 30 } };
        }

        minX = Math.max(1, minX - 8);
        maxX = Math.min(W - 3, maxX + 8);
        minY = Math.max(1, minY - 8);
        maxY = Math.min(H - 3, maxY + 8);

        const isSolid = (x, y) => {
            if (x < 0 || x >= W || y < 0 || y >= H) return false;
            return data[(y * W + x) * 4 + 3] > 105;
        };

        const rawPolygons = marchingSquaresContours(isSolid, minX, maxX, minY, maxY, 1);

        // Scale to physical millimeters (target text height: dynamic textSize)
        const textH = Math.max(10, maxY - minY);
        const targetH = Math.max(8.0, textSize || 18.0);
        const scale = targetH / textH; // mm per pixel
        const CLIPPER_SCALE = 1000;
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;

        const clipperPaths = [];

        rawPolygons.forEach(pts => {
            // Fine tolerance to preserve smooth curvatures
            const simp = simplifyPoly(pts, 0.4);
            if (simp.length < 4) return;
            // 3-iteration Chaikin smoothing for silky curves
            const smoothed = chaikinSmooth(simp, 3);

            const cPath = smoothed.map(p => ({
                X: Math.round((p.x - midX) * scale * CLIPPER_SCALE),
                Y: Math.round(-(p.y - midY) * scale * CLIPPER_SCALE) // Invert Y for 3D coordinate system
            }));

            if (cPath.length >= 3 && Math.abs(ClipperLib.Clipper.Area(cPath)) > 30000) {
                clipperPaths.push(cPath);
            }
        });

        // Use Clipper with pftEvenOdd to accurately identify outer boundaries and inner holes
        const normalizer = new ClipperLib.Clipper();
        normalizer.AddPaths(clipperPaths, ClipperLib.PolyType.ptSubject, true);
        const normTree = new ClipperLib.PolyTree();
        normalizer.Execute(ClipperLib.ClipType.ctUnion, normTree, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
        const exPolys = ClipperLib.JS.PolyTreeToExPolygons(normTree);

        const allPaths = [];
        const outerPaths = [];

        exPolys.forEach(exp => {
            if (!exp.outer || exp.outer.length < 3) return;
            if (!ClipperLib.Clipper.Orientation(exp.outer)) {
                exp.outer.reverse();
            }
            allPaths.push(exp.outer);
            outerPaths.push(exp.outer);

            if (exp.holes && exp.holes.length > 0) {
                exp.holes.forEach(hole => {
                    if (!hole || hole.length < 3) return;
                    if (ClipperLib.Clipper.Orientation(hole)) {
                        hole.reverse();
                    }
                    allPaths.push(hole);
                });
            }
        });

        return {
            paths: allPaths,
            outerPaths: outerPaths,
            exPolys: exPolys,
            scale: scale,
            bounds: {
                width: (maxX - minX) * scale,
                height: (maxY - minY) * scale
            }
        };
    }

    // High-Order Corner Smoothing for 2D Polygons to Eliminate All Facets & Creases
    function smoothExPolygons(exPolygons, iterations = 2) {
        if (!exPolygons || !exPolygons.length) return [];
        return exPolygons.map(exp => {
            if (!exp.outer || exp.outer.length < 3) return exp;
            const outPts = exp.outer.map(p => ({ x: p.X, y: p.Y }));
            const simpOuter = simplifyPoly(outPts, 35); // Filter micro-noise
            const smoothedOut = chaikinSmooth(simpOuter, iterations).map(p => ({
                X: Math.round(p.x),
                Y: Math.round(p.y)
            }));
            const smoothedHoles = (exp.holes || []).map(hole => {
                if (!hole || hole.length < 3) return hole;
                const hPts = hole.map(p => ({ x: p.X, y: p.Y }));
                const simpHole = simplifyPoly(hPts, 35);
                return chaikinSmooth(simpHole, iterations).map(p => ({
                    X: Math.round(p.x),
                    Y: Math.round(p.y)
                }));
            });
            return {
                outer: smoothedOut,
                holes: smoothedHoles
            };
        });
    }

    // Convert Clipper ExPolygons to THREE.Shape array with holes
    function exPolygonsToThreeShapes(exPolygons, invScale = 0.001) {
        const shapes = [];
        if (!exPolygons || !exPolygons.length) return shapes;

        exPolygons.forEach(exp => {
            if (!exp.outer || exp.outer.length < 3) return;
            const shape = new THREE.Shape();
            const outer = exp.outer;
            shape.moveTo(outer[0].X * invScale, outer[0].Y * invScale);
            for (let i = 1; i < outer.length; i++) {
                shape.lineTo(outer[i].X * invScale, outer[i].Y * invScale);
            }
            shape.closePath();

            if (exp.holes && exp.holes.length > 0) {
                exp.holes.forEach(hole => {
                    if (!hole || hole.length < 3) return;
                    const holePath = new THREE.Path();
                    holePath.moveTo(hole[0].X * invScale, hole[0].Y * invScale);
                    for (let i = 1; i < hole.length; i++) {
                        holePath.lineTo(hole[i].X * invScale, hole[i].Y * invScale);
                    }
                    holePath.closePath();
                    shape.holes.push(holePath);
                });
            }
            shapes.push(shape);
        });
        return shapes;
    }

    // ============================================================
    // 5. AUTHENTIC 4-LAYER 6.0mm LEGO KEYCHAIN GENERATOR (Clipper CAD)
    // Layer 1: Red Base (0.0mm -> 3.2mm, Height = 3.2mm)
    // Layer 2: Yellow Accent (3.2mm -> 4.2mm, Height = 1.0mm)
    // Layer 3: Black Outline (4.2mm -> 5.2mm, Height = 1.0mm)
    // Layer 4: White Raised Letters (5.2mm -> 6.0mm, Height = 0.8mm)
    // ============================================================
    async function buildLegoKeychain(params) {
        const group = new THREE.Group();
        const text = (params.text || 'LEGO').trim() || 'LEGO';

        if (typeof ClipperLib === 'undefined') {
            console.error('ClipperLib not loaded');
            return group;
        }

        const fontStr = currentFont || "'Nunito', sans-serif";
        const { paths: textPaths, outerPaths, exPolys } = await extractTextContours(text, fontStr, params.spaceWidth, params.textSize);

        if (!textPaths || textPaths.length === 0) {
            return group;
        }

        const CLIPPER_SCALE = 1000;
        const invScale = 1 / CLIPPER_SCALE;
        const arcTol = 0.1 * CLIPPER_SCALE; // 0.1mm arc precision — smooth, fast

        // ============================================================
        // SINGLE SOURCE OF TRUTH: exPolys
        // ============================================================
        // exPolys[].outer = EXACT same shapes used for white letters.
        // ALL border layers must derive from these same shapes to
        // guarantee font consistency. No Chaikin applied here to avoid
        // shape mismatch between white letters and their borders.
        const letterBase = exPolys
            .filter(e => e && e.outer && e.outer.length >= 3)
            .map(e => e.outer);

        if (letterBase.length === 0) return group;

        // Union all letter outer paths → one connected silhouette
        const uc = new ClipperLib.Clipper();
        uc.AddPaths(letterBase, ClipperLib.PolyType.ptSubject, true);
        const uTree = new ClipperLib.PolyTree();
        uc.Execute(ClipperLib.ClipType.ctUnion, uTree,
            ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        // Only outer paths — holes would invert the offset direction
        const letterUnion = ClipperLib.JS.PolyTreeToExPolygons(uTree)
            .map(e => e.outer)
            .filter(p => p && p.length >= 3);

        if (letterUnion.length === 0) return group;

        // Helper: offset letterUnion and return solid ExPolygons (no holes)
        function offsetUnion(deltaMm) {
            const co = new ClipperLib.ClipperOffset(2.0, arcTol);
            co.AddPaths(letterUnion, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
            const tree = new ClipperLib.PolyTree();
            co.Execute(tree, deltaMm * CLIPPER_SCALE);
            const exps = ClipperLib.JS.PolyTreeToExPolygons(tree);
            return exps.map(e => ({ outer: e.outer, holes: [] }));
        }

        // outlineSize drives how thick the brim is (default 4.5mm)
        const brimMm = params.outlineSize || 4.5;
        // Layers offsets (from the white letter outline):
        //   Black = brimMm - 3.0  (~1.5mm border just hugging the letters)
        //   Yellow = brimMm - 1.5 (~3.0mm)
        //   Red   = brimMm       (~4.5mm, the full base)
        const blackDelta  = Math.max(0.5, brimMm - 3.0);
        const yellowDelta = Math.max(1.5, brimMm - 1.5);
        const redDelta    = brimMm;

        // Dynamic heights (no bevel on intermediate layers for 100% planar slicer compatibility)
        const baseThickness = Math.max(1.0, params.baseThick || 3.2);
        const yellowThickness = 1.0;
        const blackThickness = 1.0;
        const letterThickness = Math.max(0.4, params.letterThick || 0.8);

        // ------------------------------------------------------------
        // 1. RED BASE PLATE (0.0mm -> baseThickness)
        // ------------------------------------------------------------
        const redExPoly   = offsetUnion(redDelta);
        const redOffsetPaths = redExPoly.map(e => e.outer);

        // Bounding box for eyelet placement
        let redMinX = Infinity, redMaxX = -Infinity, redMinY = Infinity, redMaxY = -Infinity;
        redOffsetPaths.forEach(path => path.forEach(pt => {
            if (pt.X < redMinX) redMinX = pt.X;
            if (pt.X > redMaxX) redMaxX = pt.X;
            if (pt.Y < redMinY) redMinY = pt.Y;
            if (pt.Y > redMaxY) redMaxY = pt.Y;
        }));

        const redCenterY = (redMinY + redMaxY) / 2;
        const holeDiameterMm = Math.max(3.0, params.holeSize || 5.0);
        const eyeletOuterR   = ((holeDiameterMm / 2) + 2.8) * CLIPPER_SCALE;
        const eyeletInnerR   = (holeDiameterMm / 2) * CLIPPER_SCALE;
        const eyeletX        = redMinX - eyeletOuterR * 0.5;
        const eyeletY        = redCenterY;

        // 64-segment clean ring
        const eyeletCircle = [];
        for (let i = 0; i < 64; i++) {
            const a = (i / 64) * Math.PI * 2;
            eyeletCircle.push({
                X: Math.round(eyeletX + Math.cos(a) * eyeletOuterR),
                Y: Math.round(eyeletY + Math.sin(a) * eyeletOuterR)
            });
        }

        // Union red base + eyelet
        const rc = new ClipperLib.Clipper();
        rc.AddPaths(redOffsetPaths, ClipperLib.PolyType.ptSubject, true);
        rc.AddPath(eyeletCircle, ClipperLib.PolyType.ptClip, true);
        const rTree = new ClipperLib.PolyTree();
        rc.Execute(ClipperLib.ClipType.ctUnion, rTree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        const rExps  = ClipperLib.JS.PolyTreeToExPolygons(rTree);
        const redSolid = rExps.map(e => ({ outer: e.outer, holes: [] }));
        const redShapes = exPolygonsToThreeShapes(redSolid, invScale);

        // Punch keychain hole
        const holePath = new THREE.Path();
        holePath.absarc(eyeletX * invScale, eyeletY * invScale, eyeletInnerR * invScale, 0, Math.PI * 2, true);
        if (redShapes.length > 0) redShapes[0].holes.push(holePath);

        if (redShapes.length > 0) {
            // bevelEnabled: false guarantees completely flat top at Z = baseThickness (e.g. 3.20mm)
            const geo = new THREE.ExtrudeGeometry(redShapes, {
                depth: baseThickness, bevelEnabled: false, curveSegments: 64
            });
            const mesh = new THREE.Mesh(geo, getBaseMaterial());
            mesh.name = "1_Base_Red";
            mesh.userData = {
                colorHex: currentColor || '#D01012',
                colorIdx: 0,
                layerName: 'Base Plate',
                extruder: 1
            };
            mesh.position.z = 0.0;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
        }

        // ------------------------------------------------------------
        // 2. YELLOW ACCENT BRIM (baseThickness -> baseThickness + 1.0mm)
        // ------------------------------------------------------------
        const yellowShapes = exPolygonsToThreeShapes(offsetUnion(yellowDelta), invScale);
        if (yellowShapes.length > 0) {
            const geo = new THREE.ExtrudeGeometry(yellowShapes, {
                depth: yellowThickness, bevelEnabled: false, curveSegments: 64
            });
            const mat = new THREE.MeshStandardMaterial({ color: 0xFED100, roughness: 0.30, metalness: 0.04 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = "2_Yellow_Outline";
            mesh.userData = {
                colorHex: '#FFD500',
                colorIdx: 1,
                layerName: 'Yellow Accent',
                extruder: 2
            };
            mesh.position.z = baseThickness;
            mesh.castShadow = true;
            group.add(mesh);
        }

        // ------------------------------------------------------------
        // 3. BLACK OUTLINE LAYER (baseThickness + 1.0mm -> baseThickness + 2.0mm)
        // ------------------------------------------------------------
        const blackShapes = exPolygonsToThreeShapes(offsetUnion(blackDelta), invScale);
        if (blackShapes.length > 0) {
            const geo = new THREE.ExtrudeGeometry(blackShapes, {
                depth: blackThickness, bevelEnabled: false, curveSegments: 64
            });
            const mat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.42, metalness: 0.08 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = "3_Black_Border";
            mesh.userData = {
                colorHex: '#111111',
                colorIdx: 2,
                layerName: 'Black Outline',
                extruder: 3
            };
            mesh.position.z = baseThickness + yellowThickness;
            mesh.castShadow = true;
            group.add(mesh);
        }

        // ------------------------------------------------------------
        // 4. WHITE RAISED LETTERS (baseThickness + 2.0mm -> totalHeight)
        // Uses exPolys directly — includes proper holes for b, d, a, etc.
        // ------------------------------------------------------------
        const whiteShapes = exPolygonsToThreeShapes(exPolys, invScale);
        if (whiteShapes.length > 0) {
            const geo = new THREE.ExtrudeGeometry(whiteShapes, {
                depth: letterThickness, bevelEnabled: false, curveSegments: 48
            });
            const mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.28, metalness: 0.02 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = "4_White_Letters";
            mesh.userData = {
                colorHex: '#FFFFFF',
                colorIdx: 3,
                layerName: 'White Letters',
                extruder: 4
            };
            mesh.position.z = baseThickness + yellowThickness + blackThickness;
            mesh.castShadow = true;
            group.add(mesh);
        }

        // Auto-center at origin
        const bbox = new THREE.Box3().setFromObject(group);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        group.children.forEach(child => {
            child.position.x -= center.x;
            child.position.y -= center.y;
        });

        return group;
    }

    // ============================================================
    // 6. CUSTOMIZABLE NAME TAG GENERATOR
    // ============================================================
    function buildNameTag(params) {
        const group = new THREE.Group();
        const text = (params.text || 'NAME').trim() || 'NAME';

        const fontStyle = `bold 64px ${currentFont}, 'Montserrat', sans-serif`;
        const tempCvs = document.createElement('canvas');
        const tempCtx = tempCvs.getContext('2d');
        tempCtx.font = fontStyle;
        const metrics = tempCtx.measureText(text);
        const textWidth = Math.max(70, metrics.width);

        const padX = 20 + params.outlineSize * 2.5;
        const padY = 12 + params.outlineSize * 2;
        const scale = 0.28;

        const width = (textWidth + padX * 2) * scale;
        const height = (70 + padY * 2) * scale;
        const cornerR = 5;

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

        // Lanyard Slot
        const slotW = 12;
        const slotH = 3.5;
        const slotY = h2 - 5.5;
        const slotR = slotH / 2;
        const slotPath = new THREE.Path();
        slotPath.moveTo(-slotW / 2 + slotR, slotY - slotR);
        slotPath.lineTo(slotW / 2 - slotR, slotY - slotR);
        slotPath.absarc(slotW / 2 - slotR, slotY, slotR, -Math.PI / 2, Math.PI / 2, false);
        slotPath.lineTo(-slotW / 2 + slotR, slotY + slotR);
        slotPath.absarc(-slotW / 2 + slotR, slotY, slotR, Math.PI / 2, -Math.PI / 2, false);
        shape.holes.push(slotPath);

        const baseGeo = new THREE.ExtrudeGeometry(shape, {
            depth: 3.2,
            bevelEnabled: true,
            bevelThickness: 0.35,
            bevelSize: 0.35,
            bevelSegments: 3
        });
        const baseMesh = new THREE.Mesh(baseGeo, getBaseMaterial());
        baseMesh.name = "1_Base_Plate";
        baseMesh.userData = {
            colorHex: currentColor || '#D01012',
            colorIdx: 0,
            layerName: 'Base Plate',
            extruder: 1
        };
        baseMesh.position.z = 0;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Trace Letters
        const fontStr = `${currentFont}, 'Montserrat', sans-serif`;
        const { paths: textPaths } = extractTextContours(text, fontStr);

        if (textPaths && textPaths.length > 0) {
            const textClipper = new ClipperLib.Clipper();
            textClipper.AddPaths(textPaths, ClipperLib.PolyType.ptSubject, true);
            const textPolyTree = new ClipperLib.PolyTree();
            textClipper.Execute(ClipperLib.ClipType.ctUnion, textPolyTree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
            const letterExPolygons = ClipperLib.JS.PolyTreeToExPolygons(textPolyTree);
            const letterShapes = exPolygonsToThreeShapes(letterExPolygons, 0.001);

            if (letterShapes.length > 0) {
                const letterGeo = new THREE.ExtrudeGeometry(letterShapes, {
                    depth: 2.8,
                    bevelEnabled: true,
                    bevelThickness: 0.20,
                    bevelSize: 0.20,
                    bevelSegments: 2
                });
                const letterMat = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    roughness: 0.35,
                    metalness: 0.05
                });
                const letterMesh = new THREE.Mesh(letterGeo, letterMat);
                letterMesh.name = "2_White_Letters";
                letterMesh.userData = {
                    colorHex: '#FFFFFF',
                    colorIdx: 1,
                    layerName: 'White Letters',
                    extruder: 2
                };
                letterMesh.position.z = 3.2; // Placed on top of 3.2mm base
                letterMesh.castShadow = true;
                group.add(letterMesh);
            }
        }

        const bbox = new THREE.Box3().setFromObject(group);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        group.children.forEach(child => {
            child.position.x -= center.x;
            child.position.y -= center.y;
        });

        return group;
    }

    // ============================================================
    // 7. MODEL DISPATCHER & RENDER TRIGGER
    // ============================================================
    async function renderSolidModel() {
        if (spinner) spinner.style.display = 'flex';

        const params = {
            text: inputName ? inputName.value.trim() : 'LEGO',
            textSize: elTextSizeNum ? parseFloat(elTextSizeNum.value) : 18,
            baseThick: elBaseThickNum ? parseFloat(elBaseThickNum.value) : 3.2,
            letterThick: inputThickness ? parseFloat(inputThickness.value) : 0.8,
            outlineSize: elOutlineNum ? parseFloat(elOutlineNum.value) : 4.5,
            holeSize: elHoleSizeNum ? parseFloat(elHoleSizeNum.value) : 5.0,
            holeX: elHoleXNum ? parseFloat(elHoleXNum.value) : 3.0,
            holeY: elHoleYNum ? parseFloat(elHoleYNum.value) : 0.0,
            spaceWidth: elSpaceWidthNum ? parseFloat(elSpaceWidthNum.value) : 1.0
        };

        if (currentModelGroup) {
            scene.remove(currentModelGroup);
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

        if (currentTemplate === 'lego') {
            currentModelGroup = await buildLegoKeychain(params);
        } else {
            currentModelGroup = buildNameTag(params);
        }

        if (currentModelGroup) {
            scene.add(currentModelGroup);

            // Compute precise real-world dimensions in millimeters
            const box = new THREE.Box3().setFromObject(currentModelGroup);
            const size = new THREE.Vector3();
            box.getSize(size);
            params.actualWidth = size.x;  // Length (X)
            params.actualHeight = size.y; // Breadth/Width (Y)
            params.actualDepth = size.z;  // Total Height (Z)
        }

        updatePricing(params);

        if (spinner) {
            setTimeout(() => { spinner.style.display = 'none'; }, 60);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // ============================================================
    // 8. PRICING & WEIGHT CALCULATION WITH LIVE DIMENSIONS
    // ============================================================
    let lastDimensions = { width: '0.0', height: '0.0', depth: '6.0' };

    function updatePricing(params) {
        const textLen = (params.text || 'LEGO').length;
        const estGrams = Math.max(14, Math.round(textLen * 3.8 + 6));

        let finishMul = 1.0;
        if (currentFinish === 'silk') finishMul = 1.25;
        if (currentFinish === 'satin') finishMul = 1.20;
        if (currentFinish === 'neon') finishMul = 1.30;

        const baseFee = 280;
        const calculatedPrice = Math.round((baseFee + (estGrams * currentRate)) * finishMul);

        const totalW = params.actualWidth ? params.actualWidth.toFixed(1) : '0.0';
        const totalH = params.actualHeight ? params.actualHeight.toFixed(1) : '0.0';
        const totalD = params.actualDepth ? params.actualDepth.toFixed(1) : (parseFloat(params.baseThick || 3.2) + 2.0 + parseFloat(params.letterThick || 0.8)).toFixed(1);
        lastDimensions = { width: totalW, height: totalH, depth: totalD };

        const dimBadge = document.getElementById('stage-dimensions-badge');
        if (dimBadge) {
            dimBadge.textContent = `📐 ${totalW} × ${totalH} × ${totalD} mm`;
        }

        if (displayPrice) {
            displayPrice.textContent = `৳${calculatedPrice}`;
        }
        if (displaySpecs) {
            const modelNames = {
                lego: 'LEGO Keychain.scad',
                nametag: 'Customizable Name Tag.scad'
            };
            displaySpecs.textContent = `${modelNames[currentTemplate]} • ${currentColorName} • ~${estGrams}g PLA • 📐 ${totalW} × ${totalH} × ${totalD} mm`;
        }
    }

    // ============================================================
    // 9. 3MF & STL EXPORT (Direct 3D Print File Download)
    // ============================================================
    async function download3MF() {
        if (!currentModelGroup) {
            alert('3D Mesh not ready yet.');
            return;
        }
        if (typeof JSZip === 'undefined') {
            alert('JSZip library is still loading. Please try again in a moment.');
            return;
        }

        try {
            if (spinner) {
                spinner.style.display = 'flex';
                const spinnerText = spinner.querySelector('span');
                if (spinnerText) spinnerText.textContent = 'Packaging Multi-Color 3MF...';
            }

            const zip = new JSZip();

            // 1. [Content_Types].xml
            zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
  <Default Extension="config" ContentType="text/xml"/>
</Types>`);

            // 2. _rels/.rels
            zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`);

            // Gather all solid sub-meshes
            const meshes = [];
            currentModelGroup.traverse(child => {
                if (child.isMesh && child.geometry) {
                    meshes.push(child);
                }
            });

            if (meshes.length === 0) {
                alert('No 3D mesh geometry found.');
                if (spinner) spinner.style.display = 'none';
                return;
            }

            // Sort by extruder number (1 -> Base, 2 -> Yellow, 3 -> Black, 4 -> White)
            meshes.sort((a, b) => ((a.userData && a.userData.extruder) || 0) - ((b.userData && b.userData.extruder) || 0));

            // Palette definitions
            const colorDefs = [];
            meshes.forEach(m => {
                let hex = (m.userData && m.userData.colorHex) || '#DA291C';
                if (!hex.startsWith('#')) hex = '#' + hex;
                if (hex.length === 7) hex = hex + 'FF';
                colorDefs.push(`      <m:color color="${hex.toUpperCase()}"/>`);
            });

            let nextId = 2;
            const objectXmls = [];
            const buildItems = [];
            const configObjects = [];

            meshes.forEach((mesh, index) => {
                const objId = nextId++;
                const name = mesh.name || `Layer_${index + 1}`;
                const colorIdx = index;
                const extruder = (mesh.userData && mesh.userData.extruder) || (index + 1);

                // 100% Watertight Closed Manifold Mesh Welder
                const geo = mesh.geometry;
                const posAttr = geo.attributes.position;
                mesh.updateMatrixWorld(true);
                const matrix = mesh.matrixWorld;

                const precision = 10000; // 0.0001 mm
                const map = new Map();
                const vList = [];
                const tList = [];
                const v = new THREE.Vector3();

                if (geo.index) {
                    const idx = geo.index;
                    for (let i = 0; i < idx.count; i++) {
                        v.fromBufferAttribute(posAttr, idx.getX(i));
                        v.applyMatrix4(matrix);

                        const rx = Math.round(v.x * precision);
                        const ry = Math.round(v.y * precision);
                        const rz = Math.round(v.z * precision);
                        const k = `${rx}_${ry}_${rz}`;

                        let vi;
                        if (map.has(k)) {
                            vi = map.get(k);
                        } else {
                            vi = vList.length;
                            map.set(k, vi);
                            vList.push({ x: v.x, y: v.y, z: v.z });
                        }
                        tList.push(vi);
                    }
                } else {
                    for (let i = 0; i < posAttr.count; i++) {
                        v.fromBufferAttribute(posAttr, i);
                        v.applyMatrix4(matrix);

                        const rx = Math.round(v.x * precision);
                        const ry = Math.round(v.y * precision);
                        const rz = Math.round(v.z * precision);
                        const k = `${rx}_${ry}_${rz}`;

                        let vi;
                        if (map.has(k)) {
                            vi = map.get(k);
                        } else {
                            vi = vList.length;
                            map.set(k, vi);
                            vList.push({ x: v.x, y: v.y, z: v.z });
                        }
                        tList.push(vi);
                    }
                }

                // Filter out degenerate faces where area is 0
                const validTriangles = [];
                for (let i = 0; i < tList.length; i += 3) {
                    const a = tList[i];
                    const b = tList[i + 1];
                    const c = tList[i + 2];
                    if (a !== b && b !== c && a !== c) {
                        validTriangles.push(a, b, c);
                    }
                }

                const vXml = vList.map(pt =>
                    `          <vertex x="${pt.x.toFixed(4)}" y="${pt.y.toFixed(4)}" z="${pt.z.toFixed(4)}"/>`
                ).join('\n');

                const tXml = [];
                for (let i = 0; i < validTriangles.length; i += 3) {
                    const a = validTriangles[i];
                    const b = validTriangles[i + 1];
                    const c = validTriangles[i + 2];
                    tXml.push(`          <triangle v1="${a}" v2="${b}" v3="${c}" pid="1" p1="${colorIdx}"/>`);
                }

                objectXmls.push(`    <object id="${objId}" type="model" name="${name}" pid="1" pindex="${colorIdx}">
      <mesh>
        <vertices>
${vXml}
        </vertices>
        <triangles>
${tXml.join('\n')}
        </triangles>
      </mesh>
    </object>`);

                buildItems.push(`    <item objectid="${objId}"/>`);

                configObjects.push(`  <object id="${objId}">
    <metadata key="name" value="${name}"/>
    <metadata key="extruder" value="${extruder}"/>
  </object>`);
            });

            const rawName = (inputName ? inputName.value : 'LEGO').trim() || 'LEGO';
            const assemblyName = `${rawName}_Keychain`;

            const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/07" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021">
  <metadata name="Title">${assemblyName}</metadata>
  <metadata name="Designer">Kira's Creation Soft-3D Studio</metadata>
  <metadata name="Application">MakerLab Parametric Studio</metadata>
  <resources>
    <m:colorgroup id="1">
${colorDefs.join('\n')}
    </m:colorgroup>
${objectXmls.join('\n')}
  </resources>
  <build>
${buildItems.join('\n')}
  </build>
</model>`;

            zip.folder('3D').file('3dmodel.model', modelXml);

            // Bambu Studio & OrcaSlicer multi-color auto-assignment metadata
            const modelSettingsConfig = `<?xml version="1.0" encoding="UTF-8"?>
<config>
${configObjects.join('\n')}
  <plate>
    <metadata key="plater_id" value="1"/>
    <metadata key="plater_name" value=""/>
    <metadata key="locked" value="false"/>
  </plate>
</config>`;

            zip.folder('Metadata').file('model_settings.config', modelSettingsConfig);

            const blob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const textClean = rawName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'keychain';
            link.download = `${textClean}_${currentTemplate}_multicolor.3mf`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('Error generating 3MF:', err);
            alert('Failed to generate 3MF file: ' + err.message);
        } finally {
            if (spinner) {
                spinner.style.display = 'none';
                const spinnerText = spinner.querySelector('span');
                if (spinnerText) spinnerText.textContent = 'Generating Solid Mesh...';
            }
        }
    }

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
        link.download = `${textClean}_${currentTemplate}_6mm_print_ready.stl`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    if (btnExport3mf) {
        btnExport3mf.addEventListener('click', download3MF);
    }
    if (btnExportStl) {
        btnExportStl.addEventListener('click', downloadSTL);
    }

    // ============================================================
    // 10. OPENSCAD CODE GENERATOR & MODAL
    // ============================================================
    function generateOpenSCADCode() {
        const text = inputName ? inputName.value.trim() : 'LEGO';
        const outlineSize = elOutlineNum ? elOutlineNum.value : '4.5';
        const holeSize = elHoleSizeNum ? elHoleSizeNum.value : '5.0';
        const holeX = elHoleXNum ? elHoleXNum.value : '3.0';
        const holeY = elHoleYNum ? elHoleYNum.value : '0.0';
        const baseThick = elBaseThickNum ? parseFloat(elBaseThickNum.value).toFixed(1) : '3.2';
        const letterThick = inputThickness ? parseFloat(inputThickness.value).toFixed(1) : '0.8';
        const yellowZ = parseFloat(baseThick).toFixed(1);
        const blackZ = (parseFloat(baseThick) + 1.0).toFixed(1);
        const whiteZ = (parseFloat(baseThick) + 2.0).toFixed(1);
        const totalHeight = (parseFloat(baseThick) + 2.0 + parseFloat(letterThick)).toFixed(1);

        if (currentTemplate === 'lego') {
            return `// ============================================================
// Parametric LEGO Keychain — Generated by Kira's Creation Studio
// Total Height: ${totalHeight} mm (4 Color Layers)
// 0.0mm -> ${yellowZ}mm: Base Color Plate
// ${yellowZ}mm -> ${blackZ}mm: Yellow Accent
// ${blackZ}mm -> ${whiteZ}mm: Black Outline
// ${whiteZ}mm -> ${totalHeight}mm: White Raised Text
// ============================================================

$fn = 60;
nome = "${text}";
tamanho = 20;
fonte = "Liberation Sans:style=Bold Italic";

module text_2d() {
    text(nome, size = tamanho, font = fonte, halign = "center", valign = "center");
}

eyelet_x = -len(nome) * tamanho * 0.38 - 8 - ${holeX};
eyelet_y = ${holeY};
eyelet_r_outer = 7.0;
eyelet_r_inner = ${holeSize} / 2;

// 1. Base Plate (0.0mm -> ${yellowZ}mm, Height = ${baseThick}mm)
color("${currentColor}") linear_extrude(height = ${baseThick}) {
    difference() {
        union() {
            offset(r = ${outlineSize}) text_2d();
            translate([eyelet_x, eyelet_y]) circle(r = eyelet_r_outer);
        }
        translate([eyelet_x, eyelet_y]) circle(r = eyelet_r_inner);
    }
}

// 2. Yellow Accent (${yellowZ}mm -> ${blackZ}mm, Height = 1.0mm)
color("#FFD700") translate([0, 0, ${yellowZ}]) linear_extrude(height = 1.0) {
    offset(r = max(1.5, ${outlineSize} - 1.5)) text_2d();
}

// 3. Black Outline (${blackZ}mm -> ${whiteZ}mm, Height = 1.0mm)
color("#111111") translate([0, 0, ${blackZ}]) linear_extrude(height = 1.0) {
    offset(r = 1.6) text_2d();
}

// 4. White Raised Text (${whiteZ}mm -> ${totalHeight}mm, Height = ${letterThick}mm)
color("#FFFFFF") translate([0, 0, ${whiteZ}]) linear_extrude(height = ${letterThick}) {
    text_2d();
}
`;
        } else {
            return `// ============================================================
// Customizable Name Tag.scad
// ============================================================

nome = "${text}";
tamanho = 20;
fonte = "Liberation Sans:style=Bold";

module tag_plate() {
    difference() {
        minkowski() {
            square([len(nome)*tamanho*0.7 + 16, tamanho*1.8 + 12], center=true);
            circle(r=5);
        }
        translate([0, (tamanho*1.8 + 12)/2 - 3])
            minkowski() { square([10, 2], center=true); circle(r=1.5); }
    }
}

color("${currentColor}") linear_extrude(height = 3.2) tag_plate();
color("#FFFFFF") translate([0, -2, 3.2]) linear_extrude(height = 2.8)
    text(nome, size = tamanho, font = fonte, halign = "center", valign = "center");
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
    // 11. CONTROLS SYNCHRONIZATION & EVENT LISTENERS
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

    if (inputName) {
        inputName.addEventListener('input', () => {
            renderSolidModel();
        });
        inputName.addEventListener('change', () => {
            saveHistoryState();
        });
    }

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
            currentFont = pill.dataset.font || "'Nunito', sans-serif";
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
                nametag: '🏷️ NAME TAG'
            };
            if (templateBadge) templateBadge.textContent = badgeTexts[currentTemplate] || '🧊 3D MODEL';
            camera.up.set(0, 0, 1);
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 3);
            controls.update();
            saveHistoryState();
            renderSolidModel();
        });
    }

    // Reset Camera View Button
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            camera.up.set(0, 0, 1);
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 3);
            controls.update();
        });
    }

    // Undo Last Change
    if (btnUndoScad) {
        btnUndoScad.addEventListener('click', () => {
            if (stateHistory.length > 1) {
                stateHistory.pop();
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
            if (elBaseThickNum) { elBaseThickNum.value = '3.2'; if (elBaseThickSlider) elBaseThickSlider.value = '3.2'; }
            if (elTextSizeNum) { elTextSizeNum.value = '18'; if (elTextSizeSlider) elTextSizeSlider.value = '18'; }
            if (inputThickness) { inputThickness.value = '0.8'; if (elLetterThickSlider) elLetterThickSlider.value = '0.8'; }
            if (elHoleSizeNum) { elHoleSizeNum.value = '5.0'; if (elHoleSizeSlider) elHoleSizeSlider.value = '5.0'; }
            if (elHoleXNum) { elHoleXNum.value = '3.0'; if (elHoleXSlider) elHoleXSlider.value = '3.0'; }
            if (elHoleYNum) { elHoleYNum.value = '0.0'; if (elHoleYSlider) elHoleYSlider.value = '0.0'; }
            if (elSpaceWidthNum) { elSpaceWidthNum.value = '1.0'; if (elSpaceWidthSlider) elSpaceWidthSlider.value = '1.0'; }
            camera.up.set(0, 0, 1);
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 3);
            controls.update();
            saveHistoryState();
            renderSolidModel();
        });
    }

    if (btnDownload3mfPanel) {
        btnDownload3mfPanel.addEventListener('click', download3MF);
    }

    if (btnDownloadStlPanel) {
        btnDownloadStlPanel.addEventListener('click', downloadSTL);
    }

    // Cart Integration
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            renderer.render(scene, camera);
            const snapshot = renderer.domElement.toDataURL('image/webp', 0.85);

            const priceText = displayPrice ? displayPrice.textContent.replace('৳', '') : '350';
            const price = parseInt(priceText, 10) || 350;

            const modelTitles = {
                lego: 'LEGO Keychain.scad (4-Layer 6.0mm)',
                nametag: 'Customizable Name Tag.scad'
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
                    height: '6.0mm Multi-Color (3.2mm Red Base + 1.0mm Yellow + 1.0mm Black + 0.8mm White)'
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

    // Wait for Google Fonts to be ready, then render
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            saveHistoryState();
            renderSolidModel();
        });
    } else {
        saveHistoryState();
        renderSolidModel();
    }
});