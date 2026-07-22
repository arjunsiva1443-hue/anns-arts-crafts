export function renderToasts(toasts) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  container.innerHTML = toasts.map(t => {
    let icon = "info";
    if (t.type === "success") icon = "check-circle";
    if (t.type === "error") icon = "alert-circle";

    return `
      <div class="toast ${t.type}">
        <i data-lucide="${icon}" style="width: 18px; height: 18px;"></i>
        <span>${t.message}</span>
      </div>
    `;
  }).join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
