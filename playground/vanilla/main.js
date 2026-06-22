import SimpleParallax from "../../src/vanilla/";

// Ensure the DOM content is fully loaded before initializing the plugin
document.addEventListener("DOMContentLoaded", () => {
  // Select all elements with the class 'parallax'
  const elements = document.querySelectorAll("img");

  for (const element of elements) {
    // Mêmes paramètres que le playground React pour comparer les deux versions.
    new SimpleParallax(element, {
      delay: 0.4,
      orientation: "up",
      scale: 1.5,
      transition: "cubic-bezier(0,0,0,1)",
    });
  }
});
