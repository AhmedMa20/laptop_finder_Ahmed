// Specification rows and comparison logic, shared by the details and compare pages.

import { formatPrice } from "./ui.js";

// best: "min" = lowest value wins, "max" = highest wins, null = nothing to rank
export const SPEC_ROWS = [
  { key: "price", label: "Price", best: "min", format: formatPrice },
  { key: "brand", label: "Brand", best: null, format: (v) => v },
  { key: "category", label: "Category", best: null, format: (v) => v[0].toUpperCase() + v.slice(1) },
  { key: "cpu", label: "Processor", best: null, format: (v) => v },
  { key: "ramGB", label: "RAM", best: "max", format: (v) => `${v} GB` },
  { key: "storageGB", label: "Storage", best: "max", format: (v) => (v >= 1024 ? `${v / 1024} TB SSD` : `${v} GB SSD`) },
  { key: "batteryHours", label: "Battery life", best: "max", format: (v) => `${v} hours` },
  { key: "weightKg", label: "Weight", best: "min", format: (v) => `${v} kg` },
  { key: "screenInches", label: "Screen size", best: null, format: (v) => `${v} inches` },
];

// Returns the winning value of one row, or null when nothing should be highlighted.
export function getBestValue(laptops, row) {
  if (!row.best) return null;
  const values = laptops.map((laptop) => laptop[row.key]);
  const best = row.best === "min" ? Math.min(...values) : Math.max(...values);
  // If every laptop has the same value there is no winner to highlight
  return values.every((value) => value === best) ? null : best;
}

const BEST_CELL = "bg-accent-soft font-bold text-accent";

// Builds the comparison table: one column per laptop, the same rows for all.
export function buildCompareTable(laptops) {
  const headerCells = laptops
    .map(
      (laptop) => `
        <th scope="col" class="min-w-44 p-3 align-bottom">
          <a href="details.html?id=${laptop.id}" class="block hover:text-accent">
            <img src="${laptop.image}" alt="${laptop.name}" class="mb-2 aspect-4/3 w-full rounded-lg bg-white object-contain" />
            ${laptop.name}
          </a>
        </th>`
    )
    .join("");

  const bodyRows = SPEC_ROWS.map((row) => {
    const best = getBestValue(laptops, row);
    const cells = laptops
      .map((laptop) => {
        const isBest = laptop[row.key] === best;
        return `<td class="p-3 ${isBest ? BEST_CELL : ""}">${isBest ? "✓ " : ""}${row.format(laptop[row.key])}</td>`;
      })
      .join("");
    return `<tr class="border-t border-line"><th scope="row" class="p-3 text-left font-medium text-muted">${row.label}</th>${cells}</tr>`;
  }).join("");

  // The wrapper scrolls sideways on small screens so the page itself never does
  return `
    <div class="panel overflow-x-auto p-0">
      <table class="w-full min-w-xl border-collapse text-left">
        <thead><tr><th class="p-3"><span class="sr-only">Specification</span></th>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;
}
