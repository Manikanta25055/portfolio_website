// ===================================
// Modern Portfolio - Interactive Features
// Black & Orange Theme with Magnetic Cursor
// ===================================

'use strict';

// ===================================
// Loading Screen with Particles
// ===================================
window.addEventListener('load', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const particleContainer = document.getElementById('particles');

    // Create floating particles
    const createParticles = () => {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particleContainer.appendChild(particle);
        }
    };

    createParticles();

    // Hide loader after 2.5 seconds
    setTimeout(() => {
        loaderWrapper.classList.add('hidden');
        document.body.classList.add('loaded');
    }, 2500);

    // Initialize particle network after loader
    setTimeout(() => {
        initParticleNetwork();
    }, 2600);
});

// ===================================
// Particle Network Animation
// ===================================
function initParticleNetwork() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = 80;
    let connectionDistance = 150;
    let mouseRadius = 200;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction - repulsion
            const dx = mouseX - this.x;
            const dy = (mouseY + window.scrollY) - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * force * 0.2;
                this.vy -= Math.sin(angle) * force * 0.2;
            }

            // Damping
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Keep minimum speed
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed < 0.1) {
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 107, 53, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    function createParticles() {
        particles = [];
        // Adjust particle count based on screen size
        particleCount = window.innerWidth > 768 ? 80 : 40;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 107, 53, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        requestAnimationFrame(animate);
    }

    animate();

    // Update canvas height on scroll
    let resizeTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newHeight = document.documentElement.scrollHeight;
            if (Math.abs(canvas.height - newHeight) > 100) {
                canvas.height = newHeight;
            }
        }, 100);
    });
}

// ===================================
// Magnetic Cursor Effect
// ===================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;
let cursorDotX = 0;
let cursorDotY = 0;
let cursorOutlineX = 0;
let cursorOutlineY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor animation
const animateCursor = () => {
    // Smooth follow for dot
    cursorDotX += (mouseX - cursorDotX) * 0.8;
    cursorDotY += (mouseY - cursorDotY) * 0.8;

    // Slower follow for outline
    cursorOutlineX += (mouseX - cursorOutlineX) * 0.15;
    cursorOutlineY += (mouseY - cursorOutlineY) * 0.15;

    cursorDot.style.transform = `translate(${cursorDotX}px, ${cursorDotY}px)`;
    cursorOutline.style.transform = `translate(${cursorOutlineX}px, ${cursorOutlineY}px)`;

    requestAnimationFrame(animateCursor);
};

animateCursor();

// Magnetic effect on interactive elements
const magneticElements = document.querySelectorAll('.magnetic-element, .btn, .nav-link, .bento-card, .project-card, .skill-card, .timeline-content, .contact-item, .social-link');

magneticElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
    });

    element.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
        element.style.transform = '';
    });

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Magnetic pull effect (subtle)
        const moveX = x * 0.15;
        const moveY = y * 0.15;

        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });
});

// ===================================
// Smooth Scroll Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.hamburger').classList.remove('active');
            }
        }
    });
});

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

// ===================================
// Mobile Navigation Toggle
// ===================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }
});

// ===================================
// Scroll Reveal Animations
// ===================================
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Add scroll reveal to elements
const addScrollReveals = () => {
    // Section titles
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        title.classList.add('scroll-reveal');
        observer.observe(title);
    });

    // Bento cards
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach((card, index) => {
        card.classList.add('scroll-reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('scroll-reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('scroll-reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('scroll-reveal');
        item.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(item);
    });

    // Contact items
    const contactItems = document.querySelectorAll('.contact-item, .contact-visual');
    contactItems.forEach((item, index) => {
        item.classList.add('scroll-reveal');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
};

// Initialize scroll reveals when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addScrollReveals);
} else {
    addScrollReveals();
}

// ===================================
// Active Section Highlighting in Nav
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active-section'));
            if (correspondingLink) {
                correspondingLink.classList.add('active-section');
            }
        }
    });
};

window.addEventListener('scroll', highlightNavOnScroll);

