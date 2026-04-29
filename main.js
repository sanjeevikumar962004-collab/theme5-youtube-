// main.js - Global Interactions

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Sidebar Toggle Logic
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // Dropdown Logic
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = toggle.closest('.nav-dropdown');
            const menu = parentLi.querySelector('.dropdown-menu');
            
            parentLi.classList.toggle('open');
            if (parentLi.classList.contains('open')) {
                menu.classList.add('expanded');
            } else {
                menu.classList.remove('expanded');
            }
        });
    });

    // Theme Toggle Logic
    const themeToggles = document.querySelectorAll('.switch input[type="checkbox"]');

    // Check if current page should force dark mode
    const forceDarkPages = ['login.html', 'signup.html', 'dashboard.html', 'forgot-password.html'];
    const isForceDarkPage = forceDarkPages.some(page => window.location.pathname.includes(page));

    if (isForceDarkPage) {
        document.documentElement.removeAttribute('data-theme');
        themeToggles.forEach(toggle => {
            toggle.checked = false;
            // Optionally hide or disable the toggle switch visually
            const switchEl = toggle.closest('.switch');
            if (switchEl) {
                switchEl.style.display = 'none';
            }
        });
    } else {
        // Load saved theme for other pages
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggles.forEach(toggle => toggle.checked = true);
        } else {
            // Default to dark mode
            document.documentElement.removeAttribute('data-theme');
            themeToggles.forEach(toggle => toggle.checked = false);
            if (!savedTheme) localStorage.setItem('theme', 'dark');
        }

        themeToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const isLight = e.target.checked;
                if (isLight) {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'dark');
                }
                // Sync other toggles if multiple exist
                themeToggles.forEach(t => {
                    if (t !== e.target) t.checked = isLight;
                });
            });
        });
    }

    // Preloader fade out logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 3000); // 3 seconds timeout to observe the animation
    }

    // Populate the video grid on the Index page
    const videoGrid = document.getElementById('video-grid');
    if (videoGrid) {
        populateDummyVideos(videoGrid);
    }

    // Populate Dashboard Table
    const uploadsBody = document.getElementById('uploads-body');
    if (uploadsBody) {
        populateDashboardTable(uploadsBody);
    }

    // Populate Blog Grid
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
        populateBlog(blogGrid);
    }

    // Populate Team Grid
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid) {
        populateTeam(teamGrid);
    }

    // Professional Search Logic
    const searchInputs = document.querySelectorAll('.input');
    const searchContainers = document.querySelectorAll('.container');

    searchInputs.forEach(input => {
        // Handle Search Submission
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.location.href = '404.html';
            }
        });

        // Close search on escape
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.blur();
            }
        });
    });

    // Mobile Search Interaction Bridge
    searchContainers.forEach(container => {
        const icon = container.querySelector('.search__icon');
        const input = container.querySelector('.input');
        if (icon && input && window.innerWidth <= 480) {
            icon.addEventListener('click', (e) => {
                input.focus();
            });
        }
    });

    // Modern Search Controller
    const searchController = {
        init() {
            this.searchTriggers = document.querySelectorAll('.search-trigger');
            this.searchOverlay = document.getElementById('search-overlay');
            this.allSearchInputs = document.querySelectorAll('.search-input, .desktop-search-input');
            
            if (this.allSearchInputs.length) {
                this.bindEvents();
            }
        },
        bindEvents() {
            // Mobile Trigger
            this.searchTriggers.forEach(trigger => {
                trigger.addEventListener('click', () => this.toggleSearch(true));
            });

            // Add click submission for search icons
            const documentSearchIcons = document.querySelectorAll('.desktop-search-icon, .modal-search-icon');
            documentSearchIcons.forEach(icon => {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', () => {
                    const input = icon.previousElementSibling;
                    if (input && input.value.trim() !== '') {
                        window.location.href = '404.html';
                    }
                });
            });

            // Handle Search Submission for ALL search inputs
            this.allSearchInputs.forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.toggleSearch(false);
                });
            });

            // Close on clicking overlay backdrop
            if (this.searchOverlay) {
                this.searchOverlay.addEventListener('click', (e) => {
                    if (e.target === this.searchOverlay) this.toggleSearch(false);
                });
            }
        },
        toggleSearch(force) {
            if (this.searchOverlay) {
                this.searchOverlay.classList.toggle('active', force);
                if (force) {
                    const overlayInput = this.searchOverlay.querySelector('.search-input');
                    if (overlayInput) {
                        setTimeout(() => overlayInput.focus(), 300);
                    }
                }
            }
        }
    };
    searchController.init();

    // Hero Slider Logic (index2.html)
    const heroSlider = document.getElementById('hero-slider');
    if (heroSlider) {
        initHeroSlider(heroSlider);
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupFormValidation(contactForm);
    }

    // Newsletter Form Validation
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const value = input ? input.value.trim() : "";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            let errorMsg = form.querySelector('.error-msg');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-msg';
                errorMsg.style.color = '#ff4d4d';
                errorMsg.style.fontSize = '0.85rem';
                errorMsg.style.marginTop = '0.2rem';
                errorMsg.style.width = '100%';
                form.appendChild(errorMsg);
            }
            
            if (!value) {
                errorMsg.innerText = "Email is required.";
                errorMsg.style.display = 'block';
                return;
            }
            
            if (!emailRegex.test(value)) {
                errorMsg.innerText = "Please enter a valid email address.";
                errorMsg.style.display = 'block';
                return;
            }
            
            errorMsg.style.display = 'none';
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : 'Subscribe';
            if(btn) {
                btn.innerHTML = 'Processing...';
                btn.disabled = true;
            }

            setTimeout(() => {
                window.location.href = '404.html';
            }, 1000);
        });
    });
});

