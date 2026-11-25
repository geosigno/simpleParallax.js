import type { Orientation } from "./types.js";

// Sign convention for a NON-inverted progress (p=0 when entering from the bottom).
// "up" moves the image up (negative Y) when scrolling down.
export const getTranslate3d = (
  rawValue: number,
  orientation: Orientation
): string => {
  // to a hundredth of a pixel: smooth sub-pixel motion without useless decimals
  const value = Math.round(rawValue * 100) / 100;
  switch (orientation) {
    case "up":
      return `0, ${-value}px, 0`;
    case "down":
      return `0, ${value}px, 0`;
    case "left":
      return `${-value}px, 0, 0`;
    case "right":
      return `${value}px, 0, 0`;
    case "up left":
      return `${-value}px, ${-value}px, 0`;
    case "up right":
      return `${value}px, ${-value}px, 0`;
    case "down left":
      return `${-value}px, ${value}px, 0`;
    case "down right":
      return `${value}px, ${value}px, 0`;
    default:
      return `0, ${-value}px, 0`;
  }
};

export const buildTransform = (
  value: number,
  orientation: Orientation,
  scale: number,
  overflow: boolean
): string => {
  const translate3d = `translate3d(${getTranslate3d(value, orientation)})`;
  return overflow ? translate3d : `${translate3d} scale(${scale})`;
};
