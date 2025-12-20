import { z } from "zod"
import { passwordValidation } from "@/utils/validation/user"

export const changePasswordFormSchema = z
   .object({
      new_password1: passwordValidation,
      new_password2: passwordValidation,
   })
   .refine(data => data.new_password1 === data.new_password2, {
      message: "New passwords do not match",
      path: ["new_password2"],
   })

export type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>

export const forgetPasswordFormSchema = changePasswordFormSchema

export type ForgetPasswordFormSchema = ChangePasswordFormSchema
