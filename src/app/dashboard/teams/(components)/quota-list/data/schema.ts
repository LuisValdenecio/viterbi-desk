import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  name: z.string(),
  role : z.string(),
  user_id : z.string(),
  img: z.any(), // to cover for null imgs
  task_quota : z.number(),
  playground_quota : z.number(),
  email: z.string(),
  status : z.string()
})

export type Task = z.infer<typeof taskSchema>
