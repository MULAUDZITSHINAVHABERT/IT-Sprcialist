// script.js - Modern Portfolio Interactions
// Mulaudzi Tshinavha Bert | IT Specialist Portfolio

(function() {
    'use strict';

    // ---------- DOM Elements ----------
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const cursorGlow = document.querySelector('.cursor-glow');
    const footerYear = document.querySelector('.footer-inner p');

    // ---------- Helper Functions ----------
    function updateFooterYear() {
        if (footerYear) {
            const currentYear = new Date().getFullYear();
            footerYear.innerHTML = `© ${currentYear} Mulaudzi Tshinavha Bert — All systems operational`;
        }
    }

    // ---------- 1. Mobile Menu Toggle ----------
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            // Change icon (optional)
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('show')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when clicking on a nav link
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close menu if clicking outside (optional)
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                navLinks.classList.remove('show');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ---------- 2. Cool Cursor Glow (Performant) ----------
    if (cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            // Smooth following with lerp
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;
            cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();

        // Hide cursor glow on touch devices (optional)
        if ('ontouchstart' in window) {
            cursorGlow.style.display = 'none';
        }
    }

    // ---------- 3. Smooth Scroll with Offset for Sticky Nav ----------
    const navHeight = document.querySelector('.glass-nav')?.offsetHeight || 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                // Update URL hash without jumping (optional)
                history.pushState(null, null, targetId);
            }
        });
    });

    // ---------- 4. Scroll Spy: Active Navigation Highlight ----------
    function updateActiveNavOnScroll() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + navHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.substring(1) === currentSectionId) {
                item.style.color = '#60A5FA';
                // add active underline style inline or extra class
                item.style.fontWeight = '600';
            } else {
                item.style.color = '#CBD5E1';
                item.style.fontWeight = '500';
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveNavOnScroll);
    });
    updateActiveNavOnScroll(); // initial call

    // ---------- 5. Intersection Observer: Fade-in Animation on Scroll ----------
    const fadeElements = document.querySelectorAll('.exp-card, .cert-card, .skill-category, .hero-content, .hero-photo, .achievement-highlight');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s ease';
        observer.observe(el);
    });

    // Also ensure hero stats fade in
    const heroStats = document.querySelectorAll('.hero-stats div');
    heroStats.forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(15px)';
        stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(stat);
    });

    // ---------- 6. Stats Counter Animation (Optional / cool) ----------
    // For numbers like "3+ years" and "3x" - animate count on view
    const statNumbers = document.querySelectorAll('.hero-stats span');
    let animated = false;

    function animateStats() {
        if (animated) return;
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animated = true;
            statNumbers.forEach(span => {
                let target = span.innerText;
                if (target.includes('+')) target = target.replace('+', '');
                if (target.includes('x')) target = target.replace('x', '');
                let finalNumber = parseInt(target);
                if (isNaN(finalNumber)) return;
                let current = 0;
                const duration = 1000;
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = finalNumber / steps;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        clearInterval(timer);
                        span.innerText = target.includes('+') ? finalNumber + '+' : (target.includes('x') ? finalNumber + 'x' : finalNumber);
                    } else {
                        span.innerText = Math.floor(current) + (target.includes('+') ? '+' : (target.includes('x') ? 'x' : ''));
                    }
                }, stepTime);
            });
        }
    }

    window.addEventListener('scroll', () => requestAnimationFrame(animateStats));
    animateStats(); // trigger check

    // ---------- 7. Typing Effect for Tagline? (optional subtle) ----------
    // As a bonus, type out IT Specialist? but keep clean: we can add a small blinking cursor
    const tagline = document.querySelector('.hero-tagline');
    if (tagline && !tagline.hasAttribute('data-typed')) {
        tagline.setAttribute('data-typed', 'true');
        const originalText = tagline.innerText;
        tagline.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                tagline.innerText += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 70);
            } else {
                tagline.style.borderRight = 'none';
            }
        }
        typeWriter();
    }

    // ---------- 8. Preload images or add Class to body after load ----------
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        // small parallax effect for tech-badge? (optional)
    });

    // Update copyright year dynamically
    updateFooterYear();

    // ---------- 9. Additional Polish: Tooltip or Glassmorphism hover effects ----------
    // Add subtle data-glitch effect on logo (just for style)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.textShadow = '0 0 5px #3B82F6';
        });
        logo.addEventListener('mouseleave', () => {
            logo.style.textShadow = 'none';
        });
    }

    console.log('✨ Portfolio interactive features loaded — Mulaudzi Tshinavha Bert');
})();