// ===================================
// Parallax Effect for Background Gradients
// ===================================
const gradientSpheres = document.querySelectorAll('.gradient-sphere');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    gradientSpheres.forEach((sphere, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        sphere.style.transform = `translateY(${yPos}px)`;
    });
});

// ===================================
// Interactive Hover Effects
// ===================================
// Tech badges hover effect
const techBadges = document.querySelectorAll('.tech-badge, .tech-icon');

techBadges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });

    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Skill items hover effect
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const dot = this.querySelector('.skill-dot');
        if (dot) {
            dot.style.transform = 'scale(1.5)';
            dot.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.6)';
        }
    });

    item.addEventListener('mouseleave', function() {
        const dot = this.querySelector('.skill-dot');
        if (dot) {
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = 'none';
        }
    });
});

// ===================================
// Debounce Function for Performance
// ===================================
const debounce = (func, wait = 10, immediate = true) => {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Apply debounce to scroll-heavy functions
const debouncedScroll = debounce(() => {
    highlightNavOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===================================
// Console Welcome Message
// ===================================
console.log(
    '%c Welcome to Manikanta Gonugondla\'s Portfolio ',
    'background: linear-gradient(135deg, #FF6B35 0%, #FF8C5F 100%); color: #0a0a0a; font-size: 18px; padding: 12px 24px; border-radius: 8px; font-weight: bold;'
);

console.log(
    '%c Electrical & Electronics Engineer | Hardware-Software Integration Specialist ',
    'color: #FF6B35; font-size: 14px; font-weight: 600; padding: 4px 0;'
);

console.log(
    '%c Interested in collaboration? Reach out at mgonugondlamanikanta@gmail.com ',
    'color: #a3a3a3; font-size: 12px;'
);

// ===================================
// Keyboard Accessibility
// ===================================
document.addEventListener('keydown', (e) => {
    // Enable keyboard navigation for interactive elements
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('project-card') ||
            e.target.classList.contains('bento-card') ||
            e.target.classList.contains('skill-card')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Make all interactive cards keyboard accessible
const interactiveCards = document.querySelectorAll('.bento-card, .project-card, .skill-card, .timeline-content, .contact-item');
interactiveCards.forEach(card => {
    if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
    }
});

// ===================================
// Page Visibility API - Pause Animations
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations when tab is not visible
        gradientSpheres.forEach(sphere => {
            sphere.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab is visible
        gradientSpheres.forEach(sphere => {
            sphere.style.animationPlayState = 'running';
        });
    }
});

// ===================================
// Smooth Page Transitions
// ===================================
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// ===================================
// Easter Egg - Konami Code
// ===================================
let konamiCode = [];
const konamiPattern = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Easter egg activated
        console.log('%c KONAMI CODE ACTIVATED! ', 'background: #FF6B35; color: white; font-size: 20px; padding: 10px;');
        console.log('%c You found the secret! Here\'s a fun fact: This portfolio was built with pure HTML, CSS, and JavaScript - no frameworks! ', 'color: #FF6B35; font-size: 14px;');

        // Add visual effect
        document.body.style.animation = 'pulse 0.5s ease-in-out 3';
    }
});

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// ===================================
// Performance Monitoring (Development)
// ===================================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('%c Performance Metrics ', 'background: #0a0a0a; color: #FF6B35; font-size: 14px; padding: 8px; font-weight: bold;');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Connection Time: ${connectTime}ms`);
            console.log(`Render Time: ${renderTime}ms`);
        }, 0);
    });
}

// ===================================
// Prevent Default Cursor on Touch Devices
// ===================================
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = 'auto';
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
}

// ===================================
// Dynamic Year in Footer
// ===================================
const footerCopyright = document.querySelector('.footer-copyright');
if (footerCopyright) {
    const currentYear = new Date().getFullYear();
    footerCopyright.textContent = `${currentYear}. All rights reserved.`;
}

// ===================================
// End of Script
// ===================================
console.log('%c Portfolio loaded successfully! ', 'color: #4ade80; font-size: 12px; font-weight: bold;');
