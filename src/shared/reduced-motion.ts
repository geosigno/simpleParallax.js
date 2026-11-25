// Framework-agnostic browser helpers around the
// "prefers-reduced-motion" preference. Used by both the vanilla and React versions.

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const getMediaQuery = (): MediaQueryList | null =>
  typeof window === "undefined"
    ? null
    : window.matchMedia(REDUCED_MOTION_QUERY);

// Current state of the preference (false during SSR).
export const prefersReducedMotion = (): boolean =>
  getMediaQuery()?.matches ?? false;

// Subscribes to changes of the preference; returns an unsubscribe function.
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
