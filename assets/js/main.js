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

    // 4. Dynamic Marquee Generation (Premium, Truly Seamless, Infinite)
    const initMarquees = () => {
        const topKeywords = [
  "Python", 
  "WordPress", 
  "JavaScript", 
  "Docker", 
  "Rust", 
  "Kubernetes", 
  "Linux", 
  "Git", 
  "AI", 
  "WebAssembly", 
  "PostgreSQL", 
  "React",
  "Svelte",
  "Vue"
];

const bottomKeywords = [
  "Kanpur WordPress Meetup", 
  "Docker Kanpur", 
  "HS4: Hackerspace", 
  "PyData Kanpur", 
  "Kanpur Python", 
  "Makers and Coders of Kanpur", 
  "Collaboration", 
  "Community", 
  "Innovation", 
  "Open Source", 
  "Networking", 
  "Kanpur.js"
];

        const createMarquee = (elementId, keywords) => {
            const container = document.getElementById(elementId);
            if (!container) return;

            // 1. Setup DOM Structure
            container.innerHTML = '';
            const track = document.createElement('div');
            
            // Apply flex styles explicitly to ensure layout works
            track.className = 'marquee-track marquee-content';
            track.style.display = 'flex';
            track.style.alignItems = 'center';
            track.style.width = 'max-content';
            track.style.willChange = 'transform';
            
            container.appendChild(track);

            const generateItems = () => {
                return keywords.map(tag => `
                    <div class="marquee-item" style="display: flex; align-items: center; flex-shrink: 0;">
                        <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: inherit;">${tag}</span>
                        <span class="separator" style="margin: 0 40px; opacity: 0.4;">•</span>
                    </div>
                `).join('');
            };

            // 2. Precise Measurement Logic
            // Add Set 1
            track.innerHTML = generateItems();
            const widthSet1 = track.scrollWidth;

            // Add Set 2
            track.innerHTML += generateItems();
            const widthSet2 = track.scrollWidth;

            // The exact distance to travel one full loop
            const travelDistance = widthSet2 - widthSet1;

            // 3. Fill the screen (4 sets usually covers all standard widths)
            track.innerHTML += generateItems();
            track.innerHTML += generateItems();

            // 4. Configure Animation
            const isReverse = container.classList.contains('reverse');
            // Base speed: pixels per second
            const baseSpeed = 50; 
            const duration = travelDistance / baseSpeed;
            
            // Allow override via data-speed (acts as raw duration override or multiplier if needed, keeping simple here)
            const configSpeed = parseFloat(container.dataset.speed) || (isReverse ? 40 : 30);
            
            let tween;

            if (isReverse) {
                // Moving RIGHT
                gsap.set(track, { x: -travelDistance });
                tween = gsap.to(track, {
                    x: 0,
                    duration: configSpeed,
                    ease: "none",
                    repeat: -1
                });
            } else {
                // Moving LEFT
                gsap.set(track, { x: 0 });
                tween = gsap.to(track, {
                    x: -travelDistance,
                    duration: configSpeed,
                    ease: "none",
                    repeat: -1
                });
            }

            // 5. Interaction
            container.addEventListener('mouseenter', () => tween.timeScale(0));
            container.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.5 }));
        };

        createMarquee('marquee-black', topKeywords);
        createMarquee('marquee-white', bottomKeywords);
    };
    initMarquees();

    // 5. Button Hover
    document.querySelectorAll('.btn, .btn-rsvp').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.2 }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2 }));
    });
});
