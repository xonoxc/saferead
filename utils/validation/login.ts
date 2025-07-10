import { z } from "zod"
import { passwordValidation, usernameValidation } from "./user"

export const loginFormSchema = z.object({
  username: usernameValidation,
  password: passwordValidation,
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>
