import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { ArrowRight, Sparkles } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { usePlans } from "@/hooks/queries/plans"
import { useActiveLanguage } from "@/store/useLocaleStore"
import { Fonts, Radii, Spacing, Type, withAlpha } from "@/constants"
import { PressableScale } from "@/components/motion"
import { planHeadlinePrice } from "@/utils/helpers/plans"

import type { Plan } from "@/services/plans.service"

/*
 * "Your plan" in Settings — and the only route into pricing.
 *
 * Two things this must never do, both learned the hard way:
 *
 * 1. **Vanish.** The first version returned `null` whenever the plans request
 *    failed or came back without a paid tier. Since this is the sole entry
 *    point to `/premium`, a server hiccup silently deleted the entire upgrade
 *    path with nothing on screen to say so. It now always renders a tappable
 *    card; `/premium` has its own error state, so sending someone there when
 *    the fetch failed is strictly better than pretending pricing does not exist.
 *
 * 2. **Hide what you are on.** It only ever pitched an upgrade, so there was no
 *    way to see your current plan anywhere in the app. The plan name comes from
 *    `/auth/user/` and renders even when `/plans/` is unreachable.
 *
 * The tier pitched is whichever the admin marked `is_featured` — changing what
 * SafeRead pushes is a checkbox in Django, not a release.
 * **/
export function UpgradeCard() {
   const { colors } = useTheme()
   const { user } = useAuth()
   const language = useActiveLanguage()
   const { data, isLoading, isError } = usePlans()

   const plans = data?.results ?? []
   const currentName = user?.active_plan_name ?? null
   const currentPlan = plans.find(p => p.id === user?.active_plan) ?? null

   const featured = pickFeatured(plans, user?.active_plan ?? null)

   /* On the top tier already, or plans could not be loaded to compare against. */
   const canUpgrade = !!featured

   return (
      <PressableScale
         onPress={() => router.push("/premium")}
         accessibilityRole="button"
         accessibilityLabel={
            canUpgrade
               ? `Upgrade to ${featured.display_name}. Currently on ${currentName ?? "the free plan"}`
               : `View plans. Currently on ${currentName ?? "the free plan"}`
         }
         style={StyleSheet.flatten([
            styles.card,
            { backgroundColor: colors.primarySoft, borderColor: withAlpha(colors.primary, 0.22) },
         ])}
      >
         <View style={[styles.iconTile, { backgroundColor: withAlpha(colors.primary, 0.14) }]}>
            <Sparkles size={20} color={colors.primary} strokeWidth={2.2} />
         </View>

         <View style={styles.body}>
            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>YOUR PLAN</Text>

            <Text style={[styles.title, { color: colors.text }]}>
               {currentName ?? (currentPlan?.display_name || "Free")}
            </Text>

            {isLoading ? (
               <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.loader}
               />
            ) : (
               <Text numberOfLines={2} style={[styles.pitch, { color: colors.textSecondary }]}>
                  {pitchFor({ featured, isError, language })}
               </Text>
            )}
         </View>

         <ArrowRight size={18} color={colors.primary} strokeWidth={2.2} />
      </PressableScale>
   )
}

/*
 * What the card says under the plan name.
 *
 * The error branch is deliberately not an error message: this is a promotional
 * card in Settings, and "Failed to fetch plans" helps nobody. Pricing still
 * exists and the screen behind this tap can report the failure properly.
 * **/
function pitchFor({
   featured,
   isError,
   language,
}: {
   featured: Plan | null
   isError: boolean
   language?: string
}) {
   if (featured) {
      return `Upgrade to ${featured.display_name} — ${planHeadlinePrice(featured, language)}`
   }
   if (isError) return "See what each plan includes"
   return "You're on the top tier. See what's included"
}

/*
 * The tier worth pitching: the admin's featured choice, else the cheapest paid
 * one. Whatever the user is already on is excluded — offering someone an
 * "upgrade" to their current plan is the fastest way to look broken.
 * **/
function pickFeatured(plans: Plan[], currentPlanId: string | null): Plan | null {
   const candidates = plans.filter(p => p.plan_type !== "free" && p.id !== currentPlanId)
   if (candidates.length === 0) return null

   return (
      candidates.find(p => p.is_featured) ??
      [...candidates].sort((a, b) => Number(a.price) - Number(b.price))[0]
   )
}

const styles = StyleSheet.create({
   card: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.md,
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
   },
   iconTile: {
      width: 42,
      height: 42,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   body: { flex: 1, gap: 1 },
   eyebrow: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   title: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   pitch: {
      ...Type.caption,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
   loader: { alignSelf: "flex-start", marginTop: 4 },
})

export default UpgradeCard
