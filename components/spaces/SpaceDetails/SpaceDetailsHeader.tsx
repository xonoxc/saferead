import React from "react"
import SpaceIcon from "@/components/spaces/Icon"

import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { Settings, Plus, Heart } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { CustomBackBtn } from "@/components"
import { useTheme } from "@/hooks/useTheme"

import { Fonts, FontSizes } from "@/constants"

import type { SpaceIconName } from "@/constants/spaceform"
import type { Space } from "@/types"

export default function SpaceDetailHeader({
  space,
  onCreateBtnPress,
  animatedStyle,
  onFavoritePress,
  onSettingsPress,
}: {
  space: Space
  onCreateBtnPress: () => void
  animatedStyle: {
    transform: {
      scale: number
    }[]
  }
  onFavoritePress: () => void
  onSettingsPress: () => void
}) {
  const { colors } = useTheme()

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={[styles.header, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerTop}>
        <CustomBackBtn style={{ borderColor: space.color }} />

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.surface }]}
            onPress={onCreateBtnPress}
          >
            <Plus size={20} color={space.color} />
          </TouchableOpacity>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: space.is_favorite ? space.color + "20" : colors.surface,
                },
              ]}
              onPress={onFavoritePress}
            >
              <Heart
                size={20}
                color={space.color}
                fill={space.is_favorite ? space.color : "transparent"}
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Settings size={20} color={space.color} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.spaceInfo, { backgroundColor: space.color }]}>
        <View style={[styles.spaceIconLarge, { backgroundColor: colors.background }]}>
          <SpaceIcon name={space.icon as SpaceIconName} color={space.color} size={50} />
        </View>

        <View style={styles.spaceMeta}>
          <Text style={[styles.spaceTitle, { color: colors.text }]}>{space.title}</Text>
          <Text style={[styles.spaceDescription, { color: colors.background }]}>
            {space.description || "No description provided"}
          </Text>
          <Text style={[styles.spaceDate, { color: colors.background }]}>
            Created {new Date(space.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  spaceInfo: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  spaceIconLarge: {
    width: 100,
    height: 100,
    borderRadius: 20,
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
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
    lineHeight: 20,
  },
  spaceDate: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
})
