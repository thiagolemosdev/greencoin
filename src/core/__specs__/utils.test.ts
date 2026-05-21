import { describe, it, expect } from "vitest";
import { groupBy, omit, pick, isNonNullable } from "@core/utils";

describe("groupBy", () => {
  it("groups items by key", () => {
    const items = [
      { type: "a", id: 1 },
      { type: "b", id: 2 },
      { type: "a", id: 3 },
    ];
    expect(groupBy(items, (i) => i.type)).toEqual({
      a: [{ type: "a", id: 1 }, { type: "a", id: 3 }],
      b: [{ type: "b", id: 2 }],
    });
  });
});

describe("omit", () => {
  it("removes specified keys", () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
  });
});

describe("pick", () => {
  it("keeps only specified keys", () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });
});

describe("isNonNullable", () => {
  it("returns false for null and undefined", () => {
    expect(isNonNullable(null)).toBe(false);
    expect(isNonNullable(undefined)).toBe(false);
  });
  it("returns true for non-null values", () => {
    expect(isNonNullable(0)).toBe(true);
    expect(isNonNullable("")).toBe(true);
  });
});
