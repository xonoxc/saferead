import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export const SpacesDemo: React.FC = () => {
   const { colors } = useTheme()

   const spaces = [
      { name: "Contracts", icon: "📄", color: "#6366F1" },
      { name: " Docs", icon: "⚖️", color: "#10B981" },
      { name: "Agreements", icon: "🤝", color: "#F59E0B" },
   ]

   return (
      <View style={styles.spacesDemo}>
         {spaces.map((space, index) => (
            <Animated.View
               key={index}
               entering={FadeInRight.delay(800 + index * 200).springify()}
               style={[styles.spaceCard, { backgroundColor: colors.card }]}
            >
               <View style={[styles.spaceIcon, { backgroundColor: space.color + "20" }]}>
                  <Text style={styles.spaceEmoji}>{space.icon}</Text>
               </View>
               <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
            </Animated.View>
         ))}
      </View>
   )
}

const styles = StyleSheet.create({
   spacesDemo: {
      flexDirection: "row",
      gap: 16,
   },
   spaceCard: {
      width: 80,
      height: 100,
      borderRadius: 16,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
   },
   spaceIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
   },
   spaceEmoji: {
      fontSize: 20,
   },
   spaceName: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.medium,
      textAlign: "center",
   },
})
