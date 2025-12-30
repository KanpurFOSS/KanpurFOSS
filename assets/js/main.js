/**
 * KanpurFOSS Global Animations
 * Minimalist & Stable
 */

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-active');
            navLinks.classList.toggle('is-active');
        });
    }

    // 1. Initial Page Reveal
    gsap.from('body', { opacity: 0, duration: 0.6 });

    // 2. Typewriter Effect for Small Text
    const initTypewriter = () => {
        const elements = document.querySelectorAll('.page-subtitle, .post-header p:not(.post-title), .footer-invite-link');
        elements.forEach(el => {
            const text = el.textContent.trim();
            el.textContent = '';
            el.style.visibility = 'visible';
            
            gsap.to(el, {
                text: text,
                duration: 2,
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    once: true
                },
                onStart: () => {
                    let i = 0;
                    el.textContent = '';
                    const timer = setInterval(() => {
                        if (i < text.length) {
                            el.textContent += text.charAt(i);
                            i++;
                        } else {
                            clearInterval(timer);
                        }
                    }, 30);
                }
            });
        });
    };
    initTypewriter();

    // 3. Robust Scroll Reveal
    window.initScrollAnimations = (selector = '.post-card, .card-media, .group-card-mirrored, .post-title, .page-title') => {
        document.querySelectorAll(selector).forEach(el => {
            if (el.dataset.animated) return;
            gsap.from(el, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    onEnter: () => el.dataset.animated = "true"
                }
            });
        });
    };
    window.initScrollAnimations();

    // 4. Dynamic Marquee Generation (Smooth, Endless, Config-controlled)
    const initMarquees = () => {
        const topKeywords = ["Python", "Open Source", "WordPress", "Javascript", "Docker", "Rust", "Kubernetes", "Linux", "Git", "AI", "Machine Learning"];
        const bottomKeywords = ["Community", "Collaboration", "Innovation", "Networking", "Kanpur.js", "PyData", "Hackerspace", "Makerspace", "Security", "Privacy", "Design", "UX"];

        const generateHTML = (keywords) => {
            const items = keywords.map(tag => `
                <span class="flex-shrink-0 text-sm uppercase font-medium tracking-widest mx-6">${tag}</span>
                <span class="flex-shrink-0 text-lg opacity-50 mx-6">•</span>
            `).join('');
            // Triple the content for seamless infinite loop
            return `<div class="marquee-track flex items-center whitespace-nowrap">${items}${items}${items}</div>`;
        };

        const blackMarquee = document.getElementById('marquee-black');
        const whiteMarquee = document.getElementById('marquee-white');

        if (blackMarquee) blackMarquee.innerHTML = generateHTML(topKeywords);
        if (whiteMarquee) whiteMarquee.innerHTML = generateHTML(bottomKeywords);

        // Animate each marquee
        document.querySelectorAll('.marquee-track').forEach((track) => {
            const container = track.parentElement;
            const isReverse = container.classList.contains('reverse');
            
            // Get speed from data attribute (set via Jekyll config)
            const speed = parseFloat(container.dataset.speed) || (isReverse ? 25 : 10);
            
            // Create the animation
            const tween = gsap.to(track, {
                xPercent: isReverse ? 0 : -33.333, // Move by 1/3 since we tripled content
                repeat: -1,
                duration: speed,
                ease: "linear", // Perfectly smooth, constant speed
                ...(isReverse && { xPercent: -33.333, reversed: true })
            });

            // For reverse, start from offset position
            if (isReverse) {
                gsap.set(track, { xPercent: -33.333 });
                gsap.to(track, {
                    xPercent: 0,
                    repeat: -1,
                    duration: speed,
                    ease: "linear"
                });
            }
            
            // Pause on hover for better UX
            container.addEventListener('mouseenter', () => {
                gsap.to(track, { timeScale: 0, duration: 0.3, ease: "power2.out" });
            });
            container.addEventListener('mouseleave', () => {
                gsap.to(track, { timeScale: 1, duration: 0.3, ease: "power2.out" });
            });
        });
    };
    initMarquees();

    // 5. Button Hover
    document.querySelectorAll('.btn, .btn-rsvp').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.2 }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2 }));
    });
});
