import type { Orientation } from "./types";

// Convention de signes pour une progression NON inversée (p=0 à l'entrée par le bas).
// "up" fait monter l'image (Y négatif) quand on scrolle vers le bas.
export const getTranslate3d = (
  value: number,
  orientation: Orientation
): string => {
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

// Construit la valeur CSS `transition`. Vide si delay <= 0.
// On ne transitionne que `transform` (seule propriété animée) plutôt que `all`.
export const buildTransition = (delay: number, transition: string): string =>
  delay > 0 ? `transform ${delay}s ${transition}` : "";
