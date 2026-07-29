import { useMemo, useState } from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { FileSignature, Plus } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useTabHideScroll } from "@/hooks/useTabHideScroll"
import { useDebouncedCallback } from "@/hooks/useDebouncCallback"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"
import { useContracts, useCurrentOrg, useDeleteContract } from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type, TAB_BAR_CLEARANCE } from "@/constants"
import { contractFilterFields } from "@/constants/filters"
import { FadeInView, PressableScale } from "@/components/motion"
import { ContractCard, EmptyState } from "@/components/contracts"
import { OrgSetupPrompt } from "@/components/contracts/OrgSetupPrompt"
import { SettingsButton } from "@/components/settings/SettingsButton"
import { UniversalFilter } from "@/components/filters/UniversalFilters"
import SearchBar from "@/components/search/SearchBar"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"

import {
   CONTRACT_TYPE_SHORT,
   SUPPORTED_CONTRACT_TYPES,
   type ContractFilterOptions,
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
   const showBottomAlert = useDrawerAlert()
   const { mutateAsync: deleteContract } = useDeleteContract()

   const [typeFilter, setTypeFilter] = useState<ContractType | null>(null)
   const [showFilter, setShowFilter] = useState(false)
   const [panelFilters, setPanelFilters] = useState<Record<string, any>>({})

   /*
    * Two pieces of state for one search box. `searchInput` is what the field
    * shows and must update on every keystroke; `search` is what the query key
    * uses, and lags behind so a five-letter word is one request rather than
    * five — each of which would otherwise re-render the whole list.
    * **/
   const [searchInput, setSearchInput] = useState("")
   const [search, setSearch] = useState("")
   const commitSearch = useDebouncedCallback(setSearch, 350)

   const handleSearchChange = (text: string) => {
      setSearchInput(text)
      commitSearch(text.trim())
   }

   /*
    * Empty values are stripped rather than sent as `status=`: the select fields
    * use "" for their "any" option, and a query key carrying empty strings is a
    * different key from one without them, so leaving them in would refetch and
    * re-cache the identical list under a second key.
    * **/
   const filters = useMemo<ContractFilterOptions>(() => {
      const merged: Record<string, any> = {
         ...panelFilters,
         ...(typeFilter ? { contract_type: typeFilter } : {}),
         ...(search ? { search } : {}),
      }

      return Object.fromEntries(
         Object.entries(merged).filter(([, v]) => v !== "" && v !== null && v !== undefined)
      )
   }, [panelFilters, typeFilter, search])

   const hasAnyFilter = Object.keys(filters).length > 0

   const { data, isLoading, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useContracts(filters, hasOrg)

   const contracts = useMemo(() => data?.pages.flatMap(p => p.results) ?? [], [data])

   const clearFilters = () => {
      setTypeFilter(null)
      setPanelFilters({})
      setSearchInput("")
      setSearch("")
   }

   /*
    * Deleting a contract also deletes its clauses, obligations and events —
    * everything the extraction produced — so the confirmation names the
    * contract rather than asking a generic "are you sure?".
    * **/
   const handleDelete = (id: string, title: string) => {
      const remove = async () => {
         const resp = await attempt(() => deleteContract(id))
         if (!resp.ok) {
            showBottomAlert({
               type: "error",
               title: "Could not remove",
               message: getErrorMessage(resp.error) || "Failed to remove this contract.",
               actions: [{ text: "OK", style: "primary", onPress: () => {} }],
            })
         }
      }

      showBottomAlert({
         type: "error",
         title: "Remove contract",
         message: `"${title || "This contract"}" and everything extracted from it will be deleted. This cannot be undone.`,
         suppressKey: "delete-contract",
         actions: [
            { text: "Cancel", style: "ghost", onPress: () => {} },
            { text: "Remove", style: "destructive", onPress: remove },
         ],
      })
   }

   /*
    * The header renders in every state, including the two below.
    *
    * It used to sit inside the "has an org" branch, so a user without one — the
    * state every new account starts in — got `OrgSetupPrompt` and nothing else,
    * and Settings was unreachable from this tab entirely. Screen chrome must
    * not live inside a conditional branch.
    * **/
   const header = (
      <FadeInView delay={80} style={styles.header}>
         <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>PORTFOLIO</Text>
            <Text style={[styles.title, { color: colors.text }]}>Contracts</Text>
         </View>

         <View style={styles.headerActions}>
            {hasOrg && (
               <PressableScale
                  onPress={() => router.push("/(application)/contracts/new")}
                  accessibilityRole="button"
                  accessibilityLabel="Add a contract"
                  style={StyleSheet.flatten([styles.addBtn, { backgroundColor: colors.primary }])}
               >
                  <Plus size={18} color={colors.onPrimary} strokeWidth={2.6} />
               </PressableScale>
            )}

            <SettingsButton />
         </View>
      </FadeInView>
   )

   if (orgLoading) {
      return (
         <View style={[styles.container, { backgroundColor: colors.background }]}>
            {header}
            <View style={styles.centre}>
               <ActivityIndicator color={colors.primary} />
            </View>
         </View>
      )
   }

   /*
    * Without an org there is nothing to scope contracts to, and the API would
    * honestly return an empty list. Showing "no contracts" there would be
    * true but useless - the actual blocker is that no workspace exists.
    * **/
   if (!hasOrg) {
      return (
         <View style={[styles.container, { backgroundColor: colors.background }]}>
            {header}
            <OrgSetupPrompt />
         </View>
      )
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         {header}

         <View style={styles.searchRow}>
            <SearchBar
               searchQuery={searchInput}
               onSearchChange={handleSearchChange}
               placeholder="Search title or counterparty..."
               showFilter
               onFilterPress={() => setShowFilter(true)}
            />
         </View>

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
            keyboardShouldPersistTaps="handled"
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
                     onDelete={() => handleDelete(item.id, item.title)}
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
               ) : hasAnyFilter ? (
                  <EmptyState
                     icon={FileSignature}
                     title="Nothing matches"
                     body="No contract in your portfolio matches this search and filter combination."
                     actionLabel="Clear all"
                     onAction={clearFilters}
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

         <UniversalFilter
            fields={contractFilterFields}
            visible={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={setPanelFilters}
            currentFilters={panelFilters}
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
   headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
   },
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
   searchRow: { paddingHorizontal: Spacing.lg },
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
