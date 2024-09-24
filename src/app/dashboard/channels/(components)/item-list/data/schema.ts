import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  channel_id: z.string(),
  name: z.string(),
  provider: z.string(),
  description: z.string(),
  //owner : z.any()
  //agents : z.any()
})

export type Task = z.infer<typeof taskSchema>
