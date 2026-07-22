import { store } from "./js/state.js";
import { renderProductCard } from "./js/components/productCard.js";
import { renderCartDrawer } from "./js/components/cartDrawer.js";
import { renderQuickViewModal } from "./js/components/quickViewModal.js";
import { renderCheckoutModal } from "./js/components/checkoutModal.js";
import { renderAuthModal } from "./js/components/authModal.js";
import { renderAdminDashboard } from "./js/components/adminDashboard.js";
import { renderToasts } from "./js/components/toast.js";

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const categoryTabs = document.getElementById("categoryTabs");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");

const drawerOverlay = document.getElementById("drawerOverlay");
const btnCartNav = document.getElementById("btnCartNav");
const btnCloseCart = document.getElementById("btnCloseCart");
const btnOpenCheckout = document.getElementById("btnOpenCheckout");

const quickViewModal = document.getElementById("quickViewModal");
const btnCloseQuickView = document.getElementById("btnCloseQuickView");

const checkoutModal = document.getElementById("checkoutModal");
const btnCloseCheckout = document.getElementById("btnCloseCheckout");

const authModal = document.getElementById("authModal");
const btnAuthNav = document.getElementById("btnAuthNav");
const btnCloseAuth = document.getElementById("btnCloseAuth");

const adminModal = document.getElementById("adminModal");
const btnAdminNav = document.getElementById("btnAdminNav");
const btnCloseAdmin = document.getElementById("btnCloseAdmin");

const btnWishlistNav = document.getElementById("btnWishlistNav");
const wishlistBadge = document.getElementById("wishlistBadge");
const promoInput = document.getElementById("promoInput");
const btnApplyPromo = document.getElementById("btnApplyPromo");

const btnHeroExplore = document.getElementById("btnHeroExplore");
const btnHeroKits = document.getElementById("btnHeroKits");

