import type { Orientation } from "../../core/types.js";

export interface SimpleParallaxProps {
  children?: React.ReactNode;
  delay?: number;
  maxTransition?: number | null;
  orientation?: Orientation;
  overflow?: boolean;
  scale?: number;
  transition?: string;
}
