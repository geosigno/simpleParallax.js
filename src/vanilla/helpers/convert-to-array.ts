// Normalise l'entrée en tableau de nœuds.
const convertToArray = (
  elements: string | Element | NodeList | HTMLCollection | Element[]
): Element[] => {
  if (elements instanceof NodeList || elements instanceof HTMLCollection) {
    return Array.from(elements) as Element[];
  }
  if (typeof elements === "string") {
    return Array.from(document.querySelectorAll(elements));
  }
  if (Array.isArray(elements)) {
    return elements;
  }
  return [elements];
};

export default convertToArray;
