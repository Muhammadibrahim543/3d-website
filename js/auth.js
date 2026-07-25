/* ==========================================================================
   KIRA'S CREATION - USER AUTHENTICATION & PROFILE MANAGER (js/auth.js)
   ========================================================================== */

(function() {
    // High-End 3D & Tech Vector Avatars
    window.KiraAvatars = [
        { 
            id: 'av_robo', 
            name: 'Cyber Bot', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cb_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1E293B"/><stop offset="100%" stop-color="#0F172A"/></linearGradient><linearGradient id="cb_vis" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00F2FE"/><stop offset="100%" stop-color="#4FACFE"/></linearGradient><linearGradient id="cb_met" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#64748B"/><stop offset="100%" stop-color="#334155"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#cb_bg)" stroke="#00F2FE" stroke-width="2.5"/><rect x="47" y="14" width="6" height="12" rx="3" fill="url(#cb_met)"/><circle cx="50" cy="12" r="5" fill="#00F2FE"/><rect x="22" y="26" width="56" height="50" rx="16" fill="url(#cb_met)"/><rect x="27" y="34" width="46" height="24" rx="8" fill="#090B10" stroke="#00F2FE" stroke-width="1.5"/><path d="M 34 46 Q 50 50 66 46" fill="none" stroke="url(#cb_vis)" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="44" r="2.5" fill="#00F2FE"/><circle cx="62" cy="44" r="2.5" fill="#00F2FE"/><line x1="38" y1="64" x2="62" y2="64" stroke="#4FACFE" stroke-width="2" stroke-linecap="round"/><line x1="43" y1="68" x2="57" y2="68" stroke="#4FACFE" stroke-width="1.5" stroke-linecap="round"/><rect x="15" y="42" width="7" height="16" rx="3" fill="#00F2FE"/><rect x="78" y="42" width="7" height="16" rx="3" fill="#00F2FE"/></svg>`,
            bg: 'linear-gradient(135deg, #1E293B, #0F172A)', 
            border: '#00F2FE', 
            title: 'AI 3D Maker' 
        },
        { 
            id: 'av_pilot', 
            name: 'Sci-Fi Pilot', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sp_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0F172A"/><stop offset="100%" stop-color="#020617"/></linearGradient><linearGradient id="sp_vis" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#EF4444"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#sp_bg)" stroke="#38BDF8" stroke-width="2.5"/><circle cx="50" cy="50" r="32" fill="#1E293B" stroke="#94A3B8" stroke-width="3"/><ellipse cx="50" cy="46" rx="24" ry="16" fill="url(#sp_vis)"/><path d="M 32 40 Q 50 34 68 40" fill="none" stroke="#FFF" stroke-width="2" opacity="0.6"/><rect x="42" y="68" width="16" height="10" rx="4" fill="#64748B"/></svg>`,
            bg: 'linear-gradient(135deg, #0F172A, #020617)', 
            border: '#38BDF8', 
            title: 'Space Crafter' 
        },
        { 
            id: 'av_fox', 
            name: 'Cyber Fox', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cf_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#431407"/><stop offset="100%" stop-color="#1F0701"/></linearGradient><linearGradient id="cf_body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FB923C"/><stop offset="100%" stop-color="#EA580C"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#cf_bg)" stroke="#F97316" stroke-width="2.5"/><polygon points="24,24 40,42 20,48" fill="#FB923C"/><polygon points="76,24 60,42 80,48" fill="#FB923C"/><polygon points="50,78 20,44 80,44" fill="url(#cf_body)"/><polygon points="50,78 35,44 65,44" fill="#FFF"/><polygon points="50,72 44,64 56,64" fill="#1E293B"/><circle cx="36" cy="50" r="3" fill="#00F2FE"/><circle cx="64" cy="50" r="3" fill="#00F2FE"/></svg>`,
            bg: 'linear-gradient(135deg, #431407, #1F0701)', 
            border: '#F97316', 
            title: 'Speedy Modeler' 
        },
        { 
            id: 'av_wizard', 
            name: '3D Architect', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ar_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#311042"/><stop offset="100%" stop-color="#180524"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#ar_bg)" stroke="#A855F7" stroke-width="2.5"/><circle cx="50" cy="38" r="16" fill="#C084FC"/><path d="M 22 80 C 22 62, 34 56, 50 56 C 66 56, 78 62, 78 80 Z" fill="#9333EA"/><polygon points="44,22 56,22 60,30 40,30" fill="#F3E8FF"/><rect x="42" y="60" width="16" height="20" fill="#E9D5FF" opacity="0.7"/></svg>`,
            bg: 'linear-gradient(135deg, #311042, #180524)', 
            border: '#A855F7', 
            title: 'Magic Architect' 
        },
        { 
            id: 'av_king', 
            name: 'Pro Designer', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pd_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#451A03"/><stop offset="100%" stop-color="#1F0B02"/></linearGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FDE047"/><stop offset="100%" stop-color="#CA8A04"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#pd_bg)" stroke="#EAB308" stroke-width="2.5"/><circle cx="50" cy="42" r="18" fill="url(#gold)"/><path d="M 20 84 C 20 64, 32 58, 50 58 C 68 58, 80 64, 80 84 Z" fill="#EAB308"/><path d="M 32 26 L 40 34 L 50 22 L 60 34 L 68 26 L 64 40 L 36 40 Z" fill="url(#gold)" stroke="#78350F" stroke-width="1"/></svg>`,
            bg: 'linear-gradient(135deg, #451A03, #1F0B02)', 
            border: '#EAB308', 
            title: 'Pro Designer' 
        },
        { 
            id: 'av_cat', 
            name: 'Cosmic Sculptor', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cs_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#064E3B"/><stop offset="100%" stop-color="#022C22"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#cs_bg)" stroke="#10B981" stroke-width="2.5"/><circle cx="50" cy="38" r="16" fill="#34D399"/><path d="M 22 80 C 22 62, 34 56, 50 56 C 66 56, 78 62, 78 80 Z" fill="#059669"/><circle cx="43" cy="36" r="2.5" fill="#064E3B"/><circle cx="57" cy="36" r="2.5" fill="#064E3B"/><path d="M 45 44 Q 50 48 55 44" stroke="#064E3B" stroke-width="2" fill="none"/></svg>`,
            bg: 'linear-gradient(135deg, #064E3B, #022C22)', 
            border: '#10B981', 
            title: 'Cute Sculptor' 
        },
        { 
            id: 'av_dragon', 
            name: 'Neon Producer', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="np_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#134E4A"/><stop offset="100%" stop-color="#042F2C"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#np_bg)" stroke="#14B8A6" stroke-width="2.5"/><rect x="25" y="25" width="50" height="50" rx="12" fill="#0F766E" stroke="#2DD4BF" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="#14B8A6"/><circle cx="50" cy="50" r="6" fill="#CCFBF1"/></svg>`,
            bg: 'linear-gradient(135deg, #134E4A, #042F2C)', 
            border: '#14B8A6', 
            title: 'Beast Producer' 
        },
        { 
            id: 'av_gamer', 
            name: 'Hero Builder', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hb_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#831843"/><stop offset="100%" stop-color="#4C0519"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#hb_bg)" stroke="#EC4899" stroke-width="2.5"/><polygon points="50,18 82,34 82,66 50,82 18,66 18,34" fill="#BE185D" stroke="#F472B6" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="#F472B6"/></svg>`,
            bg: 'linear-gradient(135deg, #831843, #4C0519)', 
            border: '#EC4899', 
            title: 'Hero Builder' 
        },
        { 
            id: 'av_ninja', 
            name: 'Shadow Cutter', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sc_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#18181B"/><stop offset="100%" stop-color="#09090B"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#sc_bg)" stroke="#71717A" stroke-width="2.5"/><circle cx="50" cy="40" r="20" fill="#27272A"/><rect x="30" y="34" width="40" height="12" rx="6" fill="#A1A1AA"/><circle cx="42" cy="40" r="2.5" fill="#09090B"/><circle cx="58" cy="40" r="2.5" fill="#09090B"/><path d="M 22 82 C 22 64, 34 58, 50 58 C 66 58, 78 64, 78 82 Z" fill="#27272A"/></svg>`,
            bg: 'linear-gradient(135deg, #18181B, #09090B)', 
            border: '#71717A', 
            title: 'Stealth Cutter' 
        },
        { 
            id: 'av_alien', 
            name: 'Galaxy Engineer', 
            svg: `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ge_bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3B0764"/><stop offset="100%" stop-color="#1E0338"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#ge_bg)" stroke="#C084FC" stroke-width="2.5"/><ellipse cx="50" cy="42" rx="22" ry="18" fill="#7E22CE"/><circle cx="38" cy="40" r="4" fill="#F3E8FF"/><circle cx="62" cy="40" r="4" fill="#F3E8FF"/><circle cx="50" cy="30" r="3" fill="#E9D5FF"/><path d="M 22 82 C 22 64, 34 60, 50 60 C 66 60, 78 64, 78 82 Z" fill="#6B21A8"/></svg>`,
            bg: 'linear-gradient(135deg, #3B0764, #1E0338)', 
            border: '#C084FC', 
            title: 'Alien Engineer' 
        }
    ];

    const GUEST_AVATAR_SVG = `<svg viewBox="0 0 100 100" class="avatar-svg" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="rgba(255,126,103,0.12)" stroke="var(--c-primary)" stroke-width="2"/><circle cx="50" cy="38" r="16" fill="var(--c-primary)"/><path d="M 24 80 C 24 62, 34 56, 50 56 C 66 56, 76 62, 76 80 Z" fill="var(--c-primary)"/></svg>`;

    // 1. Initial Storage Setup & Pre-seeded Demo User
    const DEMO_USER = {
        id: 'usr_demo_01',
        name: 'Sidratul Muntaha',
        email: 'user@kira.com',
        password: '123456',
        phone: '+880 1793-500131',
        address: '58 Lower Jessore Road, Khulna Sadar, Khulna',
        avatar: 'av_robo',
        presets: [
            {
                id: 'pst_1',
                name: 'Kira Skyblue Plate',
                text: 'KIRA',
                font: 'Fredoka',
                fontCss: "'Fredoka', cursive",
                color: 'Ocean Blue',
                colorHex: '#2979FF',
                colorRate: 5.0,
                thickness: 6,
                price: '৳484',
                date: 'Jul 24, 2026',
                snapshot: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22340%22%20height%3D%22160%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23181621%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%232979FF%22%20font-size%3D%2240%22%20font-family%3D%22sans-serif%22%3EKIRA%3C%2Ftext%3E%3C%2Fsvg%3E'
            }
        ]
    };

    function initUsers() {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('kiras_users')) || [];
        } catch(e) {}

        if (users.length === 0) {
            users.push(DEMO_USER);
            localStorage.setItem('kiras_users', JSON.stringify(users));
        }
    }
    initUsers();

    // 2. Auth State Helpers
    window.KiraAuth = {
        getCurrentUser: function() {
            try {
                return JSON.parse(localStorage.getItem('kiras_active_user'));
            } catch(e) {
                return null;
            }
        },

        setCurrentUser: function(user) {
            if (user) {
                localStorage.setItem('kiras_active_user', JSON.stringify(user));
                let users = JSON.parse(localStorage.getItem('kiras_users')) || [];
                const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
                if (idx !== -1) {
                    users[idx] = user;
                } else {
                    users.push(user);
                }
                localStorage.setItem('kiras_users', JSON.stringify(users));
            } else {
                localStorage.removeItem('kiras_active_user');
            }
            this.updateUI();
        },

        login: function(email, password) {
            const users = JSON.parse(localStorage.getItem('kiras_users')) || [];
            const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
            if (found) {
                this.setCurrentUser(found);
                return { success: true, user: found };
            }
            return { success: false, message: 'Invalid email or password.' };
        },

        register: function(name, email, password, phone, address) {
            let users = JSON.parse(localStorage.getItem('kiras_users')) || [];
            const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
            if (exists) {
                return { success: false, message: 'An account with this email already exists.' };
            }

            const newUser = {
                id: 'KIRA-USR-' + Math.floor(10000 + Math.random() * 90000),
                name: name.trim(),
                email: email.trim(),
                password: password,
                phone: phone.trim() || '',
                address: address.trim() || '',
                presets: []
            };

            users.push(newUser);
            localStorage.setItem('kiras_users', JSON.stringify(users));

            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlT_uFe-8zMu_LFpMZsGRQPaQuzcIxFZfmFa195FMp1b0IFJP-blzHYoFSv-nj_cs/exec';
            const params = new URLSearchParams({
                action: 'addUser',
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                password: newUser.password
            });
            try {
                fetch(GOOGLE_SHEET_URL + '?' + params.toString(), { mode: 'no-cors' });
            } catch(err) {}

            this.setCurrentUser(newUser);
            return { success: true, user: newUser };
        },

        logout: function() {
            this.setCurrentUser(null);
            showToast('Logged out successfully');
            if (window.location.pathname.includes('account.html')) {
                window.location.href = 'index.html';
            }
        },

        savePreset: function(preset) {
            let user = this.getCurrentUser();
            if (!user) {
                this.openModal('login');
                showToast('Please sign in to save your design preset!');
                return false;
            }

            if (!user.presets) user.presets = [];
            
            const newPreset = {
                id: 'pst_' + Date.now().toString(36),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                ...preset
            };

            user.presets.unshift(newPreset);
            this.setCurrentUser(user);
            showToast('Preset saved to your account!');
            return true;
        },

        deletePreset: function(presetId) {
            let user = this.getCurrentUser();
            if (!user || !user.presets) return;
            user.presets = user.presets.filter(p => p.id !== presetId);
            this.setCurrentUser(user);
            showToast('Preset deleted.');
        },

        getUserOrders: function() {
            const user = this.getCurrentUser();
            if (!user) return [];
            
            let allOrders = [];
            try {
                allOrders = JSON.parse(localStorage.getItem('kiras_orders')) || [];
            } catch(e) {}

            return allOrders.filter(o => o.email && o.email.toLowerCase() === user.email.toLowerCase());
        },

        getAvatar: function(avatarId) {
            return window.KiraAvatars.find(a => a.id === avatarId) || window.KiraAvatars[0];
        },

        openAvatarModal: function() {
            let modal = document.getElementById('avatar-modal-overlay');
            if (!modal) {
                this.injectAvatarModal();
                modal = document.getElementById('avatar-modal-overlay');
            }
            modal.classList.add('open');
            this.renderAvatarGrid();
        },

        closeAvatarModal: function() {
            const modal = document.getElementById('avatar-modal-overlay');
            if (modal) modal.classList.remove('open');
        },

        selectAvatar: function(avatarId) {
            let user = this.getCurrentUser();
            if (!user) return;

            user.avatar = avatarId;
            this.setCurrentUser(user);

            const av = this.getAvatar(avatarId);
            showToast(`Character avatar set to ${av.name}!`);

            this.closeAvatarModal();
            this.updateUI();

            if (typeof renderAccountPage === 'function') {
                renderAccountPage();
            }
        },

        renderAvatarGrid: function() {
            const user = this.getCurrentUser();
            const currentAvId = user ? (user.avatar || 'av_robo') : 'av_robo';
            const container = document.getElementById('avatar-grid-container');
            if (!container) return;

            container.innerHTML = window.KiraAvatars.map(av => {
                const isActive = av.id === currentAvId;
                return `
                    <div class="avatar-card ${isActive ? 'active' : ''}" onclick="KiraAuth.selectAvatar('${av.id}')">
                        <div class="avatar-icon-bubble" style="background:${av.bg}; border: 2px solid ${av.border}; width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; padding:4px;">
                            ${av.svg}
                        </div>
                        <div style="font-weight:700; font-size:0.88rem; color:var(--c-text); margin-top:0.4rem;">${av.name}</div>
                        <div style="font-size:0.72rem; color:var(--c-text-muted); margin-top:0.1rem;">${av.title}</div>
                        ${isActive ? '<div style="margin-top:0.4rem; font-size:0.75rem; font-weight:800; color:var(--c-primary);">✓ Active</div>' : ''}
                    </div>
                `;
            }).join('');
        },

        injectAvatarModal: function() {
            if (document.getElementById('avatar-modal-overlay')) return;
            const lang = localStorage.getItem('shapey_lang') || 'en';

            const modalHTML = `
                <div id="avatar-modal-overlay" class="modal-overlay">
                    <div class="modal-content clay-card" style="max-width:580px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                            <div>
                                <h2 style="font-family:var(--f-head); color:var(--c-primary); margin:0;">
                                    ${lang === 'en' ? 'Select Profile Avatar' : 'প্রোফাইল ছবি বেছে নিন'}
                                </h2>
                                <p style="margin:0.2rem 0 0 0; font-size:0.85rem; color:var(--c-text-muted);">
                                    ${lang === 'en' ? 'Select a high-tech 3D avatar character for your account!' : 'আপনার অ্যাকাউন্টের জন্য একটি প্রিমিয়াম থ্রিডি অবতার সিলেক্ট করুন!'}
                                </p>
                            </div>
                            <button onclick="KiraAuth.closeAvatarModal()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--c-text);">✕</button>
                        </div>
                        
                        <div id="avatar-grid-container" class="avatar-grid">
                            <!-- Rendered by JS -->
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            document.getElementById('avatar-modal-overlay').addEventListener('click', (e) => {
                if (e.target.id === 'avatar-modal-overlay') {
                    this.closeAvatarModal();
                }
            });
        },
                            <button onclick="KiraAuth.closeAvatarModal()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--c-text);">✕</button>
                        </div>
                        
                        <div id="avatar-grid-container" class="avatar-grid">
                            <!-- Rendered by JS -->
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            document.getElementById('avatar-modal-overlay').addEventListener('click', (e) => {
                if (e.target.id === 'avatar-modal-overlay') {
                    this.closeAvatarModal();
                }
            });
        },

        // UI Renderer
        updateUI: function() {
            const user = this.getCurrentUser();
            const lang = localStorage.getItem('shapey_lang') || 'en';
            
            document.querySelectorAll('.header-user-slot').forEach(slot => {
                if (user) {
                    const firstName = user.name.split(' ')[0];
                    const av = this.getAvatar(user.avatar);
                    slot.innerHTML = `
                        <div class="user-dropdown-container">
                            <button class="header-user-btn" aria-label="User Account" title="${user.name}">
                                <span class="auth-avatar" style="background:${av.bg}; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; padding:2px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">${av.svg}</span>
                                <span>${firstName}</span> ▾
                            </button>
                            <div class="user-dropdown-menu">
                                <div style="display:flex; align-items:center; gap:0.8rem; padding:0.6rem 0.8rem; border-bottom:1px solid rgba(0,0,0,0.08); margin-bottom:0.3rem;">
                                    <div onclick="KiraAuth.openAvatarModal()" style="width:42px; height:42px; border-radius:50%; background:${av.bg}; display:flex; align-items:center; justify-content:center; padding:4px; box-shadow:0 4px 12px rgba(0,0,0,0.15); flex-shrink:0; cursor:pointer;" title="Change Profile Avatar">
                                        ${av.svg}
                                    </div>
                                    <div style="flex:1; overflow:hidden;">
                                        <div style="font-weight:700; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.name}</div>
                                        <div style="font-size:0.75rem; color:var(--c-text-muted);">${av.name} • ${user.email}</div>
                                    </div>
                                </div>
                                <div class="user-dropdown-item" onclick="KiraAuth.openAvatarModal()" style="color:var(--c-primary); font-weight:700;">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    ${lang === 'en' ? 'Change Profile Avatar' : 'প্রোফাইল ছবি পরিবর্তন'}
                                </div>
                                <a href="account.html" class="user-dropdown-item">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    ${lang === 'en' ? 'My Account' : 'আমার অ্যাকাউন্ট'}
                                </a>
                                <a href="account.html#presets" class="user-dropdown-item">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    ${lang === 'en' ? 'Saved Presets' : 'সেভ করা প্রিসেট'}
                                </a>
                                <a href="account.html#orders" class="user-dropdown-item">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                    ${lang === 'en' ? 'Order History' : 'অর্ডার হিস্ট্রি'}
                                </a>
                                <div class="user-dropdown-item" style="color:#FF5E5E;" onclick="KiraAuth.logout()">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FF5E5E" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    ${lang === 'en' ? 'Log Out' : 'লগআউট'}
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    slot.innerHTML = `
                        <button class="header-user-btn" onclick="KiraAuth.openModal('login')" aria-label="Sign In">
                            <span class="auth-avatar" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">${GUEST_AVATAR_SVG}</span>
                            <span>${lang === 'en' ? 'Sign In' : 'লগইন'}</span>
                        </button>
                    `;
                }
            });

            // Toggle Dropdown Menu Click Listener
            document.querySelectorAll('.header-user-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const container = btn.closest('.user-dropdown-container');
                    if (container) {
                        container.classList.toggle('open');
                    }
                });
            });
        },

        openModal: function(tab = 'login') {
            let modal = document.getElementById('auth-modal-overlay');
            if (!modal) {
                this.injectAuthModal();
                modal = document.getElementById('auth-modal-overlay');
            }
            modal.classList.add('open');
            this.switchTab(tab);
        },

        closeModal: function() {
            const modal = document.getElementById('auth-modal-overlay');
            if (modal) modal.classList.remove('open');
        },

        switchTab: function(tab) {
            const loginForm = document.getElementById('auth-login-form');
            const signupForm = document.getElementById('auth-signup-form');
            const tabLoginBtn = document.getElementById('tab-btn-login');
            const tabSignupBtn = document.getElementById('tab-btn-signup');

            if (tab === 'login') {
                if (loginForm) loginForm.style.display = 'block';
                if (signupForm) signupForm.style.display = 'none';
                if (tabLoginBtn) tabLoginBtn.classList.add('active');
                if (tabSignupBtn) tabSignupBtn.classList.remove('active');
            } else {
                if (loginForm) loginForm.style.display = 'none';
                if (signupForm) signupForm.style.display = 'block';
                if (tabLoginBtn) tabLoginBtn.classList.remove('active');
                if (tabSignupBtn) tabSignupBtn.classList.add('active');
            }
        },

        injectAuthModal: function() {
            if (document.getElementById('auth-modal-overlay')) return;
            const lang = localStorage.getItem('shapey_lang') || 'en';

            const modalHTML = `
                <div id="auth-modal-overlay" class="modal-overlay">
                    <div class="modal-content clay-card">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem;">
                            <h3 style="margin:0; font-family:var(--f-head); color:var(--c-primary);" data-i18n="auth_modal_title">
                                ${lang === 'en' ? "Welcome to Kira's Creation" : "কিরাস ক্রিয়েশনে স্বাগতম"}
                            </h3>
                            <button onclick="KiraAuth.closeModal()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--c-text-muted);">✕</button>
                        </div>

                        <div class="auth-tabs">
                            <button id="tab-btn-login" class="auth-tab-btn active" onclick="KiraAuth.switchTab('login')" data-i18n="auth_login_tab">
                                ${lang === 'en' ? 'Sign In' : 'লগইন'}
                            </button>
                            <button id="tab-btn-signup" class="auth-tab-btn" onclick="KiraAuth.switchTab('signup')" data-i18n="auth_signup_tab">
                                ${lang === 'en' ? 'Create Account' : 'অ্যাকাউন্ট খুলুন'}
                            </button>
                        </div>

                        <!-- LOGIN FORM -->
                        <form id="auth-login-form" onsubmit="KiraAuth.handleLoginSubmit(event)">
                            <div class="auth-input-group">
                                <label data-i18n="label_email">Email Address</label>
                                <input type="email" id="login-email" required value="user@kira.com">
                            </div>
                            <div class="auth-input-group">
                                <label data-i18n="auth_pass">Password</label>
                                <input type="password" id="login-pass" required value="123456">
                            </div>
                            <div id="login-error" style="color:#FF5E5E; font-size:0.85rem; margin-bottom:0.8rem; display:none;"></div>
                            <button type="submit" class="clay-btn btn-coral btn-block" style="margin-top:0.5rem;" data-i18n="auth_login_tab">
                                Sign In
                            </button>
                            <div style="font-size:0.8rem; text-align:center; margin-top:1rem; color:var(--c-text-muted);">
                                💡 Demo Account: <strong>user@kira.com</strong> | Pass: <strong>123456</strong>
                            </div>
                        </form>

                        <!-- SIGNUP FORM -->
                        <form id="auth-signup-form" style="display:none;" onsubmit="KiraAuth.handleSignupSubmit(event)">
                            <div class="auth-input-group">
                                <label data-i18n="label_name">Full Name</label>
                                <input type="text" id="signup-name" required placeholder="e.g. Sidratul">
                            </div>
                            <div class="auth-input-group">
                                <label data-i18n="label_email">Email Address</label>
                                <input type="email" id="signup-email" required placeholder="name@example.com">
                            </div>
                            <div class="auth-input-group">
                                <label data-i18n="auth_pass">Password</label>
                                <input type="password" id="signup-pass" required placeholder="••••••••">
                            </div>
                            <div class="auth-input-group">
                                <label data-i18n="auth_phone">Phone Number</label>
                                <input type="tel" id="signup-phone" placeholder="+880 17...">
                            </div>
                            <div class="auth-input-group">
                                <label data-i18n="auth_address">Shipping Address</label>
                                <input type="text" id="signup-address" placeholder="Khulna, Bangladesh">
                            </div>
                            <div id="signup-error" style="color:#FF5E5E; font-size:0.85rem; margin-bottom:0.8rem; display:none;"></div>
                            <button type="submit" class="clay-btn btn-coral btn-block" style="margin-top:0.5rem;" data-i18n="auth_signup_tab">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },

        handleLoginSubmit: function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;
            const res = this.login(email, pass);
            if (res.success) {
                this.closeModal();
                showToast(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`);
            } else {
                const err = document.getElementById('login-error');
                err.textContent = res.message;
                err.style.display = 'block';
            }
        },

        handleSignupSubmit: function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const pass = document.getElementById('signup-pass').value;
            const phone = document.getElementById('signup-phone').value;
            const address = document.getElementById('signup-address').value;

            const res = this.register(name, email, pass, phone, address);
            if (res.success) {
                this.closeModal();
                showToast(`Account created! Welcome, ${res.user.name.split(' ')[0]}!`);
            } else {
                const err = document.getElementById('signup-error');
                err.textContent = res.message;
                err.style.display = 'block';
            }
        }
    };

    // Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown-container')) {
            document.querySelectorAll('.user-dropdown-container').forEach(el => el.classList.remove('open'));
        }
    });

    // Toast helper
    function showToast(msg) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span>${msg}</span>`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
    window.showToast = showToast;

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        KiraAuth.injectAuthModal();
        KiraAuth.updateUI();
    });
})();
