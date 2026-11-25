export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

// Progress of the element through the viewport, normalized to [0,1].
// top = viewport-relative position of the element's top edge.
export const getProgress = (
  top: number,
  viewportHeight: number,
  elementHeight: number
): number => {
  const span = viewportHeight + elementHeight;
  if (span === 0) {
    return 0;
  }
  return clamp((viewportHeight - top) / span, 0, 1);
};

// Caps the progress at maxTransition (0..100; 0 = off).
export const applyMaxTransition = (
  p: number,
  maxTransition: number
): number => {
  if (maxTransition > 0 && p * 100 > maxTransition) {
    return maxTransition / 100;
  }
  return p;
};

// Available translation range, in pixels.
export const getRange = (elementHeight: number, scale: number): number =>
  elementHeight * (scale - 1);

// Translation in pixels, 0 at the centre.
export const getTranslate = (p: number, range: number): number =>
  (p - 0.5) * range;
