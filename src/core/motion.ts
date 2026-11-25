// Animation engine: on every frame, moves an image's displayed value towards
// the target set by the scroll. No dependency on the DOM.
import { clamp } from "./math.js";
import type { ParallaxOptions } from "./types.js";

// Displayed value of an image and its velocity (px/s, used by the springs).
export interface Motion {
  value: number;
  velocity: number;
}

// Tuned so that ~98% of the way is covered after `delay` seconds.
const SMOOTH_RATIO = 4;
const SPRING_RATIO = 6;
// Below these thresholds (px, px/s), the image settles on its target.
const SETTLE_DISTANCE = 0.05;
const SETTLE_VELOCITY = 1;
// Bounce damping: 1 = no overshoot, lower = a stronger bounce.
// It depends on the momentum: a clear bounce after a fast scroll, a subtle one after a slow one.
const BOUNCE_DAMPING_FAST = 0.54;
const BOUNCE_DAMPING_SLOW = 0.77;
// Momentum (as a share of the range) from which the bounce is at its strongest.
const BOUNCE_FULL_MOMENTUM = 0.1;

// Underdamped spring: overshoots the target, then comes back. The overshoot is
// capped to the range so the image's edge is never revealed.
const bounce = (
  motion: Motion,
  target: number,
  delay: number,
  range: number,
  seconds: number
): void => {
  const omega = SPRING_RATIO / delay;
  const offset = motion.value - target;
  // momentum in px: distance to the target and velocity combined
  const momentum = Math.hypot(offset, motion.velocity / omega);
  const intensity =
    range > 0 ? Math.min(momentum / (range * BOUNCE_FULL_MOMENTUM), 1) : 1;
  const ratio =
    BOUNCE_DAMPING_SLOW +
    (BOUNCE_DAMPING_FAST - BOUNCE_DAMPING_SLOW) * intensity;
  const damping = ratio * omega;
  const frequency = omega * Math.sqrt(1 - ratio ** 2);
  const swing = (motion.velocity + damping * offset) / frequency;
  const decay = Math.exp(-damping * seconds);
  const cos = Math.cos(frequency * seconds);
  const sin = Math.sin(frequency * seconds);

  motion.value = clamp(
    target + decay * (offset * cos + swing * sin),
    -range / 2,
    range / 2
  );
  motion.velocity =
    decay *
    ((frequency * swing - damping * offset) * cos -
      (frequency * offset + damping * swing) * sin);
};

// True when the image rests on its target, not moving.
export const isSettled = (motion: Motion, target: number): boolean =>
  motion.value === target && motion.velocity === 0;

// Moves `motion` towards `target` over dt (ms), whatever the frame rate.
// Returns false if the value did not change (nothing to redraw).
// - smooth: covers a fraction of the remaining distance (quick start, soft end)
// - spring: spring without overshoot (soft start, soft end)
// - bounce: spring with overshoot (goes slightly past the target, then back)
export const advance = (
  motion: Motion,
  target: number,
  { delay, easing }: Pick<ParallaxOptions, "delay" | "easing">,
  range: number,
  dt: number
): boolean => {
  // image resting on its target: nothing to compute (by far the most common case)
  if (isSettled(motion, target)) {
    return false;
  }
  const previous = motion.value;
  const distance = target - previous;
  const seconds = dt / 1000;

  if (delay <= 0) {
    motion.value = target;
  } else if (easing === "bounce") {
    bounce(motion, target, delay, range, seconds);
  } else if (easing === "spring") {
    const omega = SPRING_RATIO / delay;
    const decay = Math.exp(-omega * seconds);
    const offset = (motion.velocity - omega * distance) * seconds;
    motion.value = target + (offset - distance) * decay;
    motion.velocity = (motion.velocity - omega * offset) * decay;
  } else {
    motion.value =
      previous + distance * (1 - Math.exp((-SMOOTH_RATIO * seconds) / delay));
  }

  // distance and velocity too small to see: the image settles on its target
  const isAtRest =
    Math.abs(target - motion.value) < SETTLE_DISTANCE &&
    Math.abs(motion.velocity) < SETTLE_VELOCITY;
  if (isAtRest) {
    motion.value = target;
    motion.velocity = 0;
  }
  return motion.value !== previous;
};
