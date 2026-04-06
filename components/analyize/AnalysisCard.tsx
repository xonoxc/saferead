import { View, Text, StyleSheet, Pressable } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"
import { Check, X, FileText, Clock, ChevronRight, Share2, Download, Eye } from "lucide-react-native"

import { Fonts, FontSizes } from "@/constants"
import type { ColorsType } from "@/hooks/useTheme"
import type { AnalysisResponse } from "@/types/api/documents.types"

interface AnalysisCardProps {
   document: AnalysisResponse
   onPress: () => void
   colors: ColorsType
   index: number
}

export function AnalysisCard({ document, onPress, colors, index }: AnalysisCardProps) {
   const statusConfig = getStatusConfig(document.status, colors)
   const confidencePercent = Math.round(document.confidence_score * 100)

   const getRelativeTime = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
   }

   const getDocTypeLabel = (type: string) => {
      const types: Record<string, string> = {
         terms: "Terms",
         privacy: "Privacy",
         legal: "Legal",
         other: "Other",
      }
      return types[type] || type
   }

   return (
      <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
         <Pressable
            onPress={onPress}
            style={({ pressed }) => [
               styles.card,
               {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
               },
            ]}
         >
            <View style={styles.cardHeader}>
               <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                  <statusConfig.icon size={12} color={statusConfig.color} />
               </View>
               <View style={styles.headerInfo}>
                  <Text style={[styles.docName, { color: colors.text }]} numberOfLines={1}>
                     {document.original_filename}
                  </Text>
                  <Text style={[styles.docMeta, { color: colors.textSecondary }]}>
                     {getDocTypeLabel(document.document_type)} ·{" "}
                     {getRelativeTime(document.created_at)}
                  </Text>
               </View>
               <ChevronRight size={18} color={colors.textMuted} />
            </View>

            <View style={styles.confidenceSection}>
               <View style={styles.confidenceHeader}>
                  <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                     Confidence
                  </Text>
                  <Text style={[styles.confidenceValue, { color: statusConfig.color }]}>
                     {confidencePercent}%
                  </Text>
               </View>
               <View style={[styles.confidenceBar, { backgroundColor: colors.surface }]}>
                  <View
                     style={[
                        styles.confidenceFill,
                        {
                           width: `${confidencePercent}%`,
                           backgroundColor: getConfidenceColor(confidencePercent, colors),
                        },
                     ]}
                  />
               </View>
            </View>

            <View style={styles.actions}>
               <Pressable
                  style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                  onPress={e => e.stopPropagation()}
               >
                  <Eye size={14} color={colors.textSecondary} />
                  <Text style={[styles.actionText, { color: colors.textSecondary }]}>View</Text>
               </Pressable>
               <Pressable
                  style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                  onPress={e => e.stopPropagation()}
               >
                  <Download size={14} color={colors.textSecondary} />
                  <Text style={[styles.actionText, { color: colors.textSecondary }]}>Export</Text>
               </Pressable>
               <Pressable
                  style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                  onPress={e => e.stopPropagation()}
               >
                  <Share2 size={14} color={colors.textSecondary} />
                  <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
               </Pressable>
            </View>
         </Pressable>
      </Animated.View>
   )
}

function getStatusConfig(status: string, colors: ColorsType) {
   switch (status) {
      case "completed":
         return {
            icon: Check,
            color: colors.success,
            bgColor: colors.success + "20",
            label: "Completed",
         }
      case "processing":
         return {
            icon: Clock,
            color: colors.warning,
            bgColor: colors.warning + "20",
            label: "Processing",
         }
      case "failed":
         return {
            icon: X,
            color: colors.error,
            bgColor: colors.error + "20",
            label: "Failed",
         }
      default:
         return {
            icon: FileText,
            color: colors.textMuted,
            bgColor: colors.surface,
            label: "Pending",
         }
   }
}

function getConfidenceColor(percent: number, colors: ColorsType): string {
   if (percent >= 80) return colors.success
   if (percent >= 60) return colors.warning
   if (percent >= 40) return colors.error
   return colors.textMuted
}

const styles = StyleSheet.create({
   card: {
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      marginBottom: 12,
   },
   cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
   },
   statusBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
   },
   headerInfo: {
      flex: 1,
   },
   docName: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
   },
   docMeta: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
   confidenceSection: {
      marginBottom: 12,
   },
   confidenceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
   },
   confidenceLabel: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
   confidenceValue: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
   },
   confidenceBar: {
      height: 4,
      borderRadius: 2,
      overflow: "hidden",
   },
   confidenceFill: {
      height: "100%",
      borderRadius: 2,
   },
   actions: {
      flexDirection: "row",
      gap: 8,
   },
   actionBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingVertical: 8,
      borderRadius: 10,
   },
   actionText: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.medium,
   },
})
