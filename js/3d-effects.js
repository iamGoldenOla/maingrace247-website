// Maingrace247 - 3D Effects & Depth

(function() {
    'use strict';

    // Initialize 3D effects
    document.addEventListener('DOMContentLoaded', function() {
        initParallaxEffects();
        initCardTilting();
        initDepthLayers();
        init3DScrollEffects();
        initFloatingElements();
    });

    // Parallax Effects
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                const scale = 1 + (scrolled * 0.0001);
                
                element.style.transform = `translateY(${yPos}px) scale(${scale})`;
            });
            
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Card Tilting Effects
    function initCardTilting() {
        const cards = document.querySelectorAll('.card-3d, .bento-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', handleCardTilt);
            card.addEventListener('mouseleave', resetCardTilt);
        });

        function handleCardTilt(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            e.currentTarget.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
            `;
        }

        function resetCardTilt(e) {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    }

    // Depth Layers
    function initDepthLayers() {
        const depthElements = document.querySelectorAll('.depth-shadow');
        
        depthElements.forEach(element => {
            element.addEventListener('mousemove', handleDepthShadow);
            element.addEventListener('mouseleave', resetDepthShadow);
        });

        function handleDepthShadow(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const shadowX = (x - centerX) / 20;
            const shadowY = (y - centerY) / 20;
            
            e.currentTarget.style.boxShadow = `
                ${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.2),
                0 10px 30px rgba(0, 0, 0, 0.1)
            `;
        }

        function resetDepthShadow(e) {
            e.currentTarget.style.boxShadow = '';
        }
    }

    // 3D Scroll Effects
    function init3DScrollEffects() {
        const scrollElements = document.querySelectorAll('.scroll-3d');
        
        if (scrollElements.length === 0) return;

        let ticking = false;
        
        function updateScroll3D() {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            scrollElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrolled;
                const elementCenter = elementTop + rect.height / 2;
                const distanceFromCenter = Math.abs(scrolled + windowHeight / 2 - elementCenter);
                
                const maxDistance = windowHeight;
                const progress = Math.max(0, 1 - distanceFromCenter / maxDistance);
                
                const translateZ = progress * 50;
                const scale = 0.8 + progress * 0.2;
                const opacity = 0.3 + progress * 0.7;
                
                element.style.transform = `translateZ(${translateZ}px) scale(${scale})`;
                element.style.opacity = opacity;
                element.setAttribute('data-scroll', Math.floor(progress * 3));
            });
            
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll3D);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Floating Elements Animation
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-3d');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 0.5;
            element.style.animationDelay = `${delay}s`;
            
            // Add mouse interaction
            element.addEventListener('mousemove', handleFloatingInteraction);
            element.addEventListener('mouseleave', resetFloatingInteraction);
        });

        function handleFloatingInteraction(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (x - centerX) / 20;
            
            e.currentTarget.style.transform = `
                translateY(-10px) 
                translateZ(20px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        }

        function resetFloatingInteraction(e) {
            e.currentTarget.style.transform = '';
        }
    }

    // 3D Button Effects
    function init3DButtons() {
        const buttons = document.querySelectorAll('.btn-3d');
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', handleButtonPress);
            button.addEventListener('mouseup', handleButtonRelease);
            button.addEventListener('mouseleave', handleButtonRelease);
        });

        function handleButtonPress(e) {
            e.currentTarget.style.transform = 'translateY(2px) translateZ(0px)';
        }

        function handleButtonRelease(e) {
            e.currentTarget.style.transform = 'translateY(0px) translateZ(4px)';
        }
    }

    // 3D Text Effects
    function init3DText() {
        const textElements = document.querySelectorAll('.text-3d');
        
        textElements.forEach(element => {
            element.addEventListener('mousemove', handleText3D);
            element.addEventListener('mouseleave', resetText3D);
        });

        function handleText3D(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (x - centerX) / 30;
            
            e.currentTarget.style.transform = `
                translateZ(10px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        }

        function resetText3D(e) {
            e.currentTarget.style.transform = '';
        }
    }

    // 3D Gallery Effects
    function init3DGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item-3d');
        
        galleryItems.forEach(item => {
            item.addEventListener('mousemove', handleGallery3D);
            item.addEventListener('mouseleave', resetGallery3D);
        });

        function handleGallery3D(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (x - centerX) / 15;
            
            e.currentTarget.style.transform = `
                rotateY(${rotateY}deg) 
                rotateX(${rotateX}deg) 
                translateZ(30px)
            `;
        }

        function resetGallery3D(e) {
            e.currentTarget.style.transform = '';
        }
    }

    // Performance optimizations
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

    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable all 3D effects for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .card-3d, .bento-card, .parallax-layer, .depth-shadow, 
            .scroll-3d, .float-3d, .btn-3d, .text-3d, .gallery-item-3d {
                transform: none !important;
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Mobile optimizations
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Reduce 3D effects on mobile for better performance
        const style = document.createElement('style');
        style.textContent = `
            .card-3d:hover, .bento-card:hover {
                transform: translateY(-4px) !important;
            }
            .float-3d {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize additional 3D effects after a short delay
    setTimeout(() => {
        init3DButtons();
        init3DText();
        init3DGallery();
    }, 100);

})(); 