// Compare page: pick 2 to 4 favorites and see them side by side.

import { fetchLaptops } from "./api.js";
import { MAX_COMPARE, addToCompare, getCompareIds, getFavorites, removeFromCompare } from "./storage.js";
import { renderLayout } from "./layout.js";
import { buildCompareTable } from "./compare.js";
import { formatPrice, showError, showMessage } from "./ui.js";

renderLayout("compare.html");

const picker = document.getElementById("picker");
const pickerCount = document.getElementById("picker-count");
const pickerMessage = document.getElementById("picker-message");
const tableBox = document.getElementById("compare-table");

let favorites = [];

// Only favorites can be compared, so ignore any other saved id
const getSelected = () => favorites.filter((laptop) => getCompareIds().includes(laptop.id));

function renderTable() {
  const selected = getSelected();
  pickerCount.textContent = `${selected.length} of ${MAX_COMPARE} selected`;

  if (selected.length < 2) {
    showMessage(tableBox, "Choose at least two laptops", "Tick two to four favorites above to compare them.");
    return;
  }
  tableBox.innerHTML = buildCompareTable(selected);
}

function renderPicker() {
  const selectedIds = getSelected().map((laptop) => laptop.id);
  picker.innerHTML = favorites
    .map(
      (laptop) => `
      <label class="panel flex cursor-pointer items-center gap-3 transition duration-200 hover:border-accent">
        <input type="checkbox" value="${laptop.id}" class="size-5 rounded text-accent focus:ring-accent"
               ${selectedIds.includes(laptop.id) ? "checked" : ""} />
        <span class="flex-1"><span class="block font-semibold">${laptop.name}</span>
          <span class="text-sm text-muted">${formatPrice(laptop.price)}</span></span>
      </label>`
    )
    .join("");
}

picker.addEventListener("change", (event) => {
  const box = event.target;
  const id = Number(box.value);
  pickerMessage.textContent = "";

  if (box.checked) {
    // addToCompare returns false when 4 laptops are already selected
    if (!addToCompare(id)) {
      box.checked = false;
      pickerMessage.textContent = `You can compare up to ${MAX_COMPARE} laptops. Untick one first.`;
      return;
    }
  } else {
    removeFromCompare(id);
  }
  renderTable();
});

async function init() {
  try {
    const laptops = await fetchLaptops();
    const ids = getFavorites();
    favorites = laptops.filter((laptop) => ids.includes(laptop.id));

    if (favorites.length === 0) {
      pickerCount.textContent = "";
      showMessage(picker, "No favorites to compare", "Save at least two laptops first.", {
        href: "laptops.html",
        label: "Browse laptops",
      });
      tableBox.innerHTML = "";
      return;
    }
    renderPicker();
    renderTable();
  } catch (error) {
    showError(tableBox, error.message);
  }
}

init();
