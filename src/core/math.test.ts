import { describe, expect, test } from "bun:test";
import {
  applyMaxTransition,
  clamp,
  getProgress,
  getRange,
  getTranslate,
} from "./math";

describe("clamp", () => {
  test("borne aux extrêmes", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe("getProgress", () => {
  const V = 1000;
  const h = 500;
  test("0 quand le haut de l'élément est au bas du viewport", () => {
    expect(getProgress(V, V, h)).toBe(0);
  });
  test("1 quand le bas de l'élément est au sommet du viewport", () => {
    expect(getProgress(-h, V, h)).toBe(1);
  });
  test("0.5 quand l'élément est centré", () => {
    expect(getProgress(250, V, h)).toBe(0.5);
  });
  test("clampé hors écran", () => {
    expect(getProgress(5000, V, h)).toBe(0);
    expect(getProgress(-5000, V, h)).toBe(1);
  });
});

describe("applyMaxTransition", () => {
  test("0 = désactivé, p inchangé", () => {
    expect(applyMaxTransition(0.8, 0)).toBe(0.8);
  });
  test("borne p au pourcentage max", () => {
    expect(applyMaxTransition(0.8, 50)).toBe(0.5);
  });
  test("ne touche pas p sous le seuil", () => {
    expect(applyMaxTransition(0.3, 50)).toBe(0.3);
  });
});

describe("getRange", () => {
  test("hauteur * (scale - 1)", () => {
    expect(getRange(500, 1.5)).toBe(250);
    expect(getRange(500, 1)).toBe(0);
  });
});

describe("getTranslate", () => {
  test("0 au centre", () => {
    expect(getTranslate(0.5, 150)).toBe(0);
  });
  test("-range/2 à l'entrée, +range/2 à la sortie, arrondi", () => {
    expect(getTranslate(0, 150)).toBe(-75);
    expect(getTranslate(1, 150)).toBe(75);
  });
});
