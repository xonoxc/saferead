import { View, StyleSheet } from "react-native"
import { Controller, type UseFormReturn } from "react-hook-form"

import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"

import type { ProfileFormValues } from "@/utils/validation/profile"

interface ProfileFormProps {
   form: UseFormReturn<ProfileFormValues>
   onSubmit: (values: ProfileFormValues) => void
   isEditing: boolean
}

export function ProfileForm({ form, onSubmit, isEditing }: ProfileFormProps) {
   const { control, handleSubmit, formState } = form

   return (
      <View style={styles.container}>
         <View style={styles.nameContainer}>
            <Controller
               control={control}
               name="firstName"
               render={({ field, fieldState }) => (
                  <TextInput
                     label="First Name"
                     value={field.value}
                     onChangeText={field.onChange}
                     error={fieldState.error?.message}
                  />
               )}
            />

            <Controller
               control={control}
               name="lastName"
               render={({ field, fieldState }) => (
                  <TextInput
                     label="Last Name"
                     value={field.value}
                     onChangeText={field.onChange}
                     error={fieldState.error?.message}
                  />
               )}
            />
         </View>

         <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
               <TextInput
                  label="Email"
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
               />
            )}
         />

         <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
               <TextInput
                  label="Username"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
               />
            )}
         />

         {isEditing && (
            <Button
               title="Save Changes"
               onPress={handleSubmit(onSubmit)}
               loading={formState.isSubmitting}
               fullWidth
            />
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      padding: 16,
      gap: 12,
   },
   nameContainer: {
      flexDirection: "row",
      gap: 12,
   },
})
