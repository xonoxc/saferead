import { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Building2, Users, CalendarClock, ShieldCheck } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useCreateOrganization } from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type, TAB_BAR_CLEARANCE } from "@/constants"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"

/*
 * The first-run gate for everything contract-related.
 *
 * Contracts are scoped to an organisation, not a user, and that is a
 * deliberate structural choice rather than an implementation detail: a
 * business's agreements outlive whoever uploaded them, and the whole
 * multi-seat model depends on there being a container to invite people into.
 *
 * So rather than hiding the feature until some other flow happens to create an
 * org, this screen asks for the one thing needed and explains *why* three
 * capabilities are worth the extra step. The pitch is concrete — deadlines,
 * shared ownership, missing protections — because "create a workspace" on its
 * own reads as bureaucracy.
 * **/
export function OrgSetupPrompt() {
   const { colors } = useTheme()
   const [name, setName] = useState("")
   const [error, setError] = useState<string | undefined>()
   const { mutateAsync, isPending } = useCreateOrganization()

   const onCreate = async () => {
      const trimmed = name.trim()
      if (!trimmed) {
         setError("Give your workspace a name first.")
         return
      }

      setError(undefined)
      const result = await attempt(() => mutateAsync({ name: trimmed }))

      if (!result.ok) {
         setError(getErrorMessage(result.error))
      }
      /* Success needs no navigation: `useCurrentOrg` invalidates and the
       * calling screen re-renders into its real content. */
   }

   return (
      <ScrollView
         style={{ flex: 1, backgroundColor: colors.background }}
         contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_CLEARANCE }]}
         keyboardShouldPersistTaps="handled"
         showsVerticalScrollIndicator={false}
      >
         <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
            <Building2 size={26} color={colors.primary} strokeWidth={2} />
         </View>

         <Text style={[styles.title, { color: colors.text }]}>Set up your workspace</Text>
         <Text style={[styles.body, { color: colors.textSecondary }]}>
            Contracts belong to a business, not a person. Name yours and SafeRead starts
            tracking what you have signed.
         </Text>

         <View style={styles.benefits}>
            <Benefit
               icon={CalendarClock}
               title="Never miss a renewal"
               body="Auto-renewals and notice deadlines become dated alerts, counted back from the day you actually have to act."
            />
            <Benefit
               icon={ShieldCheck}
               title="Find what is missing"
               body="Search your portfolio for agreements with no liability cap — the question a pile of PDFs cannot answer."
            />
            <Benefit
               icon={Users}
               title="Share the load"
               body="Assign obligations to colleagues so a deadline is someone's job rather than everyone's problem."
            />
         </View>

         <View style={styles.form}>
            <ErrorMessage message={error} />
            <TextInput
               label="Workspace name"
               value={name}
               onChangeText={setName}
               placeholder="Acme Industrial Supply"
               autoCapitalize="words"
               autoCorrect={false}
               returnKeyType="done"
               onSubmitEditing={onCreate}
            />
            <Button
               title="Create workspace"
               onPress={onCreate}
               loading={isPending}
               fullWidth
               size="large"
            />
         </View>
      </ScrollView>
   )
}

function Benefit({
   icon: Icon,
   title,
   body,
}: {
   icon: typeof Building2
   title: string
   body: string
}) {
   const { colors } = useTheme()

   return (
      <View style={styles.benefit}>
         <View style={[styles.benefitIcon, { backgroundColor: colors.surface }]}>
            <Icon size={15} color={colors.textSecondary} strokeWidth={2.2} />
         </View>
         <View style={styles.benefitText}>
            <Text style={[styles.benefitTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.benefitBody, { color: colors.textSecondary }]}>{body}</Text>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   content: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      gap: Spacing.xs,
   },
   iconWrap: {
      width: 52,
      height: 52,
      borderRadius: Radii.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.xs,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
   },
   body: {
      ...Type.body,
      fontFamily: Fonts.regular,
      marginBottom: Spacing.md,
   },
   benefits: {
      gap: Spacing.md,
      marginBottom: Spacing.xl,
   },
   benefit: {
      flexDirection: "row",
      gap: Spacing.sm,
      alignItems: "flex-start",
   },
   benefitIcon: {
      width: 30,
      height: 30,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   benefitText: { flex: 1, gap: 2 },
   benefitTitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   benefitBody: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   form: {
      gap: Spacing.sm,
   },
})

export default OrgSetupPrompt
