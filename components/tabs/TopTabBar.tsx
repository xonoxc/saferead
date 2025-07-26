import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native"
import React from "react"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { useTheme } from "@/hooks/useTheme"
import { CustomBackBtn } from "../CustomBackBtn"
import { useSlidingSelector } from "@/hooks/animation/useSlidingSelector"
import Animated from "react-native-reanimated"

type Tab = {
  name: string
}

type TopTabBarProps = {
  tabs: Tab[]
  selectedTab: number
  onTabPress: (index: number) => void
}

const tabsList = ["Documents", "Conversations", "Files"] as const

const TopTabBar = ({ tabs, selectedTab, onTabPress }: TopTabBarProps) => {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()

  const tabWidth = (width * 0.9) / tabs.length
  const tabIndex = tabsList.indexOf(tabs[selectedTab]?.name as (typeof tabsList)[number])
  const backgroundSlide = useSlidingSelector({
    index: tabIndex,
    widthPerItem: index => index,
    duration: 1000,
    borderRadius: 8,
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
      </View>

      <Animated.View
        style={[
          styles.tabRow,
          backgroundSlide,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {tabs.map((tab, index) => {
          const isActive = selectedTab === index
          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tab,
                {
                  width: tabWidth,
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
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 7,
    paddingHorizontal: 6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 8,
  },
  tabRow: {
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: FontSizes.sm,
  },
})

export default TopTabBar
