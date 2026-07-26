import { useTheme } from "@/hooks/useTheme"
import Animated, { FadeIn } from "react-native-reanimated"
import { StyleSheet, View } from "react-native"
import { Spacing, Radii } from "@/constants/Design"
import ResponseLoader from "./ResponseLoader"

export function TypingBubble() {
   const { colors } = useTheme()
   return (
      <Animated.View entering={FadeIn} style={[styles.bubble, { backgroundColor: colors.surface }]}>
         <View style={styles.loaderContainer}>
            <ResponseLoader />
         </View>
         {/* Divider to match bot messages */}
         <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   bubble: {
      alignSelf: "flex-start",
      borderTopLeftRadius: Radii.md,
      borderTopRightRadius: Radii.md,
      borderBottomRightRadius: Radii.md,
      borderBottomLeftRadius: Radii.xs / 2,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
   },
   loaderContainer: {
      paddingVertical: Spacing.xs,
   },
   divider: {
      height: StyleSheet.hairlineWidth,
      marginTop: Spacing.xs,
      opacity: 0.7,
   },
})
