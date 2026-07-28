import Animated, { FadeInDown } from "react-native-reanimated"
import { Text, StyleSheet } from "react-native"
import { Fonts, Spacing, Type } from "@/constants"

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
         {/*
          * Eyebrow above the name rather than a full-size line of its own.
          * "Welcome back," at body size competed with the username for the
          * top of the page, and it is the one string on this screen that
          * carries no information at all.
          * **/}
         <Text style={[styles.greeting, { color: colors.textMuted }]}>WELCOME BACK</Text>
         <Text style={[styles.userName, { color: colors.text }]}>{user?.username}</Text>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      paddingTop: Spacing.xs,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.sm,
   },
   greeting: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
      textTransform: "uppercase",
      marginBottom: 2,
   },
   userName: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
})
