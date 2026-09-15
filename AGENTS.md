# AGENTS.md - Kira's Creation Soft-3D Studio Briefing & Architecture Guide

> **Target Audience:** Future AI Agents (Antigravity, Claude, Cursor, Copilot) & Human Engineering Assistants.  
> **Last Synchronized:** September 15, 2026  
> **Repository:** `https://github.com/Muhammadibrahim543/3d-website.git` (branch: `main`)  
> **Language Policy:** User communications must always be conducted in **Bengali (বাংলা)** unless explicitly asked otherwise.

---

## 1. Executive Summary & Project Identity

**Kira's Creation Soft-3D Studio** is an advanced e-commerce platform and real-time in-browser 3D printing customizer based in Dhaka, Bangladesh. The website allows users to browse an extensive portfolio of custom 3D printed items, order personalized prints, and interactively generate custom, print-ready 3D CAD models (LEGO Keychains and Customizable Name Tags) in real time with live parametric 3MF/STL export and OpenSCAD code generation.

---

## 2. Technology Stack & Design Principles

| Layer | Technologies | Architectural Notes |
| :--- | :--- | :--- |
| **Markup & Core** | Vanilla HTML5, ES6+ JavaScript | Zero bundler overhead. Runs natively in any static web server. |
| **Styling & Theme** | Vanilla CSS3 (Custom Properties) | Claymorphic tactile design, ACES Filmic lighting, Light/Dark theme switch with localStorage persistence. |
| **3D CAD Engine** | Three.js (r128+), WebGL | CAD standard Z-Up orientation, ACES Filmic tone mapping, PBR roughness/metalness, directional soft shadows. |
| **2D Geometry & Offsets** | ClipperLib (`js/clipper.js`) | Exact 2D polygon offsetting (Minkowski dilation), Boolean unions/differences, Chaikin corner-cutting. |
| **Multi-Color 3MF & STL** | JSZip (`js/jszip.min.js`), Three STLExporter | Closed manifold mesh welder (0.0001mm precision), Bambu Studio 3MF XML packaging with multi-extruder assignments. |
| **State & Persistence** | LocalStorage, SessionStorage | LocalStorage cart (`KiraCart`), admin order queue, user presets, undo/redo state history stack (25 steps). |
| **Internationalization** | `js/translations.js` | Bilingual support (English & Bengali) toggled via `.lang-toggle-btn`. |

---

## 3. Project Directory Map

```text
3d-printing-benchmark/gemini-3-5/
├── index.html              # Homepage with hero section, process, featured prints, and CTA
├── customize.html          # Real-time 3D Solid CAD Customizer (LEGO & Name Tag models)
├── portfolio.html          # Shape Gallery & Commission Showcase with deep-link sharing
├── pricing.html            # Pricing tiers, hourly print rates, and service options
├── services.html           # 3D modeling, rapid prototyping, and batch manufacturing details
├── materials.html          # PLA+, PETG, Silk, Resin, TPU specs and temperature/flexibility guide
├── about.html              # Studio story, equipment overview, and creator philosophy
├── contact.html            # Instant quote request form and direct contact details
├── account.html            # User profile, saved 3D customizer presets, and order history
├── admin.html              # Operations portal (PIN: 1234), Orders, Products, Users, Walkthrough
├── walkthrough.html        # Interactive in-browser Project Walkthrough & Architecture Hub
│
├── css/
│   ├── base.css            # Typography, CSS variables, resets, color palette, dark mode tokens
│   ├── components.css      # Claymorphism cards, buttons, badges, navbars, modals, drawer styles
│   ├── customize.css       # 3D stage layout, dual-pane customizer UI, swatches, steppers, accordions
│   ├── pages.css           # Page-specific layouts (portfolio grid, pricing tables, admin tables)
│   └── animations.css      # Smooth micro-interactions, floating clay animations, ripple effects
│
├── js/
│   ├── customize.js        # Core 3D CAD engine (Three.js + ClipperLib + 3MF/STL exporter + OpenSCAD)
│   ├── clipper.js          # ClipperLib geometric library for polygon clipping & offsetting
│   ├── main.js             # Theme toggle, mobile hamburger menu, navbar scroll effects, i18n
│   ├── cart.js             # KiraCart shopping cart engine with drawer UI and checkout integration
│   ├── admin.js            # Admin dashboard logic, PIN lock, order manager, product CRUD, CSV export
│   ├── portfolio.js        # Gallery filtering, modal image preview, dynamic URL sharing
│   ├── translations.js     # Bilingual dictionary (EN / BN) for all dynamic elements
│   ├── jszip.min.js        # Zip library for building multi-color .3mf archive files
│   └── three/
│       ├── three.min.js    # Three.js 3D library
│       ├── OrbitControls.js# 360-degree interactive camera orbit controller
│       └── STLExporter.js  # Binary STL generator for 3D printer slicing
│
├── images/                 # Optimized WebP product photography and material textures
├── fonts/                  # Custom web fonts and vector glyph definitions
├── AGENTS.md               # Master AI Agent & Developer briefing document (This file)
├── PROJECT_WALKTHROUGH.md  # Exhaustive chronological trajectory & architectural reference
└── package.json            # Node project configuration and development server scripts
```

