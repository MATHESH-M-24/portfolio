document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor Logic ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (matchMedia('(pointer:fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .slider-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- 2. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px" };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 3. Navbar Scrolled State & Neon Rails ---
    const navbar = document.querySelector('.navbar');
    const scrollLights = document.querySelectorAll('.scroll-light');

    window.addEventListener('scroll', () => {
        // Navbar Frosting
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            document.body.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            document.body.classList.remove('scrolled');
        }

        // Calculate Scroll Percentage
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        // Update Light Position
        scrollLights.forEach(light => {
            light.style.top = `${scrollPercent}%`;
        });
    });

    // --- 4. Parallax Blobs ---
    document.addEventListener('mousemove', (e) => {
        const spheres = document.querySelectorAll('.gradient-sphere');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        spheres.forEach((sphere, i) => {
            const speed = (i + 1) * 20;
            sphere.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // --- 5. Contact Form Animation ---
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        const btnText = submitBtn.querySelector('.btn-text');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.classList.add('loading');
            btnText.textContent = "Transmitting...";

            setTimeout(() => {
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 2000);
        });
    }

    // --- 6. Background Data Network Animation ---
    const canvas = document.getElementById('data-network');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 0.4) - 0.2;
                this.directionY = (Math.random() * 0.4) - 0.2;
                this.size = Math.random() * 2 + 1;
                this.color = '#00ff41'; // Matrix Green
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.5;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 25000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(0, 243, 255,' + opacityValue * 0.15 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        init();
        animate();
    }

    // --- 7. Project Slider Logic (Auto-Loop) ---
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.slider-indicators .dot');

    if (sliderTrack && slides.length > 0) {
        let currentIndex = 0;
        let slideInterval;
        const intervalTime = 4000; // 4 seconds

        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
                resetInterval();
            });
        });

        function startInterval() {
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        const sliderContainer = document.querySelector('.project-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            sliderContainer.addEventListener('mouseleave', () => startInterval());
        }

        startInterval();
    }

    // --- Skill Modal Logic ---
    const skillData = {
        "AWS": { title: "AWS Cloud", desc: "Design and deployment of scalable, high-availability, and fault-tolerant systems on AWS.", proficiency: "90%", tags: ["EC2", "Lambda", "S3", "VPC", "CloudFormation"] },
        "Azure": { title: "Microsoft Azure", desc: "Experience in managing Azure resources, identity solutions, and hybrid cloud setups.", proficiency: "80%", tags: ["Azure AD", "VMs", "Blob Storage", "AKS"] },
        "Docker": { title: "Docker Containers", desc: "Containerization of microservices for consistent development and deployment environments.", proficiency: "95%", tags: ["Dockerfiles", "Compose", "Registry", "Optimization"] },
        "K8s": { title: "Kubernetes", desc: "Orchestration of containerized applications, managing clusters, and auto-scaling.", proficiency: "85%", tags: ["Pods", "Services", "Ingress", "Helm", "EKS"] },
        "Terraform": { title: "Terraform IaC", desc: "Infrastructure as Code for provisioning and managing multi-cloud resources.", proficiency: "88%", tags: ["Modules", "State Management", "Providers", "HCL"] },
        "Linux": { title: "Linux Systems", desc: "Deep understanding of Linux kernel, shell scripting, and system hardening.", proficiency: "92%", tags: ["Bash", "Permissions", "Networking", "Systemd"] },
        "Pentest": { title: "Penetration Testing", desc: "Ethical hacking practices to identify and mitigate vulnerabilities.", proficiency: "85%", tags: ["Metasploit", "Nmap", "Privilege Escalation"] },
        "Splunk": { title: "Splunk SIEM", desc: "Log analysis, dashboard creation, and threat monitoring.", proficiency: "75%", tags: ["SPL", "Alerting", "Data Normalization"] },
        "Wireshark": { title: "Wireshark", desc: "Packet analysis for network troubleshooting and security forensics.", proficiency: "80%", tags: ["Packet Capture", "Filters", "Protocol Analysis"] },
        "BurpSuite": { title: "Burp Suite", desc: "Web application security testing and vulnerability scanning.", proficiency: "85%", tags: ["Proxy", "Repeater", "Intruder", "Scanner"] },
        "WAF": { title: "Web App Firewall", desc: "Configuring rules to protect web applications from common attacks.", proficiency: "80%", tags: ["OWASP Top 10", "Rate Limiting", "IP Blocking"] },
        "Crypto": { title: "Cryptography", desc: "Implementation of encryption standards for data protection.", proficiency: "75%", tags: ["SSL/TLS", "PKI", "Hashing", "Encryption"] },
        "Python": { title: "Python Programming", desc: "Automation, tool building, and data analysis scripts.", proficiency: "90%", tags: ["Scripting", "Automation", "Requests", "Pandas"] },
        "Bash": { title: "Bash Scripting", desc: "Task automation and system administration scripts.", proficiency: "88%", tags: ["Cron", "Pipes", "Regex", "Text Processing"] },
        "GoLang": { title: "Go Programming", desc: "Building high-performance backend services and tools.", proficiency: "70%", tags: ["Concurrency", "Microservices", "Gin"] },
        "TensorFlow": { title: "TensorFlow", desc: "Building and training machine learning models for security analysis.", proficiency: "75%", tags: ["Keras", "Model Training", "Neural Networks"] },
        "PyTorch": { title: "PyTorch", desc: "Deep learning frameworks for specialized AI tasks.", proficiency: "72%", tags: ["Tensors", "Gradients", "Research"] },
        "GitOps": { title: "GitOps Workflow", desc: "Managing infrastructure and application configurations via Git.", proficiency: "85%", tags: ["ArgoCD", "Flux", "CI/CD Integration"] }
    };

    const modal = document.getElementById('skill-modal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-desc');
        const modalIcon = modal.querySelector('.modal-icon');
        const modalFill = modal.querySelector('.stat-fill');
        const modalTags = modal.querySelector('.modal-tags');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        document.querySelectorAll('.tech-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const skillName = chip.querySelector('span').innerText;
                const iconClass = chip.querySelector('i').className;
                const data = skillData[skillName] || { title: skillName, desc: "Detailed specs loading...", proficiency: "50%", tags: ["Skill"] };

                modalTitle.innerText = data.title;
                modalDesc.innerText = data.desc;
                modalIcon.className = `modal-icon ${iconClass}`;
                modalFill.style.width = '0%'; // Reset for animation
                modalTags.innerHTML = data.tags.map(tag => `<li>${tag}</li>`).join('');

                modal.classList.add('active');

                // Animate bar after modal opens
                setTimeout(() => {
                    modalFill.style.width = data.proficiency;
                }, 300);
            });
        });

        function closeModal() {
            modal.classList.remove('active');
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // --- Typing Animation Logic ---
    const titlesToType = document.querySelectorAll('.section-title');

    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target;
                if (!title.classList.contains('typed-out')) {
                    title.classList.add('typed-out'); // Prevent re-animating
                    const text = title.innerText;
                    title.innerHTML = `<span class="typing-wrapper"><span class="typing-text">${text}</span></span>`;

                    const typingSpan = title.querySelector('.typing-text');
                    typingSpan.classList.add('typing');
                    typingSpan.innerText = ''; // Clear for typing

                    let i = 0;
                    function typeChar() {
                        if (i < text.length) {
                            typingSpan.innerText += text.charAt(i);
                            i++;
                            setTimeout(typeChar, 100); // Typing speed
                        } else {
                            typingSpan.classList.remove('typing');
                            typingSpan.classList.add('typed');
                        }
                    }
                    typeChar();
                }
            }
        });
    }, { threshold: 0.5 });

    titlesToType.forEach(title => typeObserver.observe(title));

    // --- Footer Session Timer ---
    const timerEl = document.getElementById('session-timer');
    if (timerEl) {
        let sec = 0;
        setInterval(() => {
            sec++;
            const date = new Date(0);
            date.setSeconds(sec);
            const timeString = date.toISOString().substr(11, 8);
            timerEl.innerText = timeString;
        }, 1000);
    }

});
