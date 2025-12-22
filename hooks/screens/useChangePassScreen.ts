import { useState } from "react"
import { useForm } from "react-hook-form"
import { apiClient } from "@/utils/apiclient"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { useAuth } from "@/hooks/useAuth"
import { router } from "expo-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDrawerAlert } from "../alerts/useAlert"

import {
   type ChangePasswordFormSchema,
   changePasswordFormSchema,
} from "@/utils/validation/change-password"

export default function useChangePassScreen() {
   const { logout } = useAuth()
   const [isSubmitting, setIsSubmitting] = useState(false)

   const showBottomAlert = useDrawerAlert()

   const {
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<ChangePasswordFormSchema>({
      mode: "onChange",
      resolver: zodResolver(changePasswordFormSchema),
      defaultValues: {
         new_password1: "",
         new_password2: "",
      },
   })

   const onSubmit = async (data: ChangePasswordFormSchema) => {
      setIsSubmitting(true)
      const result = await attempt(() => apiClient.post("/auth/password/change/", data))
      setIsSubmitting(false)

      if (!result.ok) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: getErrorMessage(result.error) || "Failed to change password",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      showBottomAlert({
         type: "success",
         title: "Success",
         message: "Your password has been changed successfully. Please sign in again.",
         actions: [
            {
               text: "OK",
               style: "primary",
               onPress: async () => {
                  await logout()
                  router.push("/(auth)/login")
               },
            },
         ],
      })
   }

   return {
      control,
      handleSubmit: handleSubmit(onSubmit),
      errors,
      isSubmitting,
   }
}
