// Maingrace247 - Advanced Animations & Micro-interactions

(function() {
    'use strict';

    // Animation configuration
    const ANIMATION_CONFIG = {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        staggerDelay: 100,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Initialize animations
    document.addEventListener('DOMContentLoaded', function() {
        initScrollAnimations();
        initHoverAnimations();
        initLoadingAnimations();
        initTextAnimations();
        initCounterAnimations();
        initProgressAnimations();
        initMorphingAnimations();
    });

    // Scroll-triggered Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * ANIMATION_CONFIG.staggerDelay;
                    
                    setTimeout(() => {
                        animateElement(entry.target);
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(`
            .fade-in-up, .fade-in-left, .fade-in-right, .scale-in,
            .slide-in-left, .slide-in-right, .bounce-in, .flip-in
        `);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    function animateElement(element) {
        const animationType = getAnimationType(element);
        
        switch (animationType) {
            case 'fade-in-up':
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
                break;
            case 'fade-in-left':
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
                break;
            case 'fade-in-right':
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
                break;
            case 'scale-in':
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
                break;
            case 'bounce-in':
                element.style.animation = 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                element.style.opacity = '1';
                break;
            case 'flip-in':
                element.style.animation = 'flipIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                element.style.opacity = '1';
                break;
        }
    }

    function getAnimationType(element) {
        const classes = element.className.split(' ');
        return classes.find(cls => cls.includes('fade-in') || cls.includes('scale-in') || 
                                 cls.includes('slide-in') || cls.includes('bounce-in') || 
                                 cls.includes('flip-in')) || 'fade-in-up';
    }

    // Hover Animations
    function initHoverAnimations() {
        // Button hover effects
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', createRippleEffect);
            button.addEventListener('mouseleave', removeRippleEffect);
        });

        // Card hover effects
        const cards = document.querySelectorAll('.bento-card, .card-3d');
        cards.forEach(card => {
            card.addEventListener('mouseenter', enhanceCardHover);
            card.addEventListener('mouseleave', resetCardHover);
        });

        // Link hover effects
        const links = document.querySelectorAll('a:not(.btn-primary):not(.btn-secondary)');
        links.forEach(link => {
            link.addEventListener('mouseenter', animateLinkHover);
            link.addEventListener('mouseleave', resetLinkHover);
        });
    }

    function createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function removeRippleEffect(event) {
        const ripples = event.currentTarget.querySelectorAll('span');
        ripples.forEach(ripple => ripple.remove());
    }

    function enhanceCardHover(event) {
        const card = event.currentTarget;
        card.style.transform = 'translateY(-12px) rotateX(5deg)';
        card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        
        // Add glow effect
        card.style.boxShadow += ', 0 0 20px rgba(76, 175, 80, 0.2)';
    }

    function resetCardHover(event) {
        const card = event.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    function animateLinkHover(event) {
        const link = event.currentTarget;
        link.style.transform = 'translateX(5px)';
        link.style.color = '#4CAF50';
    }

    function resetLinkHover(event) {
        const link = event.currentTarget;
        link.style.transform = '';
        link.style.color = '';
    }

    // Loading Animations
    function initLoadingAnimations() {
        // Skeleton loading for content
        const skeletonElements = document.querySelectorAll('.skeleton');
        skeletonElements.forEach(element => {
            element.style.animation = 'skeleton-loading 1.5s infinite';
        });

        // Progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const progress = bar.dataset.progress || 0;
            animateProgressBar(bar, progress);
        });
    }

    function animateProgressBar(bar, targetProgress) {
        let currentProgress = 0;
        const increment = targetProgress / 50;
        
        const interval = setInterval(() => {
            currentProgress += increment;
            bar.style.width = `${Math.min(currentProgress, targetProgress)}%`;
            
            if (currentProgress >= targetProgress) {
                clearInterval(interval);
            }
        }, 20);
    }

    // Text Animations
    function initTextAnimations() {
        // Typewriter effect
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            typewriterEffect(element);
        });

        // Text reveal animations
        const textRevealElements = document.querySelectorAll('.text-reveal');
        textRevealElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        revealText(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(element);
        });
    }

    function typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #4CAF50';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
                element.style.borderRight = 'none';
            }
        }, 100);
    }

    function revealText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.overflow = 'hidden';
        
        let i = 0;
        const revealInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(revealInterval);
                element.style.overflow = 'visible';
            }
        }, 50);
    }

    // Counter Animations
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const interval = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(Math.min(current, target));
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(interval);
            }
        }, 16);
    }

    // Progress Animations
    function initProgressAnimations() {
        const progressElements = document.querySelectorAll('.progress-circle');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressCircle(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        progressElements.forEach(element => observer.observe(element));
    }

    function animateProgressCircle(element) {
        const progress = element.dataset.progress || 0;
        const circle = element.querySelector('circle');
        const circumference = 2 * Math.PI * 45; // radius = 45
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Morphing Animations
    function initMorphingAnimations() {
        const morphElements = document.querySelectorAll('.morph');
        
        morphElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.1) rotate(5deg)';
                element.style.filter = 'brightness(1.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.filter = '';
            });
        });
    }

    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance optimizations
    const throttledScrollHandler = throttle(() => {
        // Handle scroll-based animations
    }, 16);

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            .fade-in-up, .fade-in-left, .fade-in-right, .scale-in,
            .slide-in-left, .slide-in-right, .bounce-in, .flip-in {
                opacity: 1 !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Mobile optimizations
    if (window.matchMedia('(max-width: 768px)').matches) {
        const style = document.createElement('style');
        style.textContent = `
            .hover-lift:hover {
                transform: translateY(-2px) !important;
            }
            .bento-card:hover {
                transform: translateY(-4px) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Export animation utilities
    window.Maingrace247 = window.Maingrace247 || {};
    window.Maingrace247.Animations = {
        animateElement,
        animateCounter,
        animateProgressBar,
        typewriterEffect,
        revealText,
        throttle,
        debounce
    };

})(); 