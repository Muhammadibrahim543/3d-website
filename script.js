document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Toggle & Menu Dropdown
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-dropdown');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        // Close menu on link clicks
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // 2. Header Shadow on Scroll
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Trigger stat counters if this is the stats section
                if (entry.target.classList.contains('stats-section')) {
                    triggerStatsCounters(entry.target);
                }
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Stats Counter Animation
    let statsAnimated = false;
    function triggerStatsCounters(section) {
        if (statsAnimated) return;
        statsAnimated = true;

        const numbers = section.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing curve (easeOutQuad)
                const easedProgress = progress * (2 - progress);
                count = Math.floor(easedProgress * target);
                
                num.textContent = count.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    num.textContent = target.toLocaleString();
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // 5. Portfolio Category Filter
    const filterPills = document.querySelectorAll('.filter-pill');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active pill
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    // Re-trigger reveal animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 6. Testimonials Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Dot navigation click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });

    function startInterval() {
        carouselInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
        clearInterval(carouselInterval);
        startInterval();
    }

    if (slides.length > 0) {
        startInterval();
    }

    // 7. FAQ Accordion with morphing SVG paths
    const faqRows = document.querySelectorAll('.faq-row');
    
    // Path string shapes
    const PLUS_PATH = "M12 7 L12 17 M7 12 L17 12";
    const SMILE_PATH = "M7 10 Q12 18 17 10"; // Friendly smile curve
    
    faqRows.forEach(row => {
        const headerBtn = row.querySelector('.faq-header');
        const bodyEl = row.querySelector('.faq-body');
        const pathEl = row.querySelector('.plus-path');

        headerBtn.addEventListener('click', () => {
            const isOpen = row.classList.contains('open');

            // Close all open rows first
            faqRows.forEach(r => {
                r.classList.remove('open');
                r.querySelector('.faq-body').style.maxHeight = null;
                const otherPath = r.querySelector('.plus-path');
                if (otherPath) otherPath.setAttribute('d', PLUS_PATH);
            });

            // Toggle selected row
            if (!isOpen) {
                row.classList.add('open');
                bodyEl.style.maxHeight = bodyEl.scrollHeight + "px";
                if (pathEl) pathEl.setAttribute('d', SMILE_PATH);
            }
        });
    });

    // 8. Add soft wobble wiggle effect to organic blobs in background on click
    const backBlobs = document.querySelectorAll('.blob');
    document.addEventListener('click', (e) => {
        // Find if a button or card was clicked
        if (e.target.closest('.clay-card') || e.target.closest('.clay-btn')) {
            backBlobs.forEach(blob => {
                blob.style.transform = 'scale(1.05) rotate(15deg)';
                setTimeout(() => {
                    blob.style.transform = '';
                }, 800);
            });
        }
    });
});
