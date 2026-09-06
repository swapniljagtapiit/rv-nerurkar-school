/* ================================================================
   events-achievements.js
   Lightbox photo viewer, gallery click handling,
   featured group lightbox, video modal, and scroll animations.
   ================================================================ */

// --- Tab Switching (kept for backward compatibility if old page structure is used) ---
function switchTab(tab) {
    var eventsSection = document.getElementById('section-events');
    var achievementsSection = document.getElementById('section-achievements');
    var tabEvents = document.getElementById('tab-events');
    var tabAchievements = document.getElementById('tab-achievements');
    if (!eventsSection || !achievementsSection) return;
    if (tab === 'events') {
        eventsSection.classList.remove('ea-hidden');
        achievementsSection.classList.add('ea-hidden');
        if (tabEvents) { tabEvents.classList.add('ea-tab-btn--active'); tabEvents.setAttribute('aria-selected', 'true'); }
        if (tabAchievements) { tabAchievements.classList.remove('ea-tab-btn--active'); tabAchievements.setAttribute('aria-selected', 'false'); }
    } else {
        achievementsSection.classList.remove('ea-hidden');
        eventsSection.classList.add('ea-hidden');
        if (tabAchievements) { tabAchievements.classList.add('ea-tab-btn--active'); tabAchievements.setAttribute('aria-selected', 'true'); }
        if (tabEvents) { tabEvents.classList.remove('ea-tab-btn--active'); tabEvents.setAttribute('aria-selected', 'false'); }
    }
    triggerScrollAnimations();
}

// ================================================================
// LIGHTBOX STATE
// ================================================================
var lightboxGallery = [];
var lightboxIndex = 0;

// Open from .ea-gallery-item elements with data-gallery / data-index
function openLightboxFromItem(galleryId, startIndex) {
    var items = document.querySelectorAll('.ea-gallery-item[data-gallery="' + galleryId + '"]');
    lightboxGallery = Array.from(items).map(function(item) {
        var img = item.querySelector('img');
        return { src: img ? img.src : '', alt: img ? img.alt : '' };
    });
    lightboxIndex = parseInt(startIndex, 10) || 0;
    _showLightbox();
}

// Open from hidden .ea-lightbox-pool data carrier divs (used by featured cards)
function openLightboxGroup(galleryId, startIndex) {
    var pools = document.querySelectorAll('.ea-lightbox-pool[data-gallery="' + galleryId + '"]');
    if (!pools.length) return;
    lightboxGallery = Array.from(pools)
        .sort(function(a, b) { return parseInt(a.dataset.index) - parseInt(b.dataset.index); })
        .map(function(p) { return { src: p.dataset.src, alt: p.dataset.alt || '' }; });
    lightboxIndex = parseInt(startIndex, 10) || 0;
    _showLightbox();
}

// Legacy alias
function openLightbox(galleryId, startIndex) {
    openLightboxFromItem(galleryId, startIndex);
}

function _showLightbox() {
    if (!lightboxGallery.length) return;
    updateLightboxImage();
    var lb = document.getElementById('ea-lightbox');
    if (lb) lb.classList.add('ea-lightbox--open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    var lb = document.getElementById('ea-lightbox');
    if (lb) lb.classList.remove('ea-lightbox--open');
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
    var imgEl = document.getElementById('ea-lightbox-img');
    var counterEl = document.getElementById('ea-lightbox-counter');
    var photo = lightboxGallery[lightboxIndex];
    if (!imgEl || !photo) return;

    imgEl.style.opacity = '0';
    setTimeout(function() {
        imgEl.src = photo.src;
        imgEl.alt = photo.alt;
        imgEl.style.opacity = '1';
    }, 120);

    if (counterEl) counterEl.textContent = (lightboxIndex + 1) + ' / ' + lightboxGallery.length;

    var single = lightboxGallery.length === 1;
    var prev = document.querySelector('.ea-lightbox-prev');
    var next = document.querySelector('.ea-lightbox-next');
    if (prev) prev.style.visibility = single ? 'hidden' : 'visible';
    if (next) next.style.visibility = single ? 'hidden' : 'visible';
}

// ================================================================
// VIDEO MODAL
// ================================================================
function openVideoModal(src, caption) {
    var modal = document.getElementById('ea-video-modal');
    var videoEl = document.getElementById('ea-modal-video');
    var srcEl = document.getElementById('ea-modal-video-src');
    var captionEl = document.getElementById('ea-video-caption');
    if (!modal || !videoEl || !srcEl) return;
    srcEl.src = src;
    videoEl.load();
    if (captionEl) captionEl.textContent = caption || '';
    modal.classList.add('ea-lightbox--open');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    var modal = document.getElementById('ea-video-modal');
    var videoEl = document.getElementById('ea-modal-video');
    if (!modal) return;
    if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
    modal.classList.remove('ea-lightbox--open');
    document.body.style.overflow = '';
}

// ================================================================
// KEYBOARD NAVIGATION
// ================================================================
document.addEventListener('keydown', function(e) {
    var lightbox = document.getElementById('ea-lightbox');
    var videoModal = document.getElementById('ea-video-modal');
    if (lightbox && lightbox.classList.contains('ea-lightbox--open')) {
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'Escape') closeLightbox();
    } else if (videoModal && videoModal.classList.contains('ea-lightbox--open')) {
        if (e.key === 'Escape') closeVideoModal();
    }
});

// ================================================================
// INITIALISATION
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    var imgEl = document.getElementById('ea-lightbox-img');
    if (imgEl) imgEl.style.transition = 'opacity 0.12s ease';
    attachGalleryClickHandlers();
    triggerScrollAnimations();
});

function attachGalleryClickHandlers() {
    // Wire up photo gallery items
    document.querySelectorAll('.ea-gallery-item[data-gallery]').forEach(function(item) {
        if (item.dataset.clickBound) return;
        item.dataset.clickBound = 'true';
        item.setAttribute('tabindex', item.getAttribute('tabindex') || '0');
        item.addEventListener('click', function() {
            openLightboxFromItem(item.dataset.gallery, item.dataset.index || '0');
        });
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
        });
    });
    // Keyboard support for video items (onclick already set in HTML)
    document.querySelectorAll('.ea-gallery-item--video').forEach(function(item) {
        if (item.dataset.videoKeyBound) return;
        item.dataset.videoKeyBound = 'true';
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
        });
    });
    // Keyboard for featured cards (onclick set inline)
    document.querySelectorAll('.ea-featured-card').forEach(function(item) {
        if (item.dataset.featKeyBound) return;
        item.dataset.featKeyBound = 'true';
        item.setAttribute('tabindex', item.getAttribute('tabindex') || '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
        });
    });
}

// ================================================================
// SCROLL ANIMATIONS
// ================================================================
function triggerScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll:not(.is-visible)');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    elements.forEach(function(el) { observer.observe(el); });
}
