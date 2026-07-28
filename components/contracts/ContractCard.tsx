import { View, Text, StyleSheet } from "react-native"
import { AlertTriangle, Building2, CalendarClock, Loader, Ban } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type, elevation } from "@/constants"
import { PressableScale } from "@/components/motion"
import { RiskBadge } from "@/components/RiskBadge"
import { formatMoney, formatRelativeDeadline, daysUntil } from "@/utils/helpers/dates"

import {
   CONTRACT_TYPE_SHORT,
   type ContractListItem,
} from "@/types/api/contracts.types"

/*
 * One contract in the portfolio list.
 *
 * The hierarchy is counterparty → title → risk, in that order, because that is
 * how people actually look for a contract: they remember who it is with long
 * before they remember what it was called. The extraction state is only shown
 * when it is *not* `completed` — a badge saying "done" on every healthy row is
 * noise that makes the two rows that failed harder to spot.
 * **/

interface ContractCardProps {
   contract: ContractListItem
   onPress: () => void
}

export function ContractCard({ contract, onPress }: ContractCardProps) {
   const { colors } = useTheme()

   const expiringDays = daysUntil(contract.term_end_date)
   /* "Soon" is 60 days: below that, a 30-day notice period is already tight. */
   const isExpiringSoon = expiringDays !== null && expiringDays >= 0 && expiringDays <= 60

   return (
      <PressableScale
         onPress={onPress}
         accessibilityRole="button"
         accessibilityLabel={`${contract.title || "Untitled contract"}, ${
            contract.counterparty_name ?? "no counterparty"
         }`}
         style={StyleSheet.flatten([
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
            elevation(colors, 1),
         ])}
      >
         <View style={styles.topRow}>
            <View style={styles.identity}>
               {contract.counterparty_name ? (
                  <View style={styles.counterpartyRow}>
                     <Building2 size={12} color={colors.textMuted} strokeWidth={2.2} />
                     <Text
                        numberOfLines={1}
                        style={[styles.counterparty, { color: colors.textSecondary }]}
                     >
                        {contract.counterparty_name}
                     </Text>
                  </View>
               ) : null}

               <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
                  {contract.title || "Untitled contract"}
               </Text>
            </View>

            <View style={[styles.typeChip, { backgroundColor: colors.surface }]}>
               <Text style={[styles.typeChipText, { color: colors.textSecondary }]}>
                  {CONTRACT_TYPE_SHORT[contract.contract_type] ?? contract.contract_type}
               </Text>
            </View>
         </View>

         <ExtractionNotice status={contract.extraction_status} />

         <View style={styles.metaRow}>
            {contract.extraction_status === "completed" && (
               <RiskBadge level={contract.highest_risk} size="small" />
            )}

            {contract.total_value ? (
               <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {formatMoney(contract.total_value, contract.currency)}
               </Text>
            ) : null}

            {contract.open_obligation_count ? (
               <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {contract.open_obligation_count} open
               </Text>
            ) : null}

            {isExpiringSoon && (
               <View style={styles.expiring}>
                  <CalendarClock size={12} color={colors.riskHigh} strokeWidth={2.4} />
                  <Text style={[styles.meta, { color: colors.riskHigh }]}>
                     {formatRelativeDeadline(contract.term_end_date)}
                  </Text>
               </View>
            )}
         </View>
      </PressableScale>
   )
}

/*
 * Only speaks up when something is wrong or in flight.
 *
 * `unsupported` gets its own wording rather than being folded into "failed":
 * nothing broke, the document is simply outside the four types this release
 * claims accuracy on, and telling someone their upload failed when it did not
 * invites them to keep retrying it.
 * **/
function ExtractionNotice({ status }: { status: ContractListItem["extraction_status"] }) {
   const { colors } = useTheme()

   if (status === "completed") return null

   const config = {
      pending: { icon: Loader, text: "Queued for analysis", fg: colors.textMuted },
      processing: { icon: Loader, text: "Analysing…", fg: colors.info },
      failed: { icon: AlertTriangle, text: "Analysis failed", fg: colors.error },
      unsupported: {
         icon: Ban,
         text: "Type not supported yet",
         fg: colors.textMuted,
      },
   }[status]

   if (!config) return null

   return (
      <View style={styles.notice}>
         <config.icon size={12} color={config.fg} strokeWidth={2.2} />
         <Text style={[styles.noticeText, { color: config.fg }]}>{config.text}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   card: {
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      padding: Spacing.md,
      gap: Spacing.xs,
   },
   topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.xs,
   },
   identity: {
      flex: 1,
      gap: 2,
   },
   counterpartyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   counterparty: {
      ...Type.caption,
      fontFamily: Fonts.medium,
      flexShrink: 1,
   },
   title: {
      ...Type.subheading,
      fontFamily: Fonts.semiBold,
   },
   typeChip: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 3,
      borderRadius: Radii.xs,
   },
   typeChipText: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
   metaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: Spacing.xs,
   },
   meta: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   expiring: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   notice: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
   },
   noticeText: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
})

export default ContractCard
