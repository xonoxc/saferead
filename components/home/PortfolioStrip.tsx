import { View, Text, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"

import type { OrgStats } from "@/types/api/contracts.types"

/*
 * Portfolio size, in one line.
 *
 * These are the numbers the old home screen would have made into four large
 * tiles. They are demoted to a single strip on purpose: how many contracts you
 * have is context, not a call to action, and context belongs below the fold of
 * attention. Seats sits alongside them because an org of one is the shape most
 * likely to churn, and seeing "1 seat" next to "23 contracts" is a quiet
 * argument for inviting somebody.
 * **/

interface PortfolioStripProps {
   stats: OrgStats
   onPressContracts: () => void
   onPressSeats: () => void
}

export function PortfolioStrip({ stats, onPressContracts, onPressSeats }: PortfolioStripProps) {
   const { colors } = useTheme()

   return (
      <FadeInView delay={160}
         style={[styles.strip, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
         <Cell
            value={stats.contract_count}
            label={stats.contract_count === 1 ? "contract" : "contracts"}
            onPress={onPressContracts}
         />
         <Divider />
         <Cell
            value={stats.counterparty_count}
            label={stats.counterparty_count === 1 ? "party" : "parties"}
         />
         <Divider />
         <Cell
            value={stats.seat_count}
            label={stats.seat_count === 1 ? "seat" : "seats"}
            onPress={onPressSeats}
            /* The nudge only makes sense while the org really is one person. */
            hint={stats.seat_count === 1 ? "Invite" : undefined}
         />
      </FadeInView>
   )
}

function Cell({
   value,
   label,
   onPress,
   hint,
}: {
   value: number
   label: string
   onPress?: () => void
   hint?: string
}) {
   const { colors } = useTheme()

   const body = (
      <>
         <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
         <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
         {hint ? <Text style={[styles.hint, { color: colors.primary }]}>{hint}</Text> : null}
      </>
   )

   if (!onPress) return <View style={styles.cell}>{body}</View>

   return (
      <PressableScale
         onPress={onPress}
         accessibilityRole="button"
         accessibilityLabel={`${value} ${label}`}
         style={styles.cell}
      >
         {body}
      </PressableScale>
   )
}

function Divider() {
   const { colors } = useTheme()
   return <View style={[styles.divider, { backgroundColor: colors.border }]} />
}

const styles = StyleSheet.create({
   strip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: Radii.sm,
      borderWidth: StyleSheet.hairlineWidth,
      paddingVertical: Spacing.sm,
   },
   cell: {
      flex: 1,
      alignItems: "center",
      gap: 1,
   },
   divider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: "stretch",
      marginVertical: 2,
   },
   value: {
      ...Type.heading,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   label: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
   hint: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
      marginTop: 1,
   },
})

export default PortfolioStrip
