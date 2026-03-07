// Load images from the pre-built JSON (generated from Excel cont.xlsx)
// Click on any card navigates to product.html?id=N for the product detail page.
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gallery-grid');

  function buildGallery(data) {
    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<p class="gallery-empty">No images found.</p>';
      return;
    }
    data.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';

      const img = document.createElement('img');
      img.src     = item.src;
      img.alt     = 'Style ' + item.id;
      img.loading = 'lazy';
      card.appendChild(img);

      if (item.price) {
        const tag = document.createElement('div');
        tag.className   = 'price-tag';
        tag.textContent = '\u20B9' + item.price.toLocaleString('en-IN');
        card.appendChild(tag);
      }

      card.addEventListener('click', () => {
        window.location.href = 'product.html?id=' + item.id;
      });

      grid.appendChild(card);
    });
  }

  // Fetch JSON (Netlify serves this as a static file; server.py handles it locally)
  fetch('images_data.json?t=' + Date.now())
    .then(r => { if (!r.ok) throw new Error('JSON not found'); return r.json(); })
    .then(data => buildGallery(data))
    .catch(() => {
      grid.innerHTML = '<p class="gallery-empty">Could not load images. Please try again later.</p>';
    });
});

