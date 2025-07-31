import { useTheme } from "@/hooks/useTheme"
import Animated, { FadeIn } from "react-native-reanimated"
import { Text, StyleSheet } from "react-native"
import { Fonts } from "@/constants"

export function TypingBubble() {
  const { colors } = useTheme()
  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.chatBubble, styles.botBubble, { backgroundColor: colors.card }]}
    >
      <Text style={{ color: colors.text, fontFamily: Fonts.regular }}>Typing...</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
})
