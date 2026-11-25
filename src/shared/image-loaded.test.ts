import { describe, expect, test as it } from "bun:test";
import { isImageLoaded } from "./image-loaded";

const fakeElement = (
  tagName: string,
  props: { complete?: boolean; naturalWidth?: number } = {}
): Element => ({ tagName, ...props }) as unknown as Element;

describe("isImageLoaded", () => {
  it("a non-image element counts as loaded", () => {
    expect(isImageLoaded(fakeElement("DIV"))).toBe(true);
  });
  it("complete img with naturalWidth > 0 = loaded", () => {
    expect(
      isImageLoaded(fakeElement("IMG", { complete: true, naturalWidth: 800 }))
    ).toBe(true);
  });
  it("incomplete img = not loaded", () => {
    expect(
      isImageLoaded(fakeElement("IMG", { complete: false, naturalWidth: 800 }))
    ).toBe(false);
  });
  it("complete img but naturalWidth 0 (broken) = not loaded", () => {
    expect(
      isImageLoaded(fakeElement("IMG", { complete: true, naturalWidth: 0 }))
    ).toBe(false);
  });
});
