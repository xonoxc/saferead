import { useTheme } from "@/hooks/useTheme"
import { Fonts } from "@/constants/Fonts"
import { Radii, Spacing, Type } from "@/constants/Design"
import { View, Text, StyleSheet } from "react-native"

import type { LucideIcon } from "lucide-react-native"

interface StatCardProps {
   stat: {
      icon: LucideIcon
      title: string
      value: number
      color: string
      isPercentage?: boolean
   }
   style?: object
}

/*
 * A single metric tile.
 *
 * Reworked from centre-aligned to left-aligned, and the number now leads.
 *
 * The old layout stacked a 48px coloured circle above a centred number and
 * caption. On a two-up grid that put four large saturated discs at the top of
 * the home screen, which is the loudest thing on a page whose actual job is to
 * surface risk. Left-aligned rows scan in a straight line down the left edge,
 * the number is the largest element because the number is the point, and the
 * icon is demoted to a small square that tints rather than shouts.
 * **/
export default function HomeScreenStatCard({ stat, style }: StatCardProps) {
   const { colors } = useTheme()
   return (
      <View
         style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            style,
         ]}
      >
         <View style={[styles.statIcon, { backgroundColor: `${stat?.color}14` }]}>
            <stat.icon size={16} color={stat?.color} strokeWidth={2.2} />
         </View>
         <Text style={[styles.statValue, { color: colors.text }]}>
            {stat.value}
            {stat.isPercentage ? "%" : ""}
         </Text>
         <Text numberOfLines={2} style={[styles.statTitle, { color: colors.textSecondary }]}>
            {stat.title}
         </Text>
      </View>
   )
}

const styles = StyleSheet.create({
   statCard: {
      padding: Spacing.md,
      borderRadius: Radii.md,
      /* Hairline everywhere, in both themes: the border is what separates the
       * card from the surface now that the drop shadow barely registers. */
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: 2,
   },
   statIcon: {
      width: 28,
      height: 28,
      borderRadius: Radii.xs,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Spacing.xs,
   },
   statValue: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   statTitle: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
})
