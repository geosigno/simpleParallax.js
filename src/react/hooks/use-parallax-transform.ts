import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  applyMaxTransition,
  getProgress,
  getRange,
  getTranslate,
} from "../../core/math.js";
import { advance, isSettled } from "../../core/motion.js";
import { buildTransform } from "../../core/transform.js";
import type { Easing, Orientation } from "../../core/types.js";
import AnimationManager from "../manager/animation-manager.js";
import useReducedMotion from "./use-reduce-motion.js";

interface UseParallaxTransformProps {
  delay: number;
  easing: Easing;
  imageHeight: number;
  imageRef: React.RefObject<HTMLImageElement | null>;
  isLoaded: boolean;
  isVisible: boolean;
  maxTransition: number;
  orientation: Orientation;
  overflow: boolean;
  scale: number;
}

export const useParallaxTransform = ({
  scale,
  overflow,
  delay,
  easing,
  orientation,
  maxTransition,
  isVisible,
  isLoaded,
  imageHeight,
  imageRef,
}: UseParallaxTransformProps) => {
  const prefersReducedMotion = useReducedMotion();
  const range = getRange(imageHeight, scale);

  // Valeurs par-frame en ref : aucun re-render au scroll.
  const lastScrollY = useRef<number>(-1);
  const hasInit = useRef<boolean>(false);
  const target = useRef<number>(0);
  const motion = useRef({ value: 0, velocity: 0 });
  const isVisibleRef = useRef(isVisible);

  // Lecture : le scroll fixe la cible. On mesure le wrapper, pas l'image, qui
  // est déjà décalée par son transform.
  const measure = useCallback(
    (scrollY = window.scrollY) => {
      const wrapper = imageRef.current?.parentElement;
      if (!wrapper || scrollY === lastScrollY.current) {
        return;
      }
      lastScrollY.current = scrollY;
      const rect = wrapper.getBoundingClientRect();
      const progress = applyMaxTransition(
        getProgress(rect.top, window.innerHeight, rect.height),
        maxTransition
      );
      target.current = getTranslate(progress, range);
    },
    [imageRef, maxTransition, range]
  );

  // Écriture : la valeur affichée se rapproche de la cible (inertie = delay).
  const update = useCallback(
    (dt = 0) => {
      const el = imageRef.current;
      if (!el) {
        return;
      }

      if (!hasInit.current) {
        // premier placement direct, sans glissement depuis 0
        hasInit.current = true;
        motion.current = { value: target.current, velocity: 0 };
      } else if (
        !advance(motion.current, target.current, { delay, easing }, range, dt)
      ) {
        return;
      }

      // une transition CSS héritée ferait saccader l'écriture par frame
      el.style.transition = "none";
      el.style.transform = buildTransform(
        motion.current.value,
        orientation,
        scale,
        overflow
      );
    },
    [imageRef, range, scale, orientation, overflow, delay, easing]
  );

  // Tâche de la boucle RAF partagée. Hors écran, l'image y reste le temps de
  // terminer son mouvement, puis se désinscrit : au retour, elle est à sa place.
  const task = useMemo(
    () => ({
      measure,
      update: (dt: number) => {
        update(dt);
        if (
          !isVisibleRef.current &&
          isSettled(motion.current, target.current)
        ) {
          AnimationManager.unregister(task);
        }
      },
    }),
    [measure, update]
  );

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (prefersReducedMotion) {
      AnimationManager.unregister(task);
    } else if (isVisible) {
      AnimationManager.register(task);
    }
  }, [isVisible, prefersReducedMotion, task]);

  useEffect(() => () => AnimationManager.unregister(task), [task]);

  // Recalcule la cible au montage et à chaque changement de paramètre,
  // même sans scroll.
  useEffect(() => {
    if (isLoaded && !prefersReducedMotion) {
      lastScrollY.current = -1;
      measure();
      update();
    }
  }, [isLoaded, prefersReducedMotion, measure, update]);

  // Respecte prefers-reduced-motion : nettoie le style appliqué.
  useEffect(() => {
    const el = imageRef.current;
    if (prefersReducedMotion && el) {
      el.style.transform = "";
      el.style.transition = "";
    }
  }, [imageRef, prefersReducedMotion]);
};
