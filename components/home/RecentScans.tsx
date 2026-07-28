import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { Check, Clock, FileText, X } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import { SectionHeader } from "@/components/contracts"
import { formatTimeAgo } from "@/utils/helpers/dates"

import type { AnalysisResponse } from "@/types/api/documents.types"

/*
 * Recent one-off scans, compacted to a single line each.
 *
 * Scans are the top of the funnel — how someone tries the product before they
 * have a portfolio — so they stay visible on the home screen. But they are no
 * longer the point of it, which is why this is a three-row list with a "See
 * all" rather than the grid of tiles that used to fill the screen.
 * **/

interface RecentScansProps {
   documents: AnalysisResponse[]
   isLoading: boolean
   onPressItem: (doc: AnalysisResponse) => void
   onSeeAll: () => void
}

export function RecentScans({ documents, isLoading, onPressItem, onSeeAll }: RecentScansProps) {
   const { colors } = useTheme()

   if (isLoading) {
      return <ActivityIndicator style={styles.loading} color={colors.textMuted} />
   }

   if (documents.length === 0) return null

   return (
      <FadeInView delay={280}>
         <SectionHeader title="Recent scans" actionLabel="See all" onAction={onSeeAll} />
         <View style={styles.stack}>
            {documents.slice(0, 3).map(doc => (
               <ScanRow key={doc.id} doc={doc} onPress={() => onPressItem(doc)} />
            ))}
         </View>
      </FadeInView>
   )
}

function ScanRow({ doc, onPress }: { doc: AnalysisResponse; onPress: () => void }) {
   const { colors } = useTheme()

   const status = {
      completed: { icon: Check, fg: colors.success, bg: colors.successBackground },
      failed: { icon: X, fg: colors.error, bg: colors.errorBackground },
      processing: { icon: Clock, fg: colors.info, bg: colors.infoBackground },
      pending: { icon: Clock, fg: colors.textMuted, bg: colors.surface },
   }[doc.status] ?? { icon: FileText, fg: colors.textMuted, bg: colors.surface }

   const riskCount = doc.risky_points?.length ?? 0

   return (
      <PressableScale
         onPress={onPress}
         accessibilityRole="button"
         accessibilityLabel={doc.original_filename}
         style={StyleSheet.flatten([
            styles.row,
            { backgroundColor: colors.card, borderColor: colors.border },
         ])}
      >
         <View style={[styles.icon, { backgroundColor: status.bg }]}>
            <status.icon size={13} color={status.fg} strokeWidth={2.4} />
         </View>

         <View style={styles.text}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
               {doc.original_filename}
            </Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
               {doc.status === "completed" && riskCount > 0
                  ? `${riskCount} risk${riskCount === 1 ? "" : "s"} flagged`
                  : doc.status === "completed"
                    ? "No risks flagged"
                    : doc.status === "failed"
                      ? "Analysis failed"
                      : "Analysing…"}
            </Text>
         </View>

         <Text style={[styles.time, { color: colors.textMuted }]}>
            {formatTimeAgo(doc.created_at)}
         </Text>
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   stack: { gap: Spacing.xxs },
   loading: { paddingVertical: Spacing.lg },
   row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
      borderWidth: StyleSheet.hairlineWidth,
   },
   icon: {
      width: 26,
      height: 26,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   text: { flex: 1, gap: 1 },
   name: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   meta: {
      ...Type.micro,
      fontFamily: Fonts.regular,
   },
   time: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
})

export default RecentScans
