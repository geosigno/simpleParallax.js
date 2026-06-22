import { Orientation } from "../../core/types";

export interface SimpleParallaxProps {
	delay?: number;
	orientation?: Orientation;
	scale?: number;
	overflow?: boolean;
	transition?: string;
	maxTransition?: number | null;
	children?: React.ReactNode;
}
