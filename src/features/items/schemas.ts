import * as v from "valibot";

export const CreateItemSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "Title is required"), v.maxLength(120, "Title is too long")),
  description: v.pipe(v.string(), v.maxLength(500, "Description is too long")),
});

export type CreateItemValues = v.InferOutput<typeof CreateItemSchema>;

export const UpdateItemSchema = v.object({
  title: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(120))),
  description: v.optional(v.pipe(v.string(), v.maxLength(500))),
  status: v.optional(v.picklist(["active", "inactive", "archived"])),
});

export type UpdateItemValues = v.InferOutput<typeof UpdateItemSchema>;

export const ItemFiltersSchema = v.object({
  search: v.optional(v.string()),
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
});

export type ItemFilters = v.InferOutput<typeof ItemFiltersSchema>;
