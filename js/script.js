// ==== STORAGE KEYS ====
const STORAGE_KEYS = {
  products: 'echo_products',
  categories: 'echo_categories',
  reviews: 'echo_reviews',
  config: 'echo_config',
  cart: 'echo_cart',
  pin: 'echo_admin_pin_hash'
};

// Nombre de marca fijo (no editable desde el panel).
const SITE_NAME = 'Hecho en Capas';

// ==== DEFAULT CONFIG (editable desde el panel "Editar sitio") ====
const DEFAULT_CONFIG = {
  whatsapp: '56988260006',
  email: 'contacto@hechoencapas.cl',
  instagram: '@hechoencapas',
  address: 'Santiago, Chile',
  wholesaleQty: 3,
  wholesaleMessage: 'Si necesitas más de {qty} unidades, escríbenos por WhatsApp para un precio mayorista.'
};

// PIN fijo de acceso al panel "Editar sitio". Solo quien lo conozca puede entrar;
// se puede cambiar después desde el propio panel (sección "Seguridad del panel").
const DEFAULT_ADMIN_PIN = '0604';

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

// ==== STATE ====
let config = loadConfig();
let products = loadProducts();
let categories = loadCategories();
let reviews = loadReviews();
let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
let editingProductId = null;
let editingCategoryId = null;
let editingReviewId = null;
let activeModalProduct = null;
let activeModalCategory = null;
let modalQty = 1;
let modalFromCategoryId = null;
let selectedColor = null;
let productFormColors = [];

// ==== PERSISTENCE HELPERS ====
function loadConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.config));
    if (stored) return { ...DEFAULT_CONFIG, ...stored };
  } catch (e) {}
  return { ...DEFAULT_CONFIG };
}
function saveConfig() {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
}
function loadProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.products));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch (e) {}
  return JSON.parse(JSON.stringify(PRODUCTS));
}
function saveProducts() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}
function loadCategories() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.categories));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch (e) {}
  return JSON.parse(JSON.stringify(CATEGORIES));
}
function saveCategories() {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
}
function loadReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.reviews));
    if (Array.isArray(stored)) return stored;
  } catch (e) {}
  return JSON.parse(JSON.stringify(REVIEWS));
}
function saveReviews() {
  localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
}
function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}
function nextProductId() {
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}
function nextCategoryId() {
  return categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;
}
function nextReviewId() {
  return reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
}

// ==== ELEMENTS ====
const categoryGrid = document.getElementById('categoryGrid');
const bestSellerGrid = document.getElementById('bestSellerGrid');
const reviewGrid = document.getElementById('reviewGrid');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const customQuoteBtn = document.getElementById('customQuoteBtn');
const whatsappLink = document.getElementById('whatsappLink');
const emailLink = document.getElementById('emailLink');
const instagramLink = document.getElementById('instagramLink');
const contactWhatsappText = document.getElementById('contactWhatsappText');
const contactEmailText = document.getElementById('contactEmailText');
const contactInstagramText = document.getElementById('contactInstagramText');
const contactAddressText = document.getElementById('contactAddressText');
const siteNameLogo = document.getElementById('siteNameLogo');
const siteNameFooter = document.getElementById('siteNameFooter');
const pageTitle = document.getElementById('pageTitle');
const lockPanel = document.getElementById('lockPanel');
const changePinForm = document.getElementById('changePinForm');
const changePinNote = document.getElementById('changePinNote');

// PIN modal
const pinOverlay = document.getElementById('pinOverlay');
const pinModal = document.getElementById('pinModal');
const closePin = document.getElementById('closePin');
const pinForm = document.getElementById('pinForm');
const pinInput1 = document.getElementById('pinInput1');
const pinNote = document.getElementById('pinNote');

// Category modal
const categoryOverlay = document.getElementById('categoryOverlay');
const categoryModal = document.getElementById('categoryModal');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const categoryModalMedia = document.getElementById('categoryModalMedia');
const categoryModalName = document.getElementById('categoryModalName');
const categoryModalDesc = document.getElementById('categoryModalDesc');
const categoryModalPrice = document.getElementById('categoryModalPrice');
const categoryProductList = document.getElementById('categoryProductList');
const categoryWholesaleNote = document.getElementById('categoryWholesaleNote');

// Product modal
const productOverlay = document.getElementById('productOverlay');
const productModal = document.getElementById('productModal');
const closeProductModal = document.getElementById('closeProductModal');
const backToCategory = document.getElementById('backToCategory');
const backToCategoryName = document.getElementById('backToCategoryName');
const productModalMedia = document.getElementById('productModalMedia');
const productModalCat = document.getElementById('productModalCat');
const productModalName = document.getElementById('productModalName');
const productModalDesc = document.getElementById('productModalDesc');
const productModalPrice = document.getElementById('productModalPrice');
const modalQtyMinus = document.getElementById('modalQtyMinus');
const modalQtyPlus = document.getElementById('modalQtyPlus');
const modalQtyEl = document.getElementById('modalQty');
const modalAddToCart = document.getElementById('modalAddToCart');
const modalWholesaleNote = document.getElementById('modalWholesaleNote');
const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
const productModalColors = document.getElementById('productModalColors');
const colorSwatches = document.getElementById('colorSwatches');
const selectedColorNameEl = document.getElementById('selectedColorName');

// Settings modal
const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsPanels = document.querySelectorAll('.settings-panel');
const configForm = document.getElementById('configForm');
const configNote = document.getElementById('configNote');
const productForm = document.getElementById('productForm');
const productNote = document.getElementById('productNote');
const cancelEditProduct = document.getElementById('cancelEditProduct');
const adminProductList = document.getElementById('adminProductList');
const categoryList = document.getElementById('categoryList');
const productImagePreview = document.getElementById('productImagePreview');
const productImagePreviewImg = document.getElementById('productImagePreviewImg');
const categoryForm = document.getElementById('categoryForm');
const categoryNote = document.getElementById('categoryNote');
const cancelEditCategory = document.getElementById('cancelEditCategory');
const adminCategoryList = document.getElementById('adminCategoryList');
const categoryImagePreview = document.getElementById('categoryImagePreview');
const categoryImagePreviewImg = document.getElementById('categoryImagePreviewImg');
const reviewForm = document.getElementById('reviewForm');
const reviewNote = document.getElementById('reviewNote');
const cancelEditReview = document.getElementById('cancelEditReview');
const adminReviewList = document.getElementById('adminReviewList');
const colorNameInput = document.getElementById('colorNameInput');
const colorHexInput = document.getElementById('colorHexInput');
const colorImageInput = document.getElementById('colorImageInput');
const addColorBtn = document.getElementById('addColorBtn');
const colorChipList = document.getElementById('colorChipList');

// ==== INIT ====
document.getElementById('year').textContent = new Date().getFullYear();
applyConfigToDOM();
renderCategories();
renderBestSellers();
renderReviews();
renderCart();

// ==== CONFIG APPLIED TO DOM ====
function applyConfigToDOM() {
  siteNameLogo.textContent = SITE_NAME;
  siteNameFooter.textContent = SITE_NAME;
  pageTitle.textContent = `${SITE_NAME} | Impresión 3D a tu medida`;
  document.title = pageTitle.textContent;

  whatsappLink.href = `https://wa.me/${config.whatsapp}`;
  contactWhatsappText.textContent = formatWhatsappDisplay(config.whatsapp);

  emailLink.href = `mailto:${config.email}`;
  contactEmailText.textContent = config.email;

  const igUser = config.instagram.replace(/^@/, '');
  instagramLink.href = `https://instagram.com/${igUser}`;
  contactInstagramText.textContent = config.instagram.startsWith('@') ? config.instagram : `@${config.instagram}`;

  contactAddressText.textContent = config.address;
}

function formatWhatsappDisplay(number) {
  const digits = String(number).replace(/\D/g, '');
  return `+${digits}`;
}

function wholesaleMessageText() {
  return config.wholesaleMessage.replace('{qty}', config.wholesaleQty);
}

// ==== SHARED HELPERS ====
function productMediaHtml(p) {
  if (p.image) {
    return `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}">`;
  }
  return p.emoji || '📦';
}
function categoryMediaHtml(c) {
  if (c.image) {
    return `<img src="${escapeAttr(c.image)}" alt="${escapeAttr(c.name)}">`;
  }
  return c.emoji || '📦';
}
function formatFromPrice(price) {
  return `Desde ${CLP.format(price)}`;
}
function productsInCategory(categoryName) {
  return products.filter(p => p.category === categoryName);
}

// ==== CATEGORY GRID (nivel 1 del catálogo) ====
function renderCategories() {
  if (!categories.length) {
    categoryGrid.innerHTML = `<p class="empty-state">Aún no hay categorías configuradas.</p>`;
    return;
  }
  categoryGrid.innerHTML = categories.map(c => {
    const items = productsInCategory(c.name);
    const priceLabel = items.length
      ? formatFromPrice(Math.min(...items.map(p => p.price)))
      : 'Próximamente';
    return `
      <div class="product-card" data-cat-id="${c.id}" tabindex="0" role="button" aria-label="Ver productos de ${escapeAttr(c.name)}">
        <div class="product-thumb">${categoryMediaHtml(c)}</div>
        <div class="product-body">
          <h3>${escapeHtml(c.name)}</h3>
          <div class="product-footer">
            <span class="product-price">${priceLabel}</span>
            <span class="view-more">Ver productos →</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

categoryGrid.addEventListener('click', e => {
  const card = e.target.closest('.product-card');
  if (card) openCategoryModal(Number(card.dataset.catId));
});
categoryGrid.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.product-card');
  if (card) {
    e.preventDefault();
    openCategoryModal(Number(card.dataset.catId));
  }
});

// ==== MÁS VENDIDOS (productos marcados como favoritos desde el panel) ====
function renderBestSellers() {
  const bestSellerSection = bestSellerGrid.closest('section');
  const items = products.filter(p => p.featured);

  if (!items.length) {
    bestSellerSection.hidden = true;
    return;
  }
  bestSellerSection.hidden = false;

  bestSellerGrid.innerHTML = items.map(p => `
    <div class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Ver detalles de ${escapeAttr(p.name)}">
      <div class="product-thumb">
        <span class="featured-badge">⭐ Favorito</span>
        ${productMediaHtml(p)}
      </div>
      <div class="product-body">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="product-footer">
          <span class="product-price">${CLP.format(p.price)}</span>
          <span class="view-more">Ver detalles →</span>
        </div>
      </div>
    </div>
  `).join('');
}
bestSellerGrid.addEventListener('click', e => {
  const card = e.target.closest('.product-card');
  if (card) openProductModal(Number(card.dataset.id));
});
bestSellerGrid.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.product-card');
  if (card) {
    e.preventDefault();
    openProductModal(Number(card.dataset.id));
  }
});

// ==== RESEÑAS ====
function renderReviews() {
  const reviewsSection = reviewGrid.closest('section');
  if (!reviews.length) {
    reviewsSection.hidden = true;
    return;
  }
  reviewsSection.hidden = false;
  reviewGrid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${starString(r.rating)}</div>
      <p class="review-comment">"${escapeHtml(r.comment)}"</p>
      <div class="review-author">
        <strong>${escapeHtml(r.name)}</strong>
        <span>${formatReviewDate(r.date)}</span>
      </div>
    </div>
  `).join('');
}
function starString(rating) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}
function formatReviewDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return '';
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ==== CATEGORY DETAIL MODAL (nivel 2: descripción + lista de productos) ====
function openCategoryModal(id) {
  const category = categories.find(c => c.id === id);
  if (!category) return;
  activeModalCategory = category;

  const items = productsInCategory(category.name);
  categoryModalMedia.innerHTML = categoryMediaHtml(category);
  categoryModalName.textContent = category.name;
  categoryModalDesc.textContent = category.desc;
  categoryModalPrice.textContent = items.length
    ? formatFromPrice(Math.min(...items.map(p => p.price)))
    : 'Próximamente';

  categoryProductList.innerHTML = items.length
    ? items.map(p => `
        <div class="category-product-item" data-id="${p.id}" tabindex="0" role="button" aria-label="Ver detalle de ${escapeAttr(p.name)}">
          <div class="category-product-thumb">${productMediaHtml(p)}</div>
          <div class="category-product-info">
            <strong>${escapeHtml(p.name)}</strong>
            <span>${CLP.format(p.price)}</span>
          </div>
        </div>
      `).join('')
    : `<p class="empty-state">Todavía no hay productos cargados en esta categoría.</p>`;

  categoryWholesaleNote.textContent = `🎉 ${wholesaleMessageText()}`;

  categoryModal.classList.add('active');
  categoryOverlay.classList.add('active');
}
function closeCategoryModalFn() {
  categoryModal.classList.remove('active');
  categoryOverlay.classList.remove('active');
  activeModalCategory = null;
}
closeCategoryModal.addEventListener('click', closeCategoryModalFn);
categoryOverlay.addEventListener('click', () => {
  closeCategoryModalFn();
  closeProductModalFn();
  closeCartDrawer();
  closeSettingsModal();
});
categoryProductList.addEventListener('click', e => {
  const item = e.target.closest('.category-product-item');
  if (!item || !activeModalCategory) return;
  const categoryId = activeModalCategory.id;
  closeCategoryModalFn();
  openProductModal(Number(item.dataset.id), { fromCategoryId: categoryId });
});
categoryWholesaleNote.addEventListener('click', () => {
  if (!activeModalCategory) return;
  const text = `Hola! Quiero pedir más de ${config.wholesaleQty} unidades de la categoría "${activeModalCategory.name}". ¿Me pueden dar un precio mayorista?`;
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
});

