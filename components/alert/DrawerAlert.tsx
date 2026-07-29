import React, { useState } from "react"
import { Text, View, Pressable, StyleSheet } from "react-native"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import { AlertTriangle, Check, CheckCircle2, Info, XCircle } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts } from "@/constants"
import { Radii, Spacing, Type, withAlpha } from "@/constants/Design"
import { Drawer } from "@/components/Drawer"

import type { ColorsType } from "@/hooks/useTheme"

type DrawerAlertType = "default" | "info" | "success" | "error" | "roast"

export type ActionBtnVariant = "primary" | "secondary" | "destructive" | "ghost"

interface DrawerAlertAction {
   label: string
   onPress?: () => void
   variant?: ActionBtnVariant
}

interface DrawerAlertProps {
   visible: boolean
   type?: DrawerAlertType
   title?: string
   message?: string
   actions?: DrawerAlertAction[]
   /* Present only when the caller allows this alert to be silenced. */
   onSuppressChange?: (suppress: boolean) => void
   onClose?: () => void
}

/*
 * The app's one modal alert.
 *
 * It used to be a rounded card floating inside a full-width drawer, with the
 * message set in `colors.primary` at the smallest size in the scale — a body of
 * text coloured like a link, sitting on a box inside a box. Under the "Ink &
 * Signal" palette that reads as decoration competing with the risk ramp, which
 * is the one thing on screen allowed to be saturated.
 *
 * So: the sheet *is* the surface, colour is carried only by a single icon tile
 * that names the alert's type, and the destructive action is the only place a
 * risk colour appears. Everything else is neutral.
 * **/
export function DrawerAlert({
   visible,
   type = "default",
   title,
   message,
   actions = [],
   onSuppressChange,
}: DrawerAlertProps) {
   const { colors } = useTheme()

   /*
    * The renderer mounts this component per alert rather than keeping one
    * around and toggling `visible`, so a fresh alert starts with a fresh
    * checkbox — no effect needed to clear the last one's answer.
    * **/
   const [suppress, setSuppress] = useState(false)

   const tone = getTone(colors, type)

   const toggleSuppress = () => {
      const next = !suppress
      setSuppress(next)
      onSuppressChange?.(next)
   }

   return (
      <Drawer visible={visible} enableAbsolute position="bottom" scrollable={false}>
         <View style={[styles.sheet, { backgroundColor: colors.elevated }]}>
            <View style={[styles.grabber, { backgroundColor: colors.border }]} />

            <View style={styles.body}>
               <View style={[styles.iconTile, { backgroundColor: tone.tint }]}>
                  <tone.Icon size={20} color={tone.fg} strokeWidth={2.2} />
               </View>

               <View style={styles.copy}>
                  {!!title && (
                     <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                  )}
                  {!!message && (
                     <Text style={[styles.message, { color: colors.textSecondary }]}>
                        {message}
                     </Text>
                  )}
               </View>
            </View>

            {onSuppressChange && (
               <Pressable
                  onPress={toggleSuppress}
                  style={styles.suppressRow}
                  hitSlop={6}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: suppress }}
                  accessibilityLabel="Don't ask me again for this action"
               >
                  <View
                     style={[
                        styles.checkbox,
                        {
                           borderColor: suppress ? colors.primary : colors.borderStrong,
                           backgroundColor: suppress ? colors.primary : "transparent",
                        },
                     ]}
                  >
                     {suppress && <Check size={12} color={colors.onPrimary} strokeWidth={3} />}
                  </View>

                  <Text style={[styles.suppressText, { color: colors.textSecondary }]}>
                     Don&apos;t ask me again
                  </Text>
               </Pressable>
            )}

            {/*
             * Two actions read fine side by side, but three or more squeeze
             * into unreadable slivers on a narrow phone — so past that the
             * alert becomes a stacked action sheet instead.
             * **/}
            <View style={actions.length > 2 ? styles.actionColumn : styles.actionRow}>
               {actions.map((action, index) => (
                  <Pressable
                     key={`${action.label}-${index}`}
                     onPress={async () => {
                        await impactAsync(ImpactFeedbackStyle.Medium)
                        action.onPress?.()
                     }}
                     accessibilityRole="button"
                     style={({ pressed }) => [
                        styles.action,
                        actions.length <= 2 && styles.actionInline,
                        {
                           backgroundColor: getVariantButtonColor(colors, action.variant),
                           opacity: pressed ? 0.8 : 1,
                        },
                        isOutlined(action.variant) && {
                           borderWidth: StyleSheet.hairlineWidth,
                           borderColor: colors.borderStrong,
                        },
                     ]}
                  >
                     <Text
                        style={[
                           styles.actionText,
                           { color: getVariantButtonTextColor(colors, action.variant) },
                        ]}
                        numberOfLines={1}
                     >
                        {action.label}
                     </Text>
                  </Pressable>
               ))}
            </View>
         </View>
      </Drawer>
   )
}

