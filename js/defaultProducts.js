const defaultProducts = [
    {
        "id": "PROD-OLD-1",
        "category": "lamps",
        "desc": "Layered bamboo PLA structure with internal diffused warm white LED illumination.",
        "descKey": "cs2_desc",
        "image": "images/torii_gate_lamp.webp",
        "badge": "✨ Lightbox",
        "badgeI18n": "cs2_badge",
        "categoryLabel": "Lighting & Lamps",
        "categoryI18n": "filter_lamps",
        "name": "Japanese Torii Gate Ambient Lightbox",
        "titleI18n": "cs2_title",
        "specs": [
            {
                "text": "PLA Plastic",
                "i18n": ""
            },
            {
                "text": "0.16mm Layer",
                "i18n": ""
            },
            {
                "text": "LED Backlit",
                "i18n": ""
            }
        ],
        "price": "৳1200",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-2",
        "category": "lamps",
        "desc": "Intricate geometric relief patterns projecting intricate shadow patterns on surrounding walls.",
        "descKey": "",
        "image": "images/mandala_cube_lamp.webp",
        "badge": "💡 Lightbox",
        "badgeI18n": "",
        "categoryLabel": "Lighting & Lamps",
        "categoryI18n": "filter_lamps",
        "name": "Mandala Geometric Light Cube",
        "titleI18n": "",
        "specs": [
            {
                "text": "Matte Black & Gold",
                "i18n": ""
            },
            {
                "text": "5V USB LED",
                "i18n": ""
            },
            {
                "text": "High Contrast",
                "i18n": ""
            }
        ],
        "price": "৳1200",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-3",
        "category": "functional",
        "desc": "",
        "descKey": "g1_desc",
        "image": "images/Gemini_Generated_Image_1ojrbw1ojrbw1ojr-01.webp",
        "badge": "📱 Desk Accessory",
        "badgeI18n": "g1_badge",
        "categoryLabel": "Functional & Accessories",
        "categoryI18n": "g1_cat",
        "name": "Leaf Motif Ergonomic Phone Stand",
        "titleI18n": "g1_title",
        "specs": [
            {
                "text": "White & Black PLA",
                "i18n": "g1_spec1"
            },
            {
                "text": "Leaf Cutout",
                "i18n": "g1_spec2"
            },
            {
                "text": "Non-Slip Dock",
                "i18n": "g1_spec3"
            }
        ],
        "price": "৳300",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-4",
        "category": "custom",
        "desc": "",
        "descKey": "g2_desc",
        "image": "images/Gemini_Generated_Image_4js4rx4js4rx4js4-01.webp",
        "badge": "🧩 Mechanical Puzzle",
        "badgeI18n": "g2_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g2_cat",
        "name": "Dual-Color Mechanical Interlocking Cube",
        "titleI18n": "g2_title",
        "specs": [
            {
                "text": "Red & Silk Bronze",
                "i18n": "g2_spec1"
            },
            {
                "text": "Print-in-Place",
                "i18n": "g2_spec2"
            },
            {
                "text": "Tactile Gears",
                "i18n": "g2_spec3"
            }
        ],
        "price": "৳300",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-5",
        "category": "art",
        "desc": "",
        "descKey": "g3_desc",
        "image": "images/Gemini_Generated_Image_5fbyv05fbyv05fby-01.webp",
        "badge": "🏔️ Landscape Art",
        "badgeI18n": "g3_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g3_cat",
        "name": "Twin Geometry Mountain & Waterfall Silhouette",
        "titleI18n": "g3_title",
        "specs": [
            {
                "text": "Matte Black PLA",
                "i18n": "g3_spec1"
            },
            {
                "text": "Diamond Frame",
                "i18n": "g3_spec2"
            },
            {
                "text": "Wall & Table Decor",
                "i18n": "g3_spec3"
            }
        ],
        "price": "৳150",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-6",
        "category": "art",
        "desc": "",
        "descKey": "g4_desc",
        "image": "images/Gemini_Generated_Image_8vm6n18vm6n18vm6-01.webp",
        "badge": "🏛️ Fluted Decor",
        "badgeI18n": "g4_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g4_cat",
        "name": "Architectural Fluted Cylinder Vase",
        "titleI18n": "g4_title",
        "specs": [
            {
                "text": "Silk Bronze Finish",
                "i18n": "g4_spec1"
            },
            {
                "text": "Vertical Ribbing",
                "i18n": "g4_spec2"
            },
            {
                "text": "Modern Tabletop",
                "i18n": "g4_spec3"
            }
        ],
        "price": "৳180",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-7",
        "category": "art",
        "desc": "",
        "descKey": "g5_desc",
        "image": "images/Gemini_Generated_Image_b110ivb110ivb110-02.webp",
        "badge": "⏳ Spiral Sculpture",
        "badgeI18n": "g5_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g5_cat",
        "name": "Mathematical Twisted Hourglass Stand",
        "titleI18n": "g5_title",
        "specs": [
            {
                "text": "Pure White PLA",
                "i18n": "g5_spec1"
            },
            {
                "text": "Parametric Curves",
                "i18n": "g5_spec2"
            },
            {
                "text": "Minimalist Art",
                "i18n": "g5_spec3"
            }
        ],
        "price": "৳750",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-8",
        "category": "art",
        "desc": "",
        "descKey": "g6_desc",
        "image": "images/Gemini_Generated_Image_c3sxjac3sxjac3sx-01.webp",
        "badge": "☯️ Yin-Yang Set",
        "badgeI18n": "g6_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g6_cat",
        "name": "Contrast Ribbed Spiral Mini Vases Pair",
        "titleI18n": "g6_title",
        "specs": [
            {
                "text": "Black & Ivory Pair",
                "i18n": "g6_spec1"
            },
            {
                "text": "Swirling Waves",
                "i18n": "g6_spec2"
            },
            {
                "text": "Companion Set",
                "i18n": "g6_spec3"
            }
        ],
        "price": "৳350",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-9",
        "category": "art",
        "desc": "",
        "descKey": "g7_desc",
        "image": "images/Gemini_Generated_Image_c4t7vyc4t7vyc4t7-01.webp",
        "badge": "⛩️ Zen Silhouette",
        "badgeI18n": "g7_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g7_cat",
        "name": "Oriental Pagoda & Bonsai Moon Plaque",
        "titleI18n": "g7_title",
        "specs": [
            {
                "text": "Jet Black PLA",
                "i18n": "g7_spec1"
            },
            {
                "text": "Circular Crescent",
                "i18n": "g7_spec2"
            },
            {
                "text": "Japanese Pagoda",
                "i18n": "g7_spec3"
            }
        ],
        "price": "৳220",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-10",
        "category": "art",
        "desc": "",
        "descKey": "g8_desc",
        "image": "images/Gemini_Generated_Image_ddrleuddrleuddrl-01.webp",
        "badge": "☪️ Islamic Art",
        "badgeI18n": "g8_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g8_cat",
        "name": "3D Arabic Calligraphy Surah Al-Falaq Plaque",
        "titleI18n": "g8_title",
        "specs": [
            {
                "text": "Cream & Wood Grain",
                "i18n": "g8_spec1"
            },
            {
                "text": "3D Relief",
                "i18n": "g8_spec2"
            },
            {
                "text": "Surah Al-Falaq",
                "i18n": "g8_spec3"
            }
        ],
        "price": "৳550",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-11",
        "category": "art",
        "desc": "",
        "descKey": "g9_desc",
        "image": "images/Gemini_Generated_Image_dtoe8idtoe8idtoe-01.webp",
        "badge": "🌷 Voronoi Flowers",
        "badgeI18n": "g9_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g9_cat",
        "name": "Voronoi Mesh Vase with 3D Printed Tulips",
        "titleI18n": "g9_title",
        "specs": [
            {
                "text": "Black Voronoi Cage",
                "i18n": "g9_spec1"
            },
            {
                "text": "3 Color Tulips",
                "i18n": "g9_spec2"
            },
            {
                "text": "Eco Bio-PLA",
                "i18n": "g9_spec3"
            }
        ],
        "price": "৳1700",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-12",
        "category": "custom",
        "desc": "",
        "descKey": "g10_desc",
        "image": "images/Gemini_Generated_Image_fd44sofd44sofd44-01.webp",
        "badge": "🏷️ Pet & Name Tags",
        "badgeI18n": "g10_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g10_cat",
        "name": "Custom Dual-Color Pet & Keychain Name Tags",
        "titleI18n": "g10_title",
        "specs": [
            {
                "text": "Multi-Color PLA",
                "i18n": "g10_spec1"
            },
            {
                "text": "Raised Text",
                "i18n": "g10_spec2"
            },
            {
                "text": "Custom Names",
                "i18n": "g10_spec3"
            }
        ],
        "price": "৳30",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-13",
        "category": "custom",
        "desc": "",
        "descKey": "g11_desc",
        "image": "images/Gemini_Generated_Image_gp0bdsgp0bdsgp0b-01.webp",
        "badge": "🎖️ Desk Plaque",
        "badgeI18n": "g11_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g11_cat",
        "name": "16 December Ibrahim Victory Badge Stand",
        "titleI18n": "g11_title",
        "specs": [
            {
                "text": "Cyan Blue & Charcoal",
                "i18n": "g11_spec1"
            },
            {
                "text": "Curved Arch",
                "i18n": "g11_spec2"
            },
            {
                "text": "Victory Day Plaque",
                "i18n": "g11_spec3"
            }
        ],
        "price": "৳450",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-14",
        "category": "art",
        "desc": "",
        "descKey": "g12_desc",
        "image": "images/Gemini_Generated_Image_hug452hug452hug4-02.webp",
        "badge": "🏛️ Architecture",
        "badgeI18n": "g12_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g12_cat",
        "name": "Miniature Gothic Village Chapel Replica",
        "titleI18n": "g12_title",
        "specs": [
            {
                "text": "Dark Graphite PLA",
                "i18n": "g12_spec1"
            },
            {
                "text": "0.10mm Detail",
                "i18n": "g12_spec2"
            },
            {
                "text": "Shingle Roof",
                "i18n": "g12_spec3"
            }
        ],
        "price": "৳250",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-15",
        "category": "lamps",
        "desc": "",
        "descKey": "g13_desc",
        "image": "images/Gemini_Generated_Image_j08u0nj08u0nj08u-01.webp",
        "badge": "🏮 Ambient Lamp",
        "badgeI18n": "g13_badge",
        "categoryLabel": "Lighting & Lamps",
        "categoryI18n": "g13_cat",
        "name": "Traditional Japanese Shoji Wood Frame Lantern",
        "titleI18n": "g13_title",
        "specs": [
            {
                "text": "Silk Wood PLA",
                "i18n": "g13_spec1"
            },
            {
                "text": "Warm LED Light",
                "i18n": "g13_spec2"
            },
            {
                "text": "Shoji Grid",
                "i18n": "g13_spec3"
            }
        ],
        "price": "৳650",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-16",
        "category": "custom",
        "desc": "",
        "descKey": "g14_desc",
        "image": "images/Gemini_Generated_Image_kch6a8kch6a8kch6-01.webp",
        "badge": "🔑 Custom Logo",
        "badgeI18n": "g14_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g14_cat",
        "name": "HUNTRAX Custom Brand Emblem Keychain",
        "titleI18n": "g14_title",
        "specs": [
            {
                "text": "Ivory White & Black",
                "i18n": "g14_spec1"
            },
            {
                "text": "High Contrast",
                "i18n": "g14_spec2"
            },
            {
                "text": "Brand Keyring",
                "i18n": "g14_spec3"
            }
        ],
        "price": "৳150",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-17",
        "category": "custom",
        "desc": "",
        "descKey": "g15_desc",
        "image": "images/Gemini_Generated_Image_l6dnmdl6dnmdl6dn-01.webp",
        "badge": "🇧🇩 Bengali Name Tag",
        "badgeI18n": "g15_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g15_cat",
        "name": "Personalized Bengali & English Name Keychains",
        "titleI18n": "g15_title",
        "specs": [
            {
                "text": "Red & Black PLA",
                "i18n": "g15_spec1"
            },
            {
                "text": "Bengali Script",
                "i18n": "g15_spec2"
            },
            {
                "text": "Custom Names",
                "i18n": "g15_spec3"
            }
        ],
        "price": "৳120",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-18",
        "category": "custom",
        "desc": "",
        "descKey": "g16_desc",
        "image": "images/Gemini_Generated_Image_nrbc2bnrbc2bnrbc-01.webp",
        "badge": "🛡️ Fan Art Plaque",
        "badgeI18n": "g16_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g16_cat",
        "name": "K-Pop Demon Hunters 3D Emblem Plaque",
        "titleI18n": "g16_title",
        "specs": [
            {
                "text": "White & Black PLA",
                "i18n": "g16_spec1"
            },
            {
                "text": "Bold Typography",
                "i18n": "g16_spec2"
            },
            {
                "text": "Fan Emblem",
                "i18n": "g16_spec3"
            }
        ],
        "price": "৳250",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-19",
        "category": "functional",
        "desc": "",
        "descKey": "g17_desc",
        "image": "images/Gemini_Generated_Image_s9fhbqs9fhbqs9fh-01.webp",
        "badge": "🍃 Home Accessory",
        "badgeI18n": "g17_badge",
        "categoryLabel": "Functional & Accessories",
        "categoryI18n": "g17_cat",
        "name": "Dual-Layer Leaf Drainage Soap & Trinket Tray",
        "titleI18n": "g17_title",
        "specs": [
            {
                "text": "Sky Blue & White",
                "i18n": "g17_spec1"
            },
            {
                "text": "Slotted Drainage",
                "i18n": "g17_spec2"
            },
            {
                "text": "Leaf Outline",
                "i18n": "g17_spec3"
            }
        ],
        "price": "৳350",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-20",
        "category": "custom",
        "desc": "",
        "descKey": "g18_desc",
        "image": "images/Gemini_Generated_Image_smt185smt185smt1-01.webp",
        "badge": "🏆 Desk Stand",
        "badgeI18n": "g18_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g18_cat",
        "name": "16 December Ibrahim Wide Desk Plaque",
        "titleI18n": "g18_title",
        "specs": [
            {
                "text": "Ocean Blue & Charcoal",
                "i18n": "g18_spec1"
            },
            {
                "text": "Wide Arch",
                "i18n": "g18_spec2"
            },
            {
                "text": "Memorial Plaque",
                "i18n": "g18_spec3"
            }
        ],
        "price": "৳450",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-21",
        "category": "functional",
        "desc": "",
        "descKey": "g19_desc",
        "image": "images/Gemini_Generated_Image_t9t4u5t9t4u5t9t4-01.webp",
        "badge": "⚡ Electronics Case",
        "badgeI18n": "g19_badge",
        "categoryLabel": "Functional & Accessories",
        "categoryI18n": "g19_cat",
        "name": "ESP32 Microcontroller Sliding Case Box",
        "titleI18n": "g19_title",
        "specs": [
            {
                "text": "Silk Copper PLA",
                "i18n": "g19_spec1"
            },
            {
                "text": "Sliding Lid",
                "i18n": "g19_spec2"
            },
            {
                "text": "Tactile Switch Port",
                "i18n": "g19_spec3"
            }
        ],
        "price": "৳150",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-22",
        "category": "functional",
        "desc": "",
        "descKey": "g20_desc",
        "image": "images/Gemini_Generated_Image_tbyh3ltbyh3ltbyh-01.webp",
        "badge": "🎲 Fidget Toy",
        "badgeI18n": "g20_badge",
        "categoryLabel": "Functional & Accessories",
        "categoryI18n": "g20_cat",
        "name": "Print-in-Place Interlocking Infinity Fidget Cube",
        "titleI18n": "g20_title",
        "specs": [
            {
                "text": "Matte Tan PLA",
                "i18n": "g20_spec1"
            },
            {
                "text": "Print-in-Place Hinges",
                "i18n": "g20_spec2"
            },
            {
                "text": "Endless Flip",
                "i18n": "g20_spec3"
            }
        ],
        "price": "৳200",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-23",
        "category": "custom",
        "desc": "",
        "descKey": "g21_desc",
        "image": "images/Gemini_Generated_Image_ttuhg4ttuhg4ttuh-01.webp",
        "badge": "🏷️ Name Tag",
        "badgeI18n": "g21_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g21_cat",
        "name": "\"IBRAHIM\" Ocean Blue 3D Name Keychain",
        "titleI18n": "g21_title",
        "specs": [
            {
                "text": "White & Blue PLA",
                "i18n": "g21_spec1"
            },
            {
                "text": "Cloud Frame",
                "i18n": "g21_spec2"
            },
            {
                "text": "Custom Lettering",
                "i18n": "g21_spec3"
            }
        ],
        "price": "৳120",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-24",
        "category": "art",
        "desc": "",
        "descKey": "g22_desc",
        "image": "images/Gemini_Generated_Image_ualqw9ualqw9ualq-01.webp",
        "badge": "🧥 Mini Planters",
        "badgeI18n": "g22_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g22_cat",
        "name": "Mini Hoodie Desk Organizers Trio",
        "titleI18n": "g22_title",
        "specs": [
            {
                "text": "White, Pink & Black",
                "i18n": "g22_spec1"
            },
            {
                "text": "Front Pocket Detail",
                "i18n": "g22_spec2"
            },
            {
                "text": "Pen & Plant Holder",
                "i18n": "g22_spec3"
            }
        ],
        "price": "৳650",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-25",
        "category": "custom",
        "desc": "",
        "descKey": "g23_desc",
        "image": "images/Gemini_Generated_Image_xjrrb2xjrrb2xjrr-01.webp",
        "badge": "🏷️ Name Tag",
        "badgeI18n": "g23_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g23_cat",
        "name": "\"IFSHITA\" Blue Heart 3D Name Keychain",
        "titleI18n": "g23_title",
        "specs": [
            {
                "text": "White Lettering",
                "i18n": "g23_spec1"
            },
            {
                "text": "Heart Accent",
                "i18n": "g23_spec2"
            },
            {
                "text": "Cyan Blue Base",
                "i18n": "g23_spec3"
            }
        ],
        "price": "৳120",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-26",
        "category": "art",
        "desc": "",
        "descKey": "g24_desc",
        "image": "images/Gemini_Generated_Image_yc29tsyc29tsyc29-01.webp",
        "badge": "🏠 Cottage Model",
        "badgeI18n": "g24_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g24_cat",
        "name": "Medieval Stone Cottage Architectural Miniature",
        "titleI18n": "g24_title",
        "specs": [
            {
                "text": "Blue Shingle Roof",
                "i18n": "g24_spec1"
            },
            {
                "text": "Stone Texture",
                "i18n": "g24_spec2"
            },
            {
                "text": "Brick Chimney",
                "i18n": "g24_spec3"
            }
        ],
        "price": "৳150",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-27",
        "category": "art",
        "desc": "",
        "descKey": "g25_desc",
        "image": "images/Gemini_Generated_Image_yrxv9zyrxv9zyrxv-01.webp",
        "badge": "🩺 Doctor Gift",
        "badgeI18n": "g25_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g25_cat",
        "name": "Doctor Coat & Puffer Jacket Desk Organizers",
        "titleI18n": "g25_title",
        "specs": [
            {
                "text": "Stethoscope Detail",
                "i18n": "g25_spec1"
            },
            {
                "text": "White & Brown Set",
                "i18n": "g25_spec2"
            },
            {
                "text": "Medical Gift",
                "i18n": "g25_spec3"
            }
        ],
        "price": "৳250",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-28",
        "category": "art",
        "desc": "",
        "descKey": "g26_desc",
        "image": "images/black_twisted_vase.webp",
        "badge": "🖤 Parametric Vase",
        "badgeI18n": "g26_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "g26_cat",
        "name": "Black Parametric Twisted Spiral Vase",
        "titleI18n": "g26_title",
        "specs": [
            {
                "text": "Matte Black PLA",
                "i18n": "g26_spec1"
            },
            {
                "text": "Spiral Fins",
                "i18n": "g26_spec2"
            },
            {
                "text": "Tapered Neck",
                "i18n": "g26_spec3"
            }
        ],
        "price": "৳450",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-29",
        "category": "custom",
        "desc": "",
        "descKey": "g27_desc",
        "image": "images/custom_blue_keychains_set.webp",
        "badge": "🔑 Keychains Set",
        "badgeI18n": "g27_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "g27_cat",
        "name": "Kira's Creation & Personalized Name Keychains Collection",
        "titleI18n": "g27_title",
        "specs": [
            {
                "text": "Sky Blue & White PLA",
                "i18n": "g27_spec1"
            },
            {
                "text": "Custom Typography",
                "i18n": "g27_spec2"
            },
            {
                "text": "Gift & Studio Tags",
                "i18n": "g27_spec3"
            }
        ],
        "price": "৳120",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-30",
        "category": "custom",
        "desc": "Dual-layer 3D printed keychain inspired by the Grand Theft Auto logo. Constructed with durable matte black base, yellow accent layer, and raised crisp white lettering. Includes heavy-duty metal split ring.",
        "descKey": "g28_desc",
        "image": "images/gta_keychain_black_yellow.webp",
        "badge": "🔑 Multi-Layer Tag",
        "badgeI18n": "g28_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "GTA (Grand Theft Auto) Multi-Layered 3D Keychain",
        "titleI18n": "g28_title",
        "specs": [
            {
                "text": "Matte Black & Yellow PLA",
                "i18n": "g28_spec1"
            },
            {
                "text": "Raised White Lettering",
                "i18n": "g28_spec2"
            },
            {
                "text": "Metal Keyring Attached",
                "i18n": "g28_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-31",
        "category": "custom",
        "desc": "Adorable set of multi-colored ghost keychains featuring Halloween-themed details including witch hats, mini pumpkins, and candy apples with clean black outlines.",
        "descKey": "g29_desc",
        "image": "images/cute_ghost_halloween_keychains.webp",
        "badge": "👻 Ghost Charms",
        "badgeI18n": "g29_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "Cute Halloween Ghost & Pumpkin Keychains Set",
        "titleI18n": "g29_title",
        "specs": [
            {
                "text": "Textured White PLA",
                "i18n": "g29_spec1"
            },
            {
                "text": "Multi-Color Accents",
                "i18n": "g29_spec2"
            },
            {
                "text": "Set of 4 Designs",
                "i18n": "g29_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-32",
        "category": "custom",
        "desc": "Personalized multi-layered name tags in iconic Lego typography. Features bold red and yellow outer borders with clean white 3D raised script and integrated key loop.",
        "descKey": "g30_desc",
        "image": "images/lego_name_keychains_set.webp",
        "badge": "🧩 Custom Name",
        "badgeI18n": "g30_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "Lego-Style Personalized 3D Name Keychains Collection",
        "titleI18n": "g30_title",
        "specs": [
            {
                "text": "Red, Yellow & White PLA",
                "i18n": "g30_spec1"
            },
            {
                "text": "Custom Name Printing",
                "i18n": "g30_spec2"
            },
            {
                "text": "3D Embossed Font",
                "i18n": "g30_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-33",
        "category": "custom",
        "desc": "Comprehensive showcase of custom 3D printed keychains, including sports jerseys (Messi #10), gaming tags (Minecraft, GTA), ghost figures, and cord charm accessories.",
        "descKey": "g31_desc",
        "image": "images/master_keychain_collection_board.webp",
        "badge": "✨ Master Showcase",
        "badgeI18n": "g31_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "Master Collection 3D Printed Keychains & Badges Assortment",
        "titleI18n": "g31_title",
        "specs": [
            {
                "text": "Custom Multi-Color PLA",
                "i18n": "g31_spec1"
            },
            {
                "text": "Assorted Gaming & Names",
                "i18n": "g31_spec2"
            },
            {
                "text": "High Precision Details",
                "i18n": "g31_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-34",
        "category": "custom",
        "desc": "Studio shot edition of the GTA dual-layer 3D key tag. Precision printed with yellow inner accent strip and clean white embossed text on a durable black body.",
        "descKey": "g32_desc",
        "image": "images/gta_keychain_white_bg.webp",
        "badge": "🎮 Gaming Tag",
        "badgeI18n": "g32_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "GTA Logo 3D Printed Keyring Tag (Studio Edition)",
        "titleI18n": "g32_title",
        "specs": [
            {
                "text": "Dual-Layer Structure",
                "i18n": "g32_spec1"
            },
            {
                "text": "Matte Finish PLA",
                "i18n": "g32_spec2"
            },
            {
                "text": "Pocket Size",
                "i18n": "g32_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-35",
        "category": "custom",
        "desc": "Modular 3D printed letter beads threaded on a durable white braided cord, accented with colorful inlays, musical note symbol, and heart end-charms.",
        "descKey": "g33_desc",
        "image": "images/custom_letter_beads_cord.webp",
        "badge": "📿 Cord Charm",
        "badgeI18n": "g33_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "Personalized 3D Printed Letter Beads & Charm Bracelet Cord",
        "titleI18n": "g33_title",
        "specs": [
            {
                "text": "White PLA with Color Inlay",
                "i18n": "g33_spec1"
            },
            {
                "text": "Custom Threaded Beads",
                "i18n": "g33_spec2"
            },
            {
                "text": "Heart & Note Charms",
                "i18n": "g33_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-36",
        "category": "custom",
        "desc": "Elegant personalized name keychain featuring white cursive typography over a soft lavender base plate, topped with a pink heart sunburst emblem.",
        "descKey": "g34_desc",
        "image": "images/ananya_heart_name_keychain.webp",
        "badge": "💖 Script Name",
        "badgeI18n": "g34_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "\"Ananya\" Cursive Script Heart Name Keychain",
        "titleI18n": "g34_title",
        "specs": [
            {
                "text": "Lavender & Pink PLA",
                "i18n": "g34_spec1"
            },
            {
                "text": "Cursive Typography",
                "i18n": "g34_spec2"
            },
            {
                "text": "Sunburst Heart Emblem",
                "i18n": "g34_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-37",
        "category": "art",
        "desc": "Detailed 3D printed miniature arched bookcase in warm wood tones, fully furnished with mini black-bound books, parametric white vases, and a potted red tulip on the top shelf.",
        "descKey": "g35_desc",
        "image": "images/miniature_bookshelf_decor.webp",
        "badge": "📚 Mini Diorama",
        "badgeI18n": "g35_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Miniature Arched Wooden Bookshelf & Decor Display",
        "titleI18n": "g35_title",
        "specs": [
            {
                "text": "Brown Wood-Tone PLA",
                "i18n": "g35_spec1"
            },
            {
                "text": "Includes Mini Books & Vases",
                "i18n": "g35_spec2"
            },
            {
                "text": "Potted Tulip Top Accent",
                "i18n": "g35_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-38",
        "category": "art",
        "desc": "Precision 3D printed two-story architectural scale cottage model featuring stone texture base walls, cream clapboard upper siding, dark roof tiles, chimney, and framed balcony.",
        "descKey": "g36_desc",
        "image": "images/architectural_cottage_house_model.webp",
        "badge": "🏠 Scale Model",
        "badgeI18n": "g36_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Architectural Scale Model 3D Cottage with Balcony",
        "titleI18n": "g36_title",
        "specs": [
            {
                "text": "Multi-Material Composition",
                "i18n": "g36_spec1"
            },
            {
                "text": "Stone Wall & Roof Texture",
                "i18n": "g36_spec2"
            },
            {
                "text": "Detailed Balcony Railings",
                "i18n": "g36_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-39",
        "category": "art",
        "desc": "Ultra-high precision micro 3D print set featuring five distinct parametric spiral and geometric mini vases alongside a miniature potted red tulip, demonstrated with coin scale reference.",
        "descKey": "g37_desc",
        "image": "images/micro_vases_tulip_coin_scale.webp",
        "badge": "🔎 Micro Print",
        "badgeI18n": "g37_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Micro 3D Parametric Vases & Tulip Set (Scale Edition)",
        "titleI18n": "g37_title",
        "specs": [
            {
                "text": "High Precision SLA/FDM",
                "i18n": "g37_spec1"
            },
            {
                "text": "5 Parametric Vases + Tulip",
                "i18n": "g37_spec2"
            },
            {
                "text": "Micro Miniature Size",
                "i18n": "g37_spec3"
            }
        ],
        "price": "Contact for Quote",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-40",
        "category": "art",
        "desc": "High-detail 3D printed miniature dollhouse interior set featuring master double beds with white bedding, tufted armchairs in pink and black, wardrobe cabinet, and bathroom fixtures.",
        "descKey": "g38_desc",
        "image": "images/miniature_dollhouse_master_suite.webp",
        "badge": "🛋️ Mini Master Suite",
        "badgeI18n": "g38_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Miniature Dollhouse Furniture & Master Bedroom Suite Set",
        "titleI18n": "g38_title",
        "specs": [
            {
                "text": "Complete Master Bedroom Suite",
                "i18n": "g38_spec1"
            },
            {
                "text": "Multi-Color PLA Filament",
                "i18n": "g38_spec2"
            },
            {
                "text": "Beds, Chairs & Wardrobe",
                "i18n": "g38_spec3"
            }
        ],
        "price": "৳1,200",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-41",
        "category": "art",
        "desc": "Ultra-precise micro 3D printed pair of black Chesterfield armchairs showcasing intricate button-tufted upholstery texture and cushion curves, shown next to a 5 Taka coin for scale comparison.",
        "descKey": "g39_desc",
        "image": "images/micro_tufted_armchairs_pair.webp",
        "badge": "🪑 Micro Armchairs",
        "badgeI18n": "g39_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Micro 3D Printed Tufted Chesterfield Armchairs Pair (Scale Edition)",
        "titleI18n": "g39_title",
        "specs": [
            {
                "text": "High Detail Chesterfield Texture",
                "i18n": "g39_spec1"
            },
            {
                "text": "Mat Black Eco PLA",
                "i18n": "g39_spec2"
            },
            {
                "text": "5-Taka Coin Scale Reference",
                "i18n": "g39_spec3"
            }
        ],
        "price": "৳350",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-42",
        "category": "func",
        "desc": "Functional multi-part mechanical storage container featuring an interlocking aperture iris mechanism that opens smoothly by twisting the top gear ring.",
        "descKey": "g40_desc",
        "image": "images/mechanical_iris_aperture_container.webp",
        "badge": "⚙️ Mechanical Iris",
        "badgeI18n": "g40_badge",
        "categoryLabel": "Functional & Organizers",
        "categoryI18n": "filter_functional",
        "name": "Print-in-Place Mechanical Iris Aperture Storage Container",
        "titleI18n": "g40_title",
        "specs": [
            {
                "text": "Print-in-Place Iris Mechanism",
                "i18n": "g40_spec1"
            },
            {
                "text": "Pink Grid Body & Black Ring",
                "i18n": "g40_spec2"
            },
            {
                "text": "Interlocking Shutter Blades",
                "i18n": "g40_spec3"
            }
        ],
        "price": "৳850",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-43",
        "category": "custom",
        "desc": "Elegant 3D printed custom nameplate with brown cursive script lettering over a cloud-shaped white backdrop, decorated with a vibrant coral pink flower accent.",
        "descKey": "g41_desc",
        "image": "images/adita_floral_nameplate_keychain.webp",
        "badge": "🌸 Floral Script Name",
        "badgeI18n": "g41_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "\"Adita\" Floral Cursive Script Custom Desk Nameplate / Keychain",
        "titleI18n": "g41_title",
        "specs": [
            {
                "text": "Custom Cursive Typography",
                "i18n": "g41_spec1"
            },
            {
                "text": "Coral Pink Flower Motif",
                "i18n": "g41_spec2"
            },
            {
                "text": "White Cloud Base Plate",
                "i18n": "g41_spec3"
            }
        ],
        "price": "৳180",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-44",
        "category": "art",
        "desc": "Trio collection of traditional oriental lighting featuring a Bonsai Shoji lantern, a Chinese Pagoda lantern with Kanji calligraphy, and a modern spiral geometric column light.",
        "descKey": "g42_desc",
        "image": "images/oriental_led_lantern_trio.webp",
        "badge": "🏮 Oriental Lamp Trio",
        "badgeI18n": "g42_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Oriental Ambient LED Illuminated Lamp Trio Collection",
        "titleI18n": "g42_title",
        "specs": [
            {
                "text": "3 Distinct Asian Lamp Designs",
                "i18n": "g42_spec1"
            },
            {
                "text": "Built-in Warm LED Illumination",
                "i18n": "g42_spec2"
            },
            {
                "text": "Bonsai, Pagoda & Spiral Column",
                "i18n": "g42_spec3"
            }
        ],
        "price": "৳2,400",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-45",
        "category": "art",
        "desc": "Architectural display set comprising three mini house models: a dark Japanese temple pagoda, a cheerful red-roofed suburban house, and a white stone fantasy cottage.",
        "descKey": "g43_desc",
        "image": "images/architectural_cottage_miniature_trio.webp",
        "badge": "🏠 Mini House Trio",
        "badgeI18n": "g43_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Architectural Cottage & Fantasy House Miniature Trio",
        "titleI18n": "g43_title",
        "specs": [
            {
                "text": "3 Architectural Styles",
                "i18n": "g43_spec1"
            },
            {
                "text": "Pagoda, Suburban & Stone Cottage",
                "i18n": "g43_spec2"
            },
            {
                "text": "Multi-Material & FDM Details",
                "i18n": "g43_spec3"
            }
        ],
        "price": "৳1,500",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-46",
        "category": "art",
        "desc": "Deluxe 3D printed mini villa setup combining a red-roofed house model with complete living room seating circle, bedroom suite, wardrobe, and bathroom elements.",
        "descKey": "g44_desc",
        "image": "images/miniature_villa_interior_living_set.webp",
        "badge": "🏡 Deluxe Villa Set",
        "badgeI18n": "g44_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Complete Miniature Villa House & Living Room Interior Set",
        "titleI18n": "g44_title",
        "specs": [
            {
                "text": "Villa Model with Full Furnishings",
                "i18n": "g44_spec1"
            },
            {
                "text": "Armchair Circle & Coffee Table",
                "i18n": "g44_spec2"
            },
            {
                "text": "Bed, Wardrobe & Toilet Accessories",
                "i18n": "g44_spec3"
            }
        ],
        "price": "৳1,800",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-47",
        "category": "art",
        "desc": "Premium wooden-finish 3D printed Japanese Shoji table lamp featuring 3D cutouts of Hokusai's Great Wave off Kanagawa and a Bonsai tree with Kanji calligraphy, USB rechargeable.",
        "descKey": "g45_desc",
        "image": "images/japanese_wave_bonsai_shoji_lamp.webp",
        "badge": "🌊 Great Wave Lamp",
        "badgeI18n": "g45_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Japanese Great Wave & Bonsai Shoji Ambient Desk Lamp (Rechargeable)",
        "titleI18n": "g45_title",
        "specs": [
            {
                "text": "Great Wave & Bonsai Silhouette Panels",
                "i18n": "g45_spec1"
            },
            {
                "text": "Built-in USB Charge & Toggle Switch",
                "i18n": "g45_spec2"
            },
            {
                "text": "Warm LED Backlit Glow",
                "i18n": "g45_spec3"
            }
        ],
        "price": "৳1,650",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-48",
        "category": "art",
        "desc": "Detailed mini furniture accent pack featuring a brown double-door wardrobe with realistic wood layer lines, paired with two black tufted armchairs and wooden dining chairs.",
        "descKey": "g46_desc",
        "image": "images/miniature_wardrobe_armchairs_accent_set.webp",
        "badge": "🚪 Wardrobe Set",
        "badgeI18n": "g46_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Miniature Wooden Wardrobe & Armchairs Accent Set",
        "titleI18n": "g46_title",
        "specs": [
            {
                "text": "Wood-Texture Wardrobe Cabinet",
                "i18n": "g46_spec1"
            },
            {
                "text": "2 Tufted Armchairs & Dining Chairs",
                "i18n": "g46_spec2"
            },
            {
                "text": "Multi-Piece Scale Diorama",
                "i18n": "g46_spec3"
            }
        ],
        "price": "৳550",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-49",
        "category": "custom",
        "desc": "Custom 3D printed official BLACKPINK logo desk plaque / keychain featuring black \"BLAƆK\" and pink \"PIИK\" stylized embossed typography within a black border frame over a white base.",
        "descKey": "g47_desc",
        "image": "images/blackpink_kpop_logo_plaque.webp",
        "badge": "🖤💗 K-Pop Custom",
        "badgeI18n": "g47_badge",
        "categoryLabel": "Custom & Keychains",
        "categoryI18n": "filter_custom",
        "name": "BLACKPINK K-Pop Fan Club 3D Printed Logo Plaque / Keychain",
        "titleI18n": "g47_title",
        "specs": [
            {
                "text": "Official Stylized Typography",
                "i18n": "g47_spec1"
            },
            {
                "text": "Black & Pink Dual Filament",
                "i18n": "g47_spec2"
            },
            {
                "text": "Raised Border Frame",
                "i18n": "g47_spec3"
            }
        ],
        "price": "৳220",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-50",
        "category": "art",
        "desc": "Intricately printed oriental pagoda night lamp featuring removable black tile roof, wooden lattice frame, warm inner LED lighting, and side panels displaying Kanji characters for Prosperity (繁榮) and Love (愛).",
        "descKey": "g48_desc",
        "image": "images/chinese_pagoda_kanji_led_lamp.webp",
        "badge": "⛩️ Pagoda Lamp",
        "badgeI18n": "g48_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Traditional Chinese Pagoda LED Night Lamp with Kanji Panels",
        "titleI18n": "g48_title",
        "specs": [
            {
                "text": "Chinese Pagoda Architecture",
                "i18n": "g48_spec1"
            },
            {
                "text": "Kanji Characters \"Prosperity\" & \"Love\"",
                "i18n": "g48_spec2"
            },
            {
                "text": "Removable Roof Lid & Inner LED",
                "i18n": "g48_spec3"
            }
        ],
        "price": "৳1,850",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-51",
        "category": "art",
        "desc": "Charming 3D printed miniature storybook house featuring a scalloped pink shingle roof with chimney, brown wood-paneled walls, crisp white trim, and arched front door.",
        "descKey": "g49_desc",
        "image": "images/pink_roof_storybook_cottage.webp",
        "badge": "🏡 Storybook Cottage",
        "badgeI18n": "g49_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Pink-Roofed Storybook Cottage Miniature Model",
        "titleI18n": "g49_title",
        "specs": [
            {
                "text": "Bright Pink Tiled Gable Roof",
                "i18n": "g49_spec1"
            },
            {
                "text": "Timber Frame & Window Detailing",
                "i18n": "g49_spec2"
            },
            {
                "text": "Compact Desktop Decor",
                "i18n": "g49_spec3"
            }
        ],
        "price": "৳650",
        "delivery": "3-5 Days"
    },
    {
        "id": "PROD-OLD-52",
        "category": "art",
        "desc": "Detailed architectural mini set featuring three iconic structures: an Asian black pagoda, a colorful suburban cottage, and a medieval white stone cottage, ideal for tabletop gaming and display.",
        "descKey": "g50_desc",
        "image": "images/village_architecture_mini_models.webp",
        "badge": "🏘️ Village Set",
        "badgeI18n": "g50_badge",
        "categoryLabel": "Artistic & Decor",
        "categoryI18n": "filter_artistic",
        "name": "Village Architecture Mini Models Set (Pagoda, Cottage & Stone House)",
        "titleI18n": "g50_title",
        "specs": [
            {
                "text": "3 Architectural Scale Models",
                "i18n": "g50_spec1"
            },
            {
                "text": "Black, Multi-Color & White Stone",
                "i18n": "g50_spec2"
            },
            {
                "text": "Display Stand Ready",
                "i18n": "g50_spec3"
            }
        ],
        "price": "৳1,350",
        "delivery": "3-5 Days"
    }
];