// ==== PRODUCT DETAIL MODAL (nivel 3: ficha del producto específico) ====
function openProductModal(id, opts) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  opts = opts || {};
  activeModalProduct = product;
  modalFromCategoryId = opts.fromCategoryId || null;
  modalQty = 1;
  modalQtyEl.textContent = modalQty;

  if (modalFromCategoryId) {
    const cat = categories.find(c => c.id === modalFromCategoryId);
    backToCategory.hidden = !cat;
    backToCategoryName.textContent = cat ? cat.name : '';
  } else {
    backToCategory.hidden = true;
  }

  productModalCat.textContent = product.category;
  productModalName.textContent = product.name;
  productModalDesc.textContent = product.desc;
  productModalPrice.textContent = CLP.format(product.price);
  updateModalWholesaleNote();

  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  productModalColors.hidden = !hasColors;
  selectedColor = hasColors ? product.colors[0] : null;
  if (hasColors) renderColorSwatches(product);
  updateProductModalMedia(product);

  productModal.classList.add('active');
  productOverlay.classList.add('active');
}
function updateProductModalMedia(product) {
  productModalMedia.innerHTML = (selectedColor && selectedColor.image)
    ? `<img src="${escapeAttr(selectedColor.image)}" alt="${escapeAttr(product.name)} - ${escapeAttr(selectedColor.name)}">`
    : productMediaHtml(product);
  selectedColorNameEl.textContent = selectedColor ? selectedColor.name : '';
}
function renderColorSwatches(product) {
  colorSwatches.innerHTML = product.colors.map((c, i) => `
    <button type="button" class="color-swatch ${selectedColor && selectedColor.name === c.name ? 'active' : ''}"
      style="background-color: ${escapeAttr(c.hex || '#cccccc')};" data-color-index="${i}"
      aria-label="Elegir color ${escapeAttr(c.name)}" title="${escapeAttr(c.name)}"></button>
  `).join('');
}
colorSwatches.addEventListener('click', e => {
  const btn = e.target.closest('.color-swatch');
  if (!btn || !activeModalProduct) return;
  selectedColor = activeModalProduct.colors[Number(btn.dataset.colorIndex)];
  renderColorSwatches(activeModalProduct);
  updateProductModalMedia(activeModalProduct);
});
function closeProductModalFn() {
  productModal.classList.remove('active');
  productOverlay.classList.remove('active');
  activeModalProduct = null;
  selectedColor = null;
}
closeProductModal.addEventListener('click', closeProductModalFn);
productOverlay.addEventListener('click', () => {
  closeProductModalFn();
  closeCategoryModalFn();
  closeCartDrawer();
  closeSettingsModal();
});
backToCategory.addEventListener('click', () => {
  const categoryId = modalFromCategoryId;
  closeProductModalFn();
  if (categoryId) openCategoryModal(categoryId);
});

function updateModalWholesaleNote() {
  const show = modalQty >= config.wholesaleQty;
  modalWholesaleNote.hidden = !show;
  if (show) modalWholesaleNote.textContent = `🎉 ${wholesaleMessageText()}`;
}
modalWholesaleNote.addEventListener('click', () => {
  if (!activeModalProduct) return;
  const text = `Hola! Quiero pedir ${modalQty} unidades de "${activeModalProduct.name}". ¿Me pueden dar un precio mayorista?`;
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
});

modalQtyMinus.addEventListener('click', () => {
  modalQty = Math.max(1, modalQty - 1);
  modalQtyEl.textContent = modalQty;
  updateModalWholesaleNote();
});
modalQtyPlus.addEventListener('click', () => {
  modalQty += 1;
  modalQtyEl.textContent = modalQty;
  updateModalWholesaleNote();
});
modalAddToCart.addEventListener('click', () => {
  if (!activeModalProduct) return;
  addToCart(activeModalProduct.id, modalQty, selectedColor);
  closeProductModalFn();
});
modalWhatsappBtn.addEventListener('click', () => {
  if (!activeModalProduct) return;
  const colorText = selectedColor ? ` (Color: ${selectedColor.name})` : '';
  const text = `Hola! Me interesa "${activeModalProduct.name}"${colorText} (${CLP.format(activeModalProduct.price)}). ¿Está disponible?`;
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
});

// ==== CART LOGIC ====
// Cada línea del carrito se identifica por "key" (id + color), para que dos
// colores del mismo producto queden como filas separadas con su propia imagen.
function cartKey(id, colorName) {
  return `${id}::${colorName || ''}`;
}

