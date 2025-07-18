import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Star, ChevronRight, Calendar, FileText } from "lucide-react-native"
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import type { Space } from "@/types"
import SpaceIcon from "./Icon"
import { SpaceIconName } from "@/constants/spaceform"

interface SpaceListProps {
  spaces: Space[]
  onDelete: (id: string, name: string) => void
  onSpaceSelect: (space: Space) => void
}

export const SpaceList: React.FC<SpaceListProps> = ({ spaces, onDelete, onSpaceSelect }) => {
  const { colors } = useTheme()

  const SpaceCard: React.FC<{ space: Space; index: number }> = ({ space, index }) => {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))

    const handlePressIn = () => {
      scale.value = withSpring(0.98)
    }

    const handlePressOut = () => {
      scale.value = withSpring(1)
    }

    return (
      <Animated.View entering={FadeInRight.delay(index * 100).springify()} style={animatedStyle}>
        <TouchableOpacity
          style={[styles.spaceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => onSpaceSelect(space)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.spaceIcon, { backgroundColor: `${space.color}20` }]}>
                <Text style={styles.spaceEmoji}>
                  <SpaceIcon name={space.icon as SpaceIconName} />
                </Text>
              </View>
              <View style={styles.spaceInfo}>
                <View style={styles.titleRow}>
                  <Text style={[styles.spaceName, { color: colors.text }]} numberOfLines={1}>
                    {space.title}
                  </Text>
                  {space.is_favorite && (
                    <Star size={16} color={colors.warning} fill={colors.warning} />
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.error + "10" }]}
              onPress={() => onDelete(space.id, space.title)}
            >
              <Text style={[styles.deleteButtonText, { color: colors.error }]}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <FileText size={16} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.primary }]}>
                {space.document_count} documents
              </Text>
            </View>

            <View style={styles.statItem}>
              <Calendar size={16} color={colors.textMuted} />
              <Text style={[styles.statText, { color: colors.textMuted }]}>
                {new Date(space.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={[styles.colorIndicator, { backgroundColor: space.color }]} />
            <ChevronRight size={20} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      {spaces.map((space, index) => (
        <SpaceCard key={space.id} space={space} index={index} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
  },
  spaceCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  spaceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  spaceEmoji: {
    fontSize: 28,
  },
  spaceInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  spaceName: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    flex: 1,
  },
  spaceDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorIndicator: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
})
