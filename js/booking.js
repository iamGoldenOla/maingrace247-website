// Maingrace247 - Booking System

(function() {
    'use strict';

    // Booking system configuration
    const BOOKING_CONFIG = {
        consultationTypes: [
            { id: 'personal', name: 'Personal Consultation', duration: '60 min', price: '$75' },
            { id: 'herbal-remedy', name: 'Herbal Remedy Consultation', duration: '45 min', price: '$60' },
            { id: 'wellness-program', name: 'Wellness Program', duration: '90 min', price: '$120' }
        ],
        availableSlots: [
            '09:00', '10:30', '12:00', '14:00', '15:30', '17:00'
        ],
        bookingLeadTime: 24, // hours
        maxBookingsPerDay: 8
    };

    // Initialize booking system
    document.addEventListener('DOMContentLoaded', function() {
        initBookingForm();
        initCalendarIntegration();
        initServiceSelection();
        initBookingConfirmation();
        initBookingHistory();

        // Consultation type selection
        window.selectConsultation = function(type) {
            const select = document.getElementById('consultation-type');
            if (select) {
                switch(type) {
                    case 'initial':
                        select.value = 'initial';
                        break;
                    case 'followup':
                        select.value = 'followup';
                        break;
                    case 'wellness':
                        select.value = 'wellness';
                        break;
                }
            }
        };

        // Contact form handling
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Basic validation
                if (!data.firstName || !data.lastName || !data.email || !data.message) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    alert('Thank you for your message! We will get back to you within 24 hours.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }

        // Consultation form handling
        const consultationForm = document.getElementById('consultation-form');
        if (consultationForm) {
            consultationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(consultationForm);
                const data = Object.fromEntries(formData);
                
                // Basic validation
                if (!data.consultationType || !data.firstName || !data.lastName || !data.email || !data.phone || !data.healthConcern) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Phone validation
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(data.phone)) {
                    alert('Please enter a valid phone number.');
                    return;
                }
                
                // Simulate form submission
                const submitBtn = consultationForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Booking...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    alert('Thank you for booking your consultation! We will contact you within 24 hours to confirm your appointment.');
                    consultationForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form field animations
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    });

    // Booking Form Management
    function initBookingForm() {
        const bookingForm = document.getElementById('consultation-form');
        if (!bookingForm) return;

        // Add service type options dynamically
        populateServiceOptions(bookingForm);
        
        // Add date and time picker
        addDateTimePicker(bookingForm);
        
        // Enhanced form validation
        enhanceFormValidation(bookingForm);
        
        // Form submission handling
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }

    function populateServiceOptions(form) {
        const serviceSelect = form.querySelector('#service');
        if (!serviceSelect) return;

        // Clear existing options except the first one
        while (serviceSelect.children.length > 1) {
            serviceSelect.removeChild(serviceSelect.lastChild);
        }

        // Add service options
        BOOKING_CONFIG.consultationTypes.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = `${service.name} (${service.duration}) - ${service.price}`;
            serviceSelect.appendChild(option);
        });
    }

    function addDateTimePicker(form) {
        const dateTimeContainer = document.createElement('div');
        dateTimeContainer.className = 'mb-6';
        dateTimeContainer.innerHTML = `
            <label class="block text-sm font-medium mb-2">Preferred Date & Time</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" id="booking-date" name="booking-date" required 
                       class="form-input" min="${getMinDate()}">
                <select id="booking-time" name="booking-time" required class="form-input">
                    <option value="">Select time</option>
                    ${BOOKING_CONFIG.availableSlots.map(slot => 
                        `<option value="${slot}">${slot}</option>`
                    ).join('')}
                </select>
            </div>
        `;

        // Insert after service selection
        const serviceField = form.querySelector('#service').parentNode;
        serviceField.parentNode.insertBefore(dateTimeContainer, serviceField.nextSibling);

        // Add date change handler
        const dateInput = form.querySelector('#booking-date');
        dateInput.addEventListener('change', updateAvailableSlots);
    }

    function getMinDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    function updateAvailableSlots() {
        const dateInput = document.getElementById('booking-date');
        const timeSelect = document.getElementById('booking-time');
        const selectedDate = dateInput.value;

        if (!selectedDate) return;

        // Simulate checking availability (replace with actual API call)
        const availableSlots = checkAvailability(selectedDate);
        
        // Update time options
        timeSelect.innerHTML = '<option value="">Select time</option>';
        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        });
    }

    function checkAvailability(date) {
        // Simulate availability check (replace with actual API)
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        if (isWeekend) {
            return ['10:00', '12:00', '14:00']; // Limited weekend slots
        }
        
        return BOOKING_CONFIG.availableSlots.filter(slot => {
            // Simulate some slots being booked
            return Math.random() > 0.3;
        });
    }

    function enhanceFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateBookingField);
            input.addEventListener('input', clearFieldError);
        });
    }

    function validateBookingField(event) {
        const field = event.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Date validation
        if (field.id === 'booking-date' && value) {
            const selectedDate = new Date(value);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (selectedDate < tomorrow) {
                isValid = false;
                errorMessage = 'Please select a future date';
            }
        }

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

    // Booking Submission
    function handleBookingSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        if (!validateBookingForm(form)) {
            return;
        }

        const formData = new FormData(form);
        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            date: formData.get('booking-date'),
            time: formData.get('booking-time'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        showBookingLoading(form);
        
        // Simulate API call (replace with actual booking API)
        setTimeout(() => {
            processBookingSuccess(bookingData, form);
        }, 2000);
    }

    function validateBookingForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateBookingField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }

    function showBookingLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Booking...';
        submitBtn.classList.add('loading');
        
        // Store original text for restoration
        submitBtn.dataset.originalText = originalText;
    }

    function processBookingSuccess(bookingData, form) {
        // Reset form
        form.reset();
        
        // Restore button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showBookingConfirmation(bookingData);
        
        // Store booking in local storage (for demo purposes)
        storeBooking(bookingData);
        
        // Send confirmation email (simulated)
        sendConfirmationEmail(bookingData);
    }

    function showBookingConfirmation(bookingData) {
        const service = BOOKING_CONFIG.consultationTypes.find(s => s.id === bookingData.service);
        
        const confirmationHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-3xl p-8 max-w-md w-full text-center">
                    <div class="text-6xl mb-4">✅</div>
                    <h3 class="text-2xl font-lora font-bold text-green-800 mb-4">Booking Confirmed!</h3>
                    <div class="text-left space-y-2 mb-6">
                        <p><strong>Service:</strong> ${service.name}</p>
                        <p><strong>Date:</strong> ${formatDate(bookingData.date)}</p>
                        <p><strong>Time:</strong> ${bookingData.time}</p>
                        <p><strong>Duration:</strong> ${service.duration}</p>
                        <p><strong>Price:</strong> ${service.price}</p>
                    </div>
                    <p class="text-green-700 mb-6">
                        We've sent a confirmation email to ${bookingData.email} with all the details.
                    </p>
                    <button onclick="closeBookingConfirmation()" 
                            class="btn-primary w-full">Close</button>
                </div>
            </div>
        `;
        
        const confirmationDiv = document.createElement('div');
        confirmationDiv.id = 'booking-confirmation';
        confirmationDiv.innerHTML = confirmationHTML;
        document.body.appendChild(confirmationDiv);
    }

    function closeBookingConfirmation() {
        const confirmation = document.getElementById('booking-confirmation');
        if (confirmation) {
            confirmation.remove();
        }
    }

    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function storeBooking(bookingData) {
        const bookings = JSON.parse(localStorage.getItem('maingrace_bookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('maingrace_bookings', JSON.stringify(bookings));
    }

    function sendConfirmationEmail(bookingData) {
        // Simulate email sending (replace with actual email service)
        console.log('Sending confirmation email to:', bookingData.email);
        console.log('Booking details:', bookingData);
    }

    // Service Selection Enhancement
    function initServiceSelection() {
        const serviceSelect = document.getElementById('service');
        if (!serviceSelect) return;

        serviceSelect.addEventListener('change', function() {
            const selectedService = BOOKING_CONFIG.consultationTypes.find(s => s.id === this.value);
            if (selectedService) {
                updateServiceDetails(selectedService);
            }
        });
    }

    function updateServiceDetails(service) {
        // Update service details display if it exists
        const detailsContainer = document.querySelector('.service-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="bg-green-50 p-4 rounded-xl">
                    <h4 class="font-semibold text-green-800">${service.name}</h4>
                    <p class="text-green-600">Duration: ${service.duration}</p>
                    <p class="text-green-600">Price: ${service.price}</p>
                </div>
            `;
        }
    }

    // Calendar Integration (placeholder for future implementation)
    function initCalendarIntegration() {
        // This would integrate with Google Calendar, Outlook, or other calendar services
        console.log('Calendar integration ready for implementation');
    }

    // Booking History
    function initBookingHistory() {
        const bookings = JSON.parse(localStorage.getItem('maingrace_bookings') || '[]');
        if (bookings.length > 0) {
            console.log('Previous bookings found:', bookings.length);
        }
    }

    // Newsletter subscription (if exists)
    function subscribeNewsletter(email) {
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate subscription
        alert('Thank you for subscribing to our newsletter!');
    }

    // Product ordering simulation
    function orderProduct(productId, productName) {
        if (confirm(`Would you like to order ${productName}? We'll contact you to complete your order.`)) {
            // Redirect to consultation page for ordering
            window.location.href = 'consultations.html';
        }
    }

    // Make functions globally accessible
    window.closeBookingConfirmation = closeBookingConfirmation;
    window.Maingrace247 = window.Maingrace247 || {};
    window.Maingrace247.Booking = {
        BOOKING_CONFIG,
        storeBooking,
        sendConfirmationEmail
    };

})(); 