import { z } from "zod"
import { emailValidation, passwordValidation } from "./user"

export const loginFormSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>
