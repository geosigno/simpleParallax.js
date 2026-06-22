export type Orientation =
  | "up"
  | "right"
  | "down"
  | "left"
  | "up left"
  | "up right"
  | "down left"
  | "down right";

export interface ParallaxOptions {
  delay: number;
  maxTransition: number;
  orientation: Orientation;
  overflow: boolean;
  scale: number;
  transition: string;
}
