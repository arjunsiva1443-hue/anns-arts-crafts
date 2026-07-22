import { PRODUCTS, PROMO_CODES } from "../data/products.js";

class Store {
  constructor() {
    // Initial products & promos
    const savedProducts = localStorage.getItem("lumina_products");
    const productsList = savedProducts ? JSON.parse(savedProducts) : PRODUCTS;

    const savedPromos = localStorage.getItem("lumina_promos");
    const promosObj = savedPromos ? JSON.parse(savedPromos) : PROMO_CODES;

    // Initial User
    const savedUser = localStorage.getItem("lumina_user");
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    this.state = {
      products: productsList,
      filteredProducts: [...productsList],
      promos: promosObj,
      cart: JSON.parse(localStorage.getItem("lumina_cart") || "[]"),
      wishlist: new Set(JSON.parse(localStorage.getItem("lumina_wishlist") || "[]")),
      currentUser: currentUser, // { name, email, role: 'customer'|'admin', avatar }
      activeCategory: "all",
      searchQuery: "",
      sortBy: "featured",
      appliedPromo: null,
      quickViewProduct: null,
      isCartOpen: false,
      isAuthOpen: false,
      isAdminOpen: false,
      adminTab: "analytics", // analytics, inventory, orders, promos
      isCheckoutOpen: false,
      checkoutStep: 1,
      orderHistory: JSON.parse(localStorage.getItem("lumina_orders") || "[]"),
      currentOrder: null,
      toasts: []
    };

    this.listeners = [];
    this.applyFilters();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
    localStorage.setItem("lumina_products", JSON.stringify(this.state.products));
    localStorage.setItem("lumina_promos", JSON.stringify(this.state.promos));
    localStorage.setItem("lumina_cart", JSON.stringify(this.state.cart));
    localStorage.setItem("lumina_wishlist", JSON.stringify(Array.from(this.state.wishlist)));
    localStorage.setItem("lumina_user", JSON.stringify(this.state.currentUser));
    localStorage.setItem("lumina_orders", JSON.stringify(this.state.orderHistory));
  }

  // --- Auth Operations ---
  login(name, email, role = "customer") {
    this.state.currentUser = {
      name,
      email,
      role,
      avatar: role === "admin" ? "🛠️" : "🎨"
    };
    this.state.isAuthOpen = false;
    this.addToast(`Welcome back, ${name}! (${role === 'admin' ? 'Admin Access' : 'Customer Account'})`, "success");
    this.notify();
  }

  logout() {
    const name = this.state.currentUser ? this.state.currentUser.name : "User";
    this.state.currentUser = null;
    this.state.isAdminOpen = false;
    this.addToast(`Logged out ${name}`, "info");
    this.notify();
  }

  toggleAuthModal(isOpen = null) {
    this.state.isAuthOpen = isOpen !== null ? isOpen : !this.state.isAuthOpen;
    this.notify();
  }

  toggleAdminDashboard(isOpen = null) {
    if (isOpen && (!this.state.currentUser || this.state.currentUser.role !== "admin")) {
      this.addToast("Admin access required. Please sign in as Admin.", "error");
      this.state.isAuthOpen = true;
      this.notify();
      return;
    }
    this.state.isAdminOpen = isOpen !== null ? isOpen : !this.state.isAdminOpen;
    this.notify();
  }

  setAdminTab(tab) {
    this.state.adminTab = tab;
    this.notify();
  }

  // --- Filter & Search Logic ---
  setCategory(category) {
    this.state.activeCategory = category;
    this.applyFilters();
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query.trim().toLowerCase();
    this.applyFilters();
    this.notify();
  }

  setSortBy(sortBy) {
    this.state.sortBy = sortBy;
    this.applyFilters();
    this.notify();
  }

