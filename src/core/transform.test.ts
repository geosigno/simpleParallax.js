import { describe, expect, test } from "bun:test";
import { buildTransform, buildTransition, getTranslate3d } from "./transform";

describe("getTranslate3d", () => {
  test("up fait monter (Y négatif)", () => {
    expect(getTranslate3d(75, "up")).toBe("0, -75px, 0");
  });
  test("down", () => {
    expect(getTranslate3d(75, "down")).toBe("0, 75px, 0");
  });
  test("left / right", () => {
    expect(getTranslate3d(75, "left")).toBe("-75px, 0, 0");
    expect(getTranslate3d(75, "right")).toBe("75px, 0, 0");
  });
  test("diagonales", () => {
    expect(getTranslate3d(75, "up left")).toBe("-75px, -75px, 0");
    expect(getTranslate3d(75, "up right")).toBe("75px, -75px, 0");
    expect(getTranslate3d(75, "down left")).toBe("-75px, 75px, 0");
    expect(getTranslate3d(75, "down right")).toBe("75px, 75px, 0");
  });
});

describe("buildTransform", () => {
  test("ajoute scale quand overflow est false", () => {
    expect(buildTransform(75, "up", 1.3, false)).toBe(
      "translate3d(0, -75px, 0) scale(1.3)"
    );
  });
  test("pas de scale quand overflow est true", () => {
    expect(buildTransform(75, "up", 1.3, true)).toBe(
      "translate3d(0, -75px, 0)"
    );
  });
});

describe("buildTransition", () => {
  test("string transform quand delay > 0", () => {
    expect(buildTransition(0.4, "cubic-bezier(0,0,0,1)")).toBe(
      "transform 0.4s cubic-bezier(0,0,0,1)"
    );
  });
  test("vide quand delay <= 0", () => {
    expect(buildTransition(0, "ease")).toBe("");
  });
});
