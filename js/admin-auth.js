// Maingrace247 - Admin Authentication System

(function() {
    'use strict';

    // Admin credentials (in production, this should be server-side)
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'maingrace247' // Change this to a secure password
    };

    // Session management
    const SESSION_KEY = 'maingrace247_admin_session';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    // Initialize authentication
    document.addEventListener('DOMContentLoaded', function() {
        initLoginForm();
        initPasswordToggle();
        checkExistingSession();
    });

    // Initialize login form
    function initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogin(e);
            });
        }
    }

    // Initialize password toggle
    function initPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Update icon
                const icon = toggleBtn.querySelector('svg');
                if (type === 'text') {
                    icon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    `;
                } else {
                    icon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    `;
                }
            });
        }
    }

    // Handle login submission
    function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Validate inputs
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Show loading state
        showLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            if (authenticateUser(username, password)) {
                // Create session
                createSession(rememberMe);
                
                // Redirect to admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                showError('Invalid username or password');
                showLoading(false);
            }
        }, 1000);
    }

    // Authenticate user
    function authenticateUser(username, password) {
        return username === ADMIN_CREDENTIALS.username && 
               password === ADMIN_CREDENTIALS.password;
    }

    // Create admin session
    function createSession(rememberMe) {
        const session = {
            authenticated: true,
            username: ADMIN_CREDENTIALS.username,
            timestamp: Date.now(),
            expires: rememberMe ? Date.now() + (7 * 24 * 60 * 60 * 1000) : Date.now() + SESSION_DURATION
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    // Check existing session
    function checkExistingSession() {
        const sessionData = localStorage.getItem(SESSION_KEY);
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                
                if (session.authenticated && session.expires > Date.now()) {
                    // Valid session exists, redirect to dashboard
                    if (window.location.pathname.includes('admin-login.html')) {
                        window.location.href = 'admin-dashboard.html';
                    }
                } else {
                    // Session expired, clear it
                    clearSession();
                }
            } catch (error) {
                console.error('Error parsing session data:', error);
                clearSession();
            }
        }
    }

    // Clear session
    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    // Show loading state
    function showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loginBtn = document.getElementById('loginBtn');
        
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('hidden', !show);
        }
        
        if (loginBtn) {
            loginBtn.disabled = show;
            loginBtn.innerHTML = show ? 
                '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>' :
                '<span class="absolute left-0 inset-y-0 flex items-center pl-3"><svg class="h-5 w-5 text-brand-500 group-hover:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg></span>Sign in';
        }
    }

    // Show error message
    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 5000);
        }
    }

    // Validate session (for use in other admin pages)
    window.validateAdminSession = function() {
        const sessionData = localStorage.getItem(SESSION_KEY);
        
        if (!sessionData) {
            redirectToLogin();
            return false;
        }

        try {
            const session = JSON.parse(sessionData);
            
            if (!session.authenticated || session.expires <= Date.now()) {
                clearSession();
                redirectToLogin();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validating session:', error);
            clearSession();
            redirectToLogin();
            return false;
        }
    };

    // Redirect to login
    function redirectToLogin() {
        window.location.href = 'admin-login.html';
    }

    // Logout function (for use in other admin pages)
    window.logoutAdmin = function() {
        clearSession();
        redirectToLogin();
    };

    // Get current admin info
    window.getCurrentAdmin = function() {
        const sessionData = localStorage.getItem(SESSION_KEY);
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                return {
                    username: session.username,
                    timestamp: session.timestamp
                };
            } catch (error) {
                console.error('Error getting admin info:', error);
                return null;
            }
        }
        
        return null;
    };

})(); 