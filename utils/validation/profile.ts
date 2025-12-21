import { z } from "zod"

export const profileSchema = z.object({
   firstName: z.string().min(1, "First name is required"),
   lastName: z.string().min(1, "Last name is required"),
   email: z.string().email("Invalid email"),
   username: z.string().min(3, "Username too short"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
