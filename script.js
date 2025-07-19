/**
 * Translation Lab - Main JavaScript
 * 
 * Ce fichier contient toutes les fonctionnalités JavaScript pour le site Translation Lab
 * - Navigation responsive
 * - Animations au défilement
 * - Accordéons FAQ
 * - Animation de typing
 * - Sticky header
 * - Compteurs
 * - Carousel de témoignages
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Navigation Toggle =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // ===== Sticky Header =====
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // ===== Accordion Functionality =====
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                // Close other accordions
                accordions.forEach(item => {
                    if (item !== accordion && item.classList.contains('active')) {
                        item.classList.remove('active');
                    }
                });
                
                // Toggle current accordion
                accordion.classList.toggle('active');
            });
        }
    });
    
    // ===== Animation on Scroll =====
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    const checkIfInView = () => {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.getBoundingClientRect().top + windowTopPosition;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Add a threshold to start animation before the element is fully in view
            const threshold = 100;
            
            if ((elementBottomPosition >= windowTopPosition) && 
                (elementTopPosition <= windowBottomPosition - threshold)) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    window.addEventListener('load', checkIfInView);
    
    // ===== Typing Animation =====
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.display = 'inline-block';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation with a delay
        setTimeout(typeWriter, 500);
    });
    
    // ===== Counters =====
    const counters = document.querySelectorAll('.counter');
    
    const startCounting = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
    
    // Start counters when they come into view
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counterSection);
    }
    
    // ===== Testimonial Carousel =====
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        const testimonials = testimonialCarousel.querySelectorAll('.testimonial');
        const prevBtn = testimonialCarousel.querySelector('.carousel-prev');
        const nextBtn = testimonialCarousel.querySelector('.carousel-next');
        const dots = testimonialCarousel.querySelectorAll('.carousel-dot');
        
        let currentIndex = 0;
        
        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentIndex = i;
                showTestimonial(currentIndex);
            });
        });
        
        // Auto rotate testimonials
        setInterval(() => {
            if (document.hasFocus()) {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }
        }, 5000);
        
        // Initialize
        showTestimonial(currentIndex);
    }
    
    // ===== Form Validation =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value)) {
                        valid = false;
                        field.classList.add('error');
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
                alert('Veuillez remplir correctement tous les champs obligatoires.');
            }
        });
        
        // Remove error class on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
});
