import { useTheme } from "@/hooks/useTheme"
import Animated, { FadeIn } from "react-native-reanimated"
import { StyleSheet } from "react-native"
import ResponseLoader from "./ResponseLoader"

export function TypingBubble() {
   const { colors } = useTheme()
   return (
      <Animated.View
         entering={FadeIn}
         style={[styles.chatBubble, styles.botBubble, { backgroundColor: colors.card }]}
      >
         <ResponseLoader />
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
