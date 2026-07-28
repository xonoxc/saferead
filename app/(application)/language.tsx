import { useMemo, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { router } from "expo-router"
import { Check, ChevronLeft, Smartphone } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useLocaleStore } from "@/store/useLocaleStore"
import { useTranslation } from "@/i18n"
import { APP_LANGUAGES, languageLabel, type AppLanguage } from "@/constants/languages"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import SearchBar from "@/components/search/SearchBar"

/*
 * Language picker.
 *
 * This screen used to hold its selection in local `useState` against a
 * hardcoded list of twenty languages - picking one moved a tick and changed
 * nothing else, and the choice was gone on the next mount. It now writes to
 * the locale store, which persists it, mirrors it to the account, and
 * re-renders every screen using `useTranslation`.
 *
 * The list is `APP_LANGUAGES`, i.e. only languages that have a translation
 * file, so choosing one cannot leave the user staring at English wondering
 * what broke.
 * **/
export default function LanguageScreen() {
   const { colors } = useTheme()
   const { t } = useTranslation()
   const [query, setQuery] = useState("")

   const languageChoice = useLocaleStore(s => s.languageChoice)
   const detected = useLocaleStore(s => s.detectedLanguage)
   const setLanguage = useLocaleStore(s => s.setLanguage)

   const filtered = useMemo(() => {
      const q = query.trim().toLowerCase()
      if (!q) return APP_LANGUAGES
      return APP_LANGUAGES.filter(
         l =>
            l.name.toLowerCase().includes(q) ||
            l.nativeName.toLowerCase().includes(q) ||
            l.code.includes(q)
      )
   }, [query])

   const choose = async (code: string | null) => {
      await setLanguage(code)
      router.back()
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.topBar}>
            <PressableScale
               onPress={() => router.back()}
               accessibilityRole="button"
               accessibilityLabel={t("common.back")}
               hitSlop={8}
               style={StyleSheet.flatten([styles.iconBtn, { backgroundColor: colors.surface }])}
            >
               <ChevronLeft size={19} color={colors.text} strokeWidth={2.2} />
            </PressableScale>
         </View>

         <FadeInView style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t("language.title")}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
               {t("language.subtitle")}
            </Text>
         </FadeInView>

         <View style={styles.searchWrap}>
            <SearchBar
               searchQuery={query}
               onSearchChange={setQuery}
               placeholder={t("language.searchPlaceholder")}
            />
         </View>

         <ScrollView
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
         >
            <Pressable
               onPress={() => choose(null)}
               accessibilityRole="button"
               accessibilityState={{ selected: languageChoice === null }}
               style={[styles.row, { borderColor: colors.border }]}
            >
               <View style={[styles.badge, { backgroundColor: colors.primaryFaded }]}>
                  <Smartphone size={15} color={colors.primary} strokeWidth={2.2} />
               </View>
               <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>
                     {t("language.useDevice")}
                  </Text>
                  <Text style={[styles.rowBody, { color: colors.textMuted }]}>
                     {languageLabel(detected)}
                  </Text>
               </View>
               {languageChoice === null && (
                  <Check size={18} color={colors.primary} strokeWidth={2.6} />
               )}
            </Pressable>

            {filtered.map(language => (
               <LanguageRow
                  key={language.code}
                  language={language}
                  selected={languageChoice === language.code}
                  onPress={() => choose(language.code)}
               />
            ))}

            {filtered.length === 0 && (
               <Text style={[styles.empty, { color: colors.textMuted }]}>
                  {t("language.noMatch", { query })}
               </Text>
            )}
         </ScrollView>
      </View>
   )
}

function LanguageRow({
   language,
   selected,
   onPress,
}: {
   language: AppLanguage
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
            <Text style={styles.flag}>{language.flag}</Text>
         </View>
         <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{language.nativeName}</Text>
            <Text style={[styles.rowBody, { color: colors.textMuted }]}>{language.name}</Text>
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
   flag: { fontSize: 17 },
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
