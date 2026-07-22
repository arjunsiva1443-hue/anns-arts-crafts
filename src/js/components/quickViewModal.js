export function renderQuickViewModal(product, store) {
  const container = document.getElementById("quickViewContainer");
  if (!product) {
    container.innerHTML = "";
    return;
  }

  let selectedColor = product.colors[0];

  const specsRows = Object.entries(product.specs || {}).map(([key, val]) => `
    <div class="spec-item">
      <span class="spec-name">${key}</span>
      <span class="spec-val">${val}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="quickview-grid">
      <div class="qv-visual">
        <img src="${product.image}" alt="${product.name}" class="qv-image" id="qvImg" />
      </div>

      <div class="qv-details">
        <div style="font-size: 0.8rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin-bottom: 0.4rem;">
          ${product.categoryLabel}
        </div>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">
          ${product.name}
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5;">
          ${product.description}
        </p>

        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <span style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: #fff;">
            $${product.price.toFixed(2)}
          </span>
          ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-dim); font-size: 1.1rem;">$${product.originalPrice.toFixed(2)}</span>` : ''}
          <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: var(--accent-emerald); font-size: 0.75rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">
            In Stock (${product.stockCount} available)
          </span>
        </div>

        <div style="margin-bottom: 1rem;">
          <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Accent Finish</label>
          <div class="color-options" id="qvColorPicker">
            ${product.colors.map((c, i) => `
              <div class="color-chip ${i === 0 ? 'selected' : ''}" data-color="${c}" style="background-color: ${c};"></div>
            `).join('')}
          </div>
        </div>

        <!-- Specifications Breakdown Table -->
        <div class="qv-specs">
          <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Handcraft Specifications
          </div>
          ${specsRows}
        </div>

        <div style="display: flex; gap: 1rem; margin-top: auto; padding-top: 1rem;">
          <button class="btn-primary" id="btnQVAddToCart" style="flex: 1; justify-content: center;">
            <i data-lucide="shopping-bag"></i> Add to Collection
          </button>
          <button class="btn-secondary" id="btnQVWishlist" style="padding: 0 1.2rem;">
            <i data-lucide="heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Color selection event listeners inside modal
  const colorChips = container.querySelectorAll(".color-chip");
  colorChips.forEach(chip => {
    chip.addEventListener("click", () => {
      colorChips.forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      selectedColor = chip.dataset.color;
    });
  });

  // Add to cart listener inside quick view
  const btnQVAddToCart = container.querySelector("#btnQVAddToCart");
  if (btnQVAddToCart) {
    btnQVAddToCart.addEventListener("click", () => {
      store.addToCart(product, 1, selectedColor);
      store.closeQuickView();
      store.toggleCart(true);
    });
  }

  // Wishlist toggle listener
  const btnQVWishlist = container.querySelector("#btnQVWishlist");
  if (btnQVWishlist) {
    btnQVWishlist.addEventListener("click", () => {
      store.toggleWishlist(product.id);
    });
  }
}
