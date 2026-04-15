// ========== SCROLL REVEAL ==========
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

// ========== LIGHTBOX ==========
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

function lightboxHandler(e) {
  openLightbox(e.currentTarget.src);
}

// ========== RANDOM FACTS ==========
const cityFacts = [
  " Xi'an served as the capital for 13 dynasties, spanning over 1,100 years.",
  " The Terracotta Army was discovered in 1974 by farmers digging a well.",
  " The Ancient City Wall is 13.7 km long and dates back to the Ming Dynasty (1370).",
  " The Giant Wild Goose Pagoda once held Buddhist scriptures brought by Xuanzang.",
  " The Great Mosque of Xi'an blends Chinese architecture with Islamic traditions  built over 1,200 years ago.",
  " Xi'an was the starting point of the Silk Road, connecting China to the Mediterranean.",
  " The 'Tang Dynasty Dumpling Banquet' recreates imperial court cuisine with over 150 shapes.",
  " The Bell Tower is the geographical center of Xi'an, and you can still hear chimes on special occasions."
];

const foodFacts = [
  " Roujiamo dates back to the Qin Dynasty (221 BC) it might be the world's oldest sandwich.",
  " Liangpi noodles are made by washing wheat starch dough the gluten is separated and steamed.",
  " Yangrou Paomo is traditionally eaten by crumbling the bread into bean-sized pieces with your fingers.",
  " Cumin lamb skewers were introduced via Silk Road traders from Central Asia.",
  " Persimmon cakes (shibing) are a local sweet treat, especially famous in Lintong district.",
  " The 'Dumpling Banquet' at Xi'an's Defachang restaurant has been a culinary landmark since 1936.",
  " Biangbiang noodles are named after the sound of slapping dough on the table they are thick and chewy.",
  " Pomegranates were brought to China from Persia via the Silk Road and Xi'an now produces the best."
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
      setTimeout(() => { if (displayPara) displayPara.style.transform = ''; }, 200);
    });
  }
}

// ========== WISHLIST MODULE ==========
let wishlistItems = [];

function loadWishlist() {
  const stored = localStorage.getItem('xian_wishlist');
  if (stored) {
    try {
      wishlistItems = JSON.parse(stored);
    } catch (e) {
      wishlistItems = [];
    }
  } else {
    wishlistItems = [];
  }
  renderWishlistSidebar();
  updateAllFavoriteButtons();
}

function saveWishlist() {
  localStorage.setItem('xian_wishlist', JSON.stringify(wishlistItems));
  renderWishlistSidebar();
  updateAllFavoriteButtons();
}

function addToWishlist(item) {
  if (!wishlistItems.some(i => i.id === item.id)) {
    wishlistItems.push(item);
    saveWishlist();
  }
}

function removeFromWishlist(id) {
  wishlistItems = wishlistItems.filter(i => i.id !== id);
  saveWishlist();
}

function clearWishlist() {
  if (confirm('Clear all items from your wishlist?')) {
    wishlistItems = [];
    saveWishlist();
  }
}

function isInWishlist(id) {
  return wishlistItems.some(i => i.id === id);
}

function updateAllFavoriteButtons() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const favId = btn.getAttribute('data-fav');
    if (favId && isInWishlist(favId)) {
      btn.classList.add('active');
      btn.innerHTML = 'like';
    } else if (favId) {
      btn.classList.remove('active');
      btn.innerHTML = 'like';
    }
  });
}

