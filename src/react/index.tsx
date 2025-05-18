import React from "react";
import useGetImageHeight from "./hooks/useGetImageHeight";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import { useParallaxTransform } from "./hooks/useParallaxTransform";
import { SimpleParallaxProps } from "./types";

const SimpleParallax: React.FunctionComponent<SimpleParallaxProps> = ({
	delay = 0.4,
	orientation: orientationProp = "up",
	scale: scaleProp = 1.4,
	overflow = false,
	transition = "cubic-bezier(0,0,0,1)",
	maxTransition = null,
	children,
}) => {
	const orientation = orientationProp ?? "up";
	const scale = scaleProp ?? 1.2;
	const src = (children as React.ReactElement)?.props?.src;

	const [imageRef, imageHeight, isLoaded] = useGetImageHeight(src);
	const [elementRef, isVisible] = useIntersectionObserver<HTMLDivElement>();

	useParallaxTransform({
		scale,
		overflow,
		delay,
		transition,
		orientation,
		maxTransition,
		isVisible,
		isLoaded,
		imageHeight,
		imageRef,
	});

	const clonedChild = React.isValidElement(children)
		? React.cloneElement(children as React.ReactElement, {
				ref: imageRef,
			})
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
