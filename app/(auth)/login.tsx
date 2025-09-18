import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Link, type RelativePathString, router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { type LoginFormSchema, loginFormSchema } from "@/utils/validation/login"

export default function LoginScreen() {
   const { colors } = useTheme()
   const { login } = useAuth()
   const [errorMessage, setErrorMessage] = useState<string | undefined>()

   const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<LoginFormSchema>({
      mode: "onChange",
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
         username: "",
         password: "",
      },
   })

   const onSubmit = async (data: LoginFormSchema) => {
      const result = await login(data)
      if (!result.success) {
         setErrorMessage(result.message)
         return
      }
      router.push("/(application)/(tabs)")
   }

   return (
      <ScrollView
         style={[styles.container, { backgroundColor: colors.background }]}
         contentContainerStyle={styles.scrollContent}
         showsVerticalScrollIndicator={false}
         keyboardShouldPersistTaps="handled"
      >
         <View style={styles.content}>
            <View style={styles.header}>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign In</Text>
            </View>

            <View style={styles.form}>
               <ErrorMessage message={errorMessage} />
               {/* 
          <GoogleSignInButton onPress={handleGoogleLogin} loading={isGoogleLoading} fullWidth />
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              or continue with email
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View> 
          */}

               <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                     Don&apos;t have an account?{" "}
                     <Link href="/(auth)/register" asChild>
                        <Text style={[styles.link, { color: colors.primary }]}>Sign up</Text>
                     </Link>
                  </Text>
               </View>

               <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                  <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                     or continue with
                  </Text>
                  <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
               </View>

               <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                     <TextInput
                        label="Username"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter your username"
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                        error={errors.username?.message}
                     />
                  )}
               />

               <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                     <TextInput
                        label="Password"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter your password"
                        secureTextEntry
                        error={errors.password?.message}
                     />
                  )}
               />

               <View style={styles.forgotPasswordContainer}>
                  <Link href={"/(auth)/forgot-password" as RelativePathString} asChild>
                     <Text style={{ color: "skyblue" }}>Forgot Password?</Text>
                  </Link>
               </View>

               <View style={styles.buttonContainer}>
                  <Button
                     title="Sign In"
                     onPress={handleSubmit(onSubmit)}
                     loading={isSubmitting}
                     fullWidth
                     size="large"
                  />
               </View>
            </View>
         </View>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   keyboardAvoidingView: {
      flex: 1,
   },
   container: {
      flex: 1,
   },
   scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
   },
   content: {
      padding: 24,
   },
   header: {
      alignItems: "center",
      marginBottom: 40,
   },
   title: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.bold,
      textAlign: "center",
      marginBottom: 8,
   },
   subtitle: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
   form: {
      gap: 24,
   },
   divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
   },
   dividerLine: {
      flex: 1,
      height: 1,
   },
   dividerText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      paddingHorizontal: 16,
   },
   buttonContainer: {
      marginTop: 8,
   },
   footer: {
      marginTop: 32,
      alignItems: "center",
   },
   footerText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
   link: {
      fontFamily: Fonts.medium,
      textDecorationLine: "underline",
   },
   forgotPasswordContainer: {
      alignSelf: "flex-end",
   },
})
