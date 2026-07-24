/* ==========================================================================
   KIRA'S CREATION - USER AUTHENTICATION & PROFILE MANAGER (js/auth.js)
   ========================================================================== */

(function() {
    // Game & 3D Character Avatar Presets
    window.KiraAvatars = [
        { id: 'av_robo', name: 'Cyber Bot', icon: '🤖', bg: 'linear-gradient(135deg, #FF6B6B, #FFE66D)', border: '#FF6B6B', title: 'AI 3D Maker' },
        { id: 'av_pilot', name: 'Sci-Fi Pilot', icon: '🚀', bg: 'linear-gradient(135deg, #4E54C8, #8F94FB)', border: '#8F94FB', title: 'Space Crafter' },
        { id: 'av_fox', name: 'Cyber Fox', icon: '🦊', bg: 'linear-gradient(135deg, #FF9F43, #FF5252)', border: '#FF9F43', title: 'Speedy Modeler' },
        { id: 'av_wizard', name: 'Print Wizard', icon: '🧙‍♂️', bg: 'linear-gradient(135deg, #8E2DE2, #4A00E0)', border: '#8E2DE2', title: 'Magic Architect' },
        { id: 'av_king', name: 'Crown King', icon: '👑', bg: 'linear-gradient(135deg, #F7971E, #FFD200)', border: '#F7971E', title: 'Pro Designer' },
        { id: 'av_cat', name: 'Cosmic Meow', icon: '🐱', bg: 'linear-gradient(135deg, #00B4DB, #0083B0)', border: '#00B4DB', title: 'Cute Sculpter' },
        { id: 'av_dragon', name: 'Neon Dragon', icon: '🐲', bg: 'linear-gradient(135deg, #11998E, #38EF7D)', border: '#38EF7D', title: 'Beast Producer' },
        { id: 'av_gamer', name: 'Pixel Gamer', icon: '🎮', bg: 'linear-gradient(135deg, #FC466B, #3F5EFB)', border: '#FC466B', title: 'Hero Builder' },
        { id: 'av_ninja', name: 'Shadow Ninja', icon: '🥷', bg: 'linear-gradient(135deg, #3A3D40, #181719)', border: '#666666', title: 'Stealth Cutter' },
        { id: 'av_alien', name: 'Galaxy Alien', icon: '👾', bg: 'linear-gradient(135deg, #D4145A, #FBB03B)', border: '#D4145A', title: 'Alien Engineer' }
    ];

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

        // Set demo user logged in by default if no active session
        // Removed to allow real users to register and login independently.
        // if (!localStorage.getItem('kiras_active_user')) {
        //     localStorage.setItem('kiras_active_user', JSON.stringify(DEMO_USER));
        // }
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
                // Update in all users array
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
                id: 'KIRA-USR-' + Math.floor(10000 + Math.random() * 90000), // Generates e.g., KIRA-USR-49215
                name: name.trim(),
                email: email.trim(),
                password: password,
                phone: phone.trim() || '',
                address: address.trim() || '',
                presets: []
            };

            users.push(newUser);
            localStorage.setItem('kiras_users', JSON.stringify(users));

            // Sync user registration to Google Sheet
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

        // Saved Presets Manager
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
            showToast('⭐ Preset saved to your account!');
            return true;
        },

        deletePreset: function(presetId) {
            let user = this.getCurrentUser();
            if (!user || !user.presets) return;
            user.presets = user.presets.filter(p => p.id !== presetId);
            this.setCurrentUser(user);
            showToast('Preset deleted.');
        },

        // Get Orders for Logged In User
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
            showToast(`${av.icon} Character avatar set to ${av.name}! 🎉`);

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
                        <div class="avatar-icon-bubble" style="background:${av.bg}; border: 2px solid ${av.border};">
                            ${av.icon}
                        </div>
                        <div style="font-weight:700; font-size:0.88rem; color:var(--c-text);">${av.name}</div>
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
                    <div class="modal-content clay-card" style="max-width:560px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                            <div>
                                <h2 style="font-family:var(--f-head); color:var(--c-primary); margin:0;">
                                    🎭 ${lang === 'en' ? 'Choose Character Avatar' : 'ক্যারেক্টার প্রিসেট ছবি বেছে নিন'}
                                </h2>
                                <p style="margin:0.2rem 0 0 0; font-size:0.85rem; color:var(--c-text-muted);">
                                    ${lang === 'en' ? 'Select a cool 3D gaming avatar character for your profile!' : 'আপনার প্রোফাইলের জন্য একটি দুর্দান্ত থ্রিডি গেম প্রিসেট ছবি সিলেক্ট করুন!'}
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
                            <button class="header-user-btn" aria-label="User Account">
                                <span class="auth-avatar" style="background:${av.bg}; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.95rem; flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,0.2);">${av.icon}</span>
                                <span>${firstName}</span> ▾
                            </button>
                            <div class="user-dropdown-menu">
                                <div style="display:flex; align-items:center; gap:0.8rem; padding:0.6rem 0.8rem; border-bottom:1px solid rgba(0,0,0,0.08); margin-bottom:0.3rem;">
                                    <div onclick="KiraAuth.openAvatarModal()" style="width:42px; height:42px; border-radius:50%; background:${av.bg}; display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 4px 12px rgba(0,0,0,0.15); flex-shrink:0; cursor:pointer;" title="Change Avatar Character">
                                        ${av.icon}
                                    </div>
                                    <div style="flex:1; overflow:hidden;">
                                        <div style="font-weight:700; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.name}</div>
                                        <div style="font-size:0.75rem; color:var(--c-text-muted);">${av.name} • ${user.email}</div>
                                    </div>
                                </div>
                                <div class="user-dropdown-item" onclick="KiraAuth.openAvatarModal()" style="color:var(--c-primary); font-weight:700;">
                                    🎭 ${lang === 'en' ? 'Change Character Avatar' : 'ক্যারেক্টার পিকচার পরিবর্তন'}
                                </div>
                                <a href="account.html" class="user-dropdown-item">👤 ${lang === 'en' ? 'My Account' : 'আমার অ্যাকাউন্ট'}</a>
                                <a href="account.html#presets" class="user-dropdown-item">⭐ ${lang === 'en' ? 'Saved Presets' : 'সেভ করা প্রিসেট'}</a>
                                <a href="account.html#orders" class="user-dropdown-item">📦 ${lang === 'en' ? 'Order History' : 'অর্ডার হিস্ট্রি'}</a>
                                <div class="user-dropdown-item" style="color:#FF5E5E;" onclick="KiraAuth.logout()">🚪 ${lang === 'en' ? 'Log Out' : 'লগআউট'}</div>
                            </div>
                        </div>
                    `;
                } else {
                    slot.innerHTML = `
                        <button class="header-user-btn" onclick="KiraAuth.openModal('login')">
                            👤 <span>${lang === 'en' ? 'Sign In' : 'লগইন'}</span>
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
                showToast(`Account created! Welcome, ${res.user.name.split(' ')[0]}! 🎉`);
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
