import { z } from "zod"

export const createSpaceSchema = z.object({
  title: z.string().min(1, "Space name is required"),
  desc: z.string().optional(),
})
