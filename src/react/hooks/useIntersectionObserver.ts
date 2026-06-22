import { MutableRefObject, useEffect, useRef, useState } from "react";
import IntersectionObserverManager from "../manager/IntersectionObserverManager";

const useOptimizedIntersectionObserver = <T extends Element>(): [
	MutableRefObject<T | null>,
	boolean,
] => {
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<T | null>(null);
	const callbackRef = useRef<((visible: boolean) => void) | undefined>(
		undefined
	);

	useEffect(() => {
		callbackRef.current = (visible: boolean) => {
			setIsVisible(visible);
		};
	});

	useEffect(() => {
		const element = elementRef.current;
		if (!element || !callbackRef.current) return;

		IntersectionObserverManager.observe(element, callbackRef.current);

		return () => {
			if (element) {
				IntersectionObserverManager.unobserve(element);
				IntersectionObserverManager.disconnect();
			}
		};
	}, []);

	return [elementRef, isVisible];
};

export default useOptimizedIntersectionObserver;
