import * as v from "valibot";

export const FeatureARecordSchema = v.object({
  id: v.string(),
  label: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
  value: v.number(),
  active: v.boolean(),
});

export type FeatureARecord = v.InferOutput<typeof FeatureARecordSchema>;

export const CreateFeatureASchema = v.omit(FeatureARecordSchema, ["id"]);
export type CreateFeatureAValues = v.InferOutput<typeof CreateFeatureASchema>;