// Render Store UI
function updateUI(state) {
  // 1. Render Product Grid
  if (state.filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i data-lucide="search-x" style="width: 54px; height: 54px; margin-bottom: 1rem; opacity: 0.4;"></i>
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">
          No Artisan Works Found
        </h3>
        <p>Try searching for a different item or resetting your category filter.</p>
        <button class="btn-secondary" id="btnResetFilters" style="margin-top: 1.5rem;">
          Reset All Filters
        </button>
      </div>
    `;
    const btnReset = document.getElementById("btnResetFilters");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        store.setCategory("all");
        store.setSearchQuery("");
        if (searchInput) searchInput.value = "";
      });
    }
  } else {
    productsGrid.innerHTML = state.filteredProducts
      .map(p => renderProductCard(p, state.wishlist.has(p.id)))
      .join("");
  }

  // 2. Refresh Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. User Auth & Admin Indicators in Navbar
  const userIcon = document.getElementById("userIcon");
  const userAvatarText = document.getElementById("userAvatarText");

  if (state.currentUser) {
    if (userIcon) userIcon.style.display = "none";
    if (userAvatarText) {
      userAvatarText.style.display = "inline";
      userAvatarText.textContent = state.currentUser.avatar;
    }
    btnAuthNav.title = `${state.currentUser.name} (${state.currentUser.role})`;
    
    if (state.currentUser.role === "admin") {
      btnAdminNav.style.display = "flex";
    } else {
      btnAdminNav.style.display = "none";
    }
  } else {
    if (userIcon) userIcon.style.display = "inline-block";
    if (userAvatarText) userAvatarText.style.display = "none";
    btnAuthNav.title = "Account Login";
    btnAdminNav.style.display = "none";
  }

  // 4. Wishlist Badge
  wishlistBadge.textContent = state.wishlist.size;
  wishlistBadge.style.display = state.wishlist.size > 0 ? "flex" : "none";

  // 5. Render Cart Drawer
  const totals = store.getCartTotals();
  renderCartDrawer(state, totals);

  if (state.isCartOpen) {
    drawerOverlay.classList.add("open");
  } else {
    drawerOverlay.classList.remove("open");
  }

  // 6. Render Quick View Modal
  if (state.quickViewProduct) {
    renderQuickViewModal(state.quickViewProduct, store);
    quickViewModal.classList.add("open");
  } else {
    quickViewModal.classList.remove("open");
  }

  // 7. Render Checkout Modal
  if (state.isCheckoutOpen) {
    renderCheckoutModal(state, store);
    checkoutModal.classList.add("open");
  } else {
    checkoutModal.classList.remove("open");
  }

  // 8. Render Auth Modal
  if (state.isAuthOpen) {
    renderAuthModal(state, store);
    authModal.classList.add("open");
  } else {
    authModal.classList.remove("open");
  }

  // 9. Render Admin Dashboard Modal
  if (state.isAdminOpen) {
    renderAdminDashboard(state, store);
    adminModal.classList.add("open");
  } else {
    adminModal.classList.remove("open");
  }

  // 10. Toasts
  renderToasts(state.toasts);
}

// Event Listeners Initialization
function initEvents() {
  // Category Filter Tabs
  if (categoryTabs) {
    categoryTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (btn) {
        const cat = btn.dataset.category;
        categoryTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        store.setCategory(cat);
      }
    });
  }

  // Sort Selection
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      store.setSortBy(e.target.value);
    });
  }

  // Live Search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      store.setSearchQuery(e.target.value);
    });
  }

  // Keyboard shortcut Ctrl+K focus search
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  // Product Grid Action Delegation
  if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const product = store.state.products.find(p => p.id === id);

      if (action === "wishlist") {
        store.toggleWishlist(id);
      } else if (action === "quickview") {
        store.openQuickView(product);
      } else if (action === "add-cart") {
        store.addToCart(product, 1);
      }
    });
  }

  // Auth & Admin Navbar Buttons
  if (btnAuthNav) {
    btnAuthNav.addEventListener("click", () => {
      if (store.state.currentUser) {
        if (confirm(`Logged in as ${store.state.currentUser.name} (${store.state.currentUser.role}). Would you like to log out?`)) {
          store.logout();
        }
      } else {
        store.toggleAuthModal(true);
      }
    });
  }
  if (btnCloseAuth) {
    btnCloseAuth.addEventListener("click", () => store.toggleAuthModal(false));
  }
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) store.toggleAuthModal(false);
    });
  }

  if (btnAdminNav) {
    btnAdminNav.addEventListener("click", () => store.toggleAdminDashboard(true));
  }
  if (btnCloseAdmin) {
    btnCloseAdmin.addEventListener("click", () => store.toggleAdminDashboard(false));
  }
  if (adminModal) {
    adminModal.addEventListener("click", (e) => {
      if (e.target === adminModal) store.toggleAdminDashboard(false);
    });
  }

  // Nav Wishlist Click
  if (btnWishlistNav) {
    btnWishlistNav.addEventListener("click", () => {
      categoryTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      const wishlistTab = categoryTabs.querySelector("[data-category='wishlist']");
      if (wishlistTab) wishlistTab.classList.add("active");
      store.setCategory("wishlist");
    });
  }

  // Cart Drawer Triggers
  if (btnCartNav) {
    btnCartNav.addEventListener("click", () => store.toggleCart(true));
  }
  if (btnCloseCart) {
    btnCloseCart.addEventListener("click", () => store.toggleCart(false));
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", (e) => {
      if (e.target === drawerOverlay) store.toggleCart(false);
    });
  }

  // Cart Items Action Delegation
  const cartItemsList = document.getElementById("cartItemsList");
  if (cartItemsList) {
    cartItemsList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const color = btn.dataset.color;
      const item = store.state.cart.find(i => i.product.id === id && i.selectedColor === color);

      if (!item) return;

      if (action === "qty-plus") {
        store.updateCartQuantity(id, color, item.quantity + 1);
      } else if (action === "qty-minus") {
        store.updateCartQuantity(id, color, item.quantity - 1);
      } else if (action === "cart-remove") {
        store.removeFromCart(id, color);
      }
    });
  }

  // Promo Code Trigger
  if (btnApplyPromo && promoInput) {
    btnApplyPromo.addEventListener("click", () => {
      if (promoInput.value) {
        store.applyPromoCode(promoInput.value);
        promoInput.value = "";
      }
    });
  }

  const promoBadgeContainer = document.getElementById("promoBadgeContainer");
  if (promoBadgeContainer) {
    promoBadgeContainer.addEventListener("click", (e) => {
      if (e.target.id === "btnRemovePromo") {
        store.removePromoCode();
      }
    });
  }

  // Quick View Modal Closure
  if (btnCloseQuickView) {
    btnCloseQuickView.addEventListener("click", () => store.closeQuickView());
  }
  if (quickViewModal) {
    quickViewModal.addEventListener("click", (e) => {
      if (e.target === quickViewModal) store.closeQuickView();
    });
  }

  // Checkout Triggers
  if (btnOpenCheckout) {
    btnOpenCheckout.addEventListener("click", () => store.openCheckout());
  }
  if (btnCloseCheckout) {
    btnCloseCheckout.addEventListener("click", () => store.closeCheckout());
  }
  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) store.closeCheckout();
    });
  }

  // Hero Section Buttons
  if (btnHeroExplore) {
    btnHeroExplore.addEventListener("click", () => {
      window.scrollTo({ top: productsGrid.offsetTop - 120, behavior: "smooth" });
    });
  }
  if (btnHeroKits) {
    btnHeroKits.addEventListener("click", () => {
      categoryTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      const kitsTab = categoryTabs.querySelector("[data-category='craft-kits']");
      if (kitsTab) kitsTab.classList.add("active");
      store.setCategory("craft-kits");
      window.scrollTo({ top: productsGrid.offsetTop - 120, behavior: "smooth" });
    });
  }
}

// Initial App Boot
store.subscribe(updateUI);
initEvents();
updateUI(store.state);
