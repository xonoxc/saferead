import { useMemo, useState } from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { FileSignature, Plus } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useTabHideScroll } from "@/hooks/useTabHideScroll"
import { useContracts, useCurrentOrg } from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type, TAB_BAR_CLEARANCE } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import { ContractCard, EmptyState } from "@/components/contracts"
import { OrgSetupPrompt } from "@/components/contracts/OrgSetupPrompt"

import {
   CONTRACT_TYPE_SHORT,
   SUPPORTED_CONTRACT_TYPES,
   type ContractType,
} from "@/types/api/contracts.types"

/*
 * The portfolio.
 *
 * Filters are limited to the four supported contract types plus "All". The
 * backend has seven types, but only four are extracted — offering `lease` as a
 * filter would advertise a capability this release does not have and return an
 * empty list for the trouble.
 * **/
export default function ContractsScreen() {
   const { colors } = useTheme()
   const { handleScroll } = useTabHideScroll()
   const { hasOrg, isLoading: orgLoading } = useCurrentOrg()
   const [typeFilter, setTypeFilter] = useState<ContractType | null>(null)

   const filters = useMemo(
      () => (typeFilter ? { contract_type: typeFilter } : undefined),
      [typeFilter]
   )

   const { data, isLoading, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useContracts(filters, hasOrg)

   const contracts = useMemo(() => data?.pages.flatMap(p => p.results) ?? [], [data])

   if (orgLoading) {
      return (
         <View style={[styles.centre, { backgroundColor: colors.background }]}>
            <ActivityIndicator color={colors.primary} />
         </View>
      )
   }

   /*
    * Without an org there is nothing to scope contracts to, and the API would
    * honestly return an empty list. Showing "no contracts" there would be
    * true but useless - the actual blocker is that no workspace exists.
    * **/
   if (!hasOrg) {
      return <OrgSetupPrompt />
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <FadeInView delay={80} style={styles.header}>
            <View style={styles.headerText}>
               <Text style={[styles.eyebrow, { color: colors.textMuted }]}>PORTFOLIO</Text>
               <Text style={[styles.title, { color: colors.text }]}>Contracts</Text>
            </View>

            <PressableScale
               onPress={() => router.push("/(application)/contracts/new")}
               accessibilityRole="button"
               accessibilityLabel="Add a contract"
               style={StyleSheet.flatten([styles.addBtn, { backgroundColor: colors.primary }])}
            >
               <Plus size={18} color={colors.onPrimary} strokeWidth={2.6} />
            </PressableScale>
         </FadeInView>

         <FilterRow active={typeFilter} onChange={setTypeFilter} />

         <FlatList
            data={contracts}
            keyExtractor={item => item.id}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.listContainer}
            contentContainerStyle={[
               styles.list,
               contracts.length === 0 && styles.listEmpty,
               { paddingBottom: TAB_BAR_CLEARANCE },
            ]}
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
            renderItem={({ item, index }) => (
               <FadeInView index={index}>
                  <ContractCard
                     contract={item}
                     onPress={() => router.push(`/(application)/contracts/${item.id}`)}
                  />
               </FadeInView>
            )}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
               isFetchingNextPage ? (
                  <ActivityIndicator style={styles.footer} color={colors.textMuted} />
               ) : null
            }
            ListEmptyComponent={
               isLoading ? (
                  <ActivityIndicator style={styles.footer} color={colors.primary} />
               ) : typeFilter ? (
                  <EmptyState
                     icon={FileSignature}
                     title={`No ${CONTRACT_TYPE_SHORT[typeFilter]} contracts`}
                     body="Nothing in your portfolio matches this type yet."
                     actionLabel="Clear filter"
                     onAction={() => setTypeFilter(null)}
                  />
               ) : (
                  <EmptyState
                     icon={FileSignature}
                     title="No contracts yet"
                     body="Add an agreement and SafeRead pulls out the clauses, deadlines and obligations hiding inside it."
                     actionLabel="Add a contract"
                     onAction={() => router.push("/(application)/contracts/new")}
                  />
               )
            }
         />
      </View>
   )
}

/* Horizontal type filter. "All" first, then only the extractable types. */
function FilterRow({
   active,
   onChange,
}: {
   active: ContractType | null
   onChange: (t: ContractType | null) => void
}) {
   const { colors } = useTheme()

   const options: { value: ContractType | null; label: string }[] = [
      { value: null, label: "All" },
      ...SUPPORTED_CONTRACT_TYPES.map(t => ({ value: t, label: CONTRACT_TYPE_SHORT[t] })),
   ]

   return (
      <FlatList
         horizontal
         data={options}
         keyExtractor={o => o.value ?? "all"}
         showsHorizontalScrollIndicator={false}
         /*
          * `flexGrow: 0` is load-bearing. ScrollView - which FlatList renders -
          * carries `flexGrow: 1` in its own base style, so a horizontal one
          * dropped into a flex column has no intrinsic height and splits the
          * free space with the list below it. The chips then stretch to that
          * height, because a row content container aligns `stretch` by default.
          * Pin the row to its content and centre the chips inside it.
          * **/
         style={styles.filterList}
         contentContainerStyle={styles.filterRow}
         renderItem={({ item }) => {
            const selected = active === item.value
            return (
               <PressableScale
                  onPress={() => onChange(item.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={StyleSheet.flatten([
                     styles.chip,
                     {
                        backgroundColor: selected ? colors.primary : colors.surface,
                        borderColor: selected ? colors.primary : colors.border,
                     },
                  ])}
               >
                  <Text
                     style={[
                        styles.chipText,
                        { color: selected ? colors.onPrimary : colors.textSecondary },
                     ]}
                  >
                     {item.label}
                  </Text>
               </PressableScale>
            )
         }}
      />
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   centre: { flex: 1, alignItems: "center", justifyContent: "center" },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.sm,
      gap: Spacing.sm,
   },
   headerText: { gap: 2 },
   eyebrow: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   addBtn: {
      width: 38,
      height: 38,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   filterList: { flexGrow: 0 },
   filterRow: {
      alignItems: "center",
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.sm,
      gap: Spacing.xs,
   },
   chip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: Radii.xs,
      borderWidth: StyleSheet.hairlineWidth,
   },
   chipText: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
   listContainer: { flex: 1 },
   list: {
      paddingHorizontal: Spacing.lg,
      gap: Spacing.sm,
   },
   listEmpty: { flexGrow: 1, justifyContent: "center" },
   footer: { paddingVertical: Spacing.lg },
})
