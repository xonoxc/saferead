import { z } from "zod"

export const baseSpaceFromSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Space name is required" })
    .max(20, { message: "Space name must be less than 20 characters" }),
  description: z
    .string({ message: "description must be a string" })
    .min(1, { message: "description is required" })
    .max(50, { message: "description must be less than 50 characters" }),
  color: z.string({ message: "color must be a string" }),
  icon: z.any(),
  privacy: z.enum(["private", "public"]),
  is_favorite: z.boolean(),
})

export const createSpaceSchema = baseSpaceFromSchema

export const updateSpaceSchema = baseSpaceFromSchema.partial()

export type SpaceDataParam = z.infer<typeof createSpaceSchema>
