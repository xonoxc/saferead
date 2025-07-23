import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { MessageSquare } from "lucide-react-native"
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated"

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
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chatButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 10,
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
})
