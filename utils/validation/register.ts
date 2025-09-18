import { z } from "zod"
import { emailValidation, passwordValidation, usernameValidation } from "./user"

export const registerSchema = z
   .object({
      username: usernameValidation,
      email: emailValidation,
      password1: passwordValidation,
      password2: z.string(),
   })
   .refine(data => data.password1 === data.password2, {
      message: "Passwords do not match",
      path: ["password2"],
   })

export type RegisterFormData = z.infer<typeof registerSchema>
