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
        "price": "৳2250",
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
        "price": "৳2450",
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
        "price": "৳1200",
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
        "price": "৳1700",
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
        "price": "৳2300",
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
        "price": "৳1000",
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
        "price": "৳1800",
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
        "price": "৳1950",
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
        "price": "৳1750",
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
        "price": "৳2500",
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
        "price": "৳1650",
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
        "price": "৳2100",
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
        "price": "৳1350",
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
        "price": "৳1500",
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
        "price": "৳750",
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
        "price": "৳2200",
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
        "price": "৳1250",
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
        "price": "৳1650",
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
        "price": "৳2150",
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
        "price": "৳800",
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
        "price": "৳1350",
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
        "price": "৳1100",
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
        "price": "৳900",
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
        "price": "৳300",
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
        "price": "৳1450",
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
        "price": "৳2050",
        "delivery": "3-5 Days"
    }
];