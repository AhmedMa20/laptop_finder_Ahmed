// Favorites page: saved laptops, totals, remove one, clear all.

import { fetchLaptops } from "./api.js";
import { clearFavorites, getFavorites } from "./storage.js";
import { renderLayout } from "./layout.js";
import { bindFavoriteButtons, createLaptopCard, createSkeletonCards, formatPrice, showError, showMessage } from "./ui.js";

renderLayout("favorites.html");

const grid = document.getElementById("favorites-grid");
const summary = document.getElementById("summary");
const clearButton = document.getElementById("clear-all");

let allLaptops = [];

function render() {
  const ids = getFavorites();
  const saved = allLaptops.filter((laptop) => ids.includes(laptop.id));
  clearButton.disabled = saved.length === 0;

  if (saved.length === 0) {
    summary.textContent = "";
    showMessage(grid, "No favorites yet", "Save laptops from the catalogue and they will appear here.", {
      href: "laptops.html",
      label: "Browse laptops",
    });
    return;
  }

  // reduce(): add up all prices, then divide for the average
  const total = saved.reduce((sum, laptop) => sum + laptop.price, 0);
  const average = Math.round(total / saved.length);
  summary.innerHTML = `
    <div class="panel"><p class="text-sm text-muted">Saved laptops</p><p class="text-2xl font-extrabold text-accent">${saved.length}</p></div>
    <div class="panel"><p class="text-sm text-muted">Total price</p><p class="text-2xl font-extrabold text-accent">${formatPrice(total)}</p></div>
    <div class="panel"><p class="text-sm text-muted">Average price</p><p class="text-2xl font-extrabold text-accent">${formatPrice(average)}</p></div>`;

  grid.innerHTML = saved.map((laptop) => createLaptopCard(laptop, { saved: true, removeMode: true })).join("");
}

async function init() {
  grid.innerHTML = createSkeletonCards(3);
  try {
    allLaptops = await fetchLaptops();
    render();
  } catch (error) {
    showError(grid, error.message);
  }
}

bindFavoriteButtons(grid, render);

clearButton.addEventListener("click", () => {
  if (confirm("Remove all saved laptops?")) {
    clearFavorites();
    render();
  }
});

init();
