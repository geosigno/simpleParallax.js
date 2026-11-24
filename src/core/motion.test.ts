import { describe, expect, test as it } from "bun:test";
import { advance } from "./motion";

describe("advance", () => {
  const run = (easing: "smooth" | "spring", delay: number, ms: number) => {
    const motion = { value: 0, velocity: 0 };
    for (let elapsed = 0; elapsed < ms; elapsed += 16) {
      advance(motion, 100, { delay, easing }, 100, 16);
    }
    return motion.value;
  };

  it("delay 0 : rejoint la cible immédiatement", () => {
    expect(run("smooth", 0, 16)).toBe(100);
  });
  it("chaque easing avance sans dépasser puis se pose sur la cible", () => {
    for (const easing of ["smooth", "spring"] as const) {
      const early = run(easing, 0.4, 100);
      expect(early).toBeGreaterThan(0);
      expect(early).toBeLessThan(100);
      expect(run(easing, 0.4, 2000)).toBe(100);
    }
  });
  it("bounce : dépasse la cible puis s'y pose", () => {
    const motion = { value: -40, velocity: 0 };
    let highest = motion.value;
    for (let elapsed = 0; elapsed < 3000; elapsed += 16) {
      advance(motion, 20, { delay: 0.4, easing: "bounce" }, 100, 16);
      highest = Math.max(highest, motion.value);
    }
    expect(highest).toBeGreaterThan(20);
    expect(highest).toBeLessThanOrEqual(50);
    expect(motion.value).toBe(20);
  });
  it("indépendant de la cadence : 1 × 160 ms = 10 × 16 ms", () => {
    for (const easing of ["smooth", "spring", "bounce"] as const) {
      const once = { value: -40, velocity: 0 };
      const stepped = { value: -40, velocity: 0 };
      advance(once, 20, { delay: 0.4, easing }, 100, 160);
      for (let step = 0; step < 10; step += 1) {
        advance(stepped, 20, { delay: 0.4, easing }, 100, 16);
      }
      expect(stepped.value).toBeCloseTo(once.value, 6);
    }
  });
  it("retourne false quand rien ne bouge", () => {
    const motion = { value: 100, velocity: 0 };
    expect(
      advance(motion, 100, { delay: 0.4, easing: "smooth" }, 100, 16)
    ).toBe(false);
  });
});
