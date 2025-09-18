import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"
import { FileText } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export const WelcomeDemo: React.FC = () => {
   const { colors } = useTheme()

   return (
      <Animated.View entering={FadeInRight.delay(800).springify()} style={styles.welcomeDemo}>
         <View
            style={[
               styles.mockPhone,
               {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
               },
            ]}
         >
            <View style={styles.mockScreen}>
               <View style={[styles.mockHeader, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.mockHeaderText, { color: colors.text }]}>Assist</Text>
               </View>
               <View style={styles.mockContent}>
                  <FileText size={32} color={colors.primary} />
                  <Text style={[styles.mockText, { color: colors.textSecondary }]}>
                     AI Analysis
                  </Text>
               </View>
            </View>
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   welcomeDemo: {
      alignItems: "center",
   },
   mockPhone: {
      width: 200,
      height: 300,
      borderRadius: 20,
      borderWidth: 2,
      padding: 8,
      elevation: 8,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
   },
   mockScreen: {
      flex: 1,
      borderRadius: 12,
      overflow: "hidden",
   },
   mockHeader: {
      height: 60,
      justifyContent: "center",
      alignItems: "center",
   },
   mockHeaderText: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
   mockContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
   },
   mockText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
   },
})
