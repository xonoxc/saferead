import { z } from "zod"

export const baseSpaceFromSchema = z.object({
   title: z
      .string()
      .trim()
      .min(1, { message: "Space name is required" })
      .max(20, { message: "Space name must be less than 20 characters" }),
   /*
    * Optional, matching the server: `UserSpace.description` is `blank=True`.
    * It used to be `.min(1)`, which made a blank description block submission
    * with an error nobody expected - the field is a note to yourself, not a
    * fact the space cannot exist without.
    * **/
   description: z
      .string({ message: "description must be a string" })
      .trim()
      .max(50, { message: "Description must be less than 50 characters" })
      .optional(),
   color: z.string({ message: "color must be a string" }),
   icon: z.any(),
   privacy: z.enum(["private", "public"]),
   is_favorite: z.boolean(),
})

export const createSpaceSchema = baseSpaceFromSchema

export const updateSpaceSchema = baseSpaceFromSchema.partial()

export type SpaceDataParam = z.infer<typeof createSpaceSchema>
