/*
 * Languages the app ships strings for.
 *
 * This is the single source of truth for the picker, the settings row label
 * and the i18n fallback chain. A language belongs here only once its
 * translation file exists in `i18n/locales` — offering a language the app
 * cannot actually render is worse than not offering it, because the user
 * picks it, sees English, and concludes the setting is broken.
 * **/

export interface AppLanguage {
   code: string
   name: string
   nativeName: string
   flag: string
   /* Right-to-left scripts need layout changes beyond string swapping. */
   rtl?: boolean
}

/*
 * Adding a language is one file in `i18n/locales` (typed against `en`, so the
 * compiler lists every string you still owe) plus one line here. Right-to-left
 * languages need more than that — mirrored layout, not just swapped strings —
 * so none are listed until that work is done.
 * **/
export const APP_LANGUAGES: AppLanguage[] = [
   { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
   { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
   { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
   { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
]

export const DEFAULT_LANGUAGE = "en"

export const isSupportedLanguage = (code: string | null | undefined): boolean =>
   !!code && APP_LANGUAGES.some(l => l.code === code)

/*
 * Resolve any device tag to a language we ship.
 *
 * `getLocales()` hands back things like `en-GB`, `pt-BR`, `zh-Hant`. Matching
 * the base subtag means a Brazilian phone gets Portuguese rather than falling
 * all the way back to English over a region suffix.
 * **/
export function resolveLanguage(tag: string | null | undefined): string {
   if (!tag) return DEFAULT_LANGUAGE
   const lower = tag.toLowerCase()
   if (isSupportedLanguage(lower)) return lower
   const base = lower.split(/[-_]/)[0]
   return isSupportedLanguage(base) ? base : DEFAULT_LANGUAGE
}

/*
 * The endonym, not the English name: once the UI is in Hindi, a row reading
 * "Hindi" is the one English word left on the screen. People recognise their
 * own language written the way they write it.
 * **/
export function languageLabel(tag: string | null | undefined): string {
   const code = resolveLanguage(tag)
   return APP_LANGUAGES.find(l => l.code === code)?.nativeName ?? "English"
}
