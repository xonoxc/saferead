import Animated, { FadeInDown } from "react-native-reanimated"
import { Text, StyleSheet } from "react-native"
import { Fonts, FontSizes } from "@/constants"

import type { ColorsType } from "@/hooks/useTheme"

export default function HomeScreenHeader({
   colors,
   user,
}: {
   colors: ColorsType
   user: { username: string } | null
}) {
   return (
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
         <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
         <Text style={[styles.userName, { color: colors.text }]}>{user?.username}</Text>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      paddingTop: 8,
      paddingHorizontal: 20,
      paddingBottom: 8,
   },
   greeting: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
   },
   userName: {
      fontSize: FontSizes.xxl,
      fontFamily: Fonts.bold,
      marginBottom: 4,
   },
})
