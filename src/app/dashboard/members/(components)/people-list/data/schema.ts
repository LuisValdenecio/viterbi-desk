import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  name: z.string(),
  role : z.string(),
  user_id : z.string(),
  img: z.any(), // to cover for null imgs
  team : z.string(),
  team_id : z.string(),
  email: z.string(),
  status : z.string(),
  task_quota : z.number(),
  used_task_quota : z.number(),
})

export type Task = z.infer<typeof taskSchema>
