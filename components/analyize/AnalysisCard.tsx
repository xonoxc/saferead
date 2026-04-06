import React, { useEffect } from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import Animated, {
   FadeInRight,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from "react-native-reanimated"
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function AnalysisCard({ document, onPress, colors, index }: AnalysisCardProps) {
   const statusConfig = getStatusConfig(document.status, colors, document.confidence_score)
   const confidencePercent = Math.round(document.confidence_score * 100)

   const progressAnim = useSharedValue(0)

   React.useEffect(() => {
      progressAnim.value = withTiming(confidencePercent, { duration: 800 })
   }, [confidencePercent, progressAnim])

   const progressStyle = useAnimatedStyle(() => ({
      width: `${progressAnim.value}%`,
   }))

   const scaleAnim = useSharedValue(1)

   const handlePressIn = () => {
      scaleAnim.value = withSpring(0.97, { damping: 15, stiffness: 300 })
   }

   const handlePressOut = () => {
      scaleAnim.value = withSpring(1, { damping: 15, stiffness: 300 })
   }

   const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
   }))

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
      <Animated.View
         entering={FadeInRight.delay(index * 60)
            .springify()
            .damping(15)}
      >
         <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
               styles.card,
               cardAnimatedStyle,
               {
                  backgroundColor: colors.card,
                  borderColor: "rgba(255, 255, 255, 0.06)",
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
                  <Animated.View style={[styles.confidenceFill, progressStyle]} />
               </View>
            </View>

            <View style={styles.actions}>
               <Pressable
                  style={({ pressed }) => [
                     styles.actionBtn,
                     styles.actionPrimary,
                     {
                        backgroundColor: pressed
                           ? colors.primaryFaded
                           : "rgba(255, 255, 255, 0.08)",
                        borderColor: pressed ? colors.primary : "rgba(255, 255, 255, 0.04)",
                     },
                  ]}
                  onPress={e => e.stopPropagation()}
               >
                  <Eye size={14} color={colors.text} />
                  <Text style={[styles.actionText, { color: colors.text }]}>View</Text>
               </Pressable>
               <Pressable
                  style={({ pressed }) => [
                     styles.actionBtn,
                     {
                        backgroundColor: pressed ? "rgba(255, 255, 255, 0.05)" : "transparent",
                        borderColor: "rgba(255, 255, 255, 0.03)",
                     },
                  ]}
                  onPress={e => e.stopPropagation()}
               >
                  <Download size={14} color={colors.textMuted} />
                  <Text style={[styles.actionText, { color: colors.textSecondary }]}>Export</Text>
               </Pressable>
               <Pressable
                  style={({ pressed }) => [
                     styles.actionBtn,
                     {
                        backgroundColor: pressed ? "rgba(255, 255, 255, 0.05)" : "transparent",
                        borderColor: "rgba(255, 255, 255, 0.03)",
                     },
                  ]}
                  onPress={e => e.stopPropagation()}
               >
                  <Share2 size={14} color={colors.textMuted} />
                  <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
               </Pressable>
            </View>
         </AnimatedPressable>
      </Animated.View>
   )
}

function getStatusConfig(status: string, colors: ColorsType, confidence: number) {
   const percent = Math.round(confidence * 100)

   switch (status) {
      case "completed":
         return {
            icon: Check,
            color: percent >= 80 ? "#22C55E" : "#F59E0B",
            bgColor: percent >= 80 ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
            label: "Completed",
         }
      case "processing":
         return {
            icon: Clock,
            color: colors.textSecondary,
            bgColor: "rgba(255, 255, 255, 0.06)",
            label: "Processing",
         }
      case "failed":
         return {
            icon: X,
            color: "#EF4444",
            bgColor: "rgba(239, 68, 68, 0.15)",
            label: "Failed",
         }
      default:
         return {
            icon: FileText,
            color: colors.textMuted,
            bgColor: "rgba(255, 255, 255, 0.04)",
            label: "Pending",
         }
   }
}

const styles = StyleSheet.create({
   card: {
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      marginBottom: 12,
   },
   cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
   },
   statusBadge: {
      width: 36,
      height: 36,
      borderRadius: 12,
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
      marginTop: 3,
   },
   confidenceSection: {
      marginBottom: 14,
   },
   confidenceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
   },
   confidenceLabel: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
   confidenceValue: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
   confidenceBar: {
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
   },
   confidenceFill: {
      height: "100%",
      borderRadius: 3,
      backgroundColor: "#22C55E",
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
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
   },
   actionPrimary: {
      borderWidth: 1,
   },
   actionText: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.medium,
   },
})
