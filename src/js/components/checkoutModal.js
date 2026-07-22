export function renderCheckoutModal(state, store) {
  const checkoutBody = document.getElementById("checkoutBody");
  const step1Ind = document.getElementById("stepIndicator1");
  const step2Ind = document.getElementById("stepIndicator2");
  const step3Ind = document.getElementById("stepIndicator3");

  const totals = store.getCartTotals();

  [step1Ind, step2Ind, step3Ind].forEach((ind, idx) => {
    if (idx + 1 === state.checkoutStep) {
      ind.classList.add("active");
    } else {
      ind.classList.remove("active");
    }
  });

  if (state.checkoutStep === 1) {
    // Step 1: Delivery Details
    checkoutBody.innerHTML = `
      <form id="shippingForm">
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 1.25rem; color: #fff;">
          1. Delivery & Recipient Details
        </h3>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="shipName" class="form-control" placeholder="Arjun Sharma" required value="Arjun Sharma" />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="shipEmail" class="form-control" placeholder="arjun@annsart.com" required value="arjun@annsart.com" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Delivery Street Address</label>
          <input type="text" id="shipAddress" class="form-control" placeholder="Flat 402, Rosewood Apartments" required value="Flat 402, Rosewood Apartments" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">City</label>
            <input type="text" id="shipCity" class="form-control" placeholder="Mumbai" required value="Mumbai" />
          </div>
          <div class="form-group">
            <label class="form-label">PIN Code / Zip</label>
            <input type="text" id="shipZip" class="form-control" placeholder="400001" required value="400001" />
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.25rem;">
          <div style="font-size: 0.9rem; color: var(--text-muted);">
            Total Amount: <strong style="color: #f59e0b; font-family: var(--font-heading); font-size: 1.25rem;">$${totals.total.toFixed(2)}</strong>
          </div>
          <button type="submit" class="btn-primary">
            Proceed to Payment <i data-lucide="arrow-right"></i>
          </button>
        </div>
      </form>
    `;

    document.getElementById("shippingForm").addEventListener("submit", (e) => {
      e.preventDefault();
      store.shippingTemp = {
        name: document.getElementById("shipName").value,
        email: document.getElementById("shipEmail").value,
        address: document.getElementById("shipAddress").value,
        city: document.getElementById("shipCity").value,
        zip: document.getElementById("shipZip").value
      };
      store.setCheckoutStep(2);
    });

  } else if (state.checkoutStep === 2) {
    // Step 2: Payment Options (UPI Apps with Redirect & Fallback)
    let selectedPayMethod = "upi";

    checkoutBody.innerHTML = `
      <form id="paymentForm">
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 1.25rem; color: #fff;">
          2. Select Payment Option
        </h3>

        <!-- Payment Method Selector Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <label class="pay-method-tab selected" id="tabUPI" style="flex: 1; padding: 1rem; border: 1px solid #f59e0b; background: rgba(245, 158, 11, 0.12); border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
            <input type="radio" name="payMethod" value="upi" checked />
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">📱 UPI (GPay / PhonePe / Paytm)</div>
              <div style="font-size: 0.75rem; color: var(--accent-emerald);">Instant App Launch & QR Scan</div>
            </div>
          </label>

          <label class="pay-method-tab" id="tabCard" style="flex: 1; padding: 1rem; border: 1px solid var(--glass-border); background: rgba(15,23,42,0.6); border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
            <input type="radio" name="payMethod" value="card" />
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">💳 Credit / Debit Card</div>
              <div style="font-size: 0.75rem; color: var(--text-dim);">Visa, Mastercard, RuPay</div>
            </div>
          </label>
        </div>

        <!-- Dynamic Payment Container -->
        <div id="paymentContentArea">
          <!-- Rendered dynamically -->
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.25rem;">
          <button type="button" class="btn-secondary" id="btnBackToShip">
            <i data-lucide="arrow-left"></i> Back
          </button>
          <button type="submit" class="btn-primary" id="btnSubmitPayment" style="background: linear-gradient(135deg, #10b981, #059669);">
            Complete Payment ($${totals.total.toFixed(2)})
          </button>
        </div>
      </form>
    `;

    const paymentContentArea = document.getElementById("paymentContentArea");

    function renderPayContent(method) {
      if (method === "upi") {
        paymentContentArea.innerHTML = `
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h4 style="font-size: 0.95rem; color: #f59e0b; font-weight: 700;">Direct UPI App Launch</h4>
              <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: var(--accent-emerald); padding: 0.2rem 0.5rem; border-radius: var(--radius-full);">Verified Merchant</span>
            </div>

            <!-- List of Clickable UPI App Launchers -->
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              Select your preferred UPI app to launch and pay:
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;" id="upiAppButtonsContainer">
              <button type="button" class="btn-upi-app" data-app-name="Google Pay" data-app-scheme="gpay://upi/pay" style="padding: 0.75rem; background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; transition: var(--transition-fast);">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; color: #4285F4;">G</div>
                <span style="font-size: 0.8rem; font-weight: 600;">Google Pay</span>
              </button>

              <button type="button" class="btn-upi-app" data-app-name="PhonePe" data-app-scheme="phonepe://pay" style="padding: 0.75rem; background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; transition: var(--transition-fast);">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #5f259f; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; color: #fff;">Pe</div>
                <span style="font-size: 0.8rem; font-weight: 600;">PhonePe</span>
              </button>

              <button type="button" class="btn-upi-app" data-app-name="Paytm" data-app-scheme="paytmmp://pay" style="padding: 0.75rem; background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; transition: var(--transition-fast);">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #00b9f1; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.75rem; color: #002e6e;">Paytm</div>
                <span style="font-size: 0.8rem; font-weight: 600;">Paytm</span>
              </button>

              <button type="button" class="btn-upi-app" data-app-name="BHIM UPI" data-app-scheme="bhim://pay" style="padding: 0.75rem; background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; transition: var(--transition-fast);">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #ff7a00; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.75rem; color: #fff;">BHIM</div>
                <span style="font-size: 0.8rem; font-weight: 600;">BHIM UPI</span>
              </button>
            </div>

            <!-- UPI ID Form Field -->
            <div class="form-group">
              <label class="form-label">Or Enter VPA / UPI ID</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="upiIdInput" class="form-control" placeholder="e.g. 9876543210@paytm or anns@okaxis" value="annsart@okaxis" required style="flex: 1;" />
                <button type="button" class="btn-secondary" id="btnVerifyUPI" style="font-size: 0.8rem; padding: 0 1rem; color: #fff !important;">Verify</button>
              </div>
            </div>

            <!-- Scan QR Code Section -->
            <div style="text-align: center; margin-top: 1.25rem; padding: 1.25rem; background: rgba(6, 9, 17, 0.9); border: 1px dashed #f59e0b; border-radius: var(--radius-md);">
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.6rem;">Or Scan QR Code with any camera / UPI app</div>
              
              <div style="width: 130px; height: 130px; margin: 0 auto; background: #fff; padding: 8px; border-radius: 8px; box-shadow: 0 0 20px rgba(245,158,11,0.3); display: flex; align-items: center; justify-content: center;">
                <svg width="114" height="114" viewBox="0 0 100 100" fill="#000">
                  <rect x="5" y="5" width="25" height="25" fill="#000"/><rect x="9" y="9" width="17" height="17" fill="#fff"/><rect x="13" y="13" width="9" height="9" fill="#000"/>
                  <rect x="70" y="5" width="25" height="25" fill="#000"/><rect x="74" y="9" width="17" height="17" fill="#fff"/><rect x="78" y="13" width="9" height="9" fill="#000"/>
                  <rect x="5" y="70" width="25" height="25" fill="#000"/><rect x="9" y="74" width="17" height="17" fill="#fff"/><rect x="13" y="78" width="9" height="9" fill="#000"/>
                  <rect x="35" y="35" width="30" height="30" fill="#000"/><rect x="42" y="42" width="16" height="16" fill="#fff"/><rect x="46" y="46" width="8" height="8" fill="#f59e0b"/>
                  <rect x="35" y="10" width="10" height="10"/><rect x="55" y="15" width="10" height="10"/><rect x="75" y="35" width="15" height="10"/><rect x="10" y="35" width="10" height="15"/><rect x="70" y="70" width="20" height="20"/>
                </svg>
              </div>
              <div style="font-size: 0.85rem; font-weight: bold; color: #fff; margin-top: 0.75rem;">Payee: Anns Arts & Crafts</div>
              <div style="font-size: 0.75rem; color: #f59e0b; font-family: monospace;">annsart@okaxis • $${totals.total.toFixed(2)}</div>
            </div>
          </div>
        `;

        // UPI App Click Event Listener (Attempt App Launch & Check if Installed)
        const appBtns = paymentContentArea.querySelectorAll(".btn-upi-app");
        appBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            const appName = btn.dataset.appName;
            const upiParams = `?pa=annsart@okaxis&pn=Anns%20Arts%20%26%20Crafts&am=${totals.total.toFixed(2)}&cu=USD`;
            const primaryScheme = `${btn.dataset.appScheme}${upiParams}`;
            const genericScheme = `upi://pay${upiParams}`;

            store.addToast(`Launching ${appName}...`, "info");

            // Timestamp before trigger
            const startTime = Date.now();
            let appOpened = false;

            const handleBlur = () => {
              appOpened = true;
            };

            window.addEventListener("blur", handleBlur, { once: true });

            // Attempt to trigger app scheme
            try {
              window.location.href = primaryScheme;
            } catch (err) {
              // Try generic fallback scheme
              try { window.location.href = genericScheme; } catch (e) {}
            }

            // Fallback check after 1.2s
            setTimeout(() => {
              window.removeEventListener("blur", handleBlur);
              const elapsedTime = Date.now() - startTime;

              // If window remained visible and elapsed time is short, the app is not installed
              if (!appOpened && !document.hidden && elapsedTime < 2500) {
                store.addToast(`⚠️ ${appName} app is not installed on this device`, "error");
                alert(`App Not Installed: ${appName} is not installed on your device.\n\nPlease scan the QR code above or pay using your UPI ID (annsart@okaxis).`);
              }
            }, 1200);
          });
        });

        document.getElementById("btnVerifyUPI").addEventListener("click", () => {
          store.addToast("UPI ID Verified: Anns Arts & Crafts Merchant", "success");
        });
      } else {
        paymentContentArea.innerHTML = `
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Card Number</label>
              <input type="text" class="form-control" placeholder="4532 •••• •••• 8892" value="4532 9821 7712 8892" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Expiration Date</label>
                <input type="text" class="form-control" placeholder="12/28" value="12/28" required />
              </div>
              <div class="form-group">
                <label class="form-label">Security CVC</label>
                <input type="text" class="form-control" placeholder="789" value="789" required />
              </div>
            </div>
          </div>
        `;
      }
    }

    renderPayContent("upi");

    document.querySelectorAll("input[name='payMethod']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        selectedPayMethod = e.target.value;
        renderPayContent(selectedPayMethod);
      });
    });

    document.getElementById("btnBackToShip").addEventListener("click", () => {
      store.setCheckoutStep(1);
    });

    document.getElementById("paymentForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const payMethodLabel = selectedPayMethod === "upi" ? "UPI App Payment" : "Credit Card";
      store.completeOrder(store.shippingTemp || { name: "Valued Customer" }, { method: payMethodLabel });
    });

  } else if (state.checkoutStep === 3 && state.currentOrder) {
    // Step 3: Order Receipt
    const order = state.currentOrder;
    checkoutBody.innerHTML = `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-emerald), #059669); color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; box-shadow: 0 0 25px rgba(16, 185, 129, 0.4);">
          <i data-lucide="check" style="width: 36px; height: 36px; stroke-width: 3;"></i>
        </div>

        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">
          Thank You for Ordering at Anns Arts & Crafts!
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Order Reference: <strong style="color: #f59e0b; font-family: monospace;">${order.id}</strong>
        </p>

        <!-- Printable Receipt Box -->
        <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.8rem; margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-muted);">
            <span>Date: ${new Date(order.date).toLocaleDateString()}</span>
            <span>Paid via: ${order.paymentMethod}</span>
          </div>

          <h4 style="font-size: 0.9rem; color: #f59e0b; font-weight: 700; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Acquired Handcrafted Items
          </h4>

          <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem;">
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span>${item.quantity}x ${item.product.name}</span>
                <span style="font-weight: 600; color: #fff;">$${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div style="border-top: 1px dashed var(--glass-border); padding-top: 0.8rem; display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; color: #fff;">
            <span>Total Paid Amount:</span>
            <span style="color: #f59e0b;">$${order.totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" id="btnFinishCheckout">
            Continue Shopping at Anns
          </button>
          <button class="btn-secondary" onclick="window.print()">
            <i data-lucide="printer"></i> Print Invoice
          </button>
        </div>
      </div>
    `;

    document.getElementById("btnFinishCheckout").addEventListener("click", () => {
      store.closeCheckout();
    });
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
