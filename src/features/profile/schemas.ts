import * as v from "valibot";

export const UpdateProfileSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required"), v.maxLength(80, "Name is too long")),
  bio: v.optional(v.pipe(v.string(), v.maxLength(300, "Bio is too long"))),
});

export type UpdateProfileValues = v.InferOutput<typeof UpdateProfileSchema>;
