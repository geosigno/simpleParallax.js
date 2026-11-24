import type { Orientation } from "./types.js";

// Convention de signes pour une progression NON inversée (p=0 à l'entrée par le bas).
// "up" fait monter l'image (Y négatif) quand on scrolle vers le bas.
export const getTranslate3d = (
  rawValue: number,
  orientation: Orientation
): string => {
  // au centième de pixel : sous-pixel fluide sans décimales inutiles
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
