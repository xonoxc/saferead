import React from "react"
import { Text, StyleSheet } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

type MessageThreshold = {
  threshold: number
  message: string
}

type UploadProgressMessagesProps = {
  progress: number
  messages: MessageThreshold[]
}

export const UploadProgressMessages = ({ progress, messages }: UploadProgressMessagesProps) => {
  const current = [...messages]
    .sort((a, b) => b.threshold - a.threshold)
    .find(msg => progress >= msg.threshold)

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <Text style={styles.message}>{current?.message ?? "Starting upload..."}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#00000010",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
})
