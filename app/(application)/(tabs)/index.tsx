import { useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { router } from "expo-router"
import { ArrowRight, CalendarClock, FileSignature, ShieldOff, Sparkles } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useDocuments } from "@/hooks/queries/docs"
import { useTabHideScroll } from "@/hooks/useTabHideScroll"
import {
   useCurrentOrg,
   useObligationSummary,
   useOrgStats,
   useUpcomingEvents,
} from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type, TAB_BAR_CLEARANCE } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"

import { AttentionHero, type AttentionItem } from "@/components/home/AttentionHero"
import { MoneyRow } from "@/components/home/MoneyRow"
import { PortfolioStrip } from "@/components/home/PortfolioStrip"
import { RecentScans } from "@/components/home/RecentScans"
import { DeadlineRow, EmptyState, SectionHeader } from "@/components/contracts"

import type { ContractEvent } from "@/types/api/contracts.types"

/*
 * Home.
 *
 * This screen used to report on the tool: total documents, completed, failed,
 * average confidence. All four are true and none of them change what anyone
 * does next. The rewrite asks one question instead — **what needs me today?**
 * — and orders everything below that answer by how quickly it decays:
 *
 *   1. Things that are already late or about to be.
 *   2. Money outstanding in both directions.
 *   3. Portfolio size, as context rather than a headline.
 *   4. Deadlines with room left in them.
 *   5. Recent scans, the top of the funnel, deliberately last.
 *
 * A user with no organisation sees a different screen entirely. Showing them
 * an empty command centre — four zeroes and "all caught up" — would be
 * technically accurate and completely useless, so they get the scan flow they
 * already have plus one honest pitch for what a workspace adds.
 * **/
export default function HomeScreen() {
   const { colors } = useTheme()
   const { user } = useAuth()
   const { handleScroll } = useTabHideScroll()

   const { org, orgId, hasOrg, isLoading: orgLoading, refetch: refetchOrg } = useCurrentOrg()

   const { data: stats, refetch: refetchStats } = useOrgStats(orgId)
   const { data: summary, refetch: refetchSummary } = useObligationSummary(hasOrg)
   const { data: events, refetch: refetchEvents } = useUpcomingEvents(30, hasOrg)

   const {
      data: docsData,
      isLoading: docsLoading,
      refetch: refetchDocs,
      isRefetching,
   } = useDocuments(undefined, true)

   const documents = useMemo(() => docsData?.pages.flatMap(p => p.results) ?? [], [docsData])

   /* Unresolved deadlines only — a renewal someone already handled is history. */
   const liveEvents = useMemo(() => (events ?? []).filter(e => e.is_unresolved), [events])

   const refetchAll = () => {
      refetchOrg()
      refetchDocs()
      if (hasOrg) {
         refetchStats()
         refetchSummary()
         refetchEvents()
      }
   }

   /*
    * The attention list.
    *
    * Only non-zero entries survive into the hero, so this can be built
    * unconditionally and filtered there — which keeps the ordering (most
    * urgent first) in one place rather than scattered across conditionals.
    * **/
   const attention: AttentionItem[] = [
      {
         label: summary?.overdue_count === 1 ? "obligation is overdue" : "obligations are overdue",
         count: summary?.overdue_count ?? 0,
         onPress: () => router.push("/(application)/(tabs)/contracts"),
      },
      {
         label: liveEvents.length === 1 ? "deadline is closing in" : "deadlines are closing in",
         count: liveEvents.length,
         onPress: () => router.push("/(application)/(tabs)/contracts"),
      },
      {
         label:
            stats?.critical_clauses === 1
               ? "contract has a critical clause"
               : "contracts have critical clauses",
         count: stats?.critical_clauses ?? 0,
         onPress: () => router.push("/(application)/(tabs)/contracts"),
      },
   ]

   return (
      <ScrollView
         onScroll={handleScroll}
         scrollEventThrottle={16}
         style={{ flex: 1, backgroundColor: colors.background }}
         contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_CLEARANCE }]}
         showsVerticalScrollIndicator={false}
         refreshControl={
            <RefreshControl
               refreshing={isRefetching}
               onRefresh={refetchAll}
               tintColor={colors.textMuted}
               colors={[colors.primary]}
               progressBackgroundColor={colors.card}
            />
         }
      >
         <Greeting username={user?.username} orgName={org?.name ?? null} />

         {hasOrg ? (
            <>
               <AttentionHero
                  items={attention}
                  onPressPrimary={() => router.push("/(application)/(tabs)/contracts")}
               />

               {summary && (
                  <MoneyRow
                     summary={summary}
                     onPressOutgoing={() => router.push("/(application)/(tabs)/contracts")}
                     onPressIncoming={() => router.push("/(application)/(tabs)/contracts")}
                  />
               )}

               {stats && (
                  <PortfolioStrip
                     stats={stats}
                     onPressContracts={() => router.push("/(application)/(tabs)/contracts")}
                     onPressSeats={() => router.push("/(application)/(tabs)/settings")}
                  />
               )}

               <Deadlines events={liveEvents} />

               {stats && stats.contract_count === 0 && <FirstContractPrompt />}
            </>
         ) : (
            !orgLoading && <WorkspacePitch />
         )}

         <RecentScans
            documents={documents}
            isLoading={docsLoading}
            onPressItem={doc =>
               router.push({ pathname: "/(application)/analysisres", params: { id: doc.id } })
            }
            onSeeAll={() => router.push("/(application)/(tabs)/analyize")}
         />
      </ScrollView>
   )
}

