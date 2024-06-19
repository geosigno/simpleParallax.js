export type Orientation =
  | "up"
  | "right"
  | "down"
  | "left"
  | "up left"
  | "up right"
  | "down left"
  | "down right";
export interface SimpleParallaxProps {
  delay?: number;
  orientation?: Orientation;
  scale?: number;
  overflow?: boolean;
  transition?: string;
  maxTransition?: number | null;
  children?: React.ReactNode;
}