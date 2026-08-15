// Global variable to store all projects
let allProjects = [];

// Load and display projects
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();

        if (data.projects && data.projects.length > 0) {
            // Sort by date (newest first)
            allProjects = data.projects.sort((a, b) => {
                return new Date(b.date || '2000-01') - new Date(a.date || '2000-01');
            });

            displayProjects(allProjects);
        } else {
            displayEmptyState();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        displayEmptyState();
    }
}

// Display projects in carousel
function displayProjects(projects) {
    const carousel = document.getElementById('projects-carousel');

    carousel.innerHTML = projects.map(project => {
        const images = (project.images && project.images.length) ? project.images
            : (project.image ? [project.image] : []);
        const gallery = images.length > 1;
        const thumbnail = images.length ? `
                <img src="${images[0]}" alt="${project.title}">
                ${gallery ? `
                <button class="thumb-btn prev" aria-label="Previous screenshot">&lsaquo;</button>
                <button class="thumb-btn next" aria-label="Next screenshot">&rsaquo;</button>
                <div class="thumb-dots">
                    ${images.map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`).join('')}
                </div>` : ''}
            ` : 'Screenshot';

        return `
        <div class="project-card">
            <div class="project-thumbnail"${images.length ? ` data-images='${JSON.stringify(images)}' data-index="0"` : ''}>
                ${thumbnail}
            </div>
            <h3>${project.title}</h3>
            <p class="project-subtitle">${project.category}</p>
            <ul>
                ${project.description ? `<li>${project.description}</li>` : ''}
                ${project.highlight ? `<li>${project.highlight}</li>` : ''}
                ${project.detail ? `<li>${project.detail}</li>` : ''}
            </ul>
            <div class="project-footer">
                <div class="project-tags">
                    ${project.technologies.slice(0, 3).map(tech =>
                        `<span class="project-tag">${tech}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    ${project.demo ? `<a href="${project.demo}" target="_blank">Live</a>` : ''}
                    ${project.video ? `<a href="${project.video}" target="_blank">Video</a>` : ''}
                    ${project.pitch ? `<a href="${project.pitch}" target="_blank">Pitch Deck</a>` : ''}
                    ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ''}
                    ${project.caseStudy ? `<a href="${project.caseStudy}">Case Study</a>` : ''}
                </div>
            </div>
        </div>
    `;
    }).join('');

    setupCarousel();
    setupGalleries();
}

// Cycle each project's screenshots via prev/next buttons or dot clicks
function setupGalleries() {
    document.querySelectorAll('.project-thumbnail[data-images]').forEach(thumb => {
        const images = JSON.parse(thumb.dataset.images);
        const img = thumb.querySelector('img');
        const dots = thumb.querySelectorAll('.dot');

        function show(index) {
            const next = (index + images.length) % images.length;
            thumb.dataset.index = next;
            img.src = images[next];
            dots.forEach((dot, i) => dot.classList.toggle('active', i === next));
        }

        const prevBtn = thumb.querySelector('.thumb-btn.prev');
        const nextBtn = thumb.querySelector('.thumb-btn.next');
        if (prevBtn) prevBtn.addEventListener('click', e => {
            e.stopPropagation();
            show(parseInt(thumb.dataset.index, 10) - 1);
        });
        if (nextBtn) nextBtn.addEventListener('click', e => {
            e.stopPropagation();
            show(parseInt(thumb.dataset.index, 10) + 1);
        });
        dots.forEach((dot, i) => dot.addEventListener('click', e => {
            e.stopPropagation();
            show(i);
        }));
    });
}

// Display empty state
function displayEmptyState() {
    const carousel = document.getElementById('projects-carousel');
    carousel.innerHTML = `
        <div class="project-card">
            <div class="project-thumbnail">No projects yet</div>
            <h3>Add Your First Project</h3>
            <p class="project-subtitle">Tell Claude about your project</p>
            <ul>
                <li>Just mention a project in conversation</li>
                <li>Claude will add it automatically</li>
            </ul>
            <div class="project-footer">
                <div class="project-tags">
                    <span class="project-tag">Example</span>
                </div>
                <div class="project-links">
                    <a href="#">Demo</a>
                </div>
            </div>
        </div>
    `;
}

// Setup carousel navigation
function setupCarousel() {
    const carousel = document.getElementById('projects-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!carousel) return;

    const scrollAmount = 360;

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Hide buttons if not needed
    function updateButtons() {
        const { scrollLeft, scrollWidth, clientWidth } = carousel;
        prevBtn.style.display = scrollLeft <= 0 ? 'none' : 'flex';
        nextBtn.style.display = scrollLeft + clientWidth >= scrollWidth - 1 ? 'none' : 'flex';
    }

    carousel.addEventListener('scroll', updateButtons);
    updateButtons();
}

// Smooth scroll for in-page anchor links only
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