  applyFilters() {
    let result = [...this.state.products];

    if (this.state.activeCategory !== "all") {
      if (this.state.activeCategory === "wishlist") {
        result = result.filter(p => this.state.wishlist.has(p.id));
      } else {
        result = result.filter(p => p.category === this.state.activeCategory);
      }
    }

    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    switch (this.state.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    this.state.filteredProducts = result;
  }

  // --- Admin Product CRUD ---
  addProduct(newProductData) {
    const newId = `craft-${Date.now()}`;
    const newProduct = {
      id: newId,
      name: newProductData.name,
      tagline: newProductData.tagline || "Handcrafted Artisan Specialty",
      price: parseFloat(newProductData.price),
      originalPrice: newProductData.originalPrice ? parseFloat(newProductData.originalPrice) : null,
      category: newProductData.category,
      categoryLabel: newProductData.categoryLabel || "Artisan Craft",
      rating: 5.0,
      reviewCount: 1,
      image: newProductData.image || "./public/images/ceramic_mug.png",
      inStock: true,
      stockCount: parseInt(newProductData.stockCount) || 10,
      isFeatured: true,
      isNew: true,
      description: newProductData.description || "Handcrafted by Studio Artisans.",
      specs: newProductData.specs || { "Origin": "Studio Handcrafted", "Material": "Organic" },
      colors: ["#00f0ff", "#d97706"]
    };

    this.state.products.unshift(newProduct);
    this.applyFilters();
    this.addToast(`Product "${newProduct.name}" added to store inventory!`, "success");
    this.notify();
  }

  updateProduct(id, updatedFields) {
    const index = this.state.products.findIndex(p => p.id === id);
    if (index > -1) {
      this.state.products[index] = {
        ...this.state.products[index],
        ...updatedFields
      };
      this.applyFilters();
      this.addToast(`Updated product "${this.state.products[index].name}"`, "info");
      this.notify();
    }
  }

  deleteProduct(id) {
    const product = this.state.products.find(p => p.id === id);
    if (product) {
      this.state.products = this.state.products.filter(p => p.id !== id);
      this.applyFilters();
      this.addToast(`Deleted product "${product.name}" from inventory`, "info");
      this.notify();
    }
  }

  // --- Admin Order Fulfillment ---
  updateOrderStatus(orderId, newStatus) {
    const order = this.state.orderHistory.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.addToast(`Order ${orderId} status updated to "${newStatus}"`, "success");
      this.notify();
    }
  }

  // --- Admin Promo Code CRUD ---
  addPromoCode(code, discountPercent, description) {
    const cleanCode = code.trim().toUpperCase();
    this.state.promos[cleanCode] = {
      discountPercent: parseFloat(discountPercent),
      description
    };
    this.addToast(`Added new promo code "${cleanCode}" (${discountPercent}% Off)`, "success");
    this.notify();
  }

  deletePromoCode(code) {
    delete this.state.promos[code];
    if (this.state.appliedPromo && this.state.appliedPromo.code === code) {
      this.state.appliedPromo = null;
    }
    this.addToast(`Deleted promo code "${code}"`, "info");
    this.notify();
  }

  // --- Cart Operations ---
  addToCart(product, quantity = 1, selectedColor = null) {
    const existingIndex = this.state.cart.findIndex(
      item => item.product.id === product.id && item.selectedColor === (selectedColor || product.colors[0])
    );
    const color = selectedColor || product.colors[0];

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += quantity;
    } else {
      this.state.cart.push({
        product,
        quantity,
        selectedColor: color
      });
    }

