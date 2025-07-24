import React from "react"
import { StyleSheet, TouchableOpacity, Text } from "react-native"
import { MessageSquare } from "lucide-react-native"
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated"
import { Fonts, FontSizes } from "@/constants"

interface SpaceDetailsOpenChatBtnProps {
  onPress?: () => void
  color: string
}

export default function SpaceDetailsOpenChatBtn({ onPress, color }: SpaceDetailsOpenChatBtnProps) {
  return (
    <Animated.View
      style={[styles.chatButtonContainer]}
      entering={FadeInUp.delay(500).springify()}
      exiting={FadeOut}
    >
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
    shadowRadius: 4,
  },
  chatButtonText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.semiBold,
    color: "white",
  },
})
