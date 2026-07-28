import { useMemo } from "react"
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   ActivityIndicator,
   RefreshControl,
} from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import {
   AlertTriangle,
   Ban,
   Building2,
   CalendarClock,
   CheckCircle2,
   ChevronLeft,
   ListChecks,
   RefreshCw,
   ScrollText,
   ShieldOff,
} from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import {
   useContract,
   useLogContractAction,
   useReextractContract,
   useUpdateObligation,
} from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import { Button } from "@/components/Button"
import {
   ClauseCard,
   DeadlineRow,
   EmptyState,
   ObligationRow,
   SectionHeader,
} from "@/components/contracts"
import { formatMoney, formatShortDate, formatTimeAgo } from "@/utils/helpers/dates"

import {
   ACTION_TYPE_LABELS,
   CLAUSE_TYPE_LABELS,
   CONTRACT_STATUS_LABELS,
   CONTRACT_TYPE_LABELS,
   type ClauseType,
   type ContractClause,
   type ContractDetail,
} from "@/types/api/contracts.types"

/* Severity order used to float the clauses that matter to the top. */
const RISK_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

export default function ContractDetailScreen() {
   const { colors } = useTheme()
   const { id } = useLocalSearchParams<{ id: string }>()

   const { data: contract, isLoading, isRefetching, refetch } = useContract(id)
   const reextract = useReextractContract()
   const updateObligation = useUpdateObligation()

   /*
    * Pulled out of `contract` before the memos below. Depending on
    * `contract?.clauses` directly makes React Compiler bail on the whole
    * component - it infers the dependency as `contract.clauses`, sees that it
    * does not match the written `contract?.clauses`, and skips optimising
    * rather than risk changing when the value recomputes.
    * **/
   const rawClauses = contract?.clauses
   const rawObligations = contract?.obligations

   /*
    * Clauses sorted by severity, with missing ones treated as high.
    *
    * The API returns them in insertion order, which is the order the model
    * happened to emit. Reading a contract review top-to-bottom should mean
    * reading it worst-first: the critical finding on clause eleven is the
    * reason someone opened this screen, and it should not be below the fold.
    * **/
   const clauses = useMemo(() => {
      if (!rawClauses) return []
      return [...rawClauses].sort((a, b) => {
         const rank = (c: ContractClause) =>
            c.is_missing ? RISK_RANK.high : (RISK_RANK[c.risk_level] ?? 99)
         return rank(a) - rank(b)
      })
   }, [rawClauses])

   const openObligations = useMemo(
      () => rawObligations?.filter(o => o.status === "pending") ?? [],
      [rawObligations]
   )

   if (isLoading || !contract) {
      return (
         <View style={[styles.centre, { backgroundColor: colors.background }]}>
            <ActivityIndicator color={colors.primary} />
         </View>
      )
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <TopBar
            onBack={() => router.back()}
            onReextract={() => reextract.mutate(contract.id)}
            busy={reextract.isPending}
            canReextract={contract.extraction_status !== "processing"}
         />

         <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
               <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={colors.textMuted}
                  colors={[colors.primary]}
                  progressBackgroundColor={colors.card}
               />
            }
         >
            <Header contract={contract} />

            <ExtractionState contract={contract} />

            {contract.extraction_status === "completed" && (
               <>
                  {contract.events.length > 0 && (
                     <FadeInView delay={120}
                        style={styles.section}
                     >
                        <SectionHeader title="Deadlines" count={contract.events.length} />
                        <View style={styles.stack}>
                           {contract.events.map(event => (
                              <DeadlineRow key={event.id} event={event} hideContract />
                           ))}
                        </View>
                     </FadeInView>
                  )}

                  <FadeInView delay={160}
                     style={styles.section}
                  >
                     <SectionHeader title="Obligations" count={openObligations.length} />
                     {contract.obligations.length === 0 ? (
                        <EmptyState
                           compact
                           icon={ListChecks}
                           title="No obligations found"
                           body="Nothing in this agreement created a dated commitment either way."
                        />
                     ) : (
                        <View style={styles.stack}>
                           {contract.obligations.map(o => (
                              <ObligationRow
                                 key={o.id}
                                 obligation={o}
                                 hideContract
                                 onToggleDone={() =>
                                    updateObligation.mutate({
                                       id: o.id,
                                       status: o.status === "pending" ? "met" : "pending",
                                    })
                                 }
                              />
                           ))}
                        </View>
                     )}
                  </FadeInView>

                  <FadeInView delay={200}
                     style={styles.section}
                  >
                     <SectionHeader title="Clauses" count={clauses.length} />
                     <View style={styles.stack}>
                        {clauses.map((clause, i) => (
                           <ClauseCard
                              key={clause.id}
                              clause={clause}
                              /* Open the worst one so the screen lands on
                               * substance rather than a wall of collapsed rows. */
                              defaultExpanded={i === 0 && clause.risk_level === "critical"}
                           />
                        ))}
                     </View>
                  </FadeInView>

                  <MissingProtections types={contract.missing_clause_types} />

                  <ActionLog contract={contract} />
               </>
            )}

            <Disclaimer text={contract.disclaimer} />
         </ScrollView>
      </View>
   )
}