function renderWishlistSidebar() {
  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;
  if (wishlistItems.length === 0) {
    container.innerHTML = '<p class="empty-wishlist-msg">Your wishlist is empty. Click the  button on any attraction or dish to save it here.</p>';
    return;
  }
  container.innerHTML = '';
  wishlistItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'wishlist-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.src='images/fallback.jpg'">
      <div class="wishlist-item-info">
        <h4>${escapeHtml(item.name)}</h4>
        <p>${item.type === 'attraction' ? ' Attraction' : 'Food'}</p>
      </div>
      <button class="remove-wishlist-item" data-id="${item.id}"></button>
    `;
    container.appendChild(div);
  });
  document.querySelectorAll('.remove-wishlist-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      removeFromWishlist(id);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function getItemFromElement(el) {
  const container = el.closest('.favorite-item');
  if (!container) return null;
  const id = container.getAttribute('data-id');
  const name = container.getAttribute('data-name');
  const type = container.getAttribute('data-type');
  const image = container.getAttribute('data-image');
  if (id && name && type && image) return { id, name, type, image };
  return null;
}

function shareWishlist() {
  if (wishlistItems.length === 0) {
    alert('Your wishlist is empty. Add some favorites first!');
    return;
  }
  const text = 'My Xi\'an Wishlist:\n' + wishlistItems.map(i => `- ${i.name} (${i.type === 'attraction' ? 'Attraction' : 'Food'})`).join('\n');
  if (navigator.share) {
    navigator.share({ title: 'Xi\'an Wishlist', text: text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text);
    alert('Wishlist copied to clipboard!');
  }
}

function initWishlistUI() {
  const sidebar = document.getElementById('wishlistSidebar');
  const overlay = document.getElementById('wishlistOverlay');
  const openBtn = document.getElementById('wishlistNavBtn');
  const closeBtn = document.getElementById('closeWishlistBtn');
  const clearBtn = document.getElementById('clearWishlistBtn');
  const shareBtn = document.getElementById('shareWishlistBtn');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', (e) => { e.preventDefault(); openSidebar(); });
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
  if (clearBtn) clearBtn.addEventListener('click', clearWishlist);
  if (shareBtn) shareBtn.addEventListener('click', shareWishlist);

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.removeEventListener('click', favClickHandler);
    btn.addEventListener('click', favClickHandler);
  });
}

function favClickHandler(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const favId = btn.getAttribute('data-fav');
  if (!favId) return;
  const parentItem = btn.closest('.favorite-item');
  if (parentItem) {
    const itemData = getItemFromElement(parentItem);
    if (itemData && !isInWishlist(favId)) {
      addToWishlist(itemData);
    } else if (isInWishlist(favId)) {
      removeFromWishlist(favId);
    }
  } else {
    if (isInWishlist(favId)) {
      removeFromWishlist(favId);
    } else {
      let name = 'Item';
      let image = '';
      const container = btn.closest('.dish-showcase, .snack-item, .food-full');
      if (container) {
        const titleEl = container.querySelector('h2, .gallery-header');
        if (titleEl) name = titleEl.innerText;
        const imgEl = container.querySelector('img');
        if (imgEl) image = imgEl.src;
      }
      addToWishlist({ id: favId, name: name, type: 'food', image: image });
    }
  }
}

// ========== EXIT POPUP ==========
let exitPopupShown = false;

function initExitPopup() {
  const exitPopup = document.getElementById('exitPopup');
  const closeExit = document.querySelector('.close-exit-popup');
  const subscribeBtn = document.getElementById('exitSubscribeBtn');
  if (!exitPopup) return;

  function showExitPopup() {
    if (!exitPopupShown) {
      exitPopup.classList.add('show-exit');
      exitPopupShown = true;
    }
  }
  function hideExitPopup() {
    exitPopup.classList.remove('show-exit');
  }

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !exitPopupShown) {
      showExitPopup();
    }
  });

  if (closeExit) closeExit.addEventListener('click', hideExitPopup);
  exitPopup.addEventListener('click', (e) => { if (e.target === exitPopup) hideExitPopup(); });

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('exitEmailInput');
      const email = emailInput ? emailInput.value : '';
      if (email && email.includes('@')) {
        alert(`Thanks ${email}! You'll receive Xi'an travel inspiration.`);
        hideExitPopup();
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
}

// ========== 全局初始化 ==========
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

  loadWishlist();
  initWishlistUI();
  initExitPopup();
}, 50);

window.addEventListener('load', () => {
  bindLightboxToImages();
  const observerFav = new MutationObserver(() => {
    document.querySelectorAll('.fav-btn').forEach(btn => {
      btn.removeEventListener('click', favClickHandler);
      btn.addEventListener('click', favClickHandler);
    });
  });
  observerFav.observe(document.body, { childList: true, subtree: true });
});