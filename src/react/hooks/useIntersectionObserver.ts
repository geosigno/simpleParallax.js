import { MutableRefObject, useEffect, useRef, useState } from "react";

const useIntersectionObserver = <T extends Element>(
  options: IntersectionObserverInit = {}
): [MutableRefObject<T | null>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        ...options,
      }
    );

    const { current: currentElement } = elementRef;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
};

export default useIntersectionObserver;