function initHeroSlider(slider) {
    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    // Create dots dynamically based on number of slides
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetInterval();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds auto-play
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Pause auto-play on hover
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', resetInterval);

    resetInterval();
}

function populateDummyVideos(container) {
    const videoData = [
        { title: "Building a 3D Cyberpunk City in Blender", channel: "DesignPro", views: "1.2M", time: "2 days ago", duration: "14:20", thumb: "images/pexels-a-darmel-9040607.webp" },
        { title: "The Future of Web UX/UI in 2026", channel: "TechTrends", views: "850K", time: "1 week ago", duration: "08:45", thumb: "images/pexels-benjamin-dominguez-3363409-28332700.webp" },
        { title: "Cinematic Travel Vlog - Tokyo Nights", channel: "Wanderlust", views: "2.4M", time: "3 weeks ago", duration: "21:10", thumb: "images/pexels-benjamin-dominguez-3363409-28336275.webp" },
        { title: "Advanced CSS Animations Masterclass", channel: "CodeMaster", views: "450K", time: "5 days ago", duration: "45:30", thumb: "images/pexels-fotios-photos-1266302.webp" },
        { title: "Lo-Fi Beats to Relax & Code To", channel: "VibeStation", views: "10M", time: "1 month ago", duration: "11:00:00", thumb: "images/pexels-gustavo-fring-8770481.webp" },
        { title: "Minimalist Desk Setup Tour 2026", channel: "Workspace", views: "620K", time: "4 days ago", duration: "12:15", thumb: "images/pexels-ivan-s-8117815.webp" },
        { title: "Understanding Quantum Computing", channel: "ScienceHub", views: "1.8M", time: "2 weeks ago", duration: "18:50", thumb: "images/pexels-kamaji-ogino-5065197.webp" },
        { title: "Ultimate Next.js vs React Guide", channel: "WebDev Daily", views: "920K", time: "1 day ago", duration: "32:10", thumb: "images/pexels-mizunokozuki-13929968.webp" }
    ];

    videoData.forEach((video, index) => {
        const card = document.createElement('article');
        card.className = 'video-card';
        const hue1 = Math.floor(Math.random() * 360);
        const hue2 = Math.floor(Math.random() * 360);

        card.innerHTML = `
            <a href="404.html" style="display: block; text-decoration: none; color: inherit;">
                <div class="thumbnail-wrapper">
                    <div class="thumbnail" style="background-image: url('${video.thumb}');"></div>
                    <div class="duration-badge">${video.duration}</div>
                    <div class="video-play-overlay">
                        <div class="play-btn-circle">
                            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>
                <div class="video-info">
                    <div class="channel-avatar" style="background: linear-gradient(to right, hsl(${hue2}, 80%, 50%), hsl(${hue1}, 80%, 40%));"></div>
                    <div class="video-details">
                        <h3>${video.title}</h3>
                        <div class="channel-name">${video.channel} <i>✓</i></div>
                        <div class="video-meta">${video.views} views • ${video.time}</div>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });

    // GSAP Animation
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(".video-card",
            {
                y: 50,
                opacity: 0,
                scale: 0.95
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#video-grid",
                    start: "top 85%",
                }
            }
        );
    } else {
        // Fallback if GSAP is missing
        const cards = document.querySelectorAll('.video-card');
        cards.forEach(card => {
            card.style.opacity = '1';
        });
    }
}

function populateDashboardTable(container) {
    const tableData = [
        { title: "Building a 3D Cyberpunk City entirely with pure CSS", date: "Mar 10, 2026", views: "145K", status: "Published" },
        { title: "Advanced CSS Animations Masterclass", date: "Mar 8, 2026", views: "320K", status: "Published" },
        { title: "React vs Next.js - What to choose in 2026?", date: "Mar 5, 2026", views: "89K", status: "Draft" }
    ];

    tableData.forEach(item => {
        const tr = document.createElement('tr');
        const statusClass = item.status === 'Published' ? 'status-published' : 'status-draft';
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.date}</td>
            <td>${item.views}</td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        `;
        container.appendChild(tr);
    });
}

