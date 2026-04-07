document.addEventListener("DOMContentLoaded", () => {
    // 1. Advanced Custom Cursor (Desktop Only with pointer-events protection)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function renderCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        const interactables = document.querySelectorAll('a, button, input, textarea, .filter-btn, #theme-btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 2. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }, { passive: true });

    // 3. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    });

    // 4. Navbar & Active Link
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    }, { passive: true });

    // 5. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        document.body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : '';
    });
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.style.overflow = '';
        });
    });

    // 6. Typing Effect
    const typingSpan = document.querySelector('.typing-text');
    if (typingSpan) {
        const roles = [" Web Developer","AI & ML Enthusiast","Graphic Designer","Quantum Researcher"];
        let roleIndex = 0; let charIndex = 0; let isDeleting = false;
        function typeEffect() {
            const currentRole = roles[roleIndex];
            typingSpan.textContent = isDeleting 
                ? currentRole.substring(0, charIndex - 1) 
                : currentRole.substring(0, charIndex + 1);
            isDeleting ? charIndex-- : charIndex++;
            let speed = isDeleting ? 30 : 100;
            if (!isDeleting && charIndex === currentRole.length) { speed = 2500; isDeleting = true; }
            else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 500; }
            setTimeout(typeEffect, speed);
        }
        setTimeout(typeEffect, 1000);
    }

    // 7. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 400); 
            });
        });
    });

    // 8. Scroll Reveal
   const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // NEW: Animate the skill numbers
            const skillNumbers = entry.target.querySelectorAll('.skill-info span:last-child');
            skillNumbers.forEach(num => {
                const target = parseInt(num.innerText);
                let count = 0;
                const updateCount = () => {
                    if (count < target) {
                        count++;
                        num.innerText = count + "%";
                        setTimeout(updateCount, 17); // 17ms for ~60fps
                    }
                };
                updateCount();
            });

            const progressBars = entry.target.querySelectorAll('.progress');
            progressBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }
    });
}, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 9. Optimized 3D Tilt Effect (Desktop Only)
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (window.matchMedia("(pointer: fine)").matches) {
        let tiltFrame;
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                cancelAnimationFrame(tiltFrame);
                tiltFrame = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left; 
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -10; 
                    const rotateY = ((x - centerX) / centerX) * 10;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s ease';
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; 
            });
        });
    }

    // 10. Dark/Light Theme
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('i');
        if (localStorage.getItem('theme') === 'light') { 
            document.body.setAttribute('data-theme', 'light'); 
            themeIcon.classList.replace('fa-moon', 'fa-sun'); 
        }
        themeBtn.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

    // Robust PDF Loader
    const resumeIframe = document.querySelector('.resume-viewer iframe');
    const resumeSection = document.querySelector('#resume-viewer');

    if (resumeSection && resumeIframe) {
        const loadPDF = () => {
            if (!resumeIframe.src.includes('image/cv_hr.pdf')) {
                resumeIframe.src = "image/cv_hr.pdf#toolbar=0";
            }
        };

        // Use the existing observer to trigger the load
        const pdfObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadPDF();
                }
            });
        }, { threshold: 0.1 });

        pdfObserver.observe(resumeSection);
        
        // Backup: Load if the button is clicked or after 3 seconds
        document.getElementById('view-resume-btn')?.addEventListener('click', loadPDF);
        setTimeout(loadPDF, 3000); 
    }

    // Refresh Reveal for Certificates and Resume
    document.querySelectorAll('.reveal').forEach(el => {
        if (typeof observer !== 'undefined') observer.observe(el);
    });

    // 12. Particles.js Configuration
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#f97316" }, // Matches your --primary-color
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ef4444", // Matches your --secondary-color
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "retina_detect": true
        });
    }

});
