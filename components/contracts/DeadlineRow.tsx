import { View, Text, StyleSheet } from "react-native"
import { CalendarClock, RefreshCw, BellRing, CircleDollarSign, CalendarX } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { PressableScale } from "@/components/motion"
import { daysUntil, formatRelativeDeadline, formatShortDate } from "@/utils/helpers/dates"

import { EVENT_TYPE_LABELS, type ContractEvent } from "@/types/api/contracts.types"

/*
 * One upcoming deadline.
 *
 * This row exists to make one distinction visible that the old prose summaries
 * could not: **the date something happens is not the date you have to act.**
 * A renewal in 90 days that requires 60 days notice leaves 30 days to decide,
 * and after that the decision is made for you.
 *
 * So the large, coloured, relative figure is always `action_by_date`. The
 * event's own date is shown underneath in small text as context. Getting these
 * two the wrong way round would make the component actively misleading, which
 * is why the sort and the urgency colour both key off the same field.
 * **/

const EVENT_ICONS = {
   renewal: RefreshCw,
   notice_deadline: BellRing,
   payment_due: CircleDollarSign,
   expiry: CalendarX,
} as const

interface DeadlineRowProps {
   event: ContractEvent
   onPress?: () => void
   /* Hide the contract name when already inside that contract. */
   hideContract?: boolean
}

export function DeadlineRow({ event, onPress, hideContract = false }: DeadlineRowProps) {
   const { colors } = useTheme()

   const days = daysUntil(event.action_by_date)
   const Icon = EVENT_ICONS[event.event_type] ?? CalendarClock

   /*
    * Urgency bands. Past the action-by date is critical rather than merely
    * "high" because at that point the window has closed - there is nothing
    * left to negotiate, only consequences to manage.
    * **/
   const urgency =
      days === null
         ? { fg: colors.textMuted, bg: colors.surface }
         : days < 0
           ? { fg: colors.riskCritical, bg: colors.riskCriticalBackground }
           : days <= 7
             ? { fg: colors.riskHigh, bg: colors.riskHighBackground }
             : days <= 30
               ? { fg: colors.riskMedium, bg: colors.riskMediumBackground }
               : { fg: colors.textSecondary, bg: colors.surface }

   const resolved = !event.is_unresolved

   return (
      <PressableScale
         onPress={onPress}
         disabled={!onPress}
         accessibilityRole={onPress ? "button" : "text"}
         accessibilityLabel={`${EVENT_TYPE_LABELS[event.event_type]} for ${
            event.contract_title
         }, action by ${formatShortDate(event.action_by_date)}`}
         style={StyleSheet.flatten([
            styles.row,
            { backgroundColor: colors.card, borderColor: colors.border },
            resolved && { opacity: 0.5 },
         ])}
      >
         <View style={[styles.icon, { backgroundColor: urgency.bg }]}>
            <Icon size={15} color={urgency.fg} strokeWidth={2.4} />
         </View>

         <View style={styles.content}>
            <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
               {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
               {!hideContract && event.contract_title ? ` · ${event.contract_title}` : ""}
            </Text>

            {/*
             * Only shown when the notice period actually moves the date. For
             * an event with no notice requirement the two dates are identical
             * and repeating it would be noise.
             * **/}
            {event.notice_days_required ? (
               <Text numberOfLines={1} style={[styles.sub, { color: colors.textMuted }]}>
                  {event.notice_days_required}-day notice · {formatShortDate(event.event_date)}
               </Text>
            ) : (
               <Text numberOfLines={1} style={[styles.sub, { color: colors.textMuted }]}>
                  {formatShortDate(event.event_date)}
               </Text>
            )}
         </View>

         <Text
            numberOfLines={2}
            style={[styles.deadline, { color: resolved ? colors.textMuted : urgency.fg }]}
         >
            {resolved ? "Handled" : formatRelativeDeadline(event.action_by_date)}
         </Text>
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
      borderWidth: StyleSheet.hairlineWidth,
   },
   icon: {
      width: 30,
      height: 30,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   content: {
      flex: 1,
      gap: 2,
   },
   title: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   sub: {
      ...Type.micro,
      fontFamily: Fonts.regular,
   },
   deadline: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
      textAlign: "right",
      maxWidth: 96,
   },
})

export default DeadlineRow
