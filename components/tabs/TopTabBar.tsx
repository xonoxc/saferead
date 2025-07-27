import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native"
import React from "react"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { useTheme } from "@/hooks/useTheme"
import { CustomBackBtn } from "../CustomBackBtn"
import { useSlidingSelector } from "@/hooks/animation/useSlidingSelector"
import Animated from "react-native-reanimated"
import { useSpaceStore } from "@/store/useSpaceStore"
import { Box } from "lucide-react-native"

type Tab = {
  name: string
}

type TopTabBarProps = {
  tabs: Tab[]
  selectedTab: number
  onTabPress: (index: number) => void
}

const TopTabBar = ({ tabs, selectedTab, onTabPress }: TopTabBarProps) => {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()

  const MAX_TITLE_WIDTH = width * 0.5

  const activeSpace = useSpaceStore(state => state.selectedSpace)
  const hasActiveSpace = !!activeSpace?.id

  const filteredTab = [
    { name: "Documents" },
    ...(hasActiveSpace ? [{ name: "Conversations" }, { name: "Files" }] : []),
  ]

  const isSingleTab = filteredTab.length === 1

  const tabWidth = (width * 0.9) / tabs.length
  const safeTabIndex = Math.min(selectedTab, filteredTab.length - 1)

  const backgroundSlide = useSlidingSelector({
    index: safeTabIndex,
    widthPerItem: tabWidth,
    duration: 1000,
    borderRadius: 12,
  })

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border || colors.textMuted,
          width: width * 0.9,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <CustomBackBtn />

        <View style={styles.centerContent}>
          {isSingleTab ? (
            <Text
              style={[
                styles.singleTabText,
                {
                  color: colors.text,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              Your {filteredTab[0].name}
            </Text>
          ) : (
            <View style={styles.containerTitle}>
              <Box size={20} color={activeSpace?.color || colors.primary} />
              <Text
                style={[styles.title, { maxWidth: MAX_TITLE_WIDTH, color: colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {activeSpace?.title}
              </Text>
            </View>
          )}
        </View>

        <View style={{ width: 40 }} />
      </View>

      {!isSingleTab && (
        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              styles.tabRow,
              backgroundSlide,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                position: "absolute",
                zIndex: 0,
              },
            ]}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tabRow, { paddingVertical: 6 }]}
          >
            {filteredTab.map((tab, index) => {
              const isActive = safeTabIndex === index
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isActive ? colors.primary : colors.card,
                    },
                  ]}
                  onPress={() => onTabPress(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActive ? colors.background : colors.textMuted,
                        fontFamily: isActive ? Fonts.bold : Fonts.regular,
                      },
                    ]}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 7,
    paddingHorizontal: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  singleTabText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: "center",
  },
  tabRow: {
    borderWidth: 2,
    marginHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  containerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    maxWidth: "100%",
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: FontSizes.sm,
  },
})

export default TopTabBar
