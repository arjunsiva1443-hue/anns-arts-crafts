export function renderCartDrawer(state, totals) {
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartDiscount = document.getElementById("cartDiscount");
  const rowDiscount = document.getElementById("rowDiscount");
  const cartShipping = document.getElementById("cartShipping");
  const cartTax = document.getElementById("cartTax");
  const cartTotal = document.getElementById("cartTotal");
  const promoBadgeContainer = document.getElementById("promoBadgeContainer");
  const shippingBarText = document.getElementById("shippingBarText");
  const shippingProgressFill = document.getElementById("shippingProgressFill");
  const cartBadge = document.getElementById("cartBadge");

  // Cart Badge Counter
  cartBadge.textContent = totals.itemCount;
  cartBadge.style.display = totals.itemCount > 0 ? "flex" : "none";

  // Shipping threshold progress bar
  if (totals.amountNeededForFreeShipping > 0 && totals.subtotal > 0) {
    shippingBarText.innerHTML = `Add <strong>$${totals.amountNeededForFreeShipping.toFixed(2)}</strong> more for Free Express Shipping`;
    const percent = Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100);
    shippingProgressFill.style.width = `${percent}%`;
  } else if (totals.subtotal >= totals.freeShippingThreshold) {
    shippingBarText.innerHTML = `<span style="color: var(--accent-emerald);">🎉 You unlocked <strong>FREE Express Shipping</strong>!</span>`;
    shippingProgressFill.style.width = "100%";
  } else {
    shippingBarText.textContent = `Add $150.00 for Free Express Shipping`;
    shippingProgressFill.style.width = "0%";
  }

  // Cart Items Render
  if (state.cart.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; stroke-width: 1.5; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.5rem;">Your studio cart is empty</p>
        <p style="font-size: 0.85rem;">Discover handcrafted items and add them to your collection.</p>
      </div>
    `;
  } else {
    cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.product.name}</h4>
          <div class="cart-item-color">
            <span class="color-dot" style="background-color: ${item.selectedColor};"></span>
            <span>Variant Accent</span>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button class="qty-btn" data-action="qty-minus" data-id="${item.product.id}" data-color="${item.selectedColor}">-</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn" data-action="qty-plus" data-id="${item.product.id}" data-color="${item.selectedColor}">+</button>
            </div>
            <span class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button class="btn-close" data-action="cart-remove" data-id="${item.product.id}" data-color="${item.selectedColor}" style="position: absolute; top: 0.5rem; right: 0.5rem;">
          <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    `).join("");
  }

  // Promo Code Badge
  if (state.appliedPromo) {
    promoBadgeContainer.innerHTML = `
      <div class="promo-tag">
        <span><i data-lucide="tag" style="width: 14px; height: 14px; display: inline;"></i> ${state.appliedPromo.code} - ${state.appliedPromo.description}</span>
        <button id="btnRemovePromo" style="background: none; border: none; color: var(--accent-emerald); cursor: pointer; font-size: 0.8rem; font-weight: bold;">✕</button>
      </div>
    `;
    rowDiscount.style.display = "flex";
    cartDiscount.textContent = `-$${totals.discount.toFixed(2)}`;
  } else {
    promoBadgeContainer.innerHTML = "";
    rowDiscount.style.display = "none";
  }

  // Totals
  cartSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
  cartShipping.textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
  cartTax.textContent = `$${totals.tax.toFixed(2)}`;
  cartTotal.textContent = `$${totals.total.toFixed(2)}`;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
