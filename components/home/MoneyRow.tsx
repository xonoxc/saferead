import { View, Text, StyleSheet } from "react-native"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import { formatMoney } from "@/utils/helpers/dates"

import type { ObligationSummary } from "@/types/api/contracts.types"

/*
 * Money in both directions.
 *
 * These two figures are the reason the schema stores obligations as rows
 * rather than sentences: "what do we owe across every active agreement" is a
 * `SUM` over a column, and it is unanswerable if the same facts live inside
 * paragraphs of prose. Putting them on the home screen is the payoff.
 *
 * Both are *pending* totals — money still outstanding, not lifetime contract
 * value. A number that only ever grows is decoration; a number that goes down
 * when you pay an invoice is a number people check.
 * **/

interface MoneyRowProps {
   summary: ObligationSummary
   onPressOutgoing: () => void
   onPressIncoming: () => void
}

export function MoneyRow({ summary, onPressOutgoing, onPressIncoming }: MoneyRowProps) {
   return (
      <FadeInView delay={180} style={styles.row}>
         <MoneyCard
            label="We owe"
            amount={summary.we_owe_total}
            currency={summary.we_owe_currency}
            extraCurrencies={summary.we_owe_breakdown.length - 1}
            direction="out"
            onPress={onPressOutgoing}
         />
         <MoneyCard
            label="We're owed"
            amount={summary.they_owe_total}
            currency={summary.they_owe_currency}
            extraCurrencies={summary.they_owe_breakdown.length - 1}
            direction="in"
            onPress={onPressIncoming}
         />
      </FadeInView>
   )
}

function MoneyCard({
   label,
   amount,
   currency,
   extraCurrencies,
   direction,
   onPress,
}: {
   label: string
   amount: string
   currency: string
   /* How many other currencies sit behind this figure. */
   extraCurrencies: number
   direction: "in" | "out"
   onPress: () => void
}) {
   const { colors } = useTheme()

   const outbound = direction === "out"
   const Icon = outbound ? ArrowUpRight : ArrowDownLeft
   /*
    * Outgoing is not painted red. Owing a supplier is normal business, not a
    * risk finding, and spending the alarm colour here would devalue it on the
    * rows where something is actually wrong.
    * **/
   const accent = outbound ? colors.textSecondary : colors.success

   return (
      <PressableScale
         onPress={onPress}
         accessibilityRole="button"
         accessibilityLabel={`${label} ${formatMoney(amount, currency)}`}
         style={StyleSheet.flatten([
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
         ])}
      >
         <View style={styles.cardHead}>
            <Icon size={13} color={accent} strokeWidth={2.4} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
         </View>
         <Text numberOfLines={1} style={[styles.amount, { color: colors.text }]}>
            {formatMoney(amount, currency)}
         </Text>
         {/*
          * Say when the headline is only part of the picture. Silently showing
          * the largest currency would read as the whole total, which is the
          * same lie the old cross-currency SUM told, just prettier.
          * **/}
         {extraCurrencies > 0 && (
            <Text style={[styles.more, { color: colors.textMuted }]}>
               +{extraCurrencies} more {extraCurrencies === 1 ? "currency" : "currencies"}
            </Text>
         )}
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   row: {
      flexDirection: "row",
      gap: Spacing.xs,
   },
   card: {
      flex: 1,
      padding: Spacing.md,
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 4,
   },
   cardHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   label: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   amount: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   more: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
})

export default MoneyRow
