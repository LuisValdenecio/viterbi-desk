import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  guest_email: z.string(),
  inviter_id: z.string(),
  guest_role: z.string(),
  inviter_name: z.string(),
  inviter_email: z.string(),
})

export type Task = z.infer<typeof taskSchema>
