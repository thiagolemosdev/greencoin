import * as v from "valibot";

export const SignInSchema = v.object({
  email: v.pipe(v.string(), v.email("Enter a valid email")),
  password: v.pipe(v.string(), v.minLength(6, "Password must be at least 6 characters")),
});

export type SignInValues = v.InferOutput<typeof SignInSchema>;

export const RegisterSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.minLength(1, "Name is required"), v.maxLength(80)),
    email: v.pipe(v.string(), v.email("Enter a valid email")),
    password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
);

export type RegisterValues = v.InferOutput<typeof RegisterSchema>;
