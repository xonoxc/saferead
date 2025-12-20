import React from "react"
import { View, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import Skeleton from "@/components/skeletons/Skeleton"

const DocumentCardSkeleton = () => {
   const { colors } = useTheme()

   return (
      <View
         style={[styles.documentCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
         <View style={styles.cardHeader}>
            <Skeleton width={48} height={48} borderRadius={24} />
            <View style={styles.documentInfo}>
               <Skeleton width="80%" height={20} />
               <View style={{ height: 4 }} />
               <Skeleton width="60%" height={16} />
               <View style={{ height: 4 }} />
               <Skeleton width="40%" height={12} />
            </View>
         </View>
         <View style={styles.statusContainer}>
            <Skeleton width={80} height={24} borderRadius={12} />
            <Skeleton width={60} height={16} />
         </View>
         <View style={styles.analysisPreview}>
            <Skeleton width="100%" height={18} />
            <View style={{ height: 4 }} />
            <Skeleton width="100%" height={18} />
            <View style={{ height: 8 }} />
            <View style={styles.analysisStats}>
               <Skeleton width={80} height={16} />
               <Skeleton width={80} height={16} />
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   documentCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
   },
   cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
   },
   documentInfo: {
      flex: 1,
      marginLeft: 12,
   },
   statusContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
   },
   analysisPreview: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: "rgba(0,0,0,0.1)",
   },
   analysisStats: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
})

export default DocumentCardSkeleton
