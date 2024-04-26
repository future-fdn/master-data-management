import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const fileSchema = z.object({
  id: z.string(),
  file_name: z.string(),
  description: z.string(),
  name: z.string(),
  user_id: z.string(),
  unique: z.number(),
  valid: z.number(),
  type: z.enum(["MASTER", "QUERY"]),
  created: z.coerce.date(),
  modified: z.coerce.date(),
  url: z.string(),
});

export const filesSchema = z.object({
  files: z.array(fileSchema),
  total: z.number(),
});

export type File = z.infer<typeof fileSchema>;
