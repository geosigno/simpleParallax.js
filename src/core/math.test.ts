import { describe, expect, test as it } from "bun:test";
import {
  applyMaxTransition,
  clamp,
  getProgress,
  getRange,
  getTranslate,
} from "./math";

describe("clamp", () => {
  it("clamps to the bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe("getProgress", () => {
  const V = 1000;
  const h = 500;
  it("0 when the element's top is at the bottom of the viewport", () => {
    expect(getProgress(V, V, h)).toBe(0);
  });
  it("1 when the element's bottom is at the top of the viewport", () => {
    expect(getProgress(-h, V, h)).toBe(1);
  });
  it("0.5 when the element is centred", () => {
    expect(getProgress(250, V, h)).toBe(0.5);
  });
  it("clamped off screen", () => {
    expect(getProgress(5000, V, h)).toBe(0);
    expect(getProgress(-5000, V, h)).toBe(1);
  });
});

describe("applyMaxTransition", () => {
  it("0 = off, p unchanged", () => {
    expect(applyMaxTransition(0.8, 0)).toBe(0.8);
  });
  it("caps p at the max percentage", () => {
    expect(applyMaxTransition(0.8, 50)).toBe(0.5);
  });
  it("leaves p alone below the threshold", () => {
    expect(applyMaxTransition(0.3, 50)).toBe(0.3);
  });
});

describe("getRange", () => {
  it("height * (scale - 1)", () => {
    expect(getRange(500, 1.5)).toBe(250);
    expect(getRange(500, 1)).toBe(0);
  });
});

describe("getTranslate", () => {
  it("0 at the centre", () => {
    expect(getTranslate(0.5, 150)).toBe(0);
  });
  it("-range/2 on entry, +range/2 on exit, rounded", () => {
    expect(getTranslate(0, 150)).toBe(-75);
    expect(getTranslate(1, 150)).toBe(75);
  });
});
