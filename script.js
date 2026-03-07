// Load images from the pre-built JSON (generated from Excel cont.xlsx)
// This approach is Netlify-safe: no directory listing needed, just a static JSON fetch.
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gallery-grid');
  let images = [];
  let currentIndex = 0;

  // --- Build thumbnails ---
  function buildGallery(data) {
    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<p class="gallery-empty">No images found.</p>';
      return;
    }
    data.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `<img src="${item.src}" alt="Style ${item.id}" loading="lazy" />`;
      card.addEventListener('click', () => openLightbox(idx));
      grid.appendChild(card);
    });
  }

  // --- Lightbox ---
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');

  function openLightbox(idx) {
    currentIndex = idx;
    lbImg.src = images[idx].src;
    lbImg.alt = `Style ${images[idx].id}`;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  lbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
  });

  lbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.src = images[currentIndex].src;
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') lbNext.click();
    if (e.key === 'ArrowLeft')  lbPrev.click();
    if (e.key === 'Escape')     closeLightbox();
  });

  // --- Fetch JSON (Netlify serves this as a static file) ---
  fetch('images_data.json')
    .then(r => { if (!r.ok) throw new Error('JSON not found'); return r.json(); })
    .then(data => { images = data; buildGallery(data); })
    .catch(() => {
      grid.innerHTML = '<p class="gallery-empty">Could not load images. Please try again later.</p>';
    });
});
