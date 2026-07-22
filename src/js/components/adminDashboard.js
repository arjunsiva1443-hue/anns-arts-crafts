export function renderAdminDashboard(state, store) {
  const container = document.getElementById("adminDashboardContainer");
  if (!container) return;

  const products = state.products;
  const orders = state.orderHistory;
  const promos = state.promos;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totals ? o.totals.total : 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const totalStockCount = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);

  container.innerHTML = `
    <!-- Admin Header -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <img src="./public/images/anns_logo.png" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--accent-gold);" />
        <div>
          <div style="font-size: 0.75rem; color: #f59e0b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
            🌸 Anns Arts & Crafts Studio Portal
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 700; color: #fff;">
            Studio Command Center
          </h2>
        </div>
      </div>

      <!-- Admin Navigation Tabs -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="tab-btn ${state.adminTab === 'analytics' ? 'active' : ''}" data-admin-tab="analytics">
          <i data-lucide="bar-chart-2"></i> Analytics
        </button>
        <button class="tab-btn ${state.adminTab === 'inventory' ? 'active' : ''}" data-admin-tab="inventory">
          <i data-lucide="box"></i> Inventory (${products.length})
        </button>
        <button class="tab-btn ${state.adminTab === 'orders' ? 'active' : ''}" data-admin-tab="orders">
          <i data-lucide="receipt"></i> Orders (${orders.length})
        </button>
        <button class="tab-btn ${state.adminTab === 'promos' ? 'active' : ''}" data-admin-tab="promos">
          <i data-lucide="tag"></i> Promo Codes
        </button>
      </div>
    </div>

    <!-- Tab 1: Analytics -->
    ${state.adminTab === 'analytics' ? `
      <div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Total Studio Revenue</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: var(--accent-cyan);">$${totalRevenue.toFixed(2)}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Total Orders Placed</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: var(--accent-emerald);">${totalOrdersCount}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Average Order Value</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: var(--accent-purple);">$${avgOrderValue.toFixed(2)}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Total Stock Units</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: #fff;">${totalStockCount}</div>
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.5rem;">
          <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: #fff; margin-bottom: 1rem;">
            Category Demand & Popularity
          </h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
                <span>Handmade Bouquets & Yarn Flowers</span>
                <span style="color: #f59e0b; font-weight: bold;">38% Share</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: 38%; height: 100%; background: #f59e0b;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
                <span>Luxury Gift Hampers</span>
                <span style="color: var(--accent-cyan); font-weight: bold;">25% Share</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: 25%; height: 100%; background: var(--accent-cyan);"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
                <span>Jewellery, Paintings & Crochet</span>
                <span style="color: var(--accent-emerald); font-weight: bold;">37% Share</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: 37%; height: 100%; background: var(--accent-emerald);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Tab 2: Inventory CRUD (Add & Edit Product with Image Options) -->
    ${state.adminTab === 'inventory' ? `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: #fff;">Product Inventory</h3>
          <button class="btn-primary" id="btnAdminAddProduct" style="font-size: 0.85rem; padding: 0.6rem 1.2rem; background: linear-gradient(135deg, #f59e0b, #ec4899);">
            <i data-lucide="plus"></i> Add New Product
          </button>
        </div>

        <!-- Add Product Form Box -->
        <div id="addProductFormContainer" style="display: none; background: rgba(15, 23, 42, 0.95); border: 1px solid #f59e0b; border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: #f59e0b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="plus-circle"></i> Add New Product to Store Catalog
          </h4>
          <form id="adminAddProductForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Product Title</label>
                <input type="text" id="newProdName" class="form-control" placeholder="e.g. Handmade Pink Rose Crochet Bouquet" required />
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="newProdCategory" class="form-control">
                  <option value="bouquets">Handmade Bouquets</option>
                  <option value="hampers">Gift Hampers</option>
                  <option value="jewellery">Artisan Jewellery</option>
                  <option value="paintings">Original Paintings</option>
                  <option value="crochet">Crochet Creations</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Price ($)</label>
                <input type="number" step="0.01" id="newProdPrice" class="form-control" placeholder="48.00" required />
              </div>
              <div class="form-group">
                <label class="form-label">Stock Quantity</label>
                <input type="number" id="newProdStock" class="form-control" placeholder="10" required />
              </div>
            </div>

            <!-- Image Selection & URL Input with Live Preview -->
            <div class="form-group">
              <label class="form-label">Product Image URL / Image Path</label>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <input type="url" id="newProdImage" class="form-control" placeholder="https://images.unsplash.com/... or ./public/images/..." value="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80" required style="flex: 1;" />
                <div style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid var(--glass-border); overflow: hidden; background: #000; flex-shrink: 0;">
                  <img id="newProdImgPreview" src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="newProdDesc" class="form-control" rows="2" placeholder="Handcrafted with love by Anns Arts & Crafts..."></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn-secondary" id="btnCancelAddProd">Cancel</button>
              <button type="submit" class="btn-primary" style="background: linear-gradient(135deg, #f59e0b, #ec4899);">Add Product to Catalog</button>
            </div>
          </form>
        </div>

        <!-- Edit Product Form Box (Injected dynamically when editing) -->
        <div id="editProductFormContainer" style="display: none; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--accent-cyan); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--accent-cyan); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="edit-3"></i> Edit Product & Update Image
          </h4>
          <form id="adminEditProductForm">
            <input type="hidden" id="editProdId" />
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Product Title</label>
                <input type="text" id="editProdName" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="editProdCategory" class="form-control">
                  <option value="bouquets">Handmade Bouquets</option>
                  <option value="hampers">Gift Hampers</option>
                  <option value="jewellery">Artisan Jewellery</option>
                  <option value="paintings">Original Paintings</option>
                  <option value="crochet">Crochet Creations</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Price ($)</label>
                <input type="number" step="0.01" id="editProdPrice" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">Stock Quantity</label>
                <input type="number" id="editProdStock" class="form-control" required />
              </div>
            </div>

            <!-- Edit Image URL Input with Live Preview -->
            <div class="form-group">
              <label class="form-label">Product Image URL / Image Path</label>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <input type="url" id="editProdImage" class="form-control" required style="flex: 1;" />
                <div style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid var(--glass-border); overflow: hidden; background: #000; flex-shrink: 0;">
                  <img id="editProdImgPreview" src="" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="editProdDesc" class="form-control" rows="2"></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn-secondary" id="btnCancelEditProd">Cancel</button>
              <button type="submit" class="btn-primary">Save Product Changes</button>
            </div>
          </form>
        </div>

        <!-- Inventory Data Table -->
        <div style="overflow-x: auto; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: var(--radius-md);">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--glass-border); background: rgba(6, 9, 17, 0.5); color: var(--text-muted);">
                <th style="padding: 0.8rem 1rem;">Product Item</th>
                <th style="padding: 0.8rem 1rem;">Category</th>
                <th style="padding: 0.8rem 1rem;">Price</th>
                <th style="padding: 0.8rem 1rem;">Stock</th>
                <th style="padding: 0.8rem 1rem; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.8rem 1rem; display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; border: 1px solid var(--glass-border);" />
                    <div>
                      <div style="font-weight: 600; color: #fff;">${p.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-dim);">${p.tagline}</div>
                    </div>
                  </td>
                  <td style="padding: 0.8rem 1rem; color: #f59e0b; font-weight: 500;">${p.categoryLabel}</td>
                  <td style="padding: 0.8rem 1rem; font-weight: bold; color: #fff;">$${p.price.toFixed(2)}</td>
                  <td style="padding: 0.8rem 1rem;">
                    <span style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; padding: 0.2rem 0.5rem; border-radius: var(--radius-full); font-weight: bold;">
                      ${p.stockCount} units
                    </span>
                  </td>
                  <td style="padding: 0.8rem 1rem; text-align: right;">
                    <button class="btn-icon" data-admin-action="edit-prod" data-id="${p.id}" title="Edit Product & Image" style="width: 34px; height: 34px; display: inline-flex;">
                      <i data-lucide="edit-2" style="width: 15px; height: 15px;"></i>
                    </button>
                    <button class="btn-icon" data-admin-action="del-prod" data-id="${p.id}" title="Delete Product" style="width: 34px; height: 34px; display: inline-flex; color: var(--accent-magenta);">
                      <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- Tab 3: Order Fulfillment -->
    ${state.adminTab === 'orders' ? `
      <div>
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: #fff; margin-bottom: 1.25rem;">
          Customer Orders Fulfillment
        </h3>

        ${orders.length === 0 ? `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <i data-lucide="receipt" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem;"></i>
            <p>No orders placed yet.</p>
          </div>
        ` : `
          <div style="overflow-x: auto; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: var(--radius-md);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--glass-border); background: rgba(6, 9, 17, 0.5); color: var(--text-muted);">
                  <th style="padding: 0.8rem 1rem;">Order Ref</th>
                  <th style="padding: 0.8rem 1rem;">Customer</th>
                  <th style="padding: 0.8rem 1rem;">Payment Method</th>
                  <th style="padding: 0.8rem 1rem;">Total</th>
                  <th style="padding: 0.8rem 1rem;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 0.8rem 1rem; font-family: monospace; font-weight: bold; color: var(--accent-cyan);">${o.id}</td>
                    <td style="padding: 0.8rem 1rem;">
                      <div style="color: #fff; font-weight: 500;">${o.shippingDetails.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-dim);">${o.shippingDetails.city}</div>
                    </td>
                    <td style="padding: 0.8rem 1rem; color: var(--accent-emerald); font-weight: 500;">${o.paymentMethod || 'UPI / Card'}</td>
                    <td style="padding: 0.8rem 1rem; font-weight: bold; color: #fff;">$${o.totals ? o.totals.total.toFixed(2) : '0.00'}</td>
                    <td style="padding: 0.8rem 1rem;">
                      <select class="select-custom" data-admin-action="update-order-status" data-id="${o.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                        <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    ` : ''}

    <!-- Tab 4: Promo Codes -->
    ${state.adminTab === 'promos' ? `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: #fff;">Promo Code Engine</h3>
        </div>

        <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; color: #f59e0b; font-weight: bold; margin-bottom: 1rem;">Create New Promo Code</h4>
          <form id="adminAddPromoForm" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <input type="text" id="newPromoCode" class="form-control" placeholder="CODE (e.g. ANNS30)" style="flex: 1; min-width: 160px;" required />
            <input type="number" id="newPromoDiscount" class="form-control" placeholder="Discount % (e.g. 30)" style="width: 140px;" required />
            <input type="text" id="newPromoDesc" class="form-control" placeholder="Description" style="flex: 2; min-width: 200px;" required />
            <button type="submit" class="btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; background: linear-gradient(135deg, #f59e0b, #ec4899);">Add Code</button>
          </form>
        </div>

        <div style="overflow-x: auto; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: var(--radius-md);">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--glass-border); background: rgba(6, 9, 17, 0.5); color: var(--text-muted);">
                <th style="padding: 0.8rem 1rem;">Code</th>
                <th style="padding: 0.8rem 1rem;">Discount</th>
                <th style="padding: 0.8rem 1rem;">Description</th>
                <th style="padding: 0.8rem 1rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(promos).map(([code, p]) => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.8rem 1rem; font-family: monospace; font-weight: bold; color: var(--accent-emerald);">${code}</td>
                  <td style="padding: 0.8rem 1rem; font-weight: bold; color: #fff;">${p.discountPercent ? p.discountPercent + '%' : '$' + p.discountAmount}</td>
                  <td style="padding: 0.8rem 1rem; color: var(--text-muted);">${p.description}</td>
                  <td style="padding: 0.8rem 1rem; text-align: right;">
                    <button class="btn-icon" data-admin-action="del-promo" data-code="${code}" title="Delete Promo Code" style="width: 32px; height: 32px; display: inline-flex; color: var(--accent-magenta);">
                      <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Admin Tab Navigation
  container.querySelectorAll("[data-admin-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      store.setAdminTab(btn.dataset.adminTab);
    });
  });

  // Add Product Form Live Image Preview & Toggling
  const btnAdd = container.querySelector("#btnAdminAddProduct");
  const formContainer = container.querySelector("#addProductFormContainer");
  const btnCancelAdd = container.querySelector("#btnCancelAddProd");
  const newProdImage = container.querySelector("#newProdImage");
  const newProdImgPreview = container.querySelector("#newProdImgPreview");

  if (btnAdd && formContainer) {
    btnAdd.addEventListener("click", () => {
      formContainer.style.display = "block";
      const editBox = container.querySelector("#editProductFormContainer");
      if (editBox) editBox.style.display = "none";
    });
  }
  if (btnCancelAdd && formContainer) {
    btnCancelAdd.addEventListener("click", () => {
      formContainer.style.display = "none";
    });
  }
  if (newProdImage && newProdImgPreview) {
    newProdImage.addEventListener("input", (e) => {
      newProdImgPreview.src = e.target.value;
    });
  }

  // Add Product Form Submission
  const addForm = container.querySelector("#adminAddProductForm");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = container.querySelector("#newProdName").value;
      const category = container.querySelector("#newProdCategory").value;
      const price = container.querySelector("#newProdPrice").value;
      const stockCount = container.querySelector("#newProdStock").value;
      const image = container.querySelector("#newProdImage").value;
      const description = container.querySelector("#newProdDesc").value;

      const catObj = {
        "bouquets": "Handmade Bouquets",
        "hampers": "Gift Hampers",
        "jewellery": "Artisan Jewellery",
        "paintings": "Original Paintings",
        "crochet": "Crochet Creations"
      };

      store.addProduct({
        name,
        category,
        categoryLabel: catObj[category] || "Anns Craft",
        price,
        stockCount,
        image,
        description
      });
    });
  }

  // Edit Product Form Logic & Live Preview
  const editFormContainer = container.querySelector("#editProductFormContainer");
  const btnCancelEdit = container.querySelector("#btnCancelEditProd");
  const editProdImage = container.querySelector("#editProdImage");
  const editProdImgPreview = container.querySelector("#editProdImgPreview");

  if (btnCancelEdit && editFormContainer) {
    btnCancelEdit.addEventListener("click", () => {
      editFormContainer.style.display = "none";
    });
  }
  if (editProdImage && editProdImgPreview) {
    editProdImage.addEventListener("input", (e) => {
      editProdImgPreview.src = e.target.value;
    });
  }

  // Inventory Table Action Delegation (Edit & Delete)
  container.querySelectorAll("[data-admin-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.adminAction;
      const id = btn.dataset.id;

      if (action === "del-prod") {
        if (confirm("Are you sure you want to delete this product?")) {
          store.deleteProduct(id);
        }
      } else if (action === "edit-prod") {
        const prod = store.state.products.find(p => p.id === id);
        if (prod && editFormContainer) {
          if (formContainer) formContainer.style.display = "none";
          editFormContainer.style.display = "block";

          container.querySelector("#editProdId").value = prod.id;
          container.querySelector("#editProdName").value = prod.name;
          container.querySelector("#editProdCategory").value = prod.category;
          container.querySelector("#editProdPrice").value = prod.price;
          container.querySelector("#editProdStock").value = prod.stockCount;
          container.querySelector("#editProdImage").value = prod.image;
          container.querySelector("#editProdImgPreview").src = prod.image;
          container.querySelector("#editProdDesc").value = prod.description || "";

          editFormContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });
  });

  // Edit Form Submission
  const editForm = container.querySelector("#adminEditProductForm");
  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = container.querySelector("#editProdId").value;
      const name = container.querySelector("#editProdName").value;
      const category = container.querySelector("#editProdCategory").value;
      const price = parseFloat(container.querySelector("#editProdPrice").value);
      const stockCount = parseInt(container.querySelector("#editProdStock").value);
      const image = container.querySelector("#editProdImage").value;
      const description = container.querySelector("#editProdDesc").value;

      const catObj = {
        "bouquets": "Handmade Bouquets",
        "hampers": "Gift Hampers",
        "jewellery": "Artisan Jewellery",
        "paintings": "Original Paintings",
        "crochet": "Crochet Creations"
      };

      store.updateProduct(id, {
        name,
        category,
        categoryLabel: catObj[category] || "Anns Craft",
        price,
        stockCount,
        image,
        description
      });
    });
  }

  // Order Status Update
  container.querySelectorAll("select[data-admin-action='update-order-status']").forEach(select => {
    select.addEventListener("change", (e) => {
      const orderId = select.dataset.id;
      store.updateOrderStatus(orderId, e.target.value);
    });
  });

  // Promo Code Add Form
  const promoForm = container.querySelector("#adminAddPromoForm");
  if (promoForm) {
    promoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = container.querySelector("#newPromoCode").value;
      const discount = container.querySelector("#newPromoDiscount").value;
      const desc = container.querySelector("#newPromoDesc").value;
      store.addPromoCode(code, discount, desc);
    });
  }

  // Promo Code Delete
  container.querySelectorAll("[data-admin-action='del-promo']").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code;
      if (confirm(`Delete promo code ${code}?`)) {
        store.deletePromoCode(code);
      }
    });
  });
}
