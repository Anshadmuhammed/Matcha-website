document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.section-title, .hero-col-left, .hero-col-right, .kit-image-area, .benefit-card, .mini-card, .product-featured-card, .essential-card, .footer-offer');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-up-hidden');
        observer.observe(el);
    });
});

// Add extra CSS class for animation via JS if preferred, or rely on CSS classes defined in style.css (which I will add next)
