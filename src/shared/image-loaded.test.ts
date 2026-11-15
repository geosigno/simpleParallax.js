import { describe, expect, test as it } from "bun:test";
import { isImageLoaded } from "./image-loaded";

const fakeElement = (
  tagName: string,
  props: { complete?: boolean; naturalWidth?: number } = {}
): Element => ({ tagName, ...props }) as unknown as Element;

describe("isImageLoaded", () => {
  it("élément non-image considéré chargé", () => {
    expect(isImageLoaded(fakeElement("DIV"))).toBe(true);
  });
  it("img complète avec naturalWidth > 0 = chargée", () => {
    expect(
      isImageLoaded(fakeElement("IMG", { complete: true, naturalWidth: 800 }))
    ).toBe(true);
  });
  it("img non complète = non chargée", () => {
    expect(
      isImageLoaded(fakeElement("IMG", { complete: false, naturalWidth: 800 }))
    ).toBe(false);
  });
  it("img complète mais naturalWidth 0 (cassée) = non chargée", () => {
    expect(
      isImageLoaded(fakeElement("IMG", { complete: true, naturalWidth: 0 }))
    ).toBe(false);
  });
});
