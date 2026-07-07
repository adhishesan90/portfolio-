document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Mobile Navigation Menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                window.lucide.createIcons();
            }
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    window.lucide.createIcons();
                }
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    window.lucide.createIcons();
                }
            });
        });
    }

    // Sticky Header and Active Nav Highlights
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        const scrollPos = window.scrollY;
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const spyOptions = {
        root: null,
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => {
        spyObserver.observe(section);
    });

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        if (scrollPos < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        } else if ((window.innerHeight + scrollPos) >= document.documentElement.scrollHeight - 50) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#contact') {
                    link.classList.add('active');
                }
            });
        }
    });

    // Typing Animation
    const typingTextEl = document.getElementById('typing-text');
    if (typingTextEl) {
        const phrases = [
            "AI Full Stack Developer",
            "Data Analyst",
            "ML Enthusiast"
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typingTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typeSpeed = 50;
            } else {
                typingTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typeSpeed = 120;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }

    // Neural Network / Particle Canvas
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 10;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
            }

            draw() {
                ctx.fillStyle = 'rgba(0, 242, 254, 0.75)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                this.x += this.vx;
                this.y += this.vy;

                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        this.x -= directionX * force * 1.5;
                        this.y -= directionY * force * 1.5;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 11000);
            const cappedCount = Math.min(count, 120);

            for (let i = 0; i < cappedCount; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        };

        const connectParticles = () => {
            let maxDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        let opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(157, 78, 221, ${opacity * 0.15})`;

                        if (distance < 60) {
                            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.25})`;
                        }

                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connectParticles();
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');

                    if (entry.target.id === 'skills' || entry.target.closest('#skills')) {
                        animateSkillBars();
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Animate Skill Bars — FIXED (removed duplicate variable)
    function animateSkillBars() {
        const skillFills = document.querySelectorAll('.skill-bar-fill');
        skillFills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-width') || fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const messageVal = document.getElementById('message').value;

            console.log("Form Submitted:", { name: nameVal, email: emailVal, message: messageVal });

            contactForm.classList.add('hidden');
            formFeedback.classList.remove('hidden');
        });
    }

    if (resetFormBtn && contactForm && formFeedback) {
        resetFormBtn.addEventListener('click', () => {
            contactForm.reset();
            formFeedback.classList.add('hidden');
            contactForm.classList.remove('hidden');
        });
    }
});