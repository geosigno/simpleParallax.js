export type Orientation =
  | "up"
  | "right"
  | "down"
  | "left"
  | "up left"
  | "up right"
  | "down left"
  | "down right";

export type Easing = "smooth" | "spring" | "bounce";

export interface ParallaxOptions {
  delay: number;
  easing: Easing;
  maxTransition: number;
  orientation: Orientation;
  overflow: boolean;
  scale: number;
  /** @deprecated Sans effet : le lissage est réglé par `delay` et `easing`. */
  transition?: string;
}
