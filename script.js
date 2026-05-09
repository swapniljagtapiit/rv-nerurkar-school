document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    const navLinksList = document.querySelectorAll('.nav-links li a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if(icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Navbar Scroll Effect
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Animation using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve if you want it to animate only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Active Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });



    // Language Toggle
    const langBtn = document.getElementById('lang-toggle-btn');
    const langElementsText = document.querySelectorAll('.lang-text');
    let currentLang = 'en';

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'mr' : 'en';
            
            // Update button text
            langBtn.textContent = currentLang === 'en' ? 'मराठी' : 'English';
            
            // Update text elements
            langElementsText.forEach(el => {
                el.textContent = el.getAttribute(`data-${currentLang}`);
            });
            
            const placeholders = {
                'en': { name: 'Full Name', email: 'Email Address', phone: 'Phone Number', subject: 'Subject', message: 'Message' },
                'mr': { name: 'पूर्ण नाव', email: 'ईमेल पत्ता', phone: 'फोन नंबर', subject: 'विषय', message: 'संदेश' }
            };
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            if(nameInput) nameInput.placeholder = placeholders[currentLang].name;
            if(emailInput) emailInput.placeholder = placeholders[currentLang].email;
            if(phoneInput) phoneInput.placeholder = placeholders[currentLang].phone;
            if(subjectInput) subjectInput.placeholder = placeholders[currentLang].subject;
            if(messageInput) messageInput.placeholder = placeholders[currentLang].message;
        });
    }
});
