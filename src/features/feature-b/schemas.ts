import * as v from "valibot";

export const FeatureBDialogSchema = v.object({
  subject: v.pipe(v.string(), v.minLength(1, "Subject is required"), v.maxLength(100)),
  notes: v.optional(v.pipe(v.string(), v.maxLength(1000))),
  priority: v.picklist(["low", "medium", "high"]),
});

export type FeatureBDialogValues = v.InferOutput<typeof FeatureBDialogSchema>;
