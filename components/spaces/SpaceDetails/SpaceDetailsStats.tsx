import { View, Text, StyleSheet } from "react-native"
import { Fonts, FontSizes } from "@/constants"
import { Spacing, Radii, elevation, withAlpha } from "@/constants/Design"
import { FadeInView } from "@/components/motion"

import type { LucideIcon } from "lucide-react-native"
import type { ColorsType } from "@/hooks/useTheme"

interface SpaceDetailsStatsProps {
   stats: {
      icon: LucideIcon
      label: string
      value: number | undefined
      color: string | undefined
   }[]
   colors: ColorsType
}

/*
 * Stat cards sit on the theme surface with the space colour applied only as a
 * tint behind the icon.
 *
 * Filling the whole card with the space colour meant theme text was drawn over
 * an arbitrary hue - unreadable on the lighter palette entries like #FFEAA7.
 * **/
export default function SpaceDetailsStats({ stats, colors }: SpaceDetailsStatsProps) {
   return (
      <View style={styles.statsContainer}>
         {stats.map((stat, index) => {
            const accent = stat.color || colors.primary

            return (
               <FadeInView
                  key={`${stat.label}-${index}`}
                  index={index}
                  delay={80}
                  style={styles.statSlot}
               >
                  <View
                     style={[
                        styles.statCard,
                        {
                           backgroundColor: colors.card,
                           borderColor: colors.border,
                        },
                        elevation(colors, 1),
                     ]}
                  >
                     <View style={[styles.statIcon, { backgroundColor: withAlpha(accent, 0.14) }]}>
                        <stat.icon size={18} color={accent} />
                     </View>
                     <View style={styles.statText}>
                        <Text style={[styles.statValue, { color: colors.text }]}>
                           {stat.value ?? 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                           {stat.label}
                        </Text>
                     </View>
                  </View>
               </FadeInView>
            )
         })}
      </View>
   )
}

const styles = StyleSheet.create({
   statsContainer: {
      flexDirection: "row",
      paddingHorizontal: Spacing.md,
      gap: Spacing.sm,
      marginBottom: Spacing.md,
   },
   statSlot: {
      flex: 1,
   },
   statCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      borderRadius: Radii.md,
      padding: Spacing.sm,
      borderWidth: 1,
   },
   statIcon: {
      width: 36,
      height: 36,
      borderRadius: Radii.xs,
      justifyContent: "center",
      alignItems: "center",
   },
   statText: {
      flex: 1,
   },
   statValue: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
   statLabel: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
})
