import { useState } from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { ChevronDown, ChevronUp, Quote, PenLine, ShieldOff } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type, riskColors } from "@/constants"
import { RiskBadge } from "@/components/RiskBadge"

import { CLAUSE_TYPE_LABELS, type ContractClause } from "@/types/api/contracts.types"

/*
 * One extracted clause.
 *
 * The order of information is the argument this product makes, so it is worth
 * stating: **plain English first, verbatim quote second, redline third.**
 *
 * The temptation is to lead with the quote, because the quote is the evidence.
 * But someone opening this screen does not yet know whether they care — they
 * need the "so what" before the proof. The quote is then one tap away and
 * visually marked as *the document's words, not ours*, which is the whole
 * distinction between this and a chatbot summary.
 *
 * A clause that is **missing** inverts the layout: there is no quote to show,
 * and the absence itself is the finding.
 * **/

interface ClauseCardProps {
   clause: ContractClause
   /* Open on mount — used for the critical clauses surfaced at the top. */
   defaultExpanded?: boolean
}

export function ClauseCard({ clause, defaultExpanded = false }: ClauseCardProps) {
   const { colors } = useTheme()
   const [expanded, setExpanded] = useState(defaultExpanded)

   const risk = riskColors(colors, clause.is_missing ? "high" : clause.risk_level)
   const label = CLAUSE_TYPE_LABELS[clause.clause_type] ?? clause.clause_type_display

   const hasDetail = !!clause.extracted_text || !!clause.suggested_redline

   return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
         {/*
          * A colour bar rather than a tinted card background. Tinting the whole
          * surface makes a list of clauses read as a stack of alerts; a 3px
          * edge marker keeps the severity scannable down the left margin while
          * the text stays on a neutral surface where it is legible.
          * **/}
         <View style={[styles.riskEdge, { backgroundColor: risk.fg }]} />

         <Pressable
            onPress={() => hasDetail && setExpanded(v => !v)}
            disabled={!hasDetail}
            accessibilityRole={hasDetail ? "button" : "text"}
            accessibilityState={{ expanded }}
            style={styles.body}
         >
            <View style={styles.header}>
               <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
               {hasDetail &&
                  (expanded ? (
                     <ChevronUp size={16} color={colors.textMuted} />
                  ) : (
                     <ChevronDown size={16} color={colors.textMuted} />
                  ))}
            </View>

            <View style={styles.badgeRow}>
               <RiskBadge
                  level={clause.risk_level}
                  isMissing={clause.is_missing}
                  size="small"
               />
               {/*
                * Shown *in addition to* the risk badge, not instead of it: a
                * high-risk finding whose citation could not be verified is
                * still high risk, and hiding one fact behind the other would
                * misrepresent both.
                * **/}
               {!clause.is_missing && !clause.span_verified && (
                  <RiskBadge level={null} unverified size="small" />
               )}
            </View>

            {clause.is_missing ? (
               <View style={styles.missingRow}>
                  <ShieldOff size={13} color={colors.riskHigh} strokeWidth={2.2} />
                  <Text style={[styles.missingText, { color: colors.textSecondary }]}>
                     {clause.plain_english ||
                        `This agreement has no ${label.toLowerCase()} clause.`}
                  </Text>
               </View>
            ) : (
               <Text style={[styles.plain, { color: colors.textSecondary }]}>
                  {clause.plain_english || "No summary available for this clause."}
               </Text>
            )}
         </Pressable>

         {expanded && !clause.is_missing && (
            <View style={styles.detail}>
               {!!clause.extracted_text && (
                  <View
                     style={[
                        styles.quoteBlock,
                        { backgroundColor: colors.surface, borderLeftColor: colors.borderStrong },
                     ]}
                  >
                     <View style={styles.quoteHeader}>
                        <Quote size={11} color={colors.textMuted} strokeWidth={2.4} />
                        <Text style={[styles.quoteLabel, { color: colors.textMuted }]}>
                           {clause.span_verified
                              ? "FROM THE DOCUMENT"
                              : "QUOTED — NOT FOUND IN SOURCE"}
                        </Text>
                     </View>
                     <Text style={[styles.quote, { color: colors.text }]}>
                        {clause.extracted_text}
                     </Text>
                     {clause.page_ref ? (
                        <Text style={[styles.pageRef, { color: colors.textMuted }]}>
                           Page {clause.page_ref}
                        </Text>
                     ) : null}
                  </View>
               )}

               {!!clause.suggested_redline && (
                  <View style={styles.redline}>
                     <View style={styles.quoteHeader}>
                        <PenLine size={11} color={colors.info} strokeWidth={2.4} />
                        <Text style={[styles.quoteLabel, { color: colors.info }]}>
                           SUGGESTED CHANGE
                        </Text>
                     </View>
                     <Text style={[styles.redlineText, { color: colors.textSecondary }]}>
                        {clause.suggested_redline}
                     </Text>
                  </View>
               )}
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   card: {
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: "hidden",
   },
   riskEdge: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
   },
   body: {
      padding: Spacing.md,
      paddingLeft: Spacing.md + 3,
      gap: Spacing.xs,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing.xs,
   },
   label: {
      ...Type.body,
      fontFamily: Fonts.semiBold,
      flex: 1,
   },
   badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: Spacing.xxs,
   },
   plain: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
   },
   missingRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
   },
   missingText: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      flex: 1,
   },
   detail: {
      paddingHorizontal: Spacing.md,
      paddingLeft: Spacing.md + 3,
      paddingBottom: Spacing.md,
      gap: Spacing.sm,
   },
   quoteBlock: {
      borderRadius: Radii.xs,
      borderLeftWidth: 2,
      padding: Spacing.sm,
      gap: 6,
   },
   quoteHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
   },
   quoteLabel: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
   quote: {
      ...Type.bodySmall,
      /* Serif-ish weight change is not available, so italic marks the shift
       * from our voice to the document's. */
      fontFamily: Fonts.regular,
      fontStyle: "italic",
   },
   pageRef: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
   redline: {
      gap: 6,
   },
   redlineText: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
   },
})

export default ClauseCard
