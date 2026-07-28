import { View, Text, StyleSheet } from "react-native"
import { ArrowDownLeft, ArrowUpRight, Check, UserPlus } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { PressableScale } from "@/components/motion"
import { formatMoney, formatRelativeDeadline } from "@/utils/helpers/dates"

import { OBLIGATION_TYPE_LABELS, type Obligation } from "@/types/api/contracts.types"

/*
 * One obligation.
 *
 * Direction is carried by an arrow rather than the words "we owe" / "they owe"
 * — in a scrolling list those two strings are nearly identical at a glance,
 * and the direction is the first thing you need to know. Out-and-up is money
 * leaving; in-and-down is money arriving.
 *
 * The unassigned state is styled as an *invitation*, not an error. An
 * obligation nobody owns is the single strongest prompt to add a teammate, and
 * seats are what keep these accounts alive — so it gets a tappable affordance
 * rather than a grey "unassigned" label.
 * **/

interface ObligationRowProps {
   obligation: Obligation
   onPress?: () => void
   onAssign?: () => void
   onToggleDone?: () => void
   /* Hide the contract name when the row is already inside that contract. */
   hideContract?: boolean
}

export function ObligationRow({
   obligation,
   onPress,
   onAssign,
   onToggleDone,
   hideContract = false,
}: ObligationRowProps) {
   const { colors } = useTheme()

   const outbound = obligation.direction === "we_owe"
   const DirectionIcon = outbound ? ArrowUpRight : ArrowDownLeft
   const directionColor = outbound ? colors.riskHigh : colors.success
   const done = obligation.status !== "pending"

   return (
      <PressableScale
         onPress={onPress}
         disabled={!onPress}
         accessibilityRole={onPress ? "button" : "text"}
         accessibilityLabel={`${outbound ? "We owe" : "They owe"}: ${obligation.description}`}
         style={StyleSheet.flatten([
            styles.row,
            { backgroundColor: colors.card, borderColor: colors.border },
            done && { opacity: 0.55 },
         ])}
      >
         <View style={[styles.directionIcon, { backgroundColor: `${directionColor}14` }]}>
            <DirectionIcon size={15} color={directionColor} strokeWidth={2.4} />
         </View>

         <View style={styles.content}>
            <Text
               numberOfLines={2}
               style={[
                  styles.description,
                  { color: colors.text },
                  done && { textDecorationLine: "line-through" },
               ]}
            >
               {obligation.description || OBLIGATION_TYPE_LABELS[obligation.obligation_type]}
            </Text>

            <View style={styles.metaRow}>
               {!hideContract && obligation.contract_title ? (
                  <Text
                     numberOfLines={1}
                     style={[styles.meta, { color: colors.textMuted, flexShrink: 1 }]}
                  >
                     {obligation.counterparty_name || obligation.contract_title}
                  </Text>
               ) : null}

               {obligation.due_date ? (
                  <Text
                     style={[
                        styles.meta,
                        {
                           color: obligation.is_overdue ? colors.error : colors.textSecondary,
                           fontFamily: obligation.is_overdue ? Fonts.semiBold : Fonts.medium,
                        },
                     ]}
                  >
                     {formatRelativeDeadline(obligation.due_date)}
                  </Text>
               ) : null}
            </View>

            {obligation.assigned_to_username ? (
               <Text style={[styles.assignee, { color: colors.textMuted }]}>
                  {obligation.assigned_to_username}
               </Text>
            ) : onAssign ? (
               <PressableScale
                  onPress={onAssign}
                  accessibilityRole="button"
                  accessibilityLabel="Assign this obligation to someone"
                  style={StyleSheet.flatten([
                     styles.assignBtn,
                     { backgroundColor: colors.primaryFaded },
                  ])}
               >
                  <UserPlus size={11} color={colors.primary} strokeWidth={2.4} />
                  <Text style={[styles.assignText, { color: colors.primary }]}>Assign</Text>
               </PressableScale>
            ) : null}
         </View>

         <View style={styles.right}>
            {obligation.amount ? (
               <Text style={[styles.amount, { color: colors.text }]}>
                  {formatMoney(obligation.amount, obligation.currency)}
               </Text>
            ) : null}

            {onToggleDone && (
               <PressableScale
                  onPress={onToggleDone}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: done }}
                  accessibilityLabel={done ? "Mark as pending" : "Mark as met"}
                  hitSlop={8}
                  style={StyleSheet.flatten([
                     styles.check,
                     {
                        backgroundColor: done ? colors.success : "transparent",
                        borderColor: done ? colors.success : colors.borderStrong,
                     },
                  ])}
               >
                  {done && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
               </PressableScale>
            )}
         </View>
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
      borderWidth: StyleSheet.hairlineWidth,
   },
   directionIcon: {
      width: 28,
      height: 28,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   content: {
      flex: 1,
      gap: 3,
   },
   description: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
   },
   meta: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   assignee: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
   assignBtn: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: Radii.xs,
   },
   assignText: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
   right: {
      alignItems: "flex-end",
      gap: Spacing.xs,
   },
   amount: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   check: {
      width: 20,
      height: 20,
      borderRadius: Radii.xs,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
   },
})

export default ObligationRow
