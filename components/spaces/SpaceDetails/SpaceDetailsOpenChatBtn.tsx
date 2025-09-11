import React from "react"
import { StyleSheet, TouchableOpacity, Text } from "react-native"
import { MessageSquare } from "lucide-react-native"
import Animated, { useAnimatedStyle, interpolate, withTiming } from "react-native-reanimated"
import { Fonts, FontSizes } from "@/constants"

import type { SharedValue } from "react-native-reanimated"

interface SpaceDetailsOpenChatBtnProps {
  onPress?: () => void
  color: string
  visibility: SharedValue<number>
}

export default function SpaceDetailsOpenChatBtn({
  onPress,
  color,
  visibility,
}: SpaceDetailsOpenChatBtnProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(visibility.value, { duration: 200 })
    const translateY = withTiming(interpolate(visibility.value, [0, 1], [50, 0], "clamp"), {
      duration: 200,
    })

    return {
      opacity,
      transform: [{ translateY }],
    }
  }, [])

  return (
    <Animated.View style={[styles.chatButtonContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.chatButton, { backgroundColor: color }]}
        activeOpacity={0.8}
      >
        <MessageSquare size={28} color={"white"} />
        <Text style={[styles.chatButtonText, { color: "white" }]}>Open in chat</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chatButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 18,
    zIndex: 10,
    alignItems: "flex-end",
  },
  chatButton: {
    width: "70%",
    height: 60,
    borderRadius: 20,
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    paddingHorizontal: 16,
    shadowRadius: 4,
  },
  chatButtonText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.semiBold,
    color: "white",
  },
})
