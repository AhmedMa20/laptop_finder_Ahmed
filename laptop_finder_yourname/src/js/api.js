// Loads laptop data from the JSON file.

export async function fetchLaptops() {
  try {
    const response = await fetch("data/laptops.json");
    if (!response.ok) {
      throw new Error(`the server answered with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      `Could not load the laptops (${error.message}). ` +
        "Make sure the site runs on a local server such as VS Code Live Server."
    );
  }
}

export const findLaptop = (laptops, id) => laptops.find((laptop) => laptop.id === id);
