import { useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import Animated, {
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { useActiveLanguage } from "@/store/useLocaleStore"
import { Fonts, Motion, Radii, Spacing, Type, withAlpha } from "@/constants"
import { PressableScale } from "@/components/motion"
import { isContactPlan, planMoneyParts } from "@/utils/helpers/plans"
import { formatMoneyCompact, billingSuffix } from "@/utils/helpers/money"

import type { Plan } from "@/services/plans.service"

interface PlanSelectorProps {
   plans: Plan[]
   selectedId?: string
   currentId?: string | null
   onSelect: (plan: Plan) => void
}

/*
 * The tier switcher: a row of compact price cards, one tap each.
 *
 * This sits directly under the hero it controls, rather than at the bottom of
 * the page. The screen's premise is "pick one, read about it" — a selector
 * below the detail it drives means scrolling down to choose and back up to
 * read, with nothing on screen connecting the two.
 *
 * Horizontal rather than stacked: four tiers stacked push the detail a full
 * screen down, and the point of a compact row is seeing every price at once,
 * which is the comparison people make first.
 * **/
export function PlanSelector({ plans, selectedId, currentId, onSelect }: PlanSelectorProps) {
   return (
      <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         /*
          * `flexGrow: 0` — a horizontal ScrollView in a flex column otherwise
          * has no intrinsic height and splits the free space with whatever is
          * below it, stretching the cards. Same trap as the contracts chip row.
          * **/
         style={styles.row}
         contentContainerStyle={styles.rowContent}
      >
         {plans.map(plan => (
            <SelectorCard
               key={plan.id}
               plan={plan}
               selected={plan.id === selectedId}
               isCurrent={plan.id === currentId}
               onPress={() => onSelect(plan)}
            />
         ))}
      </ScrollView>
   )
}

/*
 * Extracted rather than inlined in the map: `useAnimatedStyle` is a hook, and a
 * hook called inside a render callback is a rules-of-hooks violation that only
 * misbehaves once the list length changes.
 * **/
function SelectorCard({
   plan,
   selected,
   isCurrent,
   onPress,
}: {
   plan: Plan
   selected: boolean
   isCurrent: boolean
   onPress: () => void
}) {
   const { colors } = useTheme()
   const language = useActiveLanguage()

   const contact = isContactPlan(plan)
   const money = contact ? null : formatMoneyCompact(planMoneyParts(plan), language)

   /*
    * A shared value driven from an effect, with the styles reading only that.
    *
    * Two tidier-looking versions did not work, both for the same underlying
    * reason — this project builds with the React Compiler
    * (`transform.reactCompiler`), which memoises the worklet closures, so a
    * style that reads `selected` straight from props never sees it change:
    *
    *   1. `useDerivedValue(() => withTiming(selected ? 1 : 0))` — re-evaluates
    *      per render and restarts the timing from wherever it had reached.
    *   2. `withTiming(selected ? a : b)` inside `useAnimatedStyle` — the
    *      closure is captured once, so the target colour never updates.
    *
    * Both left the previously selected card blue and the newly tapped one
    * stranded between the two border colours. A shared value mutated in an
    * effect always propagates to the UI thread, which is why this is the form
    * that holds.
    * **/
   const progress = useSharedValue(selected ? 1 : 0)

   useEffect(() => {
      progress.value = withTiming(selected ? 1 : 0, { duration: Motion.fast })
   }, [selected, progress])

   /*
    * Timing rather than a spring for the colours — a sprung colour overshoots
    * into a tint that is not in the palette on the way past. The lift is
    * sprung, because that one is motion rather than paint.
    * **/
   const cardStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.card, colors.primarySoft]),
      borderColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.primary]),
      transform: [{ translateY: withSpring(progress.value * -3, Motion.springQuick) }],
   }))

   const nameStyle = useAnimatedStyle(() => ({
      color: interpolateColor(progress.value, [0, 1], [colors.textSecondary, colors.primary]),
   }))

   return (
      /*
       * `radio`, not `button`: this is a single-select group, and that is what
       * lets a screen reader announce "2 of 4, selected" instead of four
       * unrelated buttons. `button` also drops `accessibilityState.selected` on
       * web, so the selected tier was not exposed to assistive tech at all.
       * **/
      <PressableScale
         onPress={onPress}
         style={styles.pressable}
         accessibilityRole="radio"
         accessibilityState={{ checked: selected }}
         accessibilityLabel={`${plan.display_name}${isCurrent ? ", your current plan" : ""}`}
      >
         <Animated.View style={[styles.card, cardStyle]}>
            <View style={styles.cardTop}>
               <Animated.Text numberOfLines={1} style={[styles.name, nameStyle]}>
                  {plan.display_name}
               </Animated.Text>

               {plan.is_featured && (
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
               )}
            </View>

            {contact ? (
               <Text style={[styles.contact, { color: colors.text }]}>Custom</Text>
            ) : (
               <View style={styles.priceRow}>
                  <Text style={[styles.symbol, { color: colors.textSecondary }]}>
                     {money?.symbol}
                  </Text>
                  <Text style={[styles.amount, { color: colors.text }]}>{money?.value}</Text>
                  <Text style={[styles.cycle, { color: colors.textMuted }]}>
                     {billingSuffix(plan.billing_cycle)}
                  </Text>
               </View>
            )}

            {isCurrent && (
               <View style={[styles.pill, { backgroundColor: withAlpha(colors.success, 0.14) }]}>
                  <Text style={[styles.pillText, { color: colors.success }]}>CURRENT</Text>
               </View>
            )}
         </Animated.View>
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   row: { flexGrow: 0 },
   rowContent: {
      paddingHorizontal: Spacing.lg,
      gap: Spacing.xs,
      /* Room for the selected card's lift, or it clips against the row edge. */
      paddingVertical: 6,
   },
   /*
    * A horizontal ScrollView row aligns `stretch`, so every card's pressable is
    * as tall as the tallest one — the Free card, which carries the extra
    * CURRENT pill. The visible card inside used to size to its own content
    * instead, which left a dead strip of pressable below the shorter tiers:
    * a tap in that strip hit the button but not the card anyone could see, and
    * the row looked ragged. `flex: 1` makes the visible card *be* the tap
    * target, and equal heights are what a price row should look like anyway.
    * **/
   pressable: { alignSelf: "stretch" },
   card: {
      flex: 1,
      minWidth: 108,
      borderRadius: Radii.md,
      borderWidth: 1.5,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      gap: 2,
   },
   cardTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
   },
   name: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
      flexShrink: 1,
   },
   /* "Most popular", without spending a whole badge on it in a 108pt card. */
   dot: {
      width: 5,
      height: 5,
      borderRadius: 3,
   },
   priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 1,
   },
   symbol: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
   amount: {
      ...Type.heading,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   cycle: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
   contact: {
      ...Type.heading,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   pill: {
      alignSelf: "flex-start",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: Radii.xs,
      marginTop: 2,
   },
   pillText: {
      ...Type.micro,
      fontFamily: Fonts.bold,
   },
})

export default PlanSelector
