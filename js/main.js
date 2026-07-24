document.addEventListener('DOMContentLoaded', () => {

    // 0. Auto-Inject Background Animated Blobs across ALL pages
    function injectBackgroundBlobs() {
        if (document.querySelector('.blob-container')) return;
        const container = document.createElement('div');
        container.className = 'blob-container';
        container.innerHTML = `
            <svg class="blob blob-1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFD3B6" d="M47.7,-63.5C61.4,-53.4,71.7,-38.3,75.1,-22.1C78.5,-6,75.1,11.2,68.4,26.9C61.8,42.5,52,56.6,38.6,64.8C25.2,73.1,8.3,75.4,-8.1,72.4C-24.5,69.5,-40.4,61.1,-52.3,49C-64.2,36.8,-72,21,-74,4.2C-76,-12.6,-72.1,-30.4,-61.8,-42C-51.5,-53.6,-34.7,-59.1,-19,-63.9C-3.4,-68.6,11.1,-72.6,27.1,-71.4C43.1,-70.2,60.6,-63.9,47.7,-63.5Z" transform="translate(100 100)" />
            </svg>
            <svg class="blob blob-2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#D4ECD5" d="M54.5,-63C68.9,-53.2,77.9,-34.8,79.5,-16.6C81.1,1.7,75.4,19.8,66.8,36.1C58.2,52.4,46.7,66.9,31.7,73.1C16.7,79.3,-1.7,77.3,-19.7,72.1C-37.7,66.9,-55.3,58.5,-65.4,44.1C-75.5,29.8,-78.1,9.6,-74.6,-9.3C-71.1,-28.2,-61.5,-45.8,-46.9,-55.6C-32.3,-65.3,-12.7,-67.2,5.2,-63.3C23.1,-59.5,45.9,-49.9,54.5,-63Z" transform="translate(100 100)" />
            </svg>
        `;
        document.body.prepend(container);
    }
    injectBackgroundBlobs();

    // 1. Mobile Menu Toggle & Auto-Close on link click
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-dropdown');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });

        // Close dropdown when a link is tapped
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // 2. Active Link Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-menu-dropdown a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 3. Header Scroll Effect
    const mainHeader = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                if (entry.target.querySelector('.stat-number')) {
                    triggerCounters(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Stat Counter Animation
    let statsTriggered = false;
    function triggerCounters(container) {
        if (statsTriggered) return;

        const statEls = container.querySelectorAll('.stat-number[data-target]');
        if (statEls.length === 0) return;
        statsTriggered = true;

        statEls.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            let current = 0;
            const step = Math.ceil(target / 60);

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current.toLocaleString();
            }, 25);
        });
    }

    // 6. Language Switcher Logic (Bilingual EN / BN)
    let currentLang = localStorage.getItem('shapey_lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('shapey_lang', lang);

        if (typeof translations === 'undefined' || !translations[lang]) return;

        const dict = translations[lang];

        // Update data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });

        // Update data-i18n-placeholder elements
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // Update toggle button text
        document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
            btn.innerHTML = lang === 'en' ? '🌐 <span class="btn-text">English <span style="opacity:0.6;">| বাংলা</span></span>' : '🌐 <span class="btn-text">বাংলা <span style="opacity:0.6;">| EN</span></span>';
        });
    }

    // Attach click listener to lang buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'bn' : 'en';
            setLanguage(nextLang);
        });
    });

    // Initialize Language
    setLanguage(currentLang);

    // 7. Automatic 3-Way Theme Switcher (System Default 💻 / Light ☀️ / Dark 🌙)
    let currentThemeMode = localStorage.getItem('kiras_theme') || 'system';

    function applyTheme(mode) {
        currentThemeMode = mode;
        localStorage.setItem('kiras_theme', mode);

        let effectiveTheme = mode;
        if (mode === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveTheme = systemPrefersDark ? 'dark' : 'light';
        }

        if (effectiveTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Update theme toggle buttons with icon & title
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            if (mode === 'system') {
                btn.innerHTML = '💻 <span class="btn-text" style="font-size:0.75rem; opacity:0.85;">Auto</span>';
                btn.setAttribute('title', 'Theme: System Default (Auto)');
                btn.setAttribute('aria-label', 'Theme Mode: System Default (Auto)');
            } else if (mode === 'light') {
                btn.innerHTML = '☀️ <span class="btn-text" style="font-size:0.75rem; opacity:0.85;">Light</span>';
                btn.setAttribute('title', 'Theme: Light Mode');
                btn.setAttribute('aria-label', 'Theme Mode: Light');
            } else {
                btn.innerHTML = '🌙 <span class="btn-text" style="font-size:0.75rem; opacity:0.85;">Dark</span>';
                btn.setAttribute('title', 'Theme: Dark Mode');
                btn.setAttribute('aria-label', 'Theme Mode: Dark');
            }
        });
    }

    // Cycle through modes: system -> light -> dark -> system
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let nextMode = 'system';
            if (currentThemeMode === 'system') nextMode = 'light';
            else if (currentThemeMode === 'light') nextMode = 'dark';
            else if (currentThemeMode === 'dark') nextMode = 'system';
            
            applyTheme(nextMode);
        });
    });

    // Listen to System OS Theme Preference Changes in Real-Time
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentThemeMode === 'system') {
                applyTheme('system');
            }
        });
    } catch(e) {}

    // Initialize Theme
    applyTheme(currentThemeMode);
});
