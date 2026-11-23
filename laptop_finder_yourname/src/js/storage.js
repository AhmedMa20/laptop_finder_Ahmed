// Everything saved in localStorage: favorites, comparison picks and theme.

const FAVORITES_KEY = "lf-favorites";
const COMPARE_KEY = "lf-compare";
const THEME_KEY = "lf-theme";

export const MAX_COMPARE = 4;

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback; // broken or blocked storage: start empty
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// ---------- Favorites ----------

export const getFavorites = () => read(FAVORITES_KEY, []);

export const isFavorite = (id) => getFavorites().includes(id);

const saveFavorites = (ids) => {
  write(FAVORITES_KEY, ids);
  // Lets the header badge update without a page reload
  window.dispatchEvent(new Event("favorites-changed"));
};

// Adds or removes a favorite. Returns true when the laptop is now saved.
export function toggleFavorite(id) {
  const favorites = getFavorites();
  if (favorites.includes(id)) {
    saveFavorites(favorites.filter((savedId) => savedId !== id));
    removeFromCompare(id); // a laptop that is no longer a favorite leaves the comparison
    return false;
  }
  saveFavorites([...favorites, id]);
  return true;
}

export const clearFavorites = () => {
  saveFavorites([]);
  write(COMPARE_KEY, []);
};

// ---------- Comparison ----------

export const getCompareIds = () => read(COMPARE_KEY, []);

export const removeFromCompare = (id) =>
  write(COMPARE_KEY, getCompareIds().filter((savedId) => savedId !== id));

// Adds a laptop to the comparison (and to favorites if needed).
// Returns false when the comparison already holds MAX_COMPARE laptops.
export function addToCompare(id) {
  const ids = getCompareIds();
  if (ids.includes(id)) return true;
  if (ids.length >= MAX_COMPARE) return false;
  if (!isFavorite(id)) toggleFavorite(id);
  write(COMPARE_KEY, [...getCompareIds(), id]);
  return true;
}

// ---------- Theme ----------

export const getTheme = () => (read(THEME_KEY, "performance") === "battery" ? "battery" : "performance");

export const saveTheme = (theme) => write(THEME_KEY, theme);
