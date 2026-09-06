/* ================================================================
   events-achievements.js
   Tab switching, lightbox photo viewer, and scroll animations
   for the Events & Achievements page.
   ================================================================ */

// --- Tab Switching ---
function switchTab(tab) {
    const eventsSection = document.getElementById('section-events');
    const achievementsSection = document.getElementById('section-achievements');
    const tabEvents = document.getElementById('tab-events');
    const tabAchievements = document.getElementById('tab-achievements');

    if (tab === 'events') {
        eventsSection.classList.remove('ea-hidden');
        achievementsSection.classList.add('ea-hidden');
        tabEvents.classList.add('ea-tab-btn--active');
        tabAchievements.classList.remove('ea-tab-btn--active');
        tabEvents.setAttribute('aria-selected', 'true');
        tabAchievements.setAttribute('aria-selected', 'false');
    } else {
        achievementsSection.classList.remove('ea-hidden');
        eventsSection.classList.add('ea-hidden');
        tabAchievements.classList.add('ea-tab-btn--active');
        tabEvents.classList.remove('ea-tab-btn--active');
        tabAchievements.setAttribute('aria-selected', 'true');
        tabEvents.setAttribute('aria-selected', 'false');
    }

    // Re-trigger scroll animation for newly visible cards
    triggerScrollAnimations();
}

// --- Lightbox State ---
let lightboxGallery = [];   // Array of { src, alt } for current gallery
let lightboxIndex = 0;      // Current photo index in gallery

/**
 * Open lightbox for a clicked photo.
 * Called by clicking .ea-photo-item elements.
 *
 * @param {string} galleryId   - value of data-gallery attribute
 * @param {number} startIndex  - value of data-index attribute
 */
function openLightbox(galleryId, startIndex) {
    // Collect all photos in this gallery group
    const items = document.querySelectorAll(`.ea-photo-item[data-gallery="${galleryId}"]`);
    lightboxGallery = Array.from(items).map(item => {
        const img = item.querySelector('img');
        return { src: img.src, alt: img.alt };
    });

    lightboxIndex = parseInt(startIndex, 10);
    updateLightboxImage();
    document.getElementById('ea-lightbox').classList.add('ea-lightbox--open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('ea-lightbox').classList.remove('ea-lightbox--open');
    document.body.style.overflow = '';
    lightboxGallery = [];
    lightboxIndex = 0;
}

function lightboxNav(direction) {
    if (!lightboxGallery.length) return;
    lightboxIndex = (lightboxIndex + direction + lightboxGallery.length) % lightboxGallery.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const imgEl = document.getElementById('ea-lightbox-img');
    const counterEl = document.getElementById('ea-lightbox-counter');
    const photo = lightboxGallery[lightboxIndex];

    // Fade transition
    imgEl.style.opacity = '0';
    setTimeout(() => {
        imgEl.src = photo.src;
        imgEl.alt = photo.alt;
        imgEl.style.opacity = '1';
    }, 150);

    counterEl.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

    // Show/hide nav arrows
    const prevBtn = document.querySelector('.ea-lightbox-prev');
    const nextBtn = document.querySelector('.ea-lightbox-next');
    const singlePhoto = lightboxGallery.length === 1;
    prevBtn.style.visibility = singlePhoto ? 'hidden' : 'visible';
    nextBtn.style.visibility = singlePhoto ? 'hidden' : 'visible';
}

// --- Keyboard navigation for lightbox ---
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('ea-lightbox');
    if (!lightbox.classList.contains('ea-lightbox--open')) return;

    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'Escape') closeLightbox();
});

// --- Lightbox image fade style ---
document.addEventListener('DOMContentLoaded', () => {
    const imgEl = document.getElementById('ea-lightbox-img');
    if (imgEl) {
        imgEl.style.transition = 'opacity 0.15s ease';
    }

    // Attach click handlers to all photo items (including those added later)
    attachPhotoClickHandlers();

    // Initial scroll animation trigger
    triggerScrollAnimations();
});

/**
 * Attach click handlers to all .ea-photo-item elements.
 * Call this again after dynamically adding new cards.
 */
function attachPhotoClickHandlers() {
    document.querySelectorAll('.ea-photo-item').forEach(item => {
        // Prevent duplicate listeners
        if (item.dataset.lightboxBound) return;
        item.dataset.lightboxBound = 'true';

        item.addEventListener('click', () => {
            const galleryId = item.dataset.gallery;
            const index = item.dataset.index;
            if (galleryId !== undefined && index !== undefined) {
                openLightbox(galleryId, index);
            }
        });
    });
}

// --- Scroll Animation (reuses existing .animate-on-scroll pattern) ---
function triggerScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll:not(.is-visible)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}
