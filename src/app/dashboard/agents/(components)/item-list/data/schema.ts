import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  _id: z.string(),
  agentName: z.string(),
  channel: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>