import { useState } from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { ChevronDown, ChevronUp, Quote, PenLine } from "lucide-react-native"

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

   const label = CLAUSE_TYPE_LABELS[clause.clause_type] ?? clause.clause_type_display

   const hasDetail = !!clause.extracted_text || !!clause.suggested_redline

   /*
    * The rail is drawn only where it changes a decision.
    *
    * It used to run down every card in the palette's risk colour, which made a
    * clause list read as a row of identical warning stripes — and a marker
    * that appears on all twelve clauses tells you nothing about any of them.
    * Standard and worth-knowing clauses carry their level in the badge alone;
    * the margin stays quiet so the ones that need negotiating own it.
    * **/
   const railed =
      clause.is_missing || clause.risk_level === "high" || clause.risk_level === "critical"
   const rail = riskColors(colors, clause.is_missing ? "high" : clause.risk_level).fg

   return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
         {railed && <View style={[styles.riskEdge, { backgroundColor: rail }]} />}

         <Pressable
            onPress={() => hasDetail && setExpanded(v => !v)}
            disabled={!hasDetail}
            accessibilityRole={hasDetail ? "button" : "text"}
            accessibilityState={{ expanded }}
            style={styles.body}
         >
            {/*
             * Title and severity share one line. They were stacked, which cost
             * a third of the card's height to say two words and pushed the
             * summary — the part worth reading — below the fold on a list.
             * **/}
            <View style={styles.header}>
               <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
                  {label}
               </Text>
               <RiskBadge level={clause.risk_level} isMissing={clause.is_missing} size="small" />
               {hasDetail &&
                  (expanded ? (
                     <ChevronUp size={16} color={colors.textMuted} />
                  ) : (
                     <ChevronDown size={16} color={colors.textMuted} />
                  ))}
            </View>

            {/*
             * A missing clause needs no icon of its own — the badge already
             * says "Not present" over a CircleSlash. Stating absence three
             * times (badge, icon, sentence) made the finding look automated
             * rather than considered.
             * **/}
            <Text style={[styles.plain, { color: colors.textSecondary }]}>
               {clause.plain_english ||
                  (clause.is_missing
                     ? `This agreement has no ${label.toLowerCase()} clause.`
                     : "No summary available for this clause.")}
            </Text>

            {/*
             * Shown *in addition to* the risk badge, not instead of it: a
             * high-risk finding whose citation could not be verified is still
             * high risk, and hiding one fact behind the other would
             * misrepresent both. It sits under the summary as the footnote it
             * is, so the header row stays a title and one verdict.
             * **/}
            {!clause.is_missing && !clause.span_verified && (
               <View style={styles.footnote}>
                  <RiskBadge level={null} unverified size="small" />
               </View>
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
      borderRadius: Radii.sm,
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
   /*
    * Padding is `sm`, and the left inset is held at `sm + 3` whether or not the
    * rail is drawn — text that shifts 3px between neighbouring cards reads as a
    * misalignment, which is exactly the sloppiness a dense list exposes.
    * **/
   body: {
      padding: Spacing.sm,
      paddingLeft: Spacing.sm + 3,
      gap: 6,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
   },
   label: {
      ...Type.body,
      fontFamily: Fonts.semiBold,
      flex: 1,
   },
   plain: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
   },
   footnote: {
      flexDirection: "row",
      marginTop: 2,
   },
   detail: {
      paddingHorizontal: Spacing.sm,
      paddingLeft: Spacing.sm + 3,
      paddingBottom: Spacing.sm,
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
