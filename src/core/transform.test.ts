import { describe, expect, test as it } from "bun:test";
import { buildTransform, getTranslate3d } from "./transform";

describe("getTranslate3d", () => {
  it("up moves the image up (negative Y)", () => {
    expect(getTranslate3d(75, "up")).toBe("0, -75px, 0");
  });
  it("down", () => {
    expect(getTranslate3d(75, "down")).toBe("0, 75px, 0");
  });
  it("left / right", () => {
    expect(getTranslate3d(75, "left")).toBe("-75px, 0, 0");
    expect(getTranslate3d(75, "right")).toBe("75px, 0, 0");
  });
  it("diagonals", () => {
    expect(getTranslate3d(75, "up left")).toBe("-75px, -75px, 0");
    expect(getTranslate3d(75, "up right")).toBe("75px, -75px, 0");
    expect(getTranslate3d(75, "down left")).toBe("-75px, 75px, 0");
    expect(getTranslate3d(75, "down right")).toBe("75px, 75px, 0");
  });
});

describe("buildTransform", () => {
  it("adds scale when overflow is false", () => {
    expect(buildTransform(75, "up", 1.3, false)).toBe(
      "translate3d(0, -75px, 0) scale(1.3)"
    );
  });
  it("no scale when overflow is true", () => {
    expect(buildTransform(75, "up", 1.3, true)).toBe(
      "translate3d(0, -75px, 0)"
    );
  });
});
