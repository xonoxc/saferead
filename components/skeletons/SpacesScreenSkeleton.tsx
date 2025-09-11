import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import Skeleton from "./Skeleton"
import { useTheme } from "@/hooks/useTheme"

const SpacesScreenSkeleton = () => {
  const { colors } = useTheme()

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Skeleton width={120} height={32} borderRadius={8} />
          <View style={styles.headerIcons}>
            <Skeleton width={24} height={24} borderRadius={4} />
            <Skeleton width={24} height={24} borderRadius={4} />
            <Skeleton width={36} height={36} borderRadius={12} />
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Skeleton width="100%" height={40} borderRadius={8} />
        </View>
      </View>

      <View style={styles.listContainer}>
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            width="100%"
            height={80}
            borderRadius={12}
            style={{ marginBottom: 12 }}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    paddingVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
})

export default SpacesScreenSkeleton
