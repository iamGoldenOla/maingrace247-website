// Maingrace247 - Main JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoadingScreen();
    initMobileNavigation();
    initSmoothScrolling();
    initIntersectionObserver();
    initParallaxEffects();
    initFormValidation();
    initLazyLoading();
    initPerformanceOptimizations();
    initMobileEnhancements();
    
    console.log('Maingrace247 website initialized');
});

// Loading Screen Management
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
        // Simulate loading time (remove in production)
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// Mobile Navigation
function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Animate menu button
            const icon = mobileMenuBtn.querySelector('svg');
            if (icon) {
                icon.style.transform = mobileMenu.classList.contains('hidden') 
                    ? 'rotate(0deg)' 
                    : 'rotate(90deg)';
            }
        });
        
        // Close menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('svg');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('svg');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animations for child elements
                const staggerElements = entry.target.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5');
                staggerElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showFieldError(input, 'This field is required');
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error-shake');
    field.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    
    // Remove shake animation after completion
    setTimeout(() => {
        field.classList.remove('error-shake');
    }, 500);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.classList.remove('error-shake');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showSuccessMessage(form, 'Thank you! Your message has been sent successfully.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
    }, 2000);
}

function showSuccessMessage(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 success-checkmark';
    successDiv.textContent = message;
    
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Lazy Loading
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based operations
        }, 16); // ~60fps
    });
    
    // Preload critical resources
    preloadCriticalResources();
}

function preloadCriticalResources() {
    const criticalImages = [
        'images/MAINGRACE-LOGO.webp',
        'images/cursor/leaf-cursor.webp',
        'images/cursor/hand-cursor.webp'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Utility Functions
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

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Send error to analytics service in production
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for use in other modules
window.Maingrace247 = {
    validateForm,
    showSuccessMessage,
    debounce,
    throttle
};

// Mobile-specific improvements
function initMobileEnhancements() {
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.fontSize = '16px';
        });
    });

    // Improve mobile menu touch interactions
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        // Add touch feedback
        mobileMenuBtn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        mobileMenuBtn.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Add swipe to close functionality
        let startX = 0;
        let startY = 0;

        mobileMenu.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        mobileMenu.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;

            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;

            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                // Swipe left - close menu
                mobileMenu.classList.add('hidden');
                startX = 0;
                startY = 0;
            }
        });
    }

    // Improve button touch interactions
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link, .mobile-nav-link');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add lazy loading for better performance
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            imageObserver.observe(img);
        }
    });

    // Improve form interactions on mobile
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Add loading state for better UX
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
                
                // Re-enable after a delay (in case of error)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
                }, 5000);
            }
        });
    });

    // Add smooth scrolling for mobile
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });
    });

    // Improve admin dashboard mobile experience
    if (window.location.pathname.includes('admin-dashboard.html')) {
        const adminSidebar = document.querySelector('.w-64');
        const adminContent = document.querySelector('.flex-1');
        
        if (adminSidebar && adminContent) {
            // Add mobile menu toggle for admin sidebar
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'md:hidden fixed top-20 left-4 z-50 bg-green-600 text-white p-2 rounded-lg shadow-lg';
            mobileToggle.innerHTML = '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
            
            document.body.appendChild(mobileToggle);
            
            mobileToggle.addEventListener('click', function() {
                adminSidebar.classList.toggle('show');
            });
            
            // Close sidebar when clicking outside
            document.addEventListener('click', function(e) {
                if (!adminSidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    adminSidebar.classList.remove('show');
                }
            });
        }
    }
}

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Mobile-specific improvements */
    @media (max-width: 768px) {
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 