function TopBar({
   onBack,
   onReextract,
   busy,
   canReextract,
}: {
   onBack: () => void
   onReextract: () => void
   busy: boolean
   canReextract: boolean
}) {
   const { colors } = useTheme()

   return (
      <View style={styles.topBar}>
         <PressableScale
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            style={StyleSheet.flatten([styles.iconBtn, { backgroundColor: colors.surface }])}
         >
            <ChevronLeft size={19} color={colors.text} strokeWidth={2.2} />
         </PressableScale>

         {canReextract && (
            <PressableScale
               onPress={onReextract}
               disabled={busy}
               accessibilityRole="button"
               accessibilityLabel="Re-run analysis"
               hitSlop={8}
               style={StyleSheet.flatten([styles.iconBtn, { backgroundColor: colors.surface }])}
            >
               {busy ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
               ) : (
                  <RefreshCw size={16} color={colors.textSecondary} strokeWidth={2.2} />
               )}
            </PressableScale>
         )}
      </View>
   )
}

function Header({ contract }: { contract: ContractDetail }) {
   const { colors } = useTheme()

   return (
      <FadeInView style={styles.header}>
         {contract.counterparty_name ? (
            <View style={styles.counterpartyRow}>
               <Building2 size={13} color={colors.textMuted} strokeWidth={2.2} />
               <Text style={[styles.counterparty, { color: colors.textSecondary }]}>
                  {contract.counterparty_name}
               </Text>
            </View>
         ) : null}

         <Text style={[styles.title, { color: colors.text }]}>
            {contract.title || "Untitled contract"}
         </Text>

         <View style={styles.factRow}>
            <Fact label="Type" value={CONTRACT_TYPE_LABELS[contract.contract_type]} />
            <Fact label="Status" value={CONTRACT_STATUS_LABELS[contract.status]} />
         </View>

         <View style={styles.factRow}>
            <Fact
               label="Value"
               value={
                  contract.total_value
                     ? formatMoney(contract.total_value, contract.currency)
                     : "Not stated"
               }
            />
            <Fact
               label="Term ends"
               value={
                  contract.term_end_date ? formatShortDate(contract.term_end_date) : "No end date"
               }
            />
         </View>
      </FadeInView>
   )
}

