import React, { useEffect } from "react"
import { View, Text, StyleSheet, useWindowDimensions } from "react-native"
import { Link } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withRepeat,
   withSequence,
   withTiming,
   Easing,
} from "react-native-reanimated"
import { ShieldCheck, Sparkles, ScanSearch } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"
import { FadeInView } from "@/components/motion"
import Logo from "@/components/Logo"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Radii, Spacing, elevation, withAlpha } from "@/constants/Design"

import type { ColorsType } from "@/hooks/useTheme"

/*
 * The value props shown under the brand mark. Three is deliberate: it fills the
 * screen enough to feel considered without turning the first thing a new user
 * sees into a feature list they have to read.
 * **/
const HIGHLIGHTS = [
   {
      icon: ScanSearch,
      title: "Scan anything",
      body: "Contracts, policies and terms - PDF, Word or a photo.",
   },
   {
      icon: ShieldCheck,
      title: "See the risks",
      body: "Buried clauses and one-sided terms, called out plainly.",
   },
   {
      icon: Sparkles,
      title: "Ask questions",
      body: "Chat with your documents and get answers in seconds.",
   },
]

export default function WelcomeScreen() {
   const { colors, isDark } = useTheme()
   const { height } = useWindowDimensions()

   /* Short screens lose the hero before the buttons, so ease the halo down. */
   const heroScale = height < 700 ? 0.82 : 1

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         {/*
          * An ambient wash rather than a photograph. The screen previously
          * pulled a stock image off pexels.com at runtime, so the first thing a
          * new user saw depended on their connection - and showed a generic
          * stock photo when it did load.
          * **/}
         <LinearGradient
            colors={[withAlpha(colors.primary, isDark ? 0.28 : 0.16), withAlpha(colors.primary, 0)]}
            style={styles.wash}
         />

         <View style={styles.content}>
            <BrandMark colors={colors} scale={heroScale} />

            <FadeInView delay={120} style={styles.textContainer}>
               <Text style={[styles.title, { color: colors.text }]}>SafeRead</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Know what you&apos;re agreeing to.
               </Text>
            </FadeInView>

            <View style={styles.highlights}>
               {HIGHLIGHTS.map((item, index) => (
                  <FadeInView key={item.title} index={index} delay={220}>
                     <Highlight colors={colors} {...item} />
                  </FadeInView>
               ))}
            </View>
         </View>

         <FadeInView delay={480} style={styles.actions}>
            <Link href="/(auth)/register" asChild>
               <Button
                  title="Get started"
                  variant="primary"
                  size="large"
                  fullWidth
                  onPress={() => {}}
               />
            </Link>

            {/*
             * A text link rather than a third full-width button. Three
             * identical buttons gave the screen no hierarchy, so nothing read
             * as the thing to actually tap.
             * **/}
            <View style={styles.signInRow}>
               <Text style={[styles.signInPrompt, { color: colors.textMuted }]}>
                  Already have an account?
               </Text>
               <Link href="/(auth)/login" style={[styles.signInLink, { color: colors.primary }]}>
                  Sign in
               </Link>
            </View>
         </FadeInView>
      </View>
   )
}

/*
 * The brand mark, breathing.
 *
 * Uses the project's own Logo, which existed but was not rendered anywhere.
 * **/
function BrandMark({ colors, scale }: { colors: ColorsType; scale: number }) {
   const pulse = useSharedValue(0)

   useEffect(() => {
      pulse.value = withDelay(
         300,
         withRepeat(
            withSequence(
               withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
               withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.quad) })
            ),
            -1,
            false
         )
      )
   }, [pulse])

   const haloStyle = useAnimatedStyle(() => ({
      transform: [{ scale: 1 + pulse.value * 0.08 }],
      opacity: 0.45 + pulse.value * 0.35,
   }))

   return (
      <FadeInView delay={0} rise={false} style={[styles.brand, { transform: [{ scale }] }]}>
         <Animated.View
            style={[styles.halo, { backgroundColor: withAlpha(colors.primary, 0.16) }, haloStyle]}
         />
         <View
            style={[
               styles.mark,
               { backgroundColor: colors.card, borderColor: withAlpha(colors.primary, 0.25) },
               elevation(colors, 2),
            ]}
         >
            <Logo width={92} height={92} fill={colors.primary} />
         </View>
      </FadeInView>
   )
}

function Highlight({
   colors,
   icon: Icon,
   title,
   body,
}: {
   colors: ColorsType
   icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
   title: string
   body: string
}) {
   return (
      <View style={styles.highlight}>
         <View style={[styles.highlightIcon, { backgroundColor: colors.primaryFaded }]}>
            <Icon size={19} color={colors.primary} strokeWidth={2.1} />
         </View>

         <View style={styles.highlightText}>
            <Text style={[styles.highlightTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.highlightBody, { color: colors.textMuted }]}>{body}</Text>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
   },
   wash: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "58%",
      /* Purely decorative, so it must never intercept a tap. */
      pointerEvents: "none",
   },
   content: {
      flex: 1,
      justifyContent: "center",
   },
   brand: {
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: Spacing.xl,
   },
   halo: {
      position: "absolute",
      width: 168,
      height: 168,
      borderRadius: Radii.pill,
   },
   mark: {
      width: 124,
      height: 124,
      borderRadius: Radii.pill,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   textContainer: {
      alignItems: "center",
      marginBottom: Spacing.xxl,
   },
   title: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.bold,
      textAlign: "center",
      letterSpacing: -0.5,
      marginBottom: Spacing.xs,
   },
   subtitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
      textAlign: "center",
   },
   highlights: {
      gap: Spacing.lg,
   },
   highlight: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
   },
   highlightIcon: {
      width: 38,
      height: 38,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   highlightText: {
      flex: 1,
      paddingTop: 2,
   },
   highlightTitle: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   highlightBody: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      lineHeight: 18,
   },
   actions: {
      gap: Spacing.md,
      paddingBottom: Spacing.xl,
   },
   signInRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: Spacing.xxs,
   },
   signInPrompt: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   signInLink: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
   },
})
