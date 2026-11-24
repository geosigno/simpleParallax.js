import type { Easing, Orientation } from "../../core/types.js";

export interface SimpleParallaxProps {
  children?: React.ReactNode;
  delay?: number;
  easing?: Easing;
  maxTransition?: number | null;
  orientation?: Orientation;
  overflow?: boolean;
  scale?: number;
}
