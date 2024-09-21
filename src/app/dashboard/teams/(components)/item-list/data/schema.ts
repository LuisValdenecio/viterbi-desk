import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  team_id: z.string(),
  name: z.string(),
  members: z.number(),
  actual_members : z.any(),
  description: z.string(),
  user_role : z.string()
})

export type Task = z.infer<typeof taskSchema>
