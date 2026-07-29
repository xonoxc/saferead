import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PhoneCall } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useCreateSalesEnquiry } from "@/hooks/queries/plans"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"
import { Button, TextInput } from "@/components"
import { Drawer } from "@/components/Drawer"
import { Fonts, Radii, Spacing, Type, withAlpha } from "@/constants"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { salesEnquirySchema, type SalesEnquiryForm } from "@/utils/validation/enquiry"

import type { Plan } from "@/services/plans.service"

interface ContactSalesFormProps {
   plan: Plan
   onClose: () => void
}

/*
 * The end of the enterprise flow.
 *
 * An enterprise tier has no list price, so there is no "buy" to complete — the
 * honest end of the journey is a request for a conversation. This posts one
 * into the admin's follow-up queue rather than pretending a checkout exists.
 * **/
export function ContactSalesForm({ plan, onClose }: ContactSalesFormProps) {
   const { colors } = useTheme()
   const { user } = useAuth()
   const showBottomAlert = useDrawerAlert()
   const { mutateAsync: submitEnquiry, isPending } = useCreateSalesEnquiry()

   const {
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<SalesEnquiryForm>({
      resolver: zodResolver(salesEnquirySchema),
      defaultValues: {
         /* Prefilled from the account: it is the same person, so asking twice
          * is friction with no payoff. Still editable — a work address is often
          * not the one they signed up with. */
         full_name: user?.username ?? "",
         work_email: user?.email ?? "",
         phone: "",
         company: "",
         team_size: "",
         message: "",
      },
   })

   const onSubmit = async (data: SalesEnquiryForm) => {
      const resp = await attempt(() => submitEnquiry({ ...data, plan: plan.id }))

      if (!resp.ok) {
         showBottomAlert({
            type: "error",
            title: "Could not send",
            message: getErrorMessage(resp.error) || "Please try again in a moment.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      onClose()
      showBottomAlert({
         type: "success",
         title: "We'll be in touch",
         message:
            "Your request is with our team. Expect a call or an email within one business day.",
         actions: [{ text: "Done", style: "primary", onPress: () => {} }],
      })
   }

   return (
      <Drawer enableAbsolute visible scrollable={false}>
         <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
               <Text style={[styles.title, { color: colors.text }]}>Talk to us</Text>
               <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button">
                  <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
               </Pressable>
            </View>

            <ScrollView
               style={styles.body}
               showsVerticalScrollIndicator={false}
               keyboardShouldPersistTaps="handled"
               contentContainerStyle={styles.bodyContent}
            >
               <View style={[styles.note, { backgroundColor: withAlpha(colors.primary, 0.08) }]}>
                  <PhoneCall size={16} color={colors.primary} strokeWidth={2.2} />
                  <Text style={[styles.noteText, { color: colors.textSecondary }]}>
                     {plan.display_name} is priced per organisation. Tell us a little about yours
                     and we will come back with a number.
                  </Text>
               </View>

               <Field
                  control={control}
                  name="full_name"
                  label="Your name"
                  placeholder="Jordan Ellis"
                  error={errors.full_name?.message}
               />
               <Field
                  control={control}
                  name="work_email"
                  label="Work email"
                  placeholder="jordan@company.com"
                  error={errors.work_email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
               />
               <Field
                  control={control}
                  name="phone"
                  label="Phone (optional)"
                  placeholder="+44 7700 900000"
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
               />
               <Field
                  control={control}
                  name="company"
                  label="Company (optional)"
                  placeholder="Ellis & Co"
                  error={errors.company?.message}
               />
               <Field
                  control={control}
                  name="team_size"
                  label="Team size (optional)"
                  placeholder="10-25"
                  error={errors.team_size?.message}
               />
               <Field
                  control={control}
                  name="message"
                  label="Anything we should know? (optional)"
                  placeholder="What you need SafeRead to do"
                  error={errors.message?.message}
                  multiline
                  numberOfLines={4}
               />
            </ScrollView>

            <View style={styles.footer}>
               <Button
                  title={isPending ? "Sending…" : "Request a call"}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                  loading={isPending}
                  fullWidth
               />
            </View>
         </View>
      </Drawer>
   )
}

/* One controlled input. Extracted only because there are six of them. */
function Field({
   control,
   name,
   label,
   error,
   ...rest
}: {
   control: any
   name: keyof SalesEnquiryForm
   label: string
   error?: string
} & React.ComponentProps<typeof TextInput>) {
   return (
      <Controller
         control={control}
         name={name}
         render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
               label={label}
               error={error}
               value={value ?? ""}
               onChangeText={onChange}
               onBlur={onBlur}
               {...rest}
            />
         )}
      />
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: Spacing.md,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.lg,
   },
   title: {
      ...Type.heading,
      fontFamily: Fonts.bold,
   },
   cancel: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   body: { flex: 1 },
   bodyContent: { gap: Spacing.sm, paddingBottom: Spacing.lg },
   note: {
      flexDirection: "row",
      gap: Spacing.xs,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
      marginBottom: Spacing.xs,
   },
   noteText: {
      flex: 1,
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   footer: {
      paddingVertical: Spacing.lg,
      paddingBottom: Spacing.xxl,
   },
})

export default ContactSalesForm
