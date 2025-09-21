// Updated useParallaxTransform.ts - Combines PassiveScrollManager + AnimationManager
import { useCallback, useEffect, useState } from "react";
import AnimationManager from "../manager/AnimationManager";
import PassiveScrollManager from "../manager/PassiveScrollManager";
import { Orientation } from "../types";
import useGetTransitionValue from "./useGetTransitionValue";
import useReducedMotion from "./useReduceMotion";

interface UseParallaxTransformProps {
	scale: number;
	overflow: boolean;
	delay: number;
	transition: string;
	orientation: Orientation;
	maxTransition: number | null;
	isVisible: boolean;
	isLoaded: boolean;
	imageHeight: number;
	imageRef: React.RefObject<HTMLImageElement>;
}

export const useParallaxTransform = ({
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
}: UseParallaxTransformProps) => {
	const [isInit, setIsInit] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [boundingClientRect, setBoundingClientRect] = useState<DOMRect | null>(
		null
	);
	const [shouldApplyTransition, setShouldApplyTransition] = useState(false);

	const prefersReducedMotion = useReducedMotion();

	const updateParallax = useCallback(() => {
		if (prefersReducedMotion || (isInit && !isVisible)) {
			return;
		}

		const currentScrollY = PassiveScrollManager.getScrollY();

		if (isInit && currentScrollY === lastScrollY) {
			return;
		}

		const newBoundingClientRect = imageRef.current?.getBoundingClientRect();
		if (newBoundingClientRect) {
			setBoundingClientRect(newBoundingClientRect);
		}

		if (!isInit) {
			setTimeout(() => {
				setShouldApplyTransition(true);
				setIsInit(true);
			}, 50);
		}

		setLastScrollY(currentScrollY);
	}, [prefersReducedMotion, isVisible, isInit, lastScrollY, imageRef]);

	const transitionValue = useGetTransitionValue({
		isLoaded,
		imageHeight,
		scale,
		boundingClientRect: boundingClientRect as DOMRect,
		orientation,
		maxTransition,
	});

	const applyTransform = useCallback(
		(transformValue: string) => {
			if (!imageRef.current || prefersReducedMotion || !transformValue) return;

			let transform = `translate3d(${transformValue})`;
			if (!overflow) {
				transform += ` scale(${scale})`;
			}

			imageRef.current.style.transform = transform;
		},
		[imageRef, scale, overflow, prefersReducedMotion]
	);

	const manageTransition = useCallback(() => {
		if (!imageRef.current || prefersReducedMotion) return;

		// Skip transitions for Safari due to performance issues
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		const transitionValue =
			delay > 0 && !isSafari ? `all ${delay}s ${transition}` : "";

		imageRef.current.style.transition = transitionValue;
	}, [imageRef, delay, transition, prefersReducedMotion]);

	useEffect(() => {
		if (isVisible && !prefersReducedMotion) {
			AnimationManager.register(updateParallax);
		} else {
			AnimationManager.unregister(updateParallax);
		}

		return () => {
			AnimationManager.unregister(updateParallax);
		};
	}, [isVisible, prefersReducedMotion, updateParallax]);

	useEffect(() => {
		if (transitionValue && (isVisible || !isInit)) {
			applyTransform(transitionValue);
			if (!isInit) setIsInit(true);
		}
	}, [transitionValue, isVisible, isInit, applyTransform]);

	useEffect(() => {
		if (!overflow && isLoaded && imageRef.current && !prefersReducedMotion) {
			imageRef.current.style.transform = `scale(${scale})`;
		}
	}, [scale, overflow, isLoaded, prefersReducedMotion]);

	useEffect(() => {
		if (!shouldApplyTransition) return;

		manageTransition();
	}, [shouldApplyTransition, manageTransition]);

	useEffect(() => {
		if (prefersReducedMotion && imageRef.current) {
			imageRef.current.style.transform = "";
			imageRef.current.style.transition = "";
		}
	}, [prefersReducedMotion]);
};
