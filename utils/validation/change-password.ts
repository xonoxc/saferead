import { z } from "zod"
import { passwordValidation } from "./user"

export const changePasswordFormSchema = z
  .object({
    old_password: passwordValidation,
    new_password1: passwordValidation,
    new_password2: passwordValidation,
  })
  .refine(data => data.new_password1 === data.new_password2, {
    message: "New passwords do not match",
    path: ["new_password2"],
  })

export type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>