/*
 * The alert's type shows up as one icon in one tinted tile, and nowhere else.
 * `roast` has no palette of its own — it is a tone of voice, not a severity.
 * **/
function getTone(colors: ColorsType, type: DrawerAlertType) {
   switch (type) {
      case "success":
         return { Icon: CheckCircle2, fg: colors.success, tint: colors.successBackground }
      case "error":
         return { Icon: XCircle, fg: colors.error, tint: colors.errorBackground }
      case "info":
         return { Icon: Info, fg: colors.info, tint: colors.infoBackground }
      case "roast":
         return { Icon: AlertTriangle, fg: colors.warning, tint: colors.warningBackground }
      default:
         return { Icon: Info, fg: colors.primary, tint: withAlpha(colors.primary, 0.1) }
   }
}

const isOutlined = (variant: ActionBtnVariant = "primary") =>
   variant === "ghost" || variant === "secondary"

function getVariantButtonTextColor(colors: ColorsType, variant: ActionBtnVariant = "primary") {
   switch (variant) {
      case "destructive":
         return colors.onPrimary
      case "ghost":
      case "secondary":
         return colors.text
      default:
         return colors.onPrimary
   }
}

function getVariantButtonColor(colors: ColorsType, variant: ActionBtnVariant = "primary") {
   switch (variant) {
      case "destructive":
         return colors.error
      case "ghost":
         return "transparent"
      case "secondary":
         return colors.surface
      default:
         return colors.primary
   }
}

const styles = StyleSheet.create({
   sheet: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.sm,
      /* Clears the home indicator without a SafeAreaView inside a drawer. */
      paddingBottom: Spacing.xxl,
      gap: Spacing.md,
   },
   grabber: {
      width: 36,
      height: 4,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: Spacing.xs,
   },
   body: {
      flexDirection: "row",
      gap: Spacing.sm,
      alignItems: "flex-start",
   },
   iconTile: {
      width: 38,
      height: 38,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   copy: {
      flex: 1,
      gap: 4,
      paddingTop: 2,
   },
   title: {
      ...Type.subheading,
      fontFamily: Fonts.semiBold,
   },
   /*
    * `Type.body` rather than the old `FontSizes.xs`: this is the sentence that
    * decides whether someone taps Delete, and unset leading on wrapped text is
    * what made it read as fine print.
    * **/
   message: {
      ...Type.body,
      fontFamily: Fonts.regular,
   },
   suppressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
   },
   checkbox: {
      width: 20,
      height: 20,
      borderRadius: Radii.xs,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
   },
   suppressText: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   actionRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: Spacing.xs,
   },
   actionColumn: {
      gap: Spacing.xs,
   },
   action: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
   },
   /* Side-by-side actions share the row evenly instead of hugging their label. */
   actionInline: {
      flex: 1,
   },
   actionText: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
})
