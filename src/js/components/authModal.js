export function renderAuthModal(state, store) {
  const container = document.getElementById("authModalBody");
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div class="brand-icon" style="margin: 0 auto 0.75rem auto; width: 44px; height: 44px; font-size: 1.2rem; background: linear-gradient(135deg, #ec4899, #8b5cf6);">🌸</div>
      <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #fff; font-weight: 700;">
        Anns Art & Crafts Account Access
      </h2>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
        Sign in to track orders, save items to your wishlist, or manage store operations.
      </p>
    </div>

    <!-- Quick 1-Click Demo Logins -->
    <div style="background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
      <div style="font-size: 0.75rem; color: #ec4899; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">
        ⚡ Instant Quick Demo Login
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn-secondary" id="btnDemoCustomer" style="flex: 1; justify-content: center; font-size: 0.85rem; padding: 0.6rem;">
          🌸 Customer Account
        </button>
        <button class="btn-primary" id="btnDemoAdmin" style="flex: 1; justify-content: center; font-size: 0.85rem; padding: 0.6rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);">
          🛠️ Anns Studio Admin
        </button>
      </div>
    </div>

    <!-- Sign In Form -->
    <form id="authForm">
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" id="authEmail" class="form-control" placeholder="arjun@annsart.com" required value="arjun@annsart.com" />
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" id="authPass" class="form-control" placeholder="••••••••" required value="annspass123" />
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
        <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
          <input type="checkbox" checked /> Remember Me
        </label>
        <a href="#" style="color: var(--accent-cyan); text-decoration: none;" id="btnForgotPass">Forgot Password?</a>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button type="submit" class="btn-primary" style="flex: 1; justify-content: center; background: linear-gradient(135deg, #ec4899, #8b5cf6);">
          Sign In <i data-lucide="log-in"></i>
        </button>
      </div>
    </form>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  document.getElementById("btnDemoCustomer").addEventListener("click", () => {
    store.login("Arjun Sharma", "arjun@annsart.com", "customer");
  });

  document.getElementById("btnDemoAdmin").addEventListener("click", () => {
    store.login("Anns Studio Owner", "admin@annsart.com", "admin");
    store.toggleAdminDashboard(true);
  });

  document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const name = email.split("@")[0] || "Customer";
    const role = email.includes("admin") ? "admin" : "customer";
    store.login(name.toUpperCase(), email, role);
    if (role === "admin") {
      store.toggleAdminDashboard(true);
    }
  });

  if (document.getElementById("btnForgotPass")) {
    document.getElementById("btnForgotPass").addEventListener("click", (e) => {
      e.preventDefault();
      store.addToast("Password reset link sent to your email!", "info");
    });
  }
}
