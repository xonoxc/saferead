import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"
import { CheckCircle } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export const CompletionDemo: React.FC = () => {
   const { colors } = useTheme()

   return (
      <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.completionDemo}>
         <View style={[styles.completionCard, { backgroundColor: colors.success + "15" }]}>
            <CheckCircle size={48} color={colors.success} />
            <Text style={[styles.completionText, { color: colors.success }]}>
               Ready to Transform Your Workflow!
            </Text>
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   completionDemo: {
      alignItems: "center",
   },
   completionCard: {
      borderRadius: 20,
      padding: 32,
      alignItems: "center",
      gap: 16,
      maxWidth: 280,
   },
   completionText: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
      textAlign: "center",
   },
})