function Fact({ label, value }: { label: string; value: string }) {
   const { colors } = useTheme()
   return (
      <View style={styles.fact}>
         <Text style={[styles.factLabel, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
         <Text style={[styles.factValue, { color: colors.text }]}>{value}</Text>
      </View>
   )
}

/*
 * The banner shown when extraction has not produced usable results.
 *
 * `unsupported` is worded as a scope limit rather than a failure, because that
 * is what it is: this release claims accuracy on four contract types and
 * refuses to guess at the rest. Telling someone their upload "failed" when the
 * system simply declined to analyse it invites them to keep retrying it.
 * **/
function ExtractionState({ contract }: { contract: ContractDetail }) {
   const { colors } = useTheme()

   if (contract.extraction_status === "completed") return null

   const config = {
      pending: {
         icon: CalendarClock,
         fg: colors.textSecondary,
         bg: colors.surface,
         title: "Queued for analysis",
         body: "This contract is waiting its turn. The page updates itself when it is done.",
      },
      processing: {
         icon: ScrollText,
         fg: colors.info,
         bg: colors.infoBackground,
         title: "Reading the contract",
         body: "Walking every clause type and checking each quote against the source. This usually takes under a minute.",
      },
      failed: {
         icon: AlertTriangle,
         fg: colors.error,
         bg: colors.errorBackground,
         title: "Analysis failed",
         body:
            contract.extraction_error ||
            "Something went wrong reading this document. Try running it again.",
      },
      unsupported: {
         icon: Ban,
         fg: colors.textSecondary,
         bg: colors.surface,
         title: "Not a type we analyse yet",
         body: "SafeRead currently extracts MSAs, SOWs, NDAs and vendor agreements. Rather than guess at this one and give you findings that look authoritative but are not, it has left it alone.",
      },
   }[contract.extraction_status]

   if (!config) return null

   return (
      <FadeInView delay={80}
         style={[styles.stateCard, { backgroundColor: config.bg, borderColor: colors.border }]}
      >
         <config.icon size={18} color={config.fg} strokeWidth={2.2} />
         <View style={styles.stateText}>
            <Text style={[styles.stateTitle, { color: colors.text }]}>{config.title}</Text>
            <Text style={[styles.stateBody, { color: colors.textSecondary }]}>{config.body}</Text>
         </View>
      </FadeInView>
   )
}

/*
 * Clause types the contract does not contain.
 *
 * Rendered as a distinct block rather than mixed into the clause list because
 * absence is a different kind of claim from presence: there is no quote to
 * show and no severity to rank, only the fact that a protection someone might
 * assume they had is not there.
 * **/
function MissingProtections({ types }: { types: ClauseType[] }) {
   const { colors } = useTheme()

   if (!types?.length) return null

   return (
      <FadeInView delay={240} style={styles.section}>
         <SectionHeader title="Not in this contract" count={types.length} />
         <View
            style={[
               styles.missingCard,
               { backgroundColor: colors.card, borderColor: colors.border },
            ]}
         >
            <View style={styles.missingHeader}>
               <ShieldOff size={14} color={colors.riskHigh} strokeWidth={2.2} />
               <Text style={[styles.missingHeaderText, { color: colors.textSecondary }]}>
                  These protections are absent. That may be fine — it is worth knowing either way.
               </Text>
            </View>
            <View style={styles.chipWrap}>
               {types.map(t => (
                  <View
                     key={t}
                     style={[styles.missingChip, { backgroundColor: colors.riskHighBackground }]}
                  >
                     <Text style={[styles.missingChipText, { color: colors.riskHigh }]}>
                        {CLAUSE_TYPE_LABELS[t] ?? t}
                     </Text>
                  </View>
               ))}
            </View>
         </View>
      </FadeInView>
   )
}

/*
 * Who did what.
 *
 * This is the only part of the screen that is not model output, and the one
 * that makes a second seat worth paying for — an alert that resolves into
 * visible, attributed work rather than dying in one person's inbox.
 * **/
function ActionLog({ contract }: { contract: ContractDetail }) {
   const { colors } = useTheme()
   const logAction = useLogContractAction(contract.id)

   return (
      <FadeInView delay={280} style={styles.section}>
         <SectionHeader title="Activity" count={contract.actions.length} />

         {contract.actions.length === 0 ? (
            <EmptyState
               compact
               icon={CheckCircle2}
               title="Nothing logged yet"
               body="Mark this contract reviewed so your team can see it has been looked at."
            />
         ) : (
            <View style={styles.stack}>
               {contract.actions.map(a => (
                  <View
                     key={a.id}
                     style={[
                        styles.actionRow,
                        { backgroundColor: colors.card, borderColor: colors.border },
                     ]}
                  >
                     <View style={[styles.actionDot, { backgroundColor: colors.primaryFaded }]}>
                        <CheckCircle2 size={12} color={colors.primary} strokeWidth={2.4} />
                     </View>
                     <View style={styles.actionText}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>
                           {ACTION_TYPE_LABELS[a.action_type] ?? a.action_type}
                           {a.actor_username ? ` by ${a.actor_username}` : ""}
                        </Text>
                        {!!a.notes && (
                           <Text style={[styles.actionNotes, { color: colors.textSecondary }]}>
                              {a.notes}
                           </Text>
                        )}
                     </View>
                     <Text style={[styles.actionTime, { color: colors.textMuted }]}>
                        {formatTimeAgo(a.created_at)}
                     </Text>
                  </View>
               ))}
            </View>
         )}

         <View style={styles.logButtons}>
            <View style={styles.logButton}>
               <Button
                  title="Mark reviewed"
                  size="small"
                  variant="outline"
                  loading={logAction.isPending}
                  onPress={() => logAction.mutate({ action_type: "review" })}
               />
            </View>
            <View style={styles.logButton}>
               <Button
                  title="Approve"
                  size="small"
                  variant="secondary"
                  onPress={() => logAction.mutate({ action_type: "approve" })}
               />
            </View>
         </View>
      </FadeInView>
   )
}

/*
 * Served with the payload rather than hardcoded, so no screen can render
 * analysis without it. See `settings.LEGAL_DISCLAIMER` on the backend.
 * **/
function Disclaimer({ text }: { text: string }) {
   const { colors } = useTheme()
   if (!text) return null

   return (
      <View style={[styles.disclaimer, { borderTopColor: colors.border }]}>
         <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>{text}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   centre: { flex: 1, alignItems: "center", justifyContent: "center" },
   scroll: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxxl,
      gap: Spacing.lg,
   },
   topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xs,
   },
   iconBtn: {
      width: 34,
      height: 34,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   header: { gap: 4 },
   counterpartyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
   },
   counterparty: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
      marginBottom: Spacing.xs,
   },
   factRow: {
      flexDirection: "row",
      gap: Spacing.md,
   },
   fact: { flex: 1, gap: 1 },
   factLabel: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
   factValue: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   stateCard: {
      flexDirection: "row",
      gap: Spacing.sm,
      alignItems: "flex-start",
      padding: Spacing.md,
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
   },
   stateText: { flex: 1, gap: 3 },
   stateTitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   stateBody: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   section: { gap: 0 },
   stack: { gap: Spacing.xs },
   missingCard: {
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      padding: Spacing.md,
      gap: Spacing.sm,
   },
   missingHeader: {
      flexDirection: "row",
      gap: 6,
      alignItems: "flex-start",
   },
   missingHeaderText: {
      ...Type.caption,
      fontFamily: Fonts.regular,
      flex: 1,
   },
   chipWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
   },
   missingChip: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 4,
      borderRadius: Radii.xs,
   },
   missingChipText: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
   actionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.xs,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
      borderWidth: StyleSheet.hairlineWidth,
   },
   actionDot: {
      width: 22,
      height: 22,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   actionText: { flex: 1, gap: 1 },
   actionTitle: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
   actionNotes: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   actionTime: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
   logButtons: {
      flexDirection: "row",
      gap: Spacing.xs,
      marginTop: Spacing.sm,
   },
   logButton: { flex: 1 },
   disclaimer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: Spacing.md,
   },
   disclaimerText: {
      ...Type.micro,
      fontFamily: Fonts.regular,
   },
})
