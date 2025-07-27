import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { ColorsType, useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"

import type { LucideIcon } from "lucide-react-native"

const { width: screenWidth } = Dimensions.get("window")

export type EmptyStateVariant = "default" | "search" | "error"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionTitle?: string
  onAction?: () => void
  secondaryActionTitle?: string
  onSecondaryAction?: () => void
  showFloatingElements?: boolean
  variant?: EmptyStateVariant
}

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showFloatingElements && (
        <View style={styles.backgroundElements}>
          {[...Array(12)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.floatingElement,
                {
                  backgroundColor: variantColors.primary + "20",
                  left: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
                  top: Math.random() * 400 + 100,
                },
              ]}
            />
          ))}
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.pulseCircle,
              styles.pulseCircle1,
              { borderColor: variantColors.primary },
            ]}
          />
          <View
            style={[
              styles.pulseCircle,
              styles.pulseCircle2,
              { borderColor: variantColors.primary },
            ]}
          />
          <View style={[styles.iconWrapper, { backgroundColor: variantColors.background }]}>
            <IconComponent size={48} color={variantColors.primary} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
        </View>

        {(actionTitle || secondaryActionTitle) && (
          <View style={styles.buttonContainer}>
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
              <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryAction}>
                <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                  {secondaryActionTitle}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const getVariantColors = (variant: EmptyStateVariant, colors: ColorsType) => {
  switch (variant) {
    case "search":
      return {
        primary: colors.secondary,
        background: colors.secondary + "15",
      }
    case "error":
      return {
        primary: colors.error,
        background: colors.error + "15",
      }
    default:
      return {
        primary: colors.primary,
        background: colors.primary + "15",
      }
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    padding: 32,
    paddingTop: 30,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 40,
  },
  pulseCircle: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 100,
  },
  pulseCircle1: {
    width: 140,
    height: 140,
    top: -30,
    left: -30,
  },
  pulseCircle2: {
    width: 180,
    height: 180,
    top: -50,
    left: -50,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 280,
    gap: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
  },
})