function addToCart(id, qty, color) {
  qty = qty || 1;
  const product = products.find(p => p.id === id);
  if (!product) return;
  const colorName = color ? color.name : null;
  const key = cartKey(id, colorName);
  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      image: (color && color.image) || product.image,
      color: colorName,
      qty
    });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} agregado al carrito`);
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.key !== key);
  }
  saveCart();
  renderCart();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
}

function renderCart() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = CLP.format(totalPrice);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Tu carrito está vacío 🙂</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb">${item.image ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}">` : (item.emoji || '📦')}</div>
      <div class="cart-item-info">
        <h4>${escapeHtml(item.name)}</h4>
        <span>${CLP.format(item.price)} c/u${item.color ? ` · Color: ${escapeHtml(item.color)}` : ''}</span>
      </div>
      <div class="cart-item-qty">
        <button data-qty-minus="${escapeAttr(item.key)}" aria-label="Restar">−</button>
        <span>${item.qty}</span>
        <button data-qty-plus="${escapeAttr(item.key)}" aria-label="Sumar">+</button>
      </div>
      <button class="cart-item-remove" data-remove="${escapeAttr(item.key)}" aria-label="Eliminar">✕</button>
    </div>
  `).join('');
}

cartItemsEl.addEventListener('click', e => {
  const minus = e.target.closest('[data-qty-minus]');
  const plus = e.target.closest('[data-qty-plus]');
  const remove = e.target.closest('[data-remove]');
  if (minus) updateQty(minus.dataset.qtyMinus, -1);
  if (plus) updateQty(plus.dataset.qtyPlus, 1);
  if (remove) removeItem(remove.dataset.remove);
});

// ==== CART DRAWER TOGGLE ====
function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}
function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', () => {
  closeCartDrawer();
  closeProductModalFn();
  closeCategoryModalFn();
  closeSettingsModal();
});

// ==== MOBILE NAV ====
hamburger.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// ==== CHECKOUT VIA WHATSAPP ====
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Agrega productos antes de finalizar tu pedido');
    return;
  }
  const lines = cart.map(i => `• ${i.qty}x ${i.name}${i.color ? ` (Color: ${i.color})` : ''} — ${CLP.format(i.price * i.qty)}`);
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const message = [
    'Hola! Quisiera hacer el siguiente pedido:',
    '',
    ...lines,
    '',
    `Total: ${CLP.format(total)}`
  ].join('\n');
  const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// ==== CUSTOM QUOTE BUTTON ====
customQuoteBtn.addEventListener('click', () => {
  const message = 'Hola! Me gustaría cotizar una impresión 3D personalizada.';
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
});

// ==== CONTACT FORM -> WHATSAPP ====
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const nombre = data.get('nombre');
  const correo = data.get('correo');
  const mensaje = data.get('mensaje');
  const text = `Hola! Soy ${nombre} (${correo}).\n\n${mensaje}`;
  window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  formNote.textContent = 'Te redirigimos a WhatsApp para enviar tu mensaje ✅';
  contactForm.reset();
});

// ==== SETTINGS MODAL (protegido por PIN) ====
function openSettingsModal() {
  populateConfigForm();
  renderAdminCategoryList();
  renderAdminProductList();
  renderAdminReviewList();
  refreshCategoryDatalist();
  settingsModal.classList.add('active');
  settingsOverlay.classList.add('active');
}
function closeSettingsModal() {
  settingsModal.classList.remove('active');
  settingsOverlay.classList.remove('active');
}
settingsBtn.addEventListener('click', () => {
  if (isAdminUnlocked()) {
    openSettingsModal();
  } else {
    openPinModal();
  }
});
closeSettings.addEventListener('click', closeSettingsModal);
settingsOverlay.addEventListener('click', () => {
  closeSettingsModal();
  closeCartDrawer();
  closeProductModalFn();
  closeCategoryModalFn();
});
lockPanel.addEventListener('click', () => {
  lockAdmin();
  closeSettingsModal();
  showToast('Panel bloqueado');
});

// ---- PIN gate: solo quien conoce el PIN puede abrir "Editar sitio" ----
// Nota: al ser un sitio 100% estático (sin servidor), esto es una traba
// práctica para visitantes casuales, no una seguridad a prueba de expertos.
async function sha256Hex(text) {
  if (window.crypto && window.crypto.subtle) {
    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Respaldo simple si el navegador no soporta Web Crypto (contextos no seguros).
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return 'fallback_' + hash;
}
function isAdminUnlocked() {
  return sessionStorage.getItem('echo_admin_unlocked') === '1';
}
function unlockAdmin() {
  sessionStorage.setItem('echo_admin_unlocked', '1');
}
function lockAdmin() {
  sessionStorage.removeItem('echo_admin_unlocked');
}

function openPinModal() {
  pinNote.textContent = '';
  pinForm.reset();
  pinModal.classList.add('active');
  pinOverlay.classList.add('active');
  pinInput1.focus();
}
function closePinModal() {
  pinModal.classList.remove('active');
  pinOverlay.classList.remove('active');
}
closePin.addEventListener('click', closePinModal);
pinOverlay.addEventListener('click', closePinModal);

// El PIN válido es DEFAULT_ADMIN_PIN mientras no se haya guardado un hash propio
// (o el que se haya definido después desde "Cambiar PIN"). Sin hash guardado,
// solo el PIN por defecto abre el panel; cualquier otro valor se rechaza.
pinForm.addEventListener('submit', async e => {
  e.preventDefault();
  const pin1 = pinInput1.value.trim();
  if (pin1.length < 4) {
    pinNote.textContent = 'El PIN debe tener al menos 4 caracteres.';
    return;
  }
  const storedHash = localStorage.getItem(STORAGE_KEYS.pin);
  let valid = false;
  if (storedHash) {
    valid = (await sha256Hex(pin1)) === storedHash;
  } else {
    valid = pin1 === DEFAULT_ADMIN_PIN;
    if (valid) {
      // Primera vez que se usa correctamente: se guarda el hash para las próximas veces.
      localStorage.setItem(STORAGE_KEYS.pin, await sha256Hex(pin1));
    }
  }
  if (valid) {
    unlockAdmin();
    closePinModal();
    openSettingsModal();
  } else {
    pinNote.textContent = 'PIN incorrecto.';
  }
});

changePinForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(changePinForm);
  const newPin = String(data.get('newPin')).trim();
  const confirmPin = String(data.get('confirmPin')).trim();
  if (newPin.length < 4) {
    changePinNote.textContent = 'El PIN debe tener al menos 4 caracteres.';
    return;
  }
  if (newPin !== confirmPin) {
    changePinNote.textContent = 'Los PIN no coinciden.';
    return;
  }
  localStorage.setItem(STORAGE_KEYS.pin, await sha256Hex(newPin));
  changePinForm.reset();
  changePinNote.textContent = 'PIN actualizado ✅';
  showToast('PIN de administrador actualizado');
});

settingsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    settingsTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    settingsPanels.forEach(p => {
      p.hidden = p.dataset.panel !== tab.dataset.tab;
    });
  });
});

// Escape closes any open modal/drawer
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCartDrawer();
    closeProductModalFn();
    closeCategoryModalFn();
    closeSettingsModal();
    closePinModal();
  }
});

// ---- Contact/config form ----
function populateConfigForm() {
  configForm.whatsapp.value = config.whatsapp;
  configForm.email.value = config.email;
  configForm.instagram.value = config.instagram;
  configForm.address.value = config.address;
  configForm.wholesaleQty.value = config.wholesaleQty;
  configForm.wholesaleMessage.value = config.wholesaleMessage;
  configNote.textContent = '';
}

configForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(configForm);
  const whatsapp = String(data.get('whatsapp')).replace(/\D/g, '');
  const wholesaleQty = Number(data.get('wholesaleQty'));
  if (whatsapp.length < 8) {
    configNote.textContent = 'Ingresa un número de WhatsApp válido (código de país + número).';
    return;
  }
  if (!Number.isFinite(wholesaleQty) || wholesaleQty < 2) {
    configNote.textContent = 'La cantidad mínima para precio mayorista debe ser 2 o más.';
    return;
  }
  config = {
    whatsapp,
    email: data.get('email').trim(),
    instagram: data.get('instagram').trim(),
    address: data.get('address').trim(),
    wholesaleQty,
    wholesaleMessage: data.get('wholesaleMessage').trim() || DEFAULT_CONFIG.wholesaleMessage
  };
  saveConfig();
  applyConfigToDOM();
  configNote.textContent = 'Cambios guardados ✅';
  showToast('Datos de contacto actualizados');
});

// ---- Category admin form ----
function refreshCategoryDatalist() {
  categoryList.innerHTML = categories.map(c => `<option value="${escapeAttr(c.name)}"></option>`).join('');
}

function resetCategoryForm() {
  categoryForm.reset();
  categoryForm.id.value = '';
  editingCategoryId = null;
  categoryImagePreview.hidden = true;
  categoryImagePreviewImg.src = '';
  categoryNote.textContent = '';
}

categoryForm.imageFile.addEventListener('change', () => {
  const file = categoryForm.imageFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    categoryImagePreviewImg.src = reader.result;
    categoryImagePreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

categoryForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(categoryForm);
  const name = data.get('name').trim();
  const desc = data.get('desc').trim();
  const emoji = data.get('emoji').trim();
  const imageUrl = data.get('imageUrl').trim();
  const file = categoryForm.imageFile.files[0];

  if (!name || !desc) {
    categoryNote.textContent = 'Completa el nombre y la descripción de la categoría.';
    return;
  }
  const duplicate = categories.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingCategoryId);
  if (duplicate) {
    categoryNote.textContent = 'Ya existe una categoría con ese nombre.';
    return;
  }

  let image = imageUrl || '';
  if (file) {
    image = await fileToDataUrl(file);
  }

  if (editingCategoryId) {
    const category = categories.find(c => c.id === editingCategoryId);
    if (category) {
      const oldName = category.name;
      category.name = name;
      category.desc = desc;
      if (emoji) category.emoji = emoji;
      if (image) category.image = image;
      if (oldName !== name) {
        products.filter(p => p.category === oldName).forEach(p => { p.category = name; });
        saveProducts();
      }
    }
    showToast('Categoría actualizada');
  } else {
    categories.push({
      id: nextCategoryId(),
      name,
      desc,
      emoji: emoji || '📦',
      image
    });
    showToast('Categoría agregada');
  }

  saveCategories();
  renderCategories();
  renderAdminCategoryList();
  refreshCategoryDatalist();
  renderAdminProductList();
  resetCategoryForm();
});

cancelEditCategory.addEventListener('click', resetCategoryForm);

function renderAdminCategoryList() {
  if (!categories.length) {
    adminCategoryList.innerHTML = `<p class="empty-state">No hay categorías todavía.</p>`;
    return;
  }
  adminCategoryList.innerHTML = categories.map(c => `
    <div class="admin-product-item">
      <div class="admin-product-thumb">${categoryMediaHtml(c)}</div>
      <div class="admin-product-info">
        <strong>${escapeHtml(c.name)}</strong>
        <span>${productsInCategory(c.name).length} producto(s)</span>
      </div>
      <div class="admin-product-actions">
        <button type="button" data-edit-cat="${c.id}">Editar</button>
        <button type="button" class="danger" data-delete-cat="${c.id}">Eliminar</button>
      </div>
    </div>
  `).join('');
}

adminCategoryList.addEventListener('click', e => {
  const editBtn = e.target.closest('[data-edit-cat]');
  const deleteBtn = e.target.closest('[data-delete-cat]');
  if (editBtn) {
    const id = Number(editBtn.dataset.editCat);
    const category = categories.find(c => c.id === id);
    if (!category) return;
    editingCategoryId = id;
    categoryForm.id.value = id;
    categoryForm.name.value = category.name;
    categoryForm.desc.value = category.desc;
    categoryForm.emoji.value = category.emoji || '';
    categoryForm.imageUrl.value = category.image && !category.image.startsWith('data:') ? category.image : '';
    if (category.image) {
      categoryImagePreviewImg.src = category.image;
      categoryImagePreview.hidden = false;
    } else {
      categoryImagePreview.hidden = true;
    }
    categoryNote.textContent = `Editando "${category.name}"`;
  }
  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.deleteCat);
    const category = categories.find(c => c.id === id);
    if (!category) return;
    if (productsInCategory(category.name).length > 0) {
      showToast('No puedes eliminar una categoría que tiene productos. Elimina o reasigna esos productos primero.');
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    categories = categories.filter(c => c.id !== id);
    saveCategories();
    renderCategories();
    renderAdminCategoryList();
    refreshCategoryDatalist();
    if (editingCategoryId === id) resetCategoryForm();
  }
});

// ---- Product admin form ----
function resetProductForm() {
  productForm.reset();
  productForm.id.value = '';
  editingProductId = null;
  productImagePreview.hidden = true;
  productImagePreviewImg.src = '';
  productNote.textContent = '';
  productFormColors = [];
  colorImageInput.value = '';
  renderColorChipList();
}

// ---- Color manager (colores del producto que se está creando/editando) ----
function renderColorChipList() {
  if (!productFormColors.length) {
    colorChipList.innerHTML = '';
    return;
  }
  colorChipList.innerHTML = productFormColors.map((c, i) => `
    <span class="color-chip">
      <span class="color-chip-dot" style="background-color: ${escapeAttr(c.hex || '#cccccc')};">${c.image ? `<img src="${escapeAttr(c.image)}" alt="">` : ''}</span>
      ${escapeHtml(c.name)}
      <button type="button" data-remove-color="${i}" aria-label="Quitar color ${escapeAttr(c.name)}">✕</button>
    </span>
  `).join('');
}

addColorBtn.addEventListener('click', async () => {
  const name = colorNameInput.value.trim();
  if (!name) {
    productNote.textContent = 'Escribe un nombre para el color antes de agregarlo.';
    return;
  }
  const hex = colorHexInput.value;
  const file = colorImageInput.files[0];
  const image = file ? await fileToDataUrl(file) : '';
  productFormColors.push({ name, hex, image });
  colorNameInput.value = '';
  colorImageInput.value = '';
  productNote.textContent = '';
  renderColorChipList();
});

colorChipList.addEventListener('click', e => {
  const btn = e.target.closest('[data-remove-color]');
  if (!btn) return;
  productFormColors.splice(Number(btn.dataset.removeColor), 1);
  renderColorChipList();
});

productForm.imageFile.addEventListener('change', () => {
  const file = productForm.imageFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    productImagePreviewImg.src = reader.result;
    productImagePreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

productForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(productForm);
  const name = data.get('name').trim();
  const category = data.get('category').trim();
  const price = Number(data.get('price'));
  const desc = data.get('desc').trim();
  const imageUrl = data.get('imageUrl').trim();
  const file = productForm.imageFile.files[0];
  const featured = data.get('featured') === 'on';

  if (!name || !category || !desc || !Number.isFinite(price) || price < 0) {
    productNote.textContent = 'Revisa los campos: falta información o el precio no es válido.';
    return;
  }

  let image = imageUrl || '';
  if (file) {
    image = await fileToDataUrl(file);
  }

  // Si la categoría escrita no existe todavía, se crea automáticamente
  // (sin descripción); el dueño puede completarla luego en la pestaña "Categorías".
  const existingCategory = categories.find(c => c.name.toLowerCase() === category.toLowerCase());
  if (!existingCategory) {
    categories.push({ id: nextCategoryId(), name: category, desc: '', emoji: '📦', image: '' });
    saveCategories();
    refreshCategoryDatalist();
  }
  const categoryName = existingCategory ? existingCategory.name : category;

  if (editingProductId) {
    const product = products.find(p => p.id === editingProductId);
    if (product) {
      product.name = name;
      product.category = categoryName;
      product.price = price;
      product.desc = desc;
      product.featured = featured;
      product.colors = productFormColors;
      if (image) product.image = image;
    }
    showToast('Producto actualizado');
  } else {
    products.push({
      id: nextProductId(),
      name,
      category: categoryName,
      price,
      desc,
      image,
      emoji: '📦',
      featured,
      colors: productFormColors
    });
    showToast('Producto agregado');
  }

  saveProducts();
  renderCategories();
  renderBestSellers();
  renderAdminProductList();
  renderAdminCategoryList();
  resetProductForm();
});

function fileToDataUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

cancelEditProduct.addEventListener('click', resetProductForm);

function renderAdminProductList() {
  if (!products.length) {
    adminProductList.innerHTML = `<p class="empty-state">No hay productos todavía.</p>`;
    return;
  }
  adminProductList.innerHTML = products.map(p => `
    <div class="admin-product-item">
      <div class="admin-product-thumb">${productMediaHtml(p)}</div>
      <div class="admin-product-info">
        <strong>${p.featured ? '⭐ ' : ''}${escapeHtml(p.name)}</strong>
        <span>${escapeHtml(p.category)} · ${CLP.format(p.price)}</span>
      </div>
      <div class="admin-product-actions">
        <button type="button" data-edit="${p.id}">Editar</button>
        <button type="button" class="danger" data-delete="${p.id}">Eliminar</button>
      </div>
    </div>
  `).join('');
}

adminProductList.addEventListener('click', e => {
  const editBtn = e.target.closest('[data-edit]');
  const deleteBtn = e.target.closest('[data-delete]');
  if (editBtn) {
    const id = Number(editBtn.dataset.edit);
    const product = products.find(p => p.id === id);
    if (!product) return;
    editingProductId = id;
    productForm.id.value = id;
    productForm.name.value = product.name;
    productForm.category.value = product.category;
    productForm.price.value = product.price;
    productForm.desc.value = product.desc;
    productForm.imageUrl.value = product.image && !product.image.startsWith('data:') ? product.image : '';
    productForm.featured.checked = !!product.featured;
    productFormColors = JSON.parse(JSON.stringify(product.colors || []));
    renderColorChipList();
    if (product.image) {
      productImagePreviewImg.src = product.image;
      productImagePreview.hidden = false;
    } else {
      productImagePreview.hidden = true;
    }
    productNote.textContent = `Editando "${product.name}"`;
  }
  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.delete);
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;
    products = products.filter(p => p.id !== id);
    cart = cart.filter(i => i.id !== id);
    saveProducts();
    saveCart();
    renderCategories();
    renderBestSellers();
    renderCart();
    renderAdminProductList();
    renderAdminCategoryList();
    if (editingProductId === id) resetProductForm();
  }
});

// ---- Review admin form ----
// Sin formulario público: al ser un sitio estático (sin servidor), solo el
// dueño agrega reseñas desde este panel (copiándolas de WhatsApp, Instagram, etc).
function resetReviewForm() {
  reviewForm.reset();
  reviewForm.id.value = '';
  editingReviewId = null;
  reviewNote.textContent = '';
}

reviewForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(reviewForm);
  const name = data.get('name').trim();
  const rating = Number(data.get('rating'));
  const comment = data.get('comment').trim();

  if (!name || !comment || !Number.isFinite(rating)) {
    reviewNote.textContent = 'Completa el nombre, la calificación y el comentario.';
    return;
  }

  if (editingReviewId) {
    const review = reviews.find(r => r.id === editingReviewId);
    if (review) {
      review.name = name;
      review.rating = rating;
      review.comment = comment;
    }
    showToast('Reseña actualizada');
  } else {
    reviews.push({
      id: nextReviewId(),
      name,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10)
    });
    showToast('Reseña agregada');
  }

  saveReviews();
  renderReviews();
  renderAdminReviewList();
  resetReviewForm();
});

cancelEditReview.addEventListener('click', resetReviewForm);

function renderAdminReviewList() {
  if (!reviews.length) {
    adminReviewList.innerHTML = `<p class="empty-state">No hay reseñas todavía.</p>`;
    return;
  }
  adminReviewList.innerHTML = reviews.map(r => `
    <div class="admin-product-item">
      <div class="admin-product-thumb">💬</div>
      <div class="admin-product-info">
        <strong>${escapeHtml(r.name)} · ${starString(r.rating)}</strong>
        <span>${escapeHtml(r.comment)}</span>
      </div>
      <div class="admin-product-actions">
        <button type="button" data-edit-review="${r.id}">Editar</button>
        <button type="button" class="danger" data-delete-review="${r.id}">Eliminar</button>
      </div>
    </div>
  `).join('');
}

adminReviewList.addEventListener('click', e => {
  const editBtn = e.target.closest('[data-edit-review]');
  const deleteBtn = e.target.closest('[data-delete-review]');
  if (editBtn) {
    const id = Number(editBtn.dataset.editReview);
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    editingReviewId = id;
    reviewForm.id.value = id;
    reviewForm.name.value = review.name;
    reviewForm.rating.value = review.rating;
    reviewForm.comment.value = review.comment;
    reviewNote.textContent = `Editando reseña de "${review.name}"`;
  }
  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.deleteReview);
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    if (!confirm(`¿Eliminar la reseña de "${review.name}"?`)) return;
    reviews = reviews.filter(r => r.id !== id);
    saveReviews();
    renderReviews();
    renderAdminReviewList();
    if (editingReviewId === id) resetReviewForm();
  }
});

// ==== TOAST ====
let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==== UTIL ====
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