function Greeting({ username, orgName }: { username?: string; orgName: string | null }) {
   const { colors } = useTheme()

   return (
      <FadeInView delay={80} style={styles.greeting}>
         <Text style={[styles.eyebrow, { color: colors.textMuted }]}>
            {orgName ? orgName.toUpperCase() : "WELCOME BACK"}
         </Text>
         <Text style={[styles.name, { color: colors.text }]}>{username ?? "there"}</Text>
      </FadeInView>
   )
}

/*
 * The next 30 days, sorted by when action is required rather than when the
 * event lands. Capped at four — a home screen is a summary, not the list.
 * **/
function Deadlines({ events }: { events: ContractEvent[] }) {
   if (events.length === 0) return null

   const overflow = events.length > 4

   return (
      <FadeInView delay={220}>
         <SectionHeader
            title="Next 30 days"
            count={events.length}
            actionLabel={overflow ? "See all" : undefined}
            onAction={overflow ? () => router.push("/(application)/(tabs)/contracts") : undefined}
         />
         <View style={styles.stack}>
            {events.slice(0, 4).map(event => (
               <DeadlineRow
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/(application)/contracts/${event.contract}`)}
               />
            ))}
         </View>
      </FadeInView>
   )
}

/* Shown once a workspace exists but is still empty. */
function FirstContractPrompt() {
   return (
      <EmptyState
         icon={FileSignature}
         title="Your portfolio is empty"
         body="Add your first agreement and SafeRead pulls out every deadline, obligation and one-sided clause hiding in it."
         actionLabel="Add a contract"
         onAction={() => router.push("/(application)/contracts/new")}
      />
   )
}

/*
 * The pitch for users who only scan.
 *
 * Deliberately concrete about what changes rather than describing a feature.
 * "Track contracts" means nothing; "know which agreements auto-renew before
 * they do" is the thing someone has actually been bitten by.
 * **/
function WorkspacePitch() {
   const { colors } = useTheme()

   return (
      <FadeInView delay={140}
         style={[styles.pitch, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
         <View style={[styles.pitchIcon, { backgroundColor: colors.primaryFaded }]}>
            <Sparkles size={18} color={colors.primary} strokeWidth={2.2} />
         </View>

         <Text style={[styles.pitchTitle, { color: colors.text }]}>
            Stop re-reading the same contracts
         </Text>
         <Text style={[styles.pitchBody, { color: colors.textSecondary }]}>
            A scan tells you about one document. A workspace tracks all of them — so you know
            which agreements auto-renew, what you owe this month, and which ones have no
            liability cap.
         </Text>

         <View style={styles.pitchPoints}>
            <PitchPoint icon={CalendarClock} text="Renewal and notice deadlines, dated" />
            <PitchPoint icon={ShieldOff} text="Find agreements missing key protections" />
         </View>

         <PressableScale
            onPress={() => router.push("/(application)/(tabs)/contracts")}
            accessibilityRole="button"
            style={StyleSheet.flatten([styles.pitchCta, { backgroundColor: colors.primary }])}
         >
            <Text style={[styles.pitchCtaText, { color: colors.onPrimary }]}>
               Set up your workspace
            </Text>
            <ArrowRight size={15} color={colors.onPrimary} strokeWidth={2.4} />
         </PressableScale>
      </FadeInView>
   )
}

function PitchPoint({ icon: Icon, text }: { icon: typeof CalendarClock; text: string }) {
   const { colors } = useTheme()
   return (
      <View style={styles.pitchPoint}>
         <Icon size={13} color={colors.textMuted} strokeWidth={2.2} />
         <Text style={[styles.pitchPointText, { color: colors.textSecondary }]}>{text}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   content: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xs,
      gap: Spacing.lg,
   },
   greeting: { gap: 2 },
   eyebrow: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   name: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   stack: { gap: Spacing.xxs },
   pitch: {
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      padding: Spacing.md,
      gap: Spacing.xs,
   },
   pitchIcon: {
      width: 38,
      height: 38,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 2,
   },
   pitchTitle: {
      ...Type.subheading,
      fontFamily: Fonts.semiBold,
   },
   pitchBody: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
   },
   pitchPoints: {
      gap: 6,
      marginTop: Spacing.xxs,
      marginBottom: Spacing.xs,
   },
   pitchPoint: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
   },
   pitchPointText: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   pitchCta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      borderRadius: Radii.sm,
   },
   pitchCtaText: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
})
