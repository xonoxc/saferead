import { View, Text, StyleSheet } from "react-native"
import { CheckCircle2, ChevronRight, TriangleAlert } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"

/*
 * The one thing the home screen exists to answer: *is anything on fire?*
 *
 * The old home led with "Total documents / Completed / Failed / Avg
 * confidence" — four numbers about how much work the tool had done. Nobody
 * opens an app to learn its average confidence score. This replaces them with
 * a single count of things that need a human, built from three sources that
 * are individually small but collectively the whole job: overdue obligations,
 * deadlines whose notice window is closing, and critical clauses nobody has
 * looked at.
 *
 * The zero state is a deliberate reward rather than an empty box. "You're all
 * caught up" is the thing a business owner wants to be told, and a screen that
 * only ever shows problems trains people to dread opening it.
 * **/

export interface AttentionItem {
   label: string
   count: number
   onPress: () => void
}

interface AttentionHeroProps {
   items: AttentionItem[]
   onPressPrimary?: () => void
}

export function AttentionHero({ items, onPressPrimary }: AttentionHeroProps) {
   const { colors } = useTheme()

   const live = items.filter(i => i.count > 0)
   const total = live.reduce((sum, i) => sum + i.count, 0)
   const clear = total === 0

   /*
    * Severity is driven by count, not by category. Any single overdue thing is
    * worth a warning colour; five or more means the pile has stopped being a
    * to-do list and started being a problem.
    * **/
   const tone = clear
      ? { fg: colors.success, bg: colors.successBackground }
      : total >= 5
        ? { fg: colors.riskCritical, bg: colors.riskCriticalBackground }
        : { fg: colors.riskHigh, bg: colors.riskHighBackground }

   return (
      <FadeInView delay={140}
         style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
         <View style={styles.head}>
            <View style={[styles.icon, { backgroundColor: tone.bg }]}>
               {clear ? (
                  <CheckCircle2 size={20} color={tone.fg} strokeWidth={2.2} />
               ) : (
                  <TriangleAlert size={20} color={tone.fg} strokeWidth={2.2} />
               )}
            </View>

            <View style={styles.headText}>
               {clear ? (
                  <>
                     <Text style={[styles.title, { color: colors.text }]}>All caught up</Text>
                     <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Nothing is overdue and no deadline is closing in.
                     </Text>
                  </>
               ) : (
                  <>
                     <Text style={[styles.count, { color: tone.fg }]}>{total}</Text>
                     <Text style={[styles.title, { color: colors.text }]}>
                        {total === 1 ? "thing needs you" : "things need you"}
                     </Text>
                  </>
               )}
            </View>
         </View>

         {live.length > 0 && (
            <View style={[styles.breakdown, { borderTopColor: colors.border }]}>
               {live.map(item => (
                  <PressableScale
                     key={item.label}
                     onPress={item.onPress}
                     accessibilityRole="button"
                     accessibilityLabel={`${item.count} ${item.label}`}
                     style={styles.line}
                  >
                     <View style={[styles.dot, { backgroundColor: tone.fg }]} />
                     <Text style={[styles.lineText, { color: colors.text }]}>
                        <Text style={{ fontFamily: Fonts.semiBold }}>{item.count}</Text>{" "}
                        {item.label}
                     </Text>
                     <ChevronRight size={14} color={colors.textMuted} strokeWidth={2.2} />
                  </PressableScale>
               ))}
            </View>
         )}

         {clear && onPressPrimary && (
            <PressableScale
               onPress={onPressPrimary}
               accessibilityRole="button"
               style={StyleSheet.flatten([
                  styles.clearAction,
                  { borderTopColor: colors.border },
               ])}
            >
               <Text style={[styles.clearActionText, { color: colors.primary }]}>
                  Review the portfolio
               </Text>
               <ChevronRight size={14} color={colors.primary} strokeWidth={2.4} />
            </PressableScale>
         )}
      </FadeInView>
   )
}

const styles = StyleSheet.create({
   card: {
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: "hidden",
   },
   head: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.md,
   },
   icon: {
      width: 42,
      height: 42,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   headText: {
      flex: 1,
      /* Baseline-ish alignment for the big number sitting above its label. */
      gap: 0,
   },
   count: {
      ...Type.display,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   title: {
      ...Type.body,
      fontFamily: Fonts.semiBold,
   },
   subtitle: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   breakdown: {
      borderTopWidth: StyleSheet.hairlineWidth,
   },
   line: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.md,
      paddingVertical: 11,
   },
   dot: {
      width: 5,
      height: 5,
      borderRadius: 999,
   },
   lineText: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      flex: 1,
   },
   clearAction: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingVertical: Spacing.sm,
   },
   clearActionText: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
})

export default AttentionHero
