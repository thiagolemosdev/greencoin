import * as v from "valibot";

export const SettingsSchema = v.object({
  notifications: v.object({
    email: v.boolean(),
    push: v.boolean(),
  }),
  theme: v.picklist(["light", "dark", "system"]),
  language: v.pipe(v.string(), v.minLength(2)),
});

export type SettingsValues = v.InferOutput<typeof SettingsSchema>;
