// Helpers navigateur (agnostiques du framework) autour de la préférence
// "prefers-reduced-motion". Consommés par la version vanilla ET react.

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const getMediaQuery = (): MediaQueryList | null =>
  typeof window === "undefined"
    ? null
    : window.matchMedia(REDUCED_MOTION_QUERY);

// État courant de la préférence (false en SSR).
export const prefersReducedMotion = (): boolean =>
  getMediaQuery()?.matches ?? false;

// S'abonne aux changements de la préférence ; retourne une fonction de désabonnement.
export const onReducedMotionChange = (
  listener: (prefersReduced: boolean) => void
): (() => void) => {
  const mediaQuery = getMediaQuery();
  if (!mediaQuery) {
    return () => undefined;
  }

  const handler = (event: MediaQueryListEvent) => listener(event.matches);
  mediaQuery.addEventListener("change", handler);

  return () => mediaQuery.removeEventListener("change", handler);
};
