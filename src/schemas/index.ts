import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z
  .object({
    username: z.string(),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(8, {
      message: "Password have to be at least 8 characters",
    }),
    confPassword: z.string().min(8, {
      message: "Password have to be at least 8 characters",
    }),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords doesn't match",
    path: ["confPassword"],
  });
