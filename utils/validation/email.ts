import { z } from "zod"

export const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

export type EmailFormSchema = z.infer<typeof emailFormSchema>
