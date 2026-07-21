import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import Animated, {
   Easing,
   FadeIn,
   FadeOut,
   useAnimatedStyle,
   useSharedValue,
   withRepeat,
   withSequence,
   withTiming,
   interpolate,
} from "react-native-reanimated"
import { Sparkles } from "lucide-react-native"

import { FontSizes, Fonts } from "@/constants"
import { Spacing, Radii, withAlpha } from "@/constants/Design"
import { useTheme } from "@/hooks/useTheme"
import { useSpaceStore } from "@/store/useSpaceStore"
import { FadeInView } from "@/components/motion"

/*
 * Empty state for a space chat.
 *
 * Naming the space and its document count tells a new user what the assistant
 * can actually answer from, which the generic "Have Questions?" copy did not.
 * **/
export default function ChatGreeting() {
   const { colors } = useTheme()
   const selectedSpace = useSpaceStore(s => s.selectedSpace)

   const glow = useSharedValue(0)

   useEffect(() => {
      glow.value = withRepeat(
         withSequence(
            withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
         ),
         -1,
         false
      )
   }, [glow])

   const haloStyle = useAnimatedStyle(() => ({
      transform: [{ scale: interpolate(glow.value, [0, 1], [1, 1.16]) }],
      opacity: interpolate(glow.value, [0, 1], [0.5, 0.16]),
   }))

   const accent = selectedSpace?.color || colors.primary
   const documentCount = selectedSpace?.document_count ?? 0

   return (
      <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
         <View style={styles.content}>
            <View style={styles.iconWrap}>
               {/* Slow breathing halo keeps the empty state feeling alive without demanding attention */}
               <Animated.View
                  style={[
                     styles.halo,
                     { backgroundColor: withAlpha(accent, 0.35) },
                     haloStyle,
                  ]}
               />
               <View style={[styles.iconTile, { backgroundColor: withAlpha(accent, 0.14) }]}>
                  <Sparkles size={26} color={accent} />
               </View>
            </View>

            <FadeInView delay={80}>
               <Text style={[styles.heading, { color: colors.text }]}>
                  {selectedSpace ? `Ask about ${selectedSpace.title}` : "Have questions?"}
               </Text>
            </FadeInView>

            <FadeInView delay={150}>
               <Text style={[styles.tagline, { color: colors.textMuted }]}>
                  {buildSubtitle(documentCount, !!selectedSpace)}
               </Text>
            </FadeInView>
         </View>
      </Animated.View>
   )
}

function buildSubtitle(documentCount: number, hasSpace: boolean) {
   if (!hasSpace) return "Pick a space above, then start a conversation below."

   if (documentCount === 0) {
      return "This space has no documents yet. Add one to get answers grounded in your files."
   }

   return `Answers are drawn from the ${documentCount} document${
      documentCount === 1 ? "" : "s"
   } in this space.`
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingVertical: 70,
   },
   content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: Spacing.xl,
   },
   iconWrap: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Spacing.md,
   },
   halo: {
      position: "absolute",
      width: 78,
      height: 78,
      borderRadius: Radii.pill,
   },
   iconTile: {
      width: 58,
      height: 58,
      borderRadius: Radii.md,
      justifyContent: "center",
      alignItems: "center",
   },
   heading: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: Spacing.xs,
      textAlign: "center",
   },
   tagline: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      textAlign: "center",
      lineHeight: 20,
   },
})
