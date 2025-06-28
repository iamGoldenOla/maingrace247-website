// Maingrace247 - Dark Mode Toggle

(function() {
    'use strict';

    // Dark mode configuration
    const DARK_MODE_CONFIG = {
        storageKey: 'maingrace247-dark-mode',
        transitionDuration: '0.3s',
        iconSun: '☀️',
        iconMoon: '🌙'
    };

    // Initialize dark mode
    document.addEventListener('DOMContentLoaded', function() {
        initDarkMode();
        createDarkModeToggle();
        setupSystemPreference();
    });

    // Initialize dark mode based on stored preference
    function initDarkMode() {
        const isDarkMode = getStoredPreference();
        
        if (isDarkMode) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    // Create dark mode toggle button
    function createDarkModeToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'dark-mode-toggle';
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.setAttribute('title', 'Toggle dark mode');
        
        // Add toggle to navigation
        const nav = document.querySelector('nav .flex');
        if (nav) {
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'flex items-center ml-4';
            toggleContainer.appendChild(toggle);
            nav.appendChild(toggleContainer);
        }

        // Add click event
        toggle.addEventListener('click', toggleDarkMode);
        
        // Update initial icon
        updateToggleIcon();
    }

    // Toggle dark mode
    function toggleDarkMode() {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
        
        // Store preference
        storePreference(!isDarkMode);
        
        // Update icon
        updateToggleIcon();
        
        // Add animation
        animateToggle();
    }

    // Enable dark mode
    function enableDarkMode() {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-mode-active');
        
        // Update meta theme color
        updateThemeColor('#1F2937');
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('darkModeChanged', { detail: { isDark: true } }));
    }

    // Disable dark mode
    function disableDarkMode() {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-mode-active');
        
        // Update meta theme color
        updateThemeColor('#4CAF50');
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('darkModeChanged', { detail: { isDark: false } }));
    }

    // Update toggle icon
    function updateToggleIcon() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (!toggle) return;
        
        const isDarkMode = document.documentElement.classList.contains('dark');
        toggle.textContent = isDarkMode ? DARK_MODE_CONFIG.iconSun : DARK_MODE_CONFIG.iconMoon;
        toggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Animate toggle button
    function animateToggle() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (!toggle) return;
        
        toggle.classList.add('toggle-animate');
        setTimeout(() => {
            toggle.classList.remove('toggle-animate');
        }, 300);
    }

    // Update theme color meta tag
    function updateThemeColor(color) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        themeColorMeta.content = color;
    }

    // Store user preference
    function storePreference(isDarkMode) {
        try {
            localStorage.setItem(DARK_MODE_CONFIG.storageKey, isDarkMode.toString());
        } catch (error) {
            console.warn('Could not store dark mode preference:', error);
        }
    }

    // Get stored preference
    function getStoredPreference() {
        try {
            const stored = localStorage.getItem(DARK_MODE_CONFIG.storageKey);
            return stored === 'true';
        } catch (error) {
            console.warn('Could not retrieve dark mode preference:', error);
            return false;
        }
    }

    // Setup system preference detection
    function setupSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Only apply system preference if no user preference is stored
        if (getStoredPreference() === null) {
            if (mediaQuery.matches) {
                enableDarkMode();
                updateToggleIcon();
            }
        }
        
        // Listen for system preference changes
        mediaQuery.addEventListener('change', function(e) {
            // Only apply if no user preference is stored
            if (getStoredPreference() === null) {
                if (e.matches) {
                    enableDarkMode();
                } else {
                    disableDarkMode();
                }
                updateToggleIcon();
            }
        });
    }

    // Add CSS for dark mode toggle
    function addDarkModeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dark-mode-toggle {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 0.5rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
            }
            
            .dark-mode-toggle:hover {
                background-color: rgba(76, 175, 80, 0.1);
                transform: scale(1.1);
            }
            
            .dark-mode-toggle:focus {
                outline: 2px solid #4CAF50;
                outline-offset: 2px;
            }
            
            .toggle-animate {
                animation: toggleSpin 0.3s ease-in-out;
            }
            
            @keyframes toggleSpin {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.2); }
                100% { transform: rotate(360deg) scale(1); }
            }
            
            /* Dark mode transitions */
            * {
                transition: background-color ${DARK_MODE_CONFIG.transitionDuration} ease,
                            color ${DARK_MODE_CONFIG.transitionDuration} ease,
                            border-color ${DARK_MODE_CONFIG.transitionDuration} ease,
                            box-shadow ${DARK_MODE_CONFIG.transitionDuration} ease;
            }
            
            /* Dark mode specific styles */
            .dark {
                --white: #1F2937;
                --gray-50: #111827;
                --gray-100: #1F2937;
                --gray-200: #374151;
                --gray-300: #4B5563;
                --gray-400: #6B7280;
                --gray-500: #9CA3AF;
                --gray-600: #D1D5DB;
                --gray-700: #E5E7EB;
                --gray-800: #F3F4F6;
                --gray-900: #F9FAFB;
            }
            
            .dark body {
                background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
                color: #E5E7EB;
            }
            
            .dark .bg-white {
                background-color: #1F2937;
            }
            
            .dark .bg-green-50 {
                background-color: #064E3B;
            }
            
            .dark .text-green-700 {
                color: #A7F3D0;
            }
            
            .dark .text-green-800 {
                color: #6EE7B7;
            }
            
            .dark .border-green-200 {
                border-color: #065F46;
            }
            
            .dark .border-green-300 {
                border-color: #047857;
            }
            
            .dark .form-input {
                background-color: #374151;
                border-color: #4B5563;
                color: #E5E7EB;
            }
            
            .dark .form-input:focus {
                border-color: #6EE7B7;
                background-color: #4B5563;
            }
            
            .dark .btn-secondary {
                background-color: #374151;
                border-color: #6EE7B7;
                color: #E5E7EB;
            }
            
            .dark .btn-secondary:hover {
                background-color: #4B5563;
            }
            
            .dark .bento-card {
                background-color: #1F2937;
                border: 1px solid #374151;
            }
            
            .dark .bento-card:hover {
                border-color: #6EE7B7;
                box-shadow: 0 25px 50px -12px rgba(110, 231, 183, 0.25);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize styles
    addDarkModeStyles();

    // Export functions for external use
    window.Maingrace247 = window.Maingrace247 || {};
    window.Maingrace247.DarkMode = {
        enable: enableDarkMode,
        disable: disableDarkMode,
        toggle: toggleDarkMode,
        isDark: () => document.documentElement.classList.contains('dark')
    };

})(); 