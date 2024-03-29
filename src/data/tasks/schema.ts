import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  file_id: z.string(),
  file_name: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"]),
  started: z.coerce.date(),
  ended: z.coerce.date(),
});

export type Task = z.infer<typeof taskSchema>;
