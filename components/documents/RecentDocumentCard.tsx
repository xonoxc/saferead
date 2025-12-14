import { Fonts, FontSizes } from "@/constants/Fonts"
import { ArrowDown, ArrowUp, FileText, Check, X, Info } from "lucide-react-native"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { ProgressBar } from "../ProgressBar"
import { type ColorsType, useTheme } from "@/hooks/useTheme"

import type { AnalysisResponse } from "@/types/api/documents.types"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"

interface RecentDocumentItemProps {
   document: AnalysisResponse
   onPress: () => void
   viewType?: "list" | "grid"
}

export const RecentDocumentItem = ({
   document,
   onPress,
   viewType = "list",
}: RecentDocumentItemProps) => {
   const { colors } = useTheme()
   const isGridView = viewType === "grid"

   const statusColor = getStatusColor(document.status, colors)
   const StatusIcon = getStatusIcon(document.status)

   const showAlert = useDrawerAlert()

   const showFullTitle = () =>
      showAlert({
         title: "Document Details",
         message: "TITLE: " + document.original_filename,
         actions: [{ text: "OK", style: "primary" }],
      })

   return (
      <TouchableOpacity
         onPress={onPress}
         style={[
            styles.container,
            isGridView && styles.gridContainer,
            { backgroundColor: colors.card + "10", borderColor: colors.border },
         ]}
      >
         <View style={styles.infoBtnWrapper}>
            <TouchableOpacity onPress={showFullTitle} hitSlop={10} style={styles.infoButton}>
               <Info size={16} color={colors.textSecondary} />
            </TouchableOpacity>
         </View>

         {/* Header */}
         <View style={[styles.header, isGridView && styles.gridHeader]}>
            <View style={[styles.iconWrapper, { backgroundColor: statusColor + "15" }]}>
               <StatusIcon size={18} color={statusColor} />
            </View>

            <View style={styles.info}>
               <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.title, { color: colors.text }]}
               >
                  {document.original_filename}
               </Text>

               {!isGridView && (
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                     {getDocumentTypeLabel(document.document_type)} ·{" "}
                     {new Date(document.created_at).toLocaleDateString()}
                  </Text>
               )}
            </View>
         </View>

         {/* Confidence */}
         <View style={styles.progressWrapper}>
            <ProgressBar value={document.confidence_score} />
         </View>

         {/* Stats */}
         {isDocumentComplete(document) && !isGridView && (
            <View style={styles.stats}>
               <View style={styles.stat}>
                  <ArrowDown size={12} color={colors.red} strokeWidth={3} />
                  <Text style={[styles.statText, { color: colors.red }]}>
                     {document.risky_points.length}
                  </Text>
               </View>

               <View style={styles.stat}>
                  <ArrowUp size={12} color={colors.success} strokeWidth={3} />
                  <Text style={[styles.statText, { color: colors.success }]}>
                     {document.favourable_points.length}
                  </Text>
               </View>
            </View>
         )}
      </TouchableOpacity>
   )
}

/* -------------------------------- helpers -------------------------------- */

function isDocumentComplete(document: AnalysisResponse): boolean {
   return document.status === "completed"
}

const getStatusIcon = (status: string) => {
   switch (status) {
      case "completed":
         return Check
      case "failed":
         return X
      default:
         return FileText
   }
}

const getStatusColor = (status: string, colors: ColorsType) => {
   switch (status) {
      case "completed":
         return colors.success
      case "processing":
         return colors.warning
      case "failed":
         return colors.error
      default:
         return colors.textSecondary
   }
}

const getDocumentTypeLabel = (type: string) => {
   const types: Record<string, string> = {
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      legal: "Legal Agreement",
      other: "Other Document",
   }
   return types[type] || type
}

/* -------------------------------- styles -------------------------------- */

const styles = StyleSheet.create({
   container: {
      borderStyle: "dashed",
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      marginBottom: 10,
   },
   gridContainer: {
      flex: 1,
   },

   header: {
      flexDirection: "row",
      padding: 3,
      alignItems: "center",
      gap: 12,
   },
   gridHeader: {
      flexDirection: "column",
      padding: 3,
      alignItems: "flex-start",
   },

   iconWrapper: {
      width: 38,
      height: 38,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
   },

   info: {
      flex: 1,
   },

   title: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
   },

   subtitle: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
   infoBtnWrapper: {
      flex: 1,
      justifyContent: "flex-end",
   },
   infoButton: {
      padding: 4,
      alignSelf: "flex-end",
   },

   progressWrapper: {
      marginTop: 12,
      paddingHorizontal: 20,
   },

   stats: {
      marginTop: 10,
      flexDirection: "row",
      gap: 12,
   },

   stat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },

   statText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.semiBold,
   },
})
