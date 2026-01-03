// Update active nav link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        form.reset();
    });
}

// CTA button animations
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.type !== 'submit') {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
    observer.observe(el);
});
