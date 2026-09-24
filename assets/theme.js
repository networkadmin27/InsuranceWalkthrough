(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  const storageKey = "allowlisting-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      root.dataset.theme = savedTheme;
    }
  } catch {
    // Theme still works for this page when storage is unavailable.
  }

  function currentTheme() {
    return root.dataset.theme || (systemTheme.matches ? "dark" : "light");
  }

  function updateButtonLabels() {
    const light = currentTheme() === "light";
    buttons.forEach((button) => {
      button.textContent = light ? "Dark mode" : "Light mode";
      button.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.theme = currentTheme() === "light" ? "dark" : "light";
      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {
        // Ignore storage errors; the selected theme remains active on this page.
      }
      updateButtonLabels();
    });
  });

  systemTheme.addEventListener?.("change", () => {
    if (!root.dataset.theme) updateButtonLabels();
  });

  updateButtonLabels();
})();
