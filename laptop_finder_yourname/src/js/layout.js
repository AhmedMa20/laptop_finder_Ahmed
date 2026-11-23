// Header (navigation, theme switch, favorites badge) and footer shared by every page.

import { getFavorites, getTheme, saveTheme } from "./storage.js";

const PAGES = [
  { href: "index.html", label: "Home" },
  { href: "laptops.html", label: "Laptops" },
  { href: "favorites.html", label: "Favorites" },
  { href: "compare.html", label: "Compare" },
];

const THEMES = {
  performance: { label: "⚡ Performance Mode", next: "battery" },
  battery: { label: "🔋 Battery Saver Mode", next: "performance" },
};

const navLinks = (activePage) =>
  PAGES.map((page) => {
    const current = page.href === activePage ? ' aria-current="page"' : "";
    const badge =
      page.href === "favorites.html"
        ? ' <span data-fav-count class="rounded-full bg-accent px-2 text-xs font-bold text-accent-ink"></span>'
        : "";
    return `<a href="${page.href}" class="nav-link"${current}>${page.label}${badge}</a>`;
  }).join("");

// Sets the theme on <html> and updates the switch label.
// On page load this restores the choice saved in localStorage.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const button = document.getElementById("theme-toggle");
  button.textContent = THEMES[theme].label;
  button.setAttribute("aria-label", `Theme: ${THEMES[theme].label}. Click to switch.`);
}

const updateFavoriteCount = () => {
  const count = getFavorites().length;
  document.querySelectorAll("[data-fav-count]").forEach((badge) => {
    badge.textContent = count;
  });
};

export function renderLayout(activePage) {
  document.getElementById("site-header").innerHTML = `
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
      <a href="index.html" class="text-lg font-extrabold">Laptop<span class="text-accent">Finder</span></a>
      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">${navLinks(activePage)}</nav>
      <div class="flex items-center gap-2">
        <button id="theme-toggle" type="button" class="btn-outline px-3 py-1.5 text-xs sm:text-sm"></button>
        <button id="menu-toggle" type="button" class="btn-outline px-3 py-1.5 md:hidden"
                aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">☰</button>
      </div>
    </div>
    <nav id="mobile-menu" class="hidden flex-col gap-1 border-t border-line px-4 py-2 md:hidden" aria-label="Mobile">${navLinks(activePage)}</nav>`;

  document.getElementById("site-footer").textContent =
    "Student Laptop Finder · SW302 User Interface Development";

  // Theme switch
  applyTheme(getTheme());
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = THEMES[document.documentElement.dataset.theme].next;
    saveTheme(next);
    applyTheme(next);
  });

  // Mobile menu toggle
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  menuButton.addEventListener("click", () => {
    const open = menu.classList.toggle("flex");
    menu.classList.toggle("hidden", !open);
    menuButton.setAttribute("aria-expanded", open);
    menuButton.textContent = open ? "✕" : "☰";
  });

  updateFavoriteCount();
  window.addEventListener("favorites-changed", updateFavoriteCount);
}
