import { View, Text, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"
import { PhoneCall } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import usePremiumScreen from "@/hooks/screens/usePremiumScreen"
import { Button, CustomBackBtn } from "@/components"
import { FadeInView } from "@/components/motion"
import { PlanSelector } from "@/components/plans/PlanSelector"
import { PlanDetail } from "@/components/plans/PlanDetail"
import { ContactSalesForm } from "@/components/plans/ContactSalesForm"
import { PlansLoadingState } from "@/components/plans/PlansLoadingState"
import { Plansfallback } from "@/components/plans/PlansFallback"
import { Fonts, Spacing, Type, TAB_BAR_CLEARANCE } from "@/constants"
import { isContactPlan } from "@/utils/helpers/plans"

/*
 * Pricing: pick a tier, read everything about it.
 *
 * Two rewrites' worth of history is worth keeping. The original was hardcoded
 * to a dark background with gold accents and a teal tick — none from the
 * palette, unreadable in light mode — and hardcoded which eleven features to
 * list, so a tier's real limits and its advertised ones were separate sources
 * of truth. The replacement fixed both but flattened the layout into a list of
 * cards, which lost the thing that actually worked: one tier at a time, in
 * depth, with a selector to switch between them.
 *
 * So this restores that shape — selector on top, full detail below — on the
 * server-owned data. `/plans/` gives the tiers, `/plans/features/` gives the
 * catalogue the detail panel renders from, and neither is baked in here.
 * **/
export default function PremiumScreen() {
   const { colors } = useTheme()

   const {
      plans,
      sections,
      isLoading,
      error,
      selectedPlan,
      selectPlan,
      isCurrent,
      currentPlanId,
      contactPlan,
      openContact,
      closeContact,
   } = usePremiumScreen()

   if (isLoading) return <PlansLoadingState />
   if (error || !plans.length) return <Plansfallback />

   const showCta = selectedPlan && !isCurrent(selectedPlan) && selectedPlan.plan_type !== "free"

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.header}>
            <CustomBackBtn onPress={() => router.back()} />
         </View>

         <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_CLEARANCE }]}
         >
            <FadeInView delay={60} style={styles.hero}>
               <Text style={[styles.eyebrow, { color: colors.textMuted }]}>PLANS</Text>
               <Text style={[styles.title, { color: colors.text }]}>
                  Know what you&apos;re signing
               </Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Every tier reads the same contracts. What changes is how many, and how much of
                  the work SafeRead does for you.
               </Text>
            </FadeInView>

            <FadeInView delay={120}>
               <PlanSelector
                  plans={plans}
                  selectedId={selectedPlan?.id}
                  currentId={currentPlanId}
                  onSelect={selectPlan}
               />
            </FadeInView>

            <View style={styles.detail}>
               {selectedPlan && <PlanDetail plan={selectedPlan} sections={sections} />}
            </View>

            {showCta && (
               /*
                * Keyed on the plan so the call to action re-enters with the
                * detail above it. Without the key the label swaps in place
                * while everything around it fades, which reads as a glitch.
                * **/
               <FadeInView key={selectedPlan.id} delay={240} style={styles.cta}>
                  {isContactPlan(selectedPlan) ? (
                     <>
                        <Button
                           title={`Contact sales about ${selectedPlan.display_name}`}
                           onPress={() => openContact(selectedPlan)}
                           fullWidth
                        />
                        <View style={styles.ctaNote}>
                           <PhoneCall size={13} color={colors.textMuted} strokeWidth={2.2} />
                           <Text style={[styles.ctaNoteText, { color: colors.textMuted }]}>
                              No card, no checkout. We agree a price with you on a call.
                           </Text>
                        </View>
                     </>
                  ) : (
                     <>
                        <Button
                           title={`Upgrade to ${selectedPlan.display_name}`}
                           onPress={() => {}}
                           fullWidth
                        />
                        <Text style={[styles.ctaNoteText, { color: colors.textMuted }]}>
                           Renews {selectedPlan.billing_cycle} until cancelled
                           {selectedPlan.display_is_estimated
                              ? ` · charged in ${selectedPlan.currency}`
                              : ""}
                           .
                        </Text>
                     </>
                  )}
               </FadeInView>
            )}
         </ScrollView>

         {contactPlan && <ContactSalesForm plan={contactPlan} onClose={closeContact} />}
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   header: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.xs,
   },
   scroll: { flex: 1 },
   /*
    * No horizontal padding here — the selector row bleeds to the screen edge so
    * its last card can sit half-off, which is what tells you it scrolls. Every
    * other block sets its own gutter.
    * **/
   content: { gap: Spacing.md },
   hero: { gap: 2, paddingHorizontal: Spacing.lg },
   eyebrow: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   subtitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      marginTop: Spacing.xxs,
   },
   detail: { paddingHorizontal: Spacing.lg },
   cta: { gap: Spacing.xs, paddingHorizontal: Spacing.lg },
   ctaNote: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xxs,
   },
   ctaNoteText: {
      ...Type.caption,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
})