    this.addToast(`Added "${product.name}" to cart`, "success");
    this.notify();
  }

  updateCartQuantity(productId, color, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId, color);
      return;
    }
    const item = this.state.cart.find(
      i => i.product.id === productId && i.selectedColor === color
    );
    if (item) {
      item.quantity = newQty;
      this.notify();
    }
  }

  removeFromCart(productId, color) {
    const item = this.state.cart.find(
      i => i.product.id === productId && i.selectedColor === color
    );
    if (item) {
      this.state.cart = this.state.cart.filter(
        i => !(i.product.id === productId && i.selectedColor === color)
      );
      this.addToast(`Removed "${item.product.name}" from cart`, "info");
      this.notify();
    }
  }

  clearCart() {
    this.state.cart = [];
    this.state.appliedPromo = null;
    this.notify();
  }

  applyPromoCode(code) {
    const cleanCode = code.trim().toUpperCase();
    const promo = this.state.promos[cleanCode];

    if (promo) {
      this.state.appliedPromo = {
        code: cleanCode,
        ...promo
      };
      this.addToast(`Promo code "${cleanCode}" applied!`, "success");
      this.notify();
      return { success: true, message: promo.description };
    } else {
      this.addToast(`Invalid promo code "${cleanCode}"`, "error");
      return { success: false, message: "Invalid promo code" };
    }
  }

  removePromoCode() {
    this.state.appliedPromo = null;
    this.addToast("Promo code removed", "info");
    this.notify();
  }

  getCartTotals() {
    const subtotal = this.state.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (this.state.appliedPromo) {
      if (this.state.appliedPromo.discountPercent) {
        discount = subtotal * (this.state.appliedPromo.discountPercent / 100);
      } else if (this.state.appliedPromo.discountAmount) {
        discount = Math.min(subtotal, this.state.appliedPromo.discountAmount);
      }
    }

    const freeShippingThreshold = 150;
    const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15.0;
    const tax = (subtotal - discount) * 0.08;
    const total = Math.max(0, subtotal - discount + shipping + tax);

    return {
      itemCount: this.state.cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      shipping,
      freeShippingThreshold,
      amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal),
      tax,
      total
    };
  }

  // --- Wishlist ---
  toggleWishlist(productId) {
    const product = this.state.products.find(p => p.id === productId);
    if (this.state.wishlist.has(productId)) {
      this.state.wishlist.delete(productId);
      this.addToast(`Removed "${product.name}" from wishlist`, "info");
    } else {
      this.state.wishlist.add(productId);
      this.addToast(`Added "${product.name}" to wishlist`, "success");
    }
    if (this.state.activeCategory === "wishlist") {
      this.applyFilters();
    }
    this.notify();
  }

  // --- Modals ---
  openQuickView(product) {
    this.state.quickViewProduct = product;
    this.notify();
  }

  closeQuickView() {
    this.state.quickViewProduct = null;
    this.notify();
  }

  toggleCart(isOpen = null) {
    this.state.isCartOpen = isOpen !== null ? isOpen : !this.state.isCartOpen;
    this.notify();
  }

  openCheckout() {
    if (this.state.cart.length === 0) {
      this.addToast("Your cart is empty", "error");
      return;
    }
    this.state.isCartOpen = false;
    this.state.isCheckoutOpen = true;
    this.state.checkoutStep = 1;
    this.notify();
  }

  closeCheckout() {
    this.state.isCheckoutOpen = false;
    this.notify();
  }

  setCheckoutStep(step) {
    this.state.checkoutStep = step;
    this.notify();
  }

  completeOrder(shippingDetails, paymentDetails) {
    const totals = this.getCartTotals();
    const newOrder = {
      id: `LMN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...this.state.cart],
      totals,
      shippingDetails,
      paymentMethod: paymentDetails.method || "Credit Card",
      status: "Processing"
    };

    this.state.currentOrder = newOrder;
    this.state.orderHistory.unshift(newOrder);
    localStorage.setItem("lumina_orders", JSON.stringify(this.state.orderHistory));

    this.clearCart();
    this.state.checkoutStep = 3;
    this.addToast("Order placed successfully!", "success");
    this.notify();
  }

  // --- Toasts ---
  addToast(message, type = "info") {
    const id = Date.now() + Math.random();
    this.state.toasts.push({ id, message, type });
    this.notify();

    setTimeout(() => {
      this.state.toasts = this.state.toasts.filter(t => t.id !== id);
      this.notify();
    }, 3500);
  }
}

export const store = new Store();
