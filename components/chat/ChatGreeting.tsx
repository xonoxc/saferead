import { FontSizes, Fonts } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { SafeAreaView, View, Text, StyleSheet } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

export default function ChatGreeting() {
   const { colors } = useTheme()
   return (
      <Animated.View style={{ flex: 1, paddingVertical: 80 }} entering={FadeIn} exiting={FadeOut}>
         <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
               <Text style={[styles.heading, { color: colors.text }]}>Have Questions?</Text>
               <Text style={[styles.tagline, { color: colors.textMuted }]}>
                  Just start a conversation by typing below.
               </Text>
            </View>
         </SafeAreaView>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   heading: {
      fontSize: FontSizes.xxl,
      fontFamily: Fonts.bold,
      marginBottom: 10,
      textAlign: "center",
   },
   tagline: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
      textAlign: "center",
      paddingHorizontal: 20,
   },
})