---

## 4. Current State Audit (Where the Project Paused)

### ✅ Completed & Fully Functional Features:
1. **LEGO Keychain 4-Layer 6.0mm Elevation Architecture (`LEGO Keychain.scad`):**
   - **Layer 1 (Red Base Plate):** $Z = 0.0 \to 3.2\text{ mm}$ (3.2mm thick).
   - **Layer 2 (Yellow Accent Brim):** $Z = 3.2 \to 4.2\text{ mm}$ (1.0mm thick).
   - **Layer 3 (Black Border Outline):** $Z = 4.2 \to 5.2\text{ mm}$ (1.0mm thick).
   - **Layer 4 (White Raised Letters):** $Z = 5.2 \to 6.0\text{ mm}$ (0.8mm thick).
   - Integrated left circular eyelet with through-hole.
   - Exact 12° italic slant applied exclusively to the LEGO model.

2. **Customizable Name Tag Engine (`Customizable Name Tag.scad`):**
   - **Organic Base Contour:** Powered by `ClipperLib` polygon offsetting (`jtRound`), organically wrapping around letters without disjoint islands or square boxes.
   - **3 Outline Styles:** 🫧 `Bubble Contour`, 💊 `Capsule Badge`, 📐 `Modern Chamfer`.
   - **Zero Font Mismatch:** Asynchronous font loader (`document.fonts.load`) respecting true Google Font weights (`Montserrat`, `Nunito`, `Orbitron`, `Fredoka`, `Baloo 2`, `Lilita One`, `Chewy`, `Lobster`, `Pacifico`, `Righteous`, `Bubblegum Sans`).
   - **Upright Typography:** 12° slant removed for Name Tag (letters extrude straight and true).
   - **Two-Tone Color Swatches:** Primary Base Color + Secondary Raised Letter Color.
   - **Hole Placement Control:** Left Eyelet, Right Eyelet, or None (Desk Display Tag).

3. **Export & Fabrication Parity:**
   - **Bambu Studio Multi-Color 3MF:** Generates watertight closed manifold triangle meshes partitioned by extruder ID for seamless AMS multi-color printing.
   - **Binary STL Export:** Single-solid watertight mesh for standard single-color slicing.
   - **Parametric OpenSCAD Code Modal:** Generates clean, copyable OpenSCAD code matching active 3D parameters.

4. **UI Bloat Cleanup:**
   - The heavy 2D Visual Layout Studio modal window and element additives (hearts, stars, flowers, paws) were **completely removed** as requested by the user to eliminate memory lag and browser stutter.

5. **Universal Navigation Consistency:**
   - All 10 HTML pages now have uniform navigation bars with `Customize` link in both desktop and mobile menus.

---

## 5. Critical Constraints for Future Agents

> [!CAUTION]
> **1. DO NOT Re-introduce Heavy 2D Canvas Modals or Additive Elements:**
> The user explicitly instructed to keep the customizer fast and lightweight. Do not re-add 2D canvas drag-and-drop toolbars or shape additives without explicit user consent.

> [!IMPORTANT]
> **2. Preserve LEGO 4-Layer Mathematical Heights:**
> Never collapse the 4-layer stepped hierarchy ($0 \to 3.2 \to 4.2 \to 5.2 \to 6.0\text{ mm}$). This exact elevation is critical for Bambu Lab AMS filament swap layers.

> [!IMPORTANT]
> **3. Maintain Font Weight Matching (`getFontWeight`):**
> When adding new fonts, register their exact weight in `getFontWeight(fontStr)` in `js/customize.js` to prevent browser fallback to system serif/sans-serif.

> [!TIP]
> **4. Git & Commit Best Practices:**
> Always verify with `git status` and test locally before pushing to `origin/main`. Keep commit messages descriptive (e.g. `feat: ...`, `fix: ...`).

---

## 6. Next Planned Milestones (Ready for Continuation)

1. **Additional SCAD Templates:**
   - Template 3: `Desk Nameplate with Stand.scad` (Angled 45° desktop nameplate with snap-fit stand legs).
   - Template 4: `Dual-Extrusion Luggage Tag.scad` (Front name tag + reverse contact card slot).
2. **Preset Sharing via URL Hash:**
   - Compress customizer parameters into a base64 or URL query string for 1-click sharing of customized tags.
3. **Automated Cloud Slicing Integration:**
   - Optional webhook to PrusaSlicer/Bambu CLI for automated print time and filament weight estimation.
