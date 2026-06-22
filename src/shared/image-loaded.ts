// Détermine si un media est complètement chargé.
// Les éléments qui ne sont pas une image (ni <img> ni <picture>) sont
// considérés comme déjà "chargés". Consommé par la version vanilla ET react.
export const isImageLoaded = (element: Element): boolean => {
  const tag = element.tagName.toLowerCase();
  if (tag !== "img" && tag !== "picture") {
    return true;
  }

  const img = element as HTMLImageElement;

  // `complete` couvre le cas non chargé ; `naturalWidth === 0` couvre
  // l'image cassée ou pas encore décodée.
  return img.complete && img.naturalWidth !== 0;
};
