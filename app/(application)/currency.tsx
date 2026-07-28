import { useMemo, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native"
import { router } from "expo-router"
import { Check, ChevronLeft, Smartphone } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useSupportedCurrencies } from "@/hooks/queries/plans"
import { useLocaleStore } from "@/store/useLocaleStore"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import SearchBar from "@/components/search/SearchBar"

import type { SupportedCurrency } from "@/services/plans.service"

/*
 * Currency picker.
 *
 * "Use my device region" is a real, selectable row rather than an implicit
 * default. Someone who travels wants prices to follow them; someone who has
 * emigrated wants them pinned. Both are ordinary, and only an explicit
 * "follow the device" option lets a user go back to the first after choosing
 * the second.
 *
 * The list comes from the server so the picker cannot offer a currency the
 * API would refuse to price in.
 * **/
export default function CurrencyScreen() {
   const { colors } = useTheme()
   const [query, setQuery] = useState("")

   const { data, isLoading } = useSupportedCurrencies()
   const currencyChoice = useLocaleStore(s => s.currencyChoice)
   const detected = useLocaleStore(s => s.detectedCurrency)
   const setCurrency = useLocaleStore(s => s.setCurrency)

   const currencies = data?.results ?? []

   const filtered = useMemo(() => {
      const q = query.trim().toLowerCase()
      if (!q) return currencies
      return currencies.filter(
         c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      )
   }, [currencies, query])

   const choose = async (code: string | null) => {
      await setCurrency(code)
      router.back()
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.topBar}>
            <PressableScale
               onPress={() => router.back()}
               accessibilityRole="button"
               accessibilityLabel="Go back"
               hitSlop={8}
               style={StyleSheet.flatten([styles.iconBtn, { backgroundColor: colors.surface }])}
            >
               <ChevronLeft size={19} color={colors.text} strokeWidth={2.2} />
            </PressableScale>
         </View>

         <FadeInView style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Currency</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
               Plan prices are shown in this currency. Converted amounts are approximate.
            </Text>
         </FadeInView>

         <View style={styles.searchWrap}>
            <SearchBar
               searchQuery={query}
               onSearchChange={setQuery}
               placeholder="Search currencies..."
            />
         </View>

         {isLoading ? (
            <ActivityIndicator color={colors.primary} style={styles.loading} />
         ) : (
            <ScrollView
               contentContainerStyle={styles.list}
               keyboardShouldPersistTaps="handled"
               showsVerticalScrollIndicator={false}
            >
               <Pressable
                  onPress={() => choose(null)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: currencyChoice === null }}
                  style={[styles.row, { borderColor: colors.border }]}
               >
                  <View style={[styles.badge, { backgroundColor: colors.primaryFaded }]}>
                     <Smartphone size={15} color={colors.primary} strokeWidth={2.2} />
                  </View>
                  <View style={styles.rowText}>
                     <Text style={[styles.rowTitle, { color: colors.text }]}>
                        Use my device region
                     </Text>
                     <Text style={[styles.rowBody, { color: colors.textMuted }]}>
                        Currently {detected}
                     </Text>
                  </View>
                  {currencyChoice === null && (
                     <Check size={18} color={colors.primary} strokeWidth={2.6} />
                  )}
               </Pressable>

               {filtered.map(c => (
                  <CurrencyRow
                     key={c.code}
                     currency={c}
                     selected={currencyChoice === c.code}
                     onPress={() => choose(c.code)}
                  />
               ))}

               {filtered.length === 0 && (
                  <Text style={[styles.empty, { color: colors.textMuted }]}>
                     No currency matches “{query}”.
                  </Text>
               )}
            </ScrollView>
         )}
      </View>
   )
}

function CurrencyRow({
   currency,
   selected,
   onPress,
}: {
   currency: SupportedCurrency
   selected: boolean
   onPress: () => void
}) {
   const { colors } = useTheme()

   return (
      <Pressable
         onPress={onPress}
         accessibilityRole="button"
         accessibilityState={{ selected }}
         style={[styles.row, { borderColor: colors.border }]}
      >
         <View style={[styles.badge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.symbol, { color: colors.text }]}>{currency.symbol}</Text>
         </View>
         <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{currency.name}</Text>
            <Text style={[styles.rowBody, { color: colors.textMuted }]}>{currency.code}</Text>
         </View>
         {selected && <Check size={18} color={colors.primary} strokeWidth={2.6} />}
      </Pressable>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   topBar: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.xxs,
   },
   iconBtn: {
      width: 34,
      height: 34,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   header: {
      paddingHorizontal: Spacing.lg,
      gap: 4,
      marginBottom: Spacing.sm,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
   },
   subtitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
   },
   searchWrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xs },
   loading: { paddingVertical: Spacing.xl },
   list: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xl,
   },
   row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
   },
   badge: {
      width: 34,
      height: 34,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   symbol: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   rowText: { flex: 1, gap: 1 },
   rowTitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   rowBody: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   empty: {
      ...Type.caption,
      fontFamily: Fonts.regular,
      textAlign: "center",
      paddingVertical: Spacing.lg,
   },
})
