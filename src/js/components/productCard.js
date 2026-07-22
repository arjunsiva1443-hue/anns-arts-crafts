export function renderProductCard(product, isWishlisted) {
  const formattedPrice = `$${product.price.toFixed(2)}`;
  const formattedOriginalPrice = product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : null;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="card-image-wrap">
        ${product.isNew ? `<span class="badge-tag">New Drop</span>` : product.isFeatured ? `<span class="badge-tag" style="border-color: var(--accent-purple); color: var(--accent-purple);">Featured</span>` : ''}
        <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy" />
        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" data-action="wishlist" data-id="${product.id}" title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
          <i data-lucide="heart" ${isWishlisted ? 'fill="currentColor"' : ''}></i>
        </button>
      </div>

      <div class="card-body">
        <div class="card-category">${product.categoryLabel}</div>
        <h3 class="card-title">${product.name}</h3>
        <p class="card-tagline">${product.tagline}</p>
        
        <div class="card-rating">
          <i data-lucide="star" fill="currentColor" style="width: 14px; height: 14px;"></i>
          <span>${product.rating}</span>
          <span class="rating-count">(${product.reviewCount} reviews)</span>
        </div>

        <div class="card-footer">
          <div class="price-wrap">
            <span class="price-current">${formattedPrice}</span>
            ${formattedOriginalPrice ? `<span class="price-original">${formattedOriginalPrice}</span>` : ''}
          </div>

          <div class="card-actions">
            <button class="btn-icon" data-action="quickview" data-id="${product.id}" title="Quick Inspect">
              <i data-lucide="eye"></i>
            </button>
            <button class="btn-add-cart" data-action="add-cart" data-id="${product.id}">
              <i data-lucide="shopping-bag"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
