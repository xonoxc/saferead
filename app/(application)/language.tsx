import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { ArrowLeft, Check, Globe, Search } from "lucide-react-native"
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  region: string
  isPopular?: boolean
}

export default function LanguageScreen() {
  const { colors } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [searchQuery, setSearchQuery] = useState("")

  const languages: Language[] = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      region: "Americas",
      isPopular: true,
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      flag: "🇪🇸",
      region: "Europe",
      isPopular: true,
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      flag: "🇫🇷",
      region: "Europe",
      isPopular: true,
    },
    {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      region: "Europe",
      isPopular: true,
    },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", region: "Europe" },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", region: "Europe" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", region: "Europe" },
    {
      code: "zh",
      name: "Chinese",
      nativeName: "中文",
      flag: "🇨🇳",
      region: "Asia",
      isPopular: true,
    },
    {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語",
      flag: "🇯🇵",
      region: "Asia",
      isPopular: true,
    },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", region: "Asia" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", region: "Middle East" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "Asia" },
    { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", region: "Asia" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", region: "Asia" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", region: "Europe" },
    { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", region: "Europe" },
    { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", region: "Europe" },
    { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", region: "Europe" },
    { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", region: "Europe" },
    { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", region: "Europe" },
  ]

  const filteredLanguages = languages.filter(
    lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const popularLanguages = filteredLanguages.filter(lang => lang.isPopular)
  const otherLanguages = filteredLanguages.filter(lang => !lang.isPopular)

  const regions = [...new Set(filteredLanguages.map(lang => lang.region))].sort()

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    // Here you would typically save the language preference
    // and potentially restart the app or update the locale
  }

  const LanguageItem: React.FC<{ language: Language; index: number; isSelected: boolean }> = ({
    language,
    index,
    isSelected,
  }) => {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))

    const handlePress = () => {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1)
      })
      handleLanguageSelect(language.code)
    }

    return (
      <Animated.View entering={FadeInRight.delay(index * 50).springify()} style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.languageItem,
            {
              backgroundColor: isSelected ? colors.primary + "15" : colors.card,
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
          onPress={handlePress}
          activeOpacity={1}
        >
          <View style={styles.languageLeft}>
            <Text style={styles.flag}>{language.flag}</Text>
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>{language.name}</Text>
              <Text style={[styles.nativeName, { color: colors.textSecondary }]}>
                {language.nativeName}
              </Text>
            </View>
            {language.isPopular && (
              <View style={[styles.popularBadge, { backgroundColor: colors.accent + "20" }]}>
                <Text style={[styles.popularText, { color: colors.accent }]}>Popular</Text>
              </View>
            )}
          </View>

          {isSelected && (
            <Animated.View entering={FadeInRight.springify()}>
              <View style={[styles.checkContainer, { backgroundColor: colors.primary }]}>
                <Check size={16} color={colors.background} />
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.header, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>Language</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose your preferred language
          </Text>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Language */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.currentLanguageCard, { backgroundColor: colors.card }]}
        >
          <View style={[styles.currentLanguageIcon, { backgroundColor: colors.primary + "15" }]}>
            <Globe size={24} color={colors.primary} />
          </View>
          <View style={styles.currentLanguageInfo}>
            <Text style={[styles.currentLanguageLabel, { color: colors.textSecondary }]}>
              Current Language
            </Text>
            <Text style={[styles.currentLanguageName, { color: colors.text }]}>
              {languages.find(lang => lang.code === selectedLanguage)?.name || "English"}
            </Text>
          </View>
        </Animated.View>

        {/* Search */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[
            styles.searchContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Search size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search languages..."
            style={styles.searchInput}
          />
        </Animated.View>

        {/* Popular Languages */}
        {popularLanguages.length > 0 && !searchQuery && (
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Languages</Text>
            <View style={styles.languageList}>
              {popularLanguages.map((language, index) => (
                <LanguageItem
                  key={language.code}
                  language={language}
                  index={index}
                  isSelected={selectedLanguage === language.code}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* All Languages by Region */}
        {regions.map((region, regionIndex) => {
          const regionLanguages = (searchQuery ? filteredLanguages : otherLanguages).filter(
            lang => lang.region === region
          )

          if (regionLanguages.length === 0) return null

          return (
            <Animated.View
              key={region}
              entering={FadeInDown.delay(500 + regionIndex * 100).springify()}
              style={styles.section}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {searchQuery ? `${region} (${regionLanguages.length})` : region}
              </Text>
              <View style={styles.languageList}>
                {regionLanguages.map((language, index) => (
                  <LanguageItem
                    key={language.code}
                    language={language}
                    index={index}
                    isSelected={selectedLanguage === language.code}
                  />
                ))}
              </View>
            </Animated.View>
          )
        })}

        {/* No Results */}
        {filteredLanguages.length === 0 && searchQuery && (
          <Animated.View entering={FadeInDown.springify()} style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: colors.textMuted }]}>
              No languages found for "{searchQuery}"
            </Text>
          </Animated.View>
        )}

        {/* Language Note */}
        <Animated.View
          entering={FadeInDown.delay(800).springify()}
          style={[styles.noteCard, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.noteTitle, { color: colors.text }]}>Language Support</Text>
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            Changing your language will update the app interface. Document analysis is currently
            available in English, with support for more languages coming soon.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentLanguageCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentLanguageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  currentLanguageInfo: {
    flex: 1,
  },
  currentLanguageLabel: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  currentLanguageName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    marginBottom: 12,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  nativeName: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  popularBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  popularText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    textTransform: "uppercase",
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  noteTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  noteText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
})
