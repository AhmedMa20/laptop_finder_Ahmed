// Details page: one laptop, chosen by ?id=... in the URL.

import { fetchLaptops, findLaptop } from "./api.js";
import { addToCompare, getCompareIds, isFavorite, removeFromCompare, toggleFavorite, MAX_COMPARE } from "./storage.js";
import { renderLayout } from "./layout.js";
import { SPEC_ROWS } from "./compare.js";
import { formatPrice, showError, showMessage, updateFavoriteButton } from "./ui.js";

renderLayout("laptops.html");

const content = document.getElementById("details");

const compareLabel = (inCompare) => (inCompare ? "✓ In comparison" : "+ Add to comparison");

function renderLaptop(laptop) {
  const specRows = SPEC_ROWS.map(
    (row) => `
      <tr class="border-t border-line first:border-t-0">
        <th scope="row" class="w-1/3 p-3 text-left font-medium text-muted">${row.label}</th>
        <td class="p-3">${row.format(laptop[row.key])}</td>
      </tr>`
  ).join("");

  document.title = `${laptop.name} | Student Laptop Finder`;
  content.innerHTML = `
    <a href="laptops.html" class="text-sm text-muted hover:text-accent">← Back to laptops</a>
    <div class="mt-4 grid gap-8 lg:grid-cols-2">
      <img src="${laptop.image}" alt="${laptop.name}" class="w-full rounded-xl border border-line bg-white object-contain" />
      <div class="flex flex-col gap-4">
        <p class="text-sm font-semibold uppercase tracking-wide text-accent">${laptop.brand}</p>
        <h1 class="text-3xl font-extrabold">${laptop.name}</h1>
        <p class="text-4xl font-extrabold text-accent">${formatPrice(laptop.price)}</p>
        <p class="text-muted">${laptop.description}</p>
        <div class="flex flex-wrap gap-3">
          <button id="fav-button" type="button" class="btn-action"></button>
          <button id="compare-button" type="button" class="btn-outline"></button>
        </div>
        <p id="action-message" class="min-h-6 text-sm" role="status"></p>
      </div>
    </div>
    <h2 class="mt-10 mb-3 text-xl font-bold">Full specifications</h2>
    <div class="panel overflow-x-auto p-0">
      <table class="w-full"><tbody>${specRows}</tbody></table>
    </div>`;

  setupButtons(laptop);
}

function setupButtons(laptop) {
  const favButton = document.getElementById("fav-button");
  const compareButton = document.getElementById("compare-button");
  const message = document.getElementById("action-message");
  const inCompare = () => getCompareIds().includes(laptop.id);

  updateFavoriteButton(favButton, isFavorite(laptop.id));
  compareButton.textContent = compareLabel(inCompare());

  favButton.addEventListener("click", () => {
    updateFavoriteButton(favButton, toggleFavorite(laptop.id));
    compareButton.textContent = compareLabel(inCompare()); // removing a favorite also leaves the comparison
    message.textContent = "";
  });

  compareButton.addEventListener("click", () => {
    if (inCompare()) {
      removeFromCompare(laptop.id);
      message.textContent = "Removed from the comparison.";
    } else if (addToCompare(laptop.id)) {
      message.innerHTML = 'Added to the comparison. <a href="compare.html" class="underline">Open comparison</a>';
    } else {
      message.textContent = `You can compare up to ${MAX_COMPARE} laptops. Remove one first.`;
    }
    updateFavoriteButton(favButton, isFavorite(laptop.id));
    compareButton.textContent = compareLabel(inCompare());
  });
}

async function init() {
  // URLSearchParams reads the id from the address, e.g. details.html?id=7
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  try {
    const laptops = await fetchLaptops();
    const laptop = findLaptop(laptops, id);
    if (laptop) {
      renderLaptop(laptop);
    } else {
      showMessage(content, "Laptop not found", "This link has no valid laptop id.", {
        href: "laptops.html",
        label: "Browse all laptops",
      });
    }
  } catch (error) {
    showError(content, error.message);
  }
}

init();
