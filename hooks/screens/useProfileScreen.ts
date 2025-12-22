import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"

import { useAuth } from "@/hooks/useAuth"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { profileSchema } from "@/utils/validation/profile"

import type { ProfileFormValues } from "@/utils/validation/profile"

export function useProfileScreen() {
   const { user, updateUser } = useAuth()
   const [isEditing, setIsEditing] = useState<boolean>(false)

   const alert = useDrawerAlert()

   const scale = useSharedValue(1)

   const startEditing = () => setIsEditing(true)
   const stopEditing = () => setIsEditing(false)

   const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
         firstName: user?.first_name ?? "",
         lastName: user?.last_name ?? "",
         email: user?.email ?? "",
         username: user?.username ?? "",
      },
   })

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
   }))

   const onSubmit = async (values: ProfileFormValues) => {
      const res = await attempt(() =>
         updateUser({
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            username: values.username,
         })
      )

      if (!res.ok) {
         alert({
            type: "error",
            title: "Error",
            message: getErrorMessage(res.error),
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      stopEditing()

      alert({
         title: "Success",
         message: "Profile updated successfully",
         actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
   }

   const handleAvatarPress = () => {
      if (!isEditing) return

      scale.value = withSpring(0.9, {}, () => {
         scale.value = withSpring(1)
      })

      alert({
         title: "Change Profile Photo",
         message: "Choose an option",
         actions: [
            { text: "Camera", style: "primary", onPress: () => {} },
            { text: "Library", style: "primary", onPress: () => {} },
            { text: "Cancel", style: "primary", onPress: () => {} },
         ],
      })
   }

   return {
      user,
      form,
      isEditing,
      startEditing,
      stopEditing,
      onSubmit,
      animatedStyle,
      handleAvatarPress,
   }
}
