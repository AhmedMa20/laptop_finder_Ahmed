// Home page: live statistics calculated from the data.

import { fetchLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { renderLayout } from "./layout.js";
import { formatPrice, showError } from "./ui.js";

renderLayout("index.html");

const statsBox = document.getElementById("stats");

const statTile = (label, value) => `
  <div class="panel">
    <p class="text-sm text-muted">${label}</p>
    <p class="mt-1 text-3xl font-extrabold text-accent">${value}</p>
  </div>`;

const renderStats = (laptops) => {
  // reduce() turns the whole list into a single number
  const lowestPrice = laptops.reduce((min, laptop) => Math.min(min, laptop.price), Infinity);
  const longestBattery = laptops.reduce((max, laptop) => Math.max(max, laptop.batteryHours), 0);

  statsBox.innerHTML =
    statTile("Laptops", laptops.length) +
    statTile("Lowest price", formatPrice(lowestPrice)) +
    statTile("Longest battery", `${longestBattery} h`) +
    statTile("Saved favorites", getFavorites().length);
};

async function init() {
  try {
    const laptops = await fetchLaptops();
    renderStats(laptops);
  } catch (error) {
    showError(statsBox, error.message);
  }
}

init();
