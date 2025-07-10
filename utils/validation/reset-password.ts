import { z } from "zod"
import { passwordValidation } from "./user"

export const resetPasswordFormSchema = z
  .object({
    new_password1: passwordValidation,
    new_password2: passwordValidation,
  })
  .refine(data => data.new_password1 === data.new_password2, {
    message: "Passwords do not match",
    path: ["new_password2"],
  })

export type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>
