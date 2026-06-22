import { useCallback, useEffect, useRef } from "react";
import {
  applyMaxTransition,
  getProgress,
  getRange,
  getTranslate,
} from "../../core/math";
import { buildTransform, buildTransition } from "../../core/transform";
import type { Orientation } from "../../core/types";
import AnimationManager from "../manager/animation-manager";
import PassiveScrollManager from "../manager/passive-scroll-manager";
import useReducedMotion from "./use-reduce-motion";

interface UseParallaxTransformProps {
  delay: number;
  imageHeight: number;
  imageRef: React.RefObject<HTMLImageElement | null>;
  isLoaded: boolean;
  isVisible: boolean;
  maxTransition: number;
  orientation: Orientation;
  overflow: boolean;
  scale: number;
  transition: string;
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
  const prefersReducedMotion = useReducedMotion();

  // Valeurs par-frame en ref : aucun re-render au scroll.
  const lastScrollY = useRef<number>(-1);
  const hasInit = useRef<boolean>(false);

  // Calcule et applique le transform directement sur l'élément (dans le RAF).
  const render = useCallback(() => {
    const el = imageRef.current;
    if (!el || prefersReducedMotion) {
      return;
    }

    const scrollY = PassiveScrollManager.getScrollY();
    if (hasInit.current && scrollY === lastScrollY.current) {
      return;
    }
    lastScrollY.current = scrollY;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const progress = applyMaxTransition(
      getProgress(rect.top, viewportHeight, rect.height),
      maxTransition
    );
    const range = getRange(imageHeight, scale);
    const value = getTranslate(progress, range);

    el.style.transform = buildTransform(value, orientation, scale, overflow);

    // La transition n'est appliquée qu'après le premier placement
    // pour éviter un saut visuel à l'init.
    if (!hasInit.current) {
      hasInit.current = true;
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = buildTransition(
            delay,
            transition
          );
        }
      }, 50);
    }
  }, [
    imageRef,
    prefersReducedMotion,
    maxTransition,
    imageHeight,
    scale,
    orientation,
    overflow,
    delay,
    transition,
  ]);

  // Enregistre dans la boucle RAF partagée uniquement quand l'élément est visible.
  useEffect(() => {
    if (isVisible && !prefersReducedMotion) {
      AnimationManager.register(render);
    } else {
      AnimationManager.unregister(render);
    }
    return () => AnimationManager.unregister(render);
  }, [isVisible, prefersReducedMotion, render]);

  // Applique le scale initial dès que l'image est chargée (avant tout scroll).
  useEffect(() => {
    const el = imageRef.current;
    if (!el || prefersReducedMotion || overflow || !isLoaded) {
      return;
    }
    el.style.transform = `scale(${scale})`;
  }, [imageRef, prefersReducedMotion, overflow, isLoaded, scale]);

  // Place l'image une fois au montage, même sans scroll.
  useEffect(() => {
    if (isLoaded && !prefersReducedMotion) {
      render();
    }
  }, [isLoaded, prefersReducedMotion, render]);

  // Respecte prefers-reduced-motion : nettoie le style appliqué.
  useEffect(() => {
    const el = imageRef.current;
    if (prefersReducedMotion && el) {
      el.style.transform = "";
      el.style.transition = "";
    }
  }, [imageRef, prefersReducedMotion]);
};
