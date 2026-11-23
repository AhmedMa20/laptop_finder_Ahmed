// Classic (non-module) script loaded in <head>: it applies the saved theme
// before the page is painted, so the wrong theme never flashes on reload.
// The key must match THEME_KEY in storage.js.
try {
  const saved = JSON.parse(localStorage.getItem("lf-theme"));
  document.documentElement.dataset.theme = saved === "battery" ? "battery" : "performance";
} catch (error) {
  document.documentElement.dataset.theme = "performance";
}
