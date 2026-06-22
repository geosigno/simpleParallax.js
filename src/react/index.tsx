import React from "react";
import { DEFAULTS } from "../core/constants";
import useGetImageHeight from "./hooks/useGetImageHeight";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import { useParallaxTransform } from "./hooks/useParallaxTransform";
import { SimpleParallaxProps } from "./types";

const SimpleParallax: React.FunctionComponent<SimpleParallaxProps> = ({
	delay = DEFAULTS.delay,
	orientation = DEFAULTS.orientation,
	scale = DEFAULTS.scale,
	overflow = DEFAULTS.overflow,
	transition = DEFAULTS.transition,
	maxTransition = DEFAULTS.maxTransition,
	children,
}) => {
	const src = (children as React.ReactElement<{ src?: string }>)?.props?.src;

	const [imageRef, imageHeight, isLoaded] = useGetImageHeight(src);
	const [elementRef, isVisible] = useIntersectionObserver<HTMLDivElement>();

	useParallaxTransform({
		scale,
		overflow,
		delay,
		transition,
		orientation,
		maxTransition: maxTransition ?? 0,
		isVisible,
		isLoaded,
		imageHeight,
		imageRef,
	});

	const clonedChild = React.isValidElement(children)
		? React.cloneElement(
				children as React.ReactElement<{
					ref?: React.Ref<HTMLImageElement>;
				}>,
				{
					ref: imageRef,
				}
			)
		: null;

	return (
		<div
			ref={elementRef}
			style={{
				overflow: overflow ? "visible" : "hidden",
			}}
		>
			{clonedChild}
		</div>
	);
};

export default SimpleParallax;
