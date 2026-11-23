// Reusable pieces of interface: cards, skeletons, messages and favorite buttons.

import { toggleFavorite } from "./storage.js";

export const formatPrice = (price) => `${price.toLocaleString("en-US")} EGP`;

export const favoriteLabel = (saved) => (saved ? "♥ Saved" : "♡ Save");

// Builds one laptop card. Used by the catalogue and the favorites page.
export const createLaptopCard = (laptop, { saved = false, removeMode = false } = {}) => `
  <article class="laptop-card" data-id="${laptop.id}">
    <a href="details.html?id=${laptop.id}" class="block bg-page">
      <img src="${laptop.image}" alt="${laptop.name}" loading="lazy" class="aspect-4/3 w-full bg-white object-contain" />
    </a>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-accent">${laptop.brand}</p>
          <h3 class="font-bold"><a href="details.html?id=${laptop.id}" class="hover:text-accent">${laptop.name}</a></h3>
        </div>
        <span class="rounded-full bg-accent-soft px-2 py-1 text-xs font-semibold capitalize text-accent">${laptop.category}</span>
      </div>
      <p class="text-2xl font-extrabold">${formatPrice(laptop.price)}</p>
      <ul class="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted">
        <li class="col-span-2 truncate">${laptop.cpu}</li>
        <li>${laptop.ramGB} GB RAM</li>
        <li>${laptop.storageGB >= 1024 ? laptop.storageGB / 1024 + " TB" : laptop.storageGB + " GB"} SSD</li>
        <li>${laptop.batteryHours} h battery</li>
        <li>${laptop.weightKg} kg</li>
      </ul>
      <div class="mt-auto flex gap-2 pt-2">
        <a href="details.html?id=${laptop.id}" class="btn-outline flex-1">Details</a>
        <button type="button" class="btn-action flex-1" data-fav-id="${laptop.id}" aria-pressed="${saved}">
          ${removeMode ? "Remove" : favoriteLabel(saved)}
        </button>
      </div>
    </div>
  </article>`;

// Placeholder cards with the same shape as real cards, shown while data loads.
export const createSkeletonCards = (count = 6) =>
  Array.from({ length: count }, () => `
    <div class="laptop-card animate-pulse" aria-hidden="true">
      <div class="aspect-4/3 bg-line"></div>
      <div class="space-y-3 p-4">
        <div class="h-3 w-1/4 rounded bg-line"></div>
        <div class="h-5 w-3/4 rounded bg-line"></div>
        <div class="h-7 w-1/3 rounded bg-line"></div>
        <div class="grid grid-cols-2 gap-2">
          <div class="h-3 rounded bg-line"></div>
          <div class="h-3 rounded bg-line"></div>
          <div class="h-3 rounded bg-line"></div>
          <div class="h-3 rounded bg-line"></div>
        </div>
        <div class="h-9 rounded-lg bg-line"></div>
      </div>
    </div>`).join("");

// Friendly box for empty states, no results and unknown laptops.
export function showMessage(container, title, text, link) {
  container.innerHTML = `
    <div class="panel col-span-full py-10 text-center">
      <h3 class="text-lg font-bold">${title}</h3>
      <p class="mt-1 text-muted">${text}</p>
      ${link ? `<a href="${link.href}" class="btn-action mt-4">${link.label}</a>` : ""}
    </div>`;
}

export function showError(container, message) {
  container.innerHTML = `
    <div class="panel col-span-full border-danger py-10 text-center" role="alert">
      <h3 class="text-lg font-bold text-danger">Something went wrong</h3>
      <p class="mt-1 text-muted">${message}</p>
    </div>`;
}

export function updateFavoriteButton(button, saved) {
  button.setAttribute("aria-pressed", saved);
  button.textContent = favoriteLabel(saved);
}

// One click listener per container handles every favorite button inside it.
// With onChange the page redraws itself; without it the button just updates.
export function bindFavoriteButtons(container, onChange) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fav-id]");
    if (!button) return;
    const saved = toggleFavorite(Number(button.dataset.favId));
    if (onChange) onChange();
    else updateFavoriteButton(button, saved);
  });
}
