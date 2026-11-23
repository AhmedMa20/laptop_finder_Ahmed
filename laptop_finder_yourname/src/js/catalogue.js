// Catalogue page: live search, filters, sorting and favorite buttons.

import { fetchLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { renderLayout } from "./layout.js";
import {
  bindFavoriteButtons,
  createLaptopCard,
  createSkeletonCards,
  formatPrice,
  showError,
  showMessage,
} from "./ui.js";

renderLayout("laptops.html");

const form = document.getElementById("filters");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const ramSelect = document.getElementById("min-ram");
const priceRange = document.getElementById("max-price");
const priceLabel = document.getElementById("max-price-label");
const sortSelect = document.getElementById("sort");
const resultCount = document.getElementById("result-count");
const grid = document.getElementById("laptop-grid");

let allLaptops = [];

// Maps the sort menu value to the laptop field it sorts by
const SORT_FIELDS = { price: "price", battery: "batteryHours", weight: "weightKg" };

const readFilters = () => ({
  search: searchInput.value.trim().toLowerCase(),
  category: categorySelect.value,
  minRam: Number(ramSelect.value),
  maxPrice: Number(priceRange.value),
  sort: sortSelect.value,
});

// filter(): keep only laptops that match every active filter at the same time
const filterLaptops = (laptops, filters) =>
  laptops.filter(
    (laptop) =>
      `${laptop.name} ${laptop.brand}`.toLowerCase().includes(filters.search) &&
      (filters.category === "all" || laptop.category === filters.category) &&
      laptop.ramGB >= filters.minRam &&
      laptop.price <= filters.maxPrice
  );

// sort() changes the array it is called on, so we sort a copy
const sortLaptops = (laptops, sortValue) => {
  if (sortValue === "none") return laptops;
  const [name, direction] = sortValue.split("-"); // e.g. "battery-desc"
  const field = SORT_FIELDS[name];
  return [...laptops].sort((a, b) => (direction === "asc" ? a[field] - b[field] : b[field] - a[field]));
};

function render() {
  const filters = readFilters();
  priceLabel.textContent = formatPrice(filters.maxPrice);

  const results = sortLaptops(filterLaptops(allLaptops, filters), filters.sort);
  resultCount.textContent = `Showing ${results.length} of ${allLaptops.length} laptops`;

  if (results.length === 0) {
    showMessage(grid, "No laptops match", "Try a different search or loosen the filters.");
    return;
  }

  const favorites = getFavorites();
  grid.innerHTML = results
    .map((laptop) => createLaptopCard(laptop, { saved: favorites.includes(laptop.id) }))
    .join("");
}

// Price slider limits come from the data: lowest and highest price, rounded to 1000
function setupPriceRange() {
  const prices = allLaptops.map((laptop) => laptop.price);
  priceRange.min = Math.floor(Math.min(...prices) / 1000) * 1000;
  priceRange.max = Math.ceil(Math.max(...prices) / 1000) * 1000;
  priceRange.value = priceRange.max;
}

async function init() {
  grid.innerHTML = createSkeletonCards(6);
  try {
    allLaptops = await fetchLaptops();
    setupPriceRange();
    render();
  } catch (error) {
    resultCount.textContent = "";
    showError(grid, error.message);
  }
}

// "input" bubbles from every field, so one listener covers search, filters and sorting
form.addEventListener("input", () => allLaptops.length && render());

document.getElementById("reset-filters").addEventListener("click", () => {
  form.reset();
  priceRange.value = priceRange.max;
  render();
});

form.addEventListener("submit", (event) => event.preventDefault());
bindFavoriteButtons(grid);

init();
