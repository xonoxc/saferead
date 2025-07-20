import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Controller } from "react-hook-form"
import { TextInput, Button, ModalLoadingSpinner } from "@/components/"
import { Fonts, FontSizes } from "@/constants"
import { SafeAreaView } from "react-native-safe-area-context"
import useChangePassScreen from "@/hooks/screens/useChangePassScreen"

export default function ChangePasswordScreen() {
  const { colors } = useTheme()
  const { isSubmitting, errors, control, handleSubmit } = useChangePassScreen()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ModalLoadingSpinner visible={isSubmitting} message="Changing password..." />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.form}>
            <Controller
              control={control}
              name="new_password1"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="New Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your new password"
                  secureTextEntry
                  error={errors.new_password1?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="new_password2"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Confirm New Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Confirm your new password"
                  secureTextEntry
                  error={errors.new_password2?.message}
                />
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Change Password"
                onPress={handleSubmit}
                loading={isSubmitting}
                fullWidth
                size="large"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  form: {
    gap: 24,
  },
  buttonContainer: {
    marginTop: 8,
  },
})
