import React from "react"
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native"
import Skeleton from "./Skeleton"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

interface AnalyzeScreenSkeletonProps {
  isAnalizing?: boolean
}

const AnalyzeScreenSkeleton = ({ isAnalizing = false }: AnalyzeScreenSkeletonProps) => {
  const { colors } = useTheme()
  const { height } = useWindowDimensions()

  return (
    <View style={{ flex: 1 }}>
      {isAnalizing && (
        <View style={[styles.overlayContainer, { top: height / 2 - 50 }]}>
          <Text style={[styles.overlayText, { color: colors.text }]}>Analyzing......</Text>
        </View>
      )}

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={100} height={30} borderRadius={8} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>

        <View style={styles.selectorContainer}>
          <Skeleton width="100%" height={50} borderRadius={12} />
        </View>

        <View style={styles.uploadSection}>
          <View style={styles.uploadGrid}>
            <Skeleton width="45%" height={100} borderRadius={12} />
            <Skeleton width="45%" height={100} borderRadius={12} />
          </View>
        </View>

        <View style={styles.textInputCard}>
          <Skeleton width={200} height={20} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={120} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={50} borderRadius={8} />
        </View>

        <View style={styles.recentSection}>
          <Skeleton width={200} height={24} style={{ marginBottom: 16 }} />
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              width="100%"
              height={70}
              borderRadius={12}
              style={{ marginBottom: 12 }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  overlayContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  overlayText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  uploadSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  uploadGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textInputCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  recentSection: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
})

export default AnalyzeScreenSkeleton
