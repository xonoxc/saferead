import { useCallback } from "react"

import { useActiveLanguage } from "@/store/useLocaleStore"
import { resolveLanguage, DEFAULT_LANGUAGE } from "@/constants/languages"

import { en, type Translations } from "./locales/en"
import { hi } from "./locales/hi"
import { es } from "./locales/es"
import { fr } from "./locales/fr"

const CATALOGUES: Record<string, Translations> = { en, hi, es, fr }

/*
 * Deliberately no i18n library.
 *
 * The app needs three things — look a key up, fall back to English when a
 * string is missing, and substitute a couple of variables. A dependency for
 * that would add a runtime, an init step and a second source of truth about
 * the current language, when the language already lives in `useLocaleStore`.
 *
 * The catalogues are typed against English, so "missing string" is a build
 * error rather than something the fallback quietly hides in production. The
 * fallback exists for the case types cannot cover: a stale persisted language
 * code from an older release.
 * **/

type Path = string

function lookup(catalogue: Translations | undefined, path: Path): string | undefined {
   if (!catalogue) return undefined
   const value = path
      .split(".")
      .reduce<any>((node, key) => (node == null ? undefined : node[key]), catalogue)
   return typeof value === "string" ? value : undefined
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
   if (!vars) return template
   return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
      key in vars ? String(vars[key]) : match
   )
}

export function translate(
   language: string,
   path: Path,
   vars?: Record<string, string | number>
): string {
   const code = resolveLanguage(language)
   const hit = lookup(CATALOGUES[code], path) ?? lookup(CATALOGUES[DEFAULT_LANGUAGE], path)
   /* Returning the key itself makes a missing string obvious in review rather
    * than rendering an empty space nobody notices. */
   return interpolate(hit ?? path, vars)
}

/** `const { t } = useTranslation()` — re-renders when the language changes. */
export function useTranslation() {
   const language = useActiveLanguage()

   const t = useCallback(
      (path: Path, vars?: Record<string, string | number>) => translate(language, path, vars),
      [language]
   )

   return { t, language: resolveLanguage(language) }
}
