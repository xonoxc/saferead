import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Star, Settings, FileText, TrendingUp } from "lucide-react-native"
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useLocalSearchParams } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useSpaces } from "@/hooks/queries/spaces"
import { Alert } from "react-native"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { updateSpace } from "@/services/api"
import SpaceIcon from "@/components/spaces/Icon"
import type { SpaceIconName } from "@/constants/spaceform"
import { CustomBackBtn } from "@/components"

export default function SpaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
  const { data: spaces } = useSpaces()

  const flattendSpaces = spaces?.pages.flatMap(page => page.results) ?? []

  const space = flattendSpaces.find(s => s.id === id)
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleFavoritePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1)
    })

    if (space) {
      updateSpace(space.id, { is_favorite: !space.is_favorite })
      Alert.alert("Success", space.is_favorite ? "Removed from favorites" : "Added to favorites", [
        { text: "OK", onPress: () => {} },
      ])
    }
  }

  const stats = [
    {
      icon: FileText,
      label: "Documents",
      value: space?.document_count,
      color: space?.color,
    },
    {
      icon: TrendingUp,
      label: "Analyzed",
      value: space?.recent_documents.length,
      color: colors.success,
    },
    /* {
      icon: Calendar,
      label: "This Month",
      value: .filter(d => {
        const docDate = new Date(d.createdAt)
        const now = new Date()
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
      }).length,
      color: colors.warning,
    },  */
  ]

  if (!space) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.header, { backgroundColor: colors.background }]}
      >
        <View style={styles.headerTop}>
          <CustomBackBtn style={{ borderColor: space.color }} />

          <View style={styles.headerActions}>
            <Animated.View style={animatedStyle}>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  { backgroundColor: space.is_favorite ? space.color + "20" : colors.surface },
                ]}
                onPress={handleFavoritePress}
              >
                <Star
                  size={20}
                  color={space.color}
                  fill={space.is_favorite ? space.color : "transparent"}
                />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.surface }]}>
              <Settings size={20} color={space.color} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spaceInfo}>
          <View style={[styles.spaceIconLarge, { backgroundColor: `${space.color}20` }]}>
            <SpaceIcon name={space.icon as SpaceIconName} color={space.color} size={50} />
          </View>

          <View style={styles.spaceMeta}>
            <Text style={[styles.spaceTitle, { color: colors.text }]}>{space.title}</Text>
            <Text style={[styles.spaceDescription, { color: colors.textSecondary }]}>
              {space.description || "No description provided"}
            </Text>
            <Text style={[styles.spaceDate, { color: colors.textMuted }]}>
              Created {new Date(space.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Animated.View
            key={index}
            entering={FadeInRight.delay(300 + index * 100).springify()}
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  spaceInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  spaceIconLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  spaceEmojiLarge: {
    fontSize: 40,
  },
  spaceMeta: {
    flex: 1,
  },
  spaceTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  spaceDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    marginBottom: 8,
    lineHeight: 20,
  },
  spaceDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  addDocButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  quickActionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  documentsList: {
    paddingBottom: 100,
  },
  documentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  documentsTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
})