function populateBlog(container) {
    const blogData = [
        { title: "Mastering the Algorithm in 2026", date: "Mar 11, 2026", excerpt: "Explore the new analytics suite we've launched to help creators understand their audience better than ever.", img: "images/pexels-ron-lach-8368744.webp" },
        { title: "The Rise of Glassmorphism in Web UI", date: "Mar 9, 2026", excerpt: "A deep dive into why glass-like interfaces are dominating the web design world in 2026.", img: "images/pexels-shvetsa-12673813.webp" },
        { title: "Spotlight: Meet Top Creator 'DesignPro'", date: "Mar 2, 2026", excerpt: "An exclusive interview with one of our fastest growing creators on building a massive audience.", img: "images/pexels-solliefoto-320617.webp" },
        { title: "The Art of Crafting Perfect Thumbnails", date: "Feb 28, 2026", excerpt: "Increase your CTR by 50% using these 5 proven psychological dark-patterns in thumbnail design.", img: "images/pexels-thangaraj-16795484.webp" }
    ];

    blogData.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-card gs-reveal';
        article.innerHTML = `
            <div class="blog-img" style="background-image: url('${post.img}'); background-size: cover; background-position: center; min-height: 200px;"></div>
            <div class="blog-content">
                <div class="blog-date" style="color: var(--accent-primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">${post.date}</div>
                <h3 class="blog-title" style="font-size: 1.25rem; line-height: 1.4; margin-bottom: 0.8rem;">${post.title}</h3>
                <p class="blog-excerpt" style="color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.2rem;">${post.excerpt}</p>
                <button class="slice" style="padding: 0.4em 0.8em; --size-letter: 14px;" onclick="window.location.href='404.html'">
                    <span class="text">Read Article</span>
                </button>
            </div>
        `;
        container.appendChild(article);
    });
}

function populateTeam(container) {
    const teamData = [
        { name: "Alex Mercer", role: "CEO & Founder", img: "images/pexels-a-darmel-9040607.webp" },
        { name: "Sarah Chen", role: "Head of Design", img: "images/pexels-benjamin-dominguez-3363409-28332700.webp" },
        { name: "Marcus Johnson", role: "Lead Engineer", img: "images/pexels-benjamin-dominguez-3363409-28336275.webp" },
        { name: "Elena Rodriguez", role: "Community Manager", img: "images/pexels-fotios-photos-1266302.webp" },
    ];

    teamData.forEach(member => {
        const div = document.createElement('div');
        div.className = 'team-member glass gs-reveal';
        div.style.padding = '2rem';
        div.style.borderRadius = '16px';
        div.style.textAlign = 'center';
        div.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

        div.innerHTML = `
            <div class="team-avatar" style="width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 1.5rem; border: 4px solid var(--border-glass); background-image: url('${member.img}'); background-size: cover; background-position: center; box-shadow: 0 10px 20px rgba(0,0,0,0.3);"></div>
            <h4 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${member.name}</h4>
            <p style="color: var(--accent-primary); font-weight: 600; font-size: 0.95rem; margin-bottom: 1.5rem;">${member.role}</p>
            <div style="display: flex; justify-content: center; gap: 1rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" style="cursor: pointer; transition: stroke 0.2s;"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" style="cursor: pointer; transition: stroke 0.2s;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            `;

        div.addEventListener('mouseenter', () => {
            div.style.transform = 'translateY(-10px)';
            div.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)';
            const icons = div.querySelectorAll('svg');
            icons.forEach(icon => icon.style.stroke = 'var(--text-primary)');
        });
        div.addEventListener('mouseleave', () => {
            div.style.transform = 'translateY(0)';
            div.style.boxShadow = 'none';
            const icons = div.querySelectorAll('svg');
            icons.forEach(icon => icon.style.stroke = 'var(--text-secondary)');
        });

        container.appendChild(div);
    });
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('.form-control');

    // Real-time constraints
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.parentElement;
            group.classList.remove('invalid');

            // Name constraint: No numbers
            if (input.id === 'name') {
                input.value = input.value.replace(/[0-9]/g, '');
            }

            // Phone constraint: Numbers only, max 10
            if (input.id === 'phone') {
                input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(input => {
            const group = input.parentElement;
            const value = input.value.trim();
            const type = input.id;
            const errorMsg = group.querySelector('.error-msg');

            // Reset state
            group.classList.remove('invalid');

            // Required Check
            if (!value) {
                group.classList.add('invalid');
                if (errorMsg) errorMsg.innerText = `${input.previousElementSibling ? input.previousElementSibling.innerText : 'This field'} is required.`;
                isValid = false;
                return;
            }

            // Email Specific
            if (type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    group.classList.add('invalid');
                    if (errorMsg) errorMsg.innerText = "Please enter a valid email address.";
                    isValid = false;
                }
            }

            // Phone Specific (10 Digits)
            if (type === 'phone' && value.length !== 10) {
                group.classList.add('invalid');
                if (errorMsg) errorMsg.innerText = "Phone number must be exactly 10 digits.";
                isValid = false;
            }

            // Password Specific (Min 8)
            if (type === 'password' && value.length < 8 && form.id === 'signup-form') {
                group.classList.add('invalid');
                if (errorMsg) errorMsg.innerText = "Password must be at least 8 characters.";
                isValid = false;
            }
        });

        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="text">Processing...</span>';
            btn.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                let successMsg = "Action Completed ✓";
                if (form.id === 'login-form') successMsg = "Welcome Back! ✓";
                if (form.id === 'signup-form') successMsg = "Account Created! ✓";
                if (form.id === 'forgot-form') successMsg = "Reset Link Sent! ✓";
                if (form.id === 'contact-form') successMsg = "Message Sent! ✓";

                btn.innerHTML = `<span class="text">${successMsg}</span>`;
                btn.style.background = '#00ff88';
                btn.style.borderColor = '#00ff88';
                
                if (form.id !== 'contact-form') {
                    // Redirect for auth flows after success
                    setTimeout(() => { window.location.href = '404.html'; }, 1500);
                } else {
                    form.reset();
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                        btn.disabled = false;
                    }, 3000);
                }
            }, 1000);
        }
    });
}

