// Filter pills
const pills = document.querySelectorAll('.pill');
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// Wishlist toggle
const wishButtons = document.querySelectorAll('.wishlist-btn');
wishButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
  });
});

// Cart counter
let cartCount = 0;
const cartBtn = document.querySelector('.nav-cart');
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    cartBtn.textContent = `🛒 Cart (${cartCount})`;
    btn.textContent = '✓ Added';
    btn.style.background = '#5a8c60';
    setTimeout(() => { btn.textContent = 'Add +'; btn.style.background = ''; }, 1500);
  });
});

// Scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .category-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease';
  observer.observe(el);
});

// load images: fill product cards and gallery from images folder
function loadImages() {
  fetch('images/')
    .then(r => r.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const imageNames = [...doc.querySelectorAll('a')]
        .map(a => a.getAttribute('href'))
        .filter(h => /\.(jpe?g|png|webp)$/i.test(h));
      
      // replace product-img-bg divs with actual img tags
      const productBgs = document.querySelectorAll('.product-img-bg');
      productBgs.forEach((el, idx) => {
        if (idx < imageNames.length) {
          const img = document.createElement('img');
          img.src = `images/${imageNames[idx]}`;
          img.alt = `Product ${idx + 1}`;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          el.replaceWith(img);
        }
      });
      
      // fill gallery thumbnails
      const container = document.getElementById('gallery');
      if (container) {
        imageNames.forEach(name => {
          const img = document.createElement('img');
          img.src = `images/${name}`;
          img.className = 'thumb';
          img.alt = name;
          container.appendChild(img);
        });
      }
    })
    .catch(err => {
      console.error('image load failed', err);
    });
}

document.addEventListener('DOMContentLoaded', loadImages);