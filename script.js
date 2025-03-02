// Performance optimized particle animation
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1; // Reduced particle size
        this.speedX = Math.random() * 1 - 0.5; // Reduced speed
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() < 0.5 ? '#ff00ff80' : '#00ffff80'; // Added transparency
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.05; // Slower size reduction
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particle animation with performance optimizations
function initParticles() {
    const particlesContainer = document.querySelector('.neon-particles');
    if (!particlesContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let animationFrameId;
    let lastTime = 0;
    const fps = 30; // Limit FPS for better performance
    const fpsInterval = 1000 / fps;

    function resizeCanvas() {
        canvas.width = particlesContainer.offsetWidth;
        canvas.height = particlesContainer.offsetHeight;
    }

    function createParticles(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Limit number of particles
        if (particles.length < 100) {
            for (let i = 0; i < 3; i++) {
                particles.push(new Particle(x, y));
            }
        }
    }

    function animate(currentTime) {
        animationFrameId = requestAnimationFrame(animate);

        // FPS limiting
        const elapsed = currentTime - lastTime;
        if (elapsed < fpsInterval) return;
        lastTime = currentTime - (elapsed % fpsInterval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use for...of for better performance
        for (const particle of particles) {
            particle.update();
        }

        // Remove small particles in batch
        particles = particles.filter(particle => particle.size > 0.2);

        // Draw remaining particles
        for (const particle of particles) {
            particle.draw(ctx);
        }
    }

    // Throttled event listener for resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });

    // Throttled event listener for mousemove
    let lastMove = 0;
    canvas.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMove > 50) { // 20fps for particle creation
            createParticles(e);
            lastMove = now;
        }
    });
    
    particlesContainer.appendChild(canvas);
    resizeCanvas();
    animate(0);

    return () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('mousemove', createParticles);
        cancelAnimationFrame(animationFrameId);
    };
}

// Destination cards data
const destinations = [
    {
        title: 'Neo Tokyo',
        description: 'Experience the future in Japan\'s cyberpunk capital. Neon-lit streets and advanced technology blend seamlessly with ancient traditions.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26'
    },
    {
        title: 'Shanghai 2049',
        description: 'Where tradition meets high-tech innovation. Explore the vertical gardens and quantum computing districts.',
        image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2'
    },
    {
        title: 'Dubai Oasis',
        description: 'The desert metropolis of tomorrow. Flying taxis and holographic entertainment in the world\'s most futuristic city.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
    },
    {
        title: 'Singapore Smart City',
        description: 'Green technology meets urban planning. Experience the perfect harmony of nature and artificial intelligence.',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd'
    },
    {
        title: 'Seoul Digital District',
        description: 'K-pop meets K-tech in this vibrant digital wonderland. Experience the future of entertainment and culture.',
        image: 'https://images.unsplash.com/photo-1617048931430-5eb626d81e71'
    },
    {
        title: 'Shenzhen Tech Hub',
        description: 'The Silicon Valley of Asia, where innovation shapes daily life. Experience the latest in consumer tech and digital lifestyle.',
        image: 'https://images.unsplash.com/photo-1522870389523-7e83c0065eaf'
    },
    {
        title: 'Berlin Underground',
        description: 'Explore the tech-savvy underground culture in Europe\'s most progressive city. Virtual raves and digital art galleries await.',
        image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047'
    },
    {
        title: 'London Neo-Victorian',
        description: 'Where steampunk meets cyberpunk. Victorian architecture enhanced with holographic projections and AI-guided tours.',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
    },
    {
        title: 'Moscow Cyberdome',
        description: 'Experience winter like never before under the world\'s largest climate-controlled dome. Arctic adventures meet virtual reality.',
        image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d'
    },
    {
        title: 'San Francisco AI Valley',
        description: 'Silicon Valley evolved. Where artificial intelligence and human creativity spark the next tech revolution.',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
    },
    {
        title: 'Mumbai Neon Nights',
        description: 'Traditional Indian culture enhanced by cutting-edge technology. Experience Bollywood in augmented reality.',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445'
    },
    {
        title: 'Sydney Smart Harbor',
        description: 'The iconic harbor reimagined with floating entertainment platforms and interactive light shows.',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9'
    }
];

// Optimized destination card population
function populateDestinations() {
    const container = document.getElementById('destinationCards');
    if (!container) return;

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        
        // Preload image
        const img = new Image();
        img.src = dest.image;
        
        card.innerHTML = `
            <div class="destination-card">
                <img src="${dest.image}" alt="${dest.title}" loading="lazy">
                <div class="destination-info">
                    <h3 class="destination-title">${dest.title}</h3>
                    <p class="destination-description">${dest.description}</p>
                    <button class="neon-button explore-btn">Explore</button>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });

    // Batch DOM update
    container.appendChild(fragment);

    // Event delegation for better performance
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('explore-btn')) {
            const card = e.target.closest('.destination-card');
            const title = card.querySelector('.destination-title').textContent;
            alert(`Booking system for ${title} coming soon!`);
        }
    });
}

// Optimized smooth scroll
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Optimized form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thanks for your message! We\'ll get back to you soon.');
            form.reset();
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        initParticles();
        populateDestinations();
        initSmoothScroll();
        initContactForm();
    });
});
