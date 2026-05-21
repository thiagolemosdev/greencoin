import { describe, it, expect } from "vitest";
import * as v from "valibot";
import { CreateItemSchema } from "@features/items/schemas";

describe("CreateItemSchema", () => {
  it("accepts valid input", () => {
    const result = v.safeParse(CreateItemSchema, { title: "Hello", description: "World" });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = v.safeParse(CreateItemSchema, { title: "", description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects title exceeding max length", () => {
    const result = v.safeParse(CreateItemSchema, { title: "a".repeat(121), description: "" });
    expect(result.success).toBe(false);
  });
});
