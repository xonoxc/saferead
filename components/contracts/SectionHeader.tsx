import { View, Text, StyleSheet } from "react-native"
import { ChevronRight } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Spacing, Type } from "@/constants"
import { PressableScale } from "@/components/motion"

/*
 * A labelled band above a list.
 *
 * The count sits next to the title rather than at the far right so the two
 * read as one phrase ("Needs attention · 4"). Pushed apart they scan as two
 * unrelated facts, and the eye has to travel the width of the screen to
 * connect them.
 * **/

interface SectionHeaderProps {
   title: string
   count?: number
   actionLabel?: string
   onAction?: () => void
}

export function SectionHeader({ title, count, actionLabel, onAction }: SectionHeaderProps) {
   const { colors } = useTheme()

   return (
      <View style={styles.row}>
         <View style={styles.titleGroup}>
            <Text style={[styles.title, { color: colors.textMuted }]}>{title.toUpperCase()}</Text>
            {count !== undefined && count > 0 && (
               <View style={[styles.countPill, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.count, { color: colors.textSecondary }]}>{count}</Text>
               </View>
            )}
         </View>

         {onAction && actionLabel && (
            <PressableScale
               onPress={onAction}
               accessibilityRole="button"
               hitSlop={8}
               style={styles.action}
            >
               <Text style={[styles.actionText, { color: colors.primary }]}>{actionLabel}</Text>
               <ChevronRight size={13} color={colors.primary} strokeWidth={2.4} />
            </PressableScale>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
   },
   titleGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
   },
   title: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   countPill: {
      minWidth: 18,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 999,
      alignItems: "center",
   },
   count: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
   action: {
      flexDirection: "row",
      alignItems: "center",
      gap: 1,
   },
   actionText: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
})

export default SectionHeader
