import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  role: z.enum(["USER", "ADMIN"]),
});

export type User = z.infer<typeof userSchema>;
