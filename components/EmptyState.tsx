import React, { useEffect } from "react"
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native"
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withRepeat,
   withSequence,
   withTiming,
   interpolate,
} from "react-native-reanimated"
import { FolderPlus, SearchX, TriangleAlert, type LucideIcon } from "lucide-react-native"

import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Spacing, Radii, elevation, withAlpha } from "@/constants/Design"
import { FadeInView } from "@/components/motion"

import { type ColorsType, useTheme } from "@/hooks/useTheme"

const { width: screenWidth } = Dimensions.get("window")

export type EmptyStateVariant = "default" | "search" | "error"

interface EmptyStateProps {
   icon?: LucideIcon
   title: string
   description: string
   actionTitle?: string
   onAction?: () => void
   secondaryActionTitle?: string
   onSecondaryAction?: () => void
   showFloatingElements?: boolean
   variant?: EmptyStateVariant
}

const PARTICLE_COUNT = 10

export const EmptyState: React.FC<EmptyStateProps> = ({
   icon: IconComponent,
   title,
   description,
   actionTitle,
   onAction,
   secondaryActionTitle,
   onSecondaryAction,
   showFloatingElements = true,
   variant = "default",
}) => {
   const { colors } = useTheme()

   const variantColors = getVariantColors(variant, colors)
   // Fall back to a variant-appropriate icon so the illustration slot is never
   // empty; callers previously had to pass one and mostly did not.
   const Icon = IconComponent ?? defaultIconFor(variant)

   return (
      <View style={styles.container}>
         {showFloatingElements && (
            <View style={styles.backgroundElements} pointerEvents="none">
               {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
                  <Particle key={index} index={index} color={variantColors.primary} />
               ))}
            </View>
         )}

         <View style={styles.content}>
            <FadeInView rise={false}>
               <View
                  style={[
                     styles.iconWrapper,
                     { backgroundColor: variantColors.background },
                     elevation(colors, 2),
                  ]}
               >
                  <Icon size={34} color={variantColors.primary} />
               </View>
            </FadeInView>

            <FadeInView delay={90}>
               <View style={styles.textContainer}>
                  <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                  <Text style={[styles.description, { color: colors.textSecondary }]}>
                     {description}
                  </Text>
               </View>
            </FadeInView>

            {(actionTitle || secondaryActionTitle) && (
               <FadeInView delay={170} style={styles.buttonContainer}>
                  {actionTitle && onAction && (
                     <Button
                        title={actionTitle}
                        onPress={onAction}
                        variant="primary"
                        size="medium"
                        fullWidth
                     />
                  )}

                  {secondaryActionTitle && onSecondaryAction && (
                     <Pressable style={styles.secondaryButton} onPress={onSecondaryAction}>
                        <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                           {secondaryActionTitle}
                        </Text>
                     </Pressable>
                  )}
               </FadeInView>
            )}
         </View>
      </View>
   )
}

/*
 * A dot that drifts slowly upward and fades.
 *
 * These were previously static dots, which read as specks of dust on the
 * screen rather than as motion.
 * **/
function Particle({ index, color }: { index: number; color: string }) {
   const progress = useSharedValue(0)

   const left = React.useMemo(() => Math.random() * screenWidth * 0.8 + screenWidth * 0.1, [])
   const top = React.useMemo(() => Math.random() * 320 + 60, [])
   const size = React.useMemo(() => 4 + Math.random() * 4, [])
   const duration = React.useMemo(() => 2600 + Math.random() * 1800, [])

   useEffect(() => {
      progress.value = withDelay(
         index * 220,
         withRepeat(
            withSequence(
               withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
               withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
         )
      )
   }, [index, duration])

   const animatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0.12, 0.4]),
      transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -18]) }],
   }))

   return (
      <Animated.View
         style={[
            styles.floatingElement,
            {
               backgroundColor: color,
               left,
               top,
               width: size,
               height: size,
               borderRadius: size / 2,
            },
            animatedStyle,
         ]}
      />
   )
}

function defaultIconFor(variant: EmptyStateVariant): LucideIcon {
   switch (variant) {
      case "search":
         return SearchX
      case "error":
         return TriangleAlert
      default:
         return FolderPlus
   }
}

const getVariantColors = (variant: EmptyStateVariant, colors: ColorsType) => {
   switch (variant) {
      case "search":
         return {
            primary: colors.textSecondary,
            background: withAlpha(colors.textMuted, 0.14),
         }
      case "error":
         return {
            primary: colors.error,
            background: colors.errorBackground,
         }
      default:
         return {
            primary: colors.primary,
            background: colors.primaryFaded,
         }
   }
}

const styles = StyleSheet.create({
   /*
    * This container previously carried borderWidth: 3 with no border colour,
    * which rendered as a hard black rectangle around the whole empty state.
    * **/
   container: {
      position: "relative",
   },
   backgroundElements: {
      ...StyleSheet.absoluteFillObject,
   },
   floatingElement: {
      position: "absolute",
   },
   content: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.lg,
      alignItems: "center",
   },
   iconWrapper: {
      width: 72,
      height: 72,
      borderRadius: Radii.lg,
      justifyContent: "center",
      alignItems: "center",
   },
   textContainer: {
      alignItems: "center",
      marginTop: Spacing.lg,
      marginBottom: Spacing.xl,
   },
   title: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
      textAlign: "center",
      marginBottom: Spacing.xs,
   },
   description: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      textAlign: "center",
      lineHeight: 21,
      maxWidth: 300,
   },
   buttonContainer: {
      width: "100%",
      maxWidth: 300,
      gap: Spacing.xs,
   },
   secondaryButton: {
      paddingVertical: Spacing.sm,
      alignItems: "center",
   },
   secondaryButtonText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
})
