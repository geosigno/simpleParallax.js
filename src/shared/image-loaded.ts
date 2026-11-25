// Tells whether a media element is fully loaded.
// Elements that are not an image (neither <img> nor <picture>) are
// considered already "loaded". Used by both the vanilla and React versions.
export const isImageLoaded = (element: Element): boolean => {
  const tag = element.tagName.toLowerCase();
  if (tag !== "img" && tag !== "picture") {
    return true;
  }

  const img = element as HTMLImageElement;

  // `complete` covers the not-loaded case; `naturalWidth === 0` covers
  // a broken image or one not decoded yet.
  return img.complete && img.naturalWidth !== 0;
};