// --- GSAP Global Reveal Helper ---
window.initGSAPReveal = function () {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const revealElements = document.querySelectorAll('.gs-reveal');
        if (revealElements.length > 0) {
            gsap.fromTo(revealElements,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: revealElements[0],
                        start: "top 90%",
                        once: true
                    }
                }
            );
        }
    }
};

// --- Dashboard Chart.js Initialization ---
window.initDashboardCharts = function () {
    // Determine Theme Colors
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#121212' : '#ffffff';
    const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    const primaryAccent = '#ff1a1a'; // var(--accent-primary)

    const revCanvas = document.getElementById('revenueChart');
    if (revCanvas) {
        const ctxRev = revCanvas.getContext('2d');
        // Create Gradient
        const gradient = ctxRev.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(255, 26, 26, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 26, 26, 0.0)');

        new Chart(ctxRev, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [8200, 9500, 11200, 10500, 13000, 12500, 14230],
                    borderColor: primaryAccent,
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#121212',
                    pointBorderColor: primaryAccent,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: gridColor }, ticks: { color: textColor } },
                    x: { grid: { display: false }, ticks: { color: textColor } }
                }
            }
        });
    }

    const trafficCanvas = document.getElementById('trafficChart');
    if (trafficCanvas) {
        const ctxTraf = trafficCanvas.getContext('2d');
        new Chart(ctxTraf, {
            type: 'doughnut',
            data: {
                labels: ['YouTube Search', 'Suggested Videos', 'External', 'Other'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        primaryAccent,
                        '#ff4d4d',
                        '#ff8080',
                        '#2a2a2d'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor, padding: 20, font: { size: 12 } }
                    }
                }
            }
        });
    }
};

// --- Lenis Smooth Scroll ---
window.initLenisData = function () {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
};

// --- FAQ Accordion Logic ---
window.initFAQ = function () {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');

            // Close others
            document.querySelectorAll('.faq-answer').forEach(ans => {
                if (ans !== answer) {
                    ans.style.maxHeight = '0px';
                    ans.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current
            if (answer.style.maxHeight && answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '0') {
                answer.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });
};

// --- Spotlight Scroll Buttons (index2) ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.spotlight-track');
    const prevBtn = document.getElementById('spotlight-prev');
    const nextBtn = document.getElementById('spotlight-next');
    if (track && prevBtn && nextBtn) {
        const scrollAmt = 330;
        prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => track.scrollBy({ left:  scrollAmt, behavior: 'smooth' }));
    }
});
