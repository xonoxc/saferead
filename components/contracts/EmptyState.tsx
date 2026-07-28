import { View, Text, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { Button } from "@/components/Button"

import type { LucideIcon } from "lucide-react-native"

/*
 * The state a screen is in most often on day one.
 *
 * Two rules it follows, both learned from how the old screens read:
 *
 * 1. **An empty list is not a failure**, so nothing here is red or apologetic.
 *    The icon sits on a neutral tint, not an alert colour.
 * 2. **Say what to do, not what is absent.** "No contracts yet" describes the
 *    database; "Add your first contract to start tracking obligations"
 *    describes the next move. The `title` should still be short — the body
 *    carries the instruction.
 * **/

interface EmptyStateProps {
   icon: LucideIcon
   title: string
   body: string
   actionLabel?: string
   onAction?: () => void
   /* Use when the empty state is good news, e.g. nothing overdue. */
   tone?: "neutral" | "positive"
   compact?: boolean
}

export function EmptyState({
   icon: Icon,
   title,
   body,
   actionLabel,
   onAction,
   tone = "neutral",
   compact = false,
}: EmptyStateProps) {
   const { colors } = useTheme()

   const accent = tone === "positive" ? colors.success : colors.textMuted
   const tint = tone === "positive" ? colors.successBackground : colors.surface

   return (
      <View style={[styles.wrap, compact && styles.compactWrap]}>
         <View style={[styles.iconWrap, compact && styles.compactIcon, { backgroundColor: tint }]}>
            <Icon size={compact ? 18 : 24} color={accent} strokeWidth={2} />
         </View>

         <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
         <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>

         {actionLabel && onAction && (
            <View style={styles.action}>
               <Button title={actionLabel} onPress={onAction} size="small" variant="outline" />
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   wrap: {
      alignItems: "center",
      paddingVertical: Spacing.xxl,
      paddingHorizontal: Spacing.lg,
      gap: 6,
   },
   compactWrap: {
      paddingVertical: Spacing.lg,
   },
   iconWrap: {
      width: 48,
      height: 48,
      borderRadius: Radii.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.xs,
   },
   compactIcon: {
      width: 36,
      height: 36,
      borderRadius: Radii.sm,
   },
   title: {
      ...Type.body,
      fontFamily: Fonts.semiBold,
      textAlign: "center",
   },
   body: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      textAlign: "center",
      maxWidth: 300,
   },
   action: {
      marginTop: Spacing.sm,
   },
})

export default EmptyState
