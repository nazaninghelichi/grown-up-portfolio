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

            setupYearFilters(allProjects);
            displayProjects(allProjects);
        } else {
            displayEmptyState();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        displayEmptyState();
    }
}

// Setup year filter buttons
function setupYearFilters(projects) {
    const yearFilters = document.getElementById('year-filters');
    if (!yearFilters) return;

    // Extract unique years from projects
    const years = [...new Set(projects.map(p => {
        const year = p.date ? p.date.split('-')[0] : null;
        return year;
    }).filter(Boolean))].sort((a, b) => b - a);

    // Add year buttons
    years.forEach(year => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-year', year);
        btn.textContent = year;
        yearFilters.appendChild(btn);
    });

    // Add click handlers
    const filterBtns = yearFilters.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            const selectedYear = btn.getAttribute('data-year');
            if (selectedYear === 'all') {
                displayProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p =>
                    p.date && p.date.startsWith(selectedYear)
                );
                displayProjects(filtered);
            }
        });
    });
}

// Display projects in carousel
function displayProjects(projects) {
    const carousel = document.getElementById('projects-carousel');

    carousel.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-thumbnail">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : 'Screenshot'}
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
                    ${project.pitch ? `<a href="${project.pitch}" target="_blank">Pitch Deck</a>` : ''}
                    ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ''}
                    ${project.caseStudy ? `<a href="${project.caseStudy}">Case Study</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    setupCarousel();
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

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
