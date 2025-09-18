import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import Skeleton from "./Skeleton"
import { useTheme } from "@/hooks/useTheme"

const HomeScreenSkeleton = () => {
   const { colors } = useTheme()

   return (
      <ScrollView
         style={[styles.container, { backgroundColor: colors.background }]}
         contentContainerStyle={{ paddingBottom: 120 }}
         showsVerticalScrollIndicator={false}
      >
         <View style={styles.header}>
            <Skeleton width={150} height={20} />
            <View style={{ height: 8 }} />
            <Skeleton width={200} height={32} />
         </View>

         {/* Main Statistics */}
         <View style={styles.statsGrid}>
            <Skeleton width="100%" height={130} borderRadius={20} style={{ marginBottom: 12 }} />
            <View style={styles.row}>
               <View style={styles.leftColumn}>
                  <Skeleton
                     width="100%"
                     height={130}
                     borderRadius={20}
                     style={{ marginBottom: 12 }}
                  />
                  <Skeleton width="100%" height={120} borderRadius={20} />
               </View>
               <Skeleton width="48%" height={264} borderRadius={20} />
            </View>
         </View>

         {/* Document Types */}
         <View style={styles.section}>
            <Skeleton width={200} height={24} style={{ marginBottom: 16 }} />
            <View style={styles.typeGrid}>
               {[...Array(4)].map((_, index) => (
                  <View key={index} style={styles.typeRow}>
                     <Skeleton width="100%" height={70} borderRadius={12} />
                  </View>
               ))}
            </View>
         </View>

         {/* Processing Status */}
         <View style={styles.section}>
            <Skeleton width={200} height={24} style={{ marginBottom: 16 }} />
            <Skeleton width="100%" height={100} borderRadius={16} />
         </View>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingVertical: 20,
   },
   header: {
      paddingTop: 8,
      paddingHorizontal: 20,
      paddingBottom: 8,
   },
   statsGrid: {
      paddingBottom: 10,
      paddingHorizontal: 20,
   },
   row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
   },
   leftColumn: {
      width: "48%",
   },
   section: {
      padding: 20,
   },
   typeGrid: {
      gap: 12,
   },
   typeRow: {
      width: "100%",
   },
})

export default HomeScreenSkeleton
