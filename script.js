// scroll reveal
const hiddenElements = document.querySelectorAll('section, .overlap-grid, .mosaic-gallery, .rich-text, .interactive-module, .qr-center, footer, .dish-showcase, .snack-gallery');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

hiddenElements.forEach(el => {
  el.classList.add('hidden');
  observer.observe(el);
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}
function closeLightboxModal() {
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
}
if (closeLightbox) closeLightbox.addEventListener('click', closeLightboxModal);
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightboxModal(); });

function bindLightboxToImages() {
  const clickable = document.querySelectorAll('.overlap-card img, .mosaic-grid img, .poem-bleed img, .dish-img img, .food-full img, .snack-grid img');
  clickable.forEach(img => {
    img.removeEventListener('click', lightboxHandler);
    img.addEventListener('click', lightboxHandler);
    img.style.cursor = 'pointer';
  });
}
function lightboxHandler(e) { openLightbox(e.currentTarget.src); }

// Xi'an City Facts
const cityFacts = [
  "🏺 Xi'an served as the capital for 13 dynasties, spanning over 1,100 years.",
  "⚔️ The Terracotta Army was discovered in 1974 by farmers digging a well.",
  "🏯 The Ancient City Wall is 13.7 km long and dates back to the Ming Dynasty (1370).",
  "📖 The Giant Wild Goose Pagoda once held Buddhist scriptures brought by Xuanzang (the real ‘Monkey King’ journey).",
  "🕌 The Great Mosque of Xi'an blends Chinese architecture with Islamic traditions – built over 1,200 years ago.",
  "🌉 Xi'an was the starting point of the Silk Road, connecting China to the Mediterranean.",
  "🥟 The 'Tang Dynasty Dumpling Banquet' recreates imperial court cuisine with over 150 shapes.",
  "🎭 The Bell Tower is the geographical center of Xi'an, and you can still hear chimes on special occasions."
];

const foodFacts = [
  "🥙 Roujiamo dates back to the Qin Dynasty (221 BC) – it might be the world's oldest sandwich.",
  "🍜 Liangpi noodles are made by washing wheat starch dough – the gluten is separated and steamed.",
  "🐑 Yangrou Paomo is traditionally eaten by crumbling the bread into bean-sized pieces with your fingers.",
  "🔥 Cumin lamb skewers were introduced via Silk Road traders from Central Asia.",
  "🍯 Persimmon cakes (shibing) are a local sweet treat, especially famous in Lintong district.",
  "🥣 The 'Dumpling Banquet' at Xi'an's Defachang restaurant has been a culinary landmark since 1936.",
  "🌶️ Biangbiang noodles are named after the sound of slapping dough on the table – they are thick and chewy.",
  "🍷 Pomegranates were brought to China from Persia via the Silk Road and Xi'an now produces the best."
];

function initRandomFact(buttonId, factArray, displayId) {
  const btn = document.getElementById(buttonId);
  const displayPara = document.getElementById(displayId);
  if (btn && displayPara) {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
      const randomIdx = Math.floor(Math.random() * factArray.length);
      displayPara.textContent = factArray[randomIdx];
      displayPara.style.transform = 'scale(1.02)';
      setTimeout(() => { if(displayPara) displayPara.style.transform = ''; }, 200);
    });
  }
}

setTimeout(() => {
  const isFoodPage = document.body.classList.contains('food-xian') || document.querySelector('.food-hero-xian') !== null;
  if (isFoodPage) {
    initRandomFact('randomFoodFactBtn', foodFacts, 'funFactText');
  } else {
    initRandomFact('randomFactBtn', cityFacts, 'funFactText');
  }
  bindLightboxToImages();

  const observerImages = new MutationObserver(() => bindLightboxToImages());
  observerImages.observe(document.body, { childList: true, subtree: true });
}, 50);

window.addEventListener('load', () => bindLightboxToImages());