import { View, Text, StyleSheet } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import type { User } from "@/types"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface Props {
   user: User | null
}

export function ProfileStats({ user }: Props) {
   const { colors } = useTheme()

   const stats = [
      {
         value: "FREE",
         color: colors.primary,
      },
      {
         value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : "—",
         color: colors.secondary,
      },
   ]

   return (
      <View style={styles.container}>
         {stats.map((stat, i) => (
            <Animated.View
               key={i}
               entering={FadeInRight.delay(150 * i).springify()}
               style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.card + "50" },
               ]}
            >
               <Text style={[styles.value, { color: colors.text }]}>{stat.value}</Text>
            </Animated.View>
         ))}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      marginBottom: 24,
   },
   card: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      padding: 16,
      alignItems: "center",
   },
   iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
   },
   label: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      marginBottom: 4,
      textAlign: "center",
   },
   value: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.bold,
   },
})
