import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getLocales } from "expo-localization"

import { apiClient } from "@/utils/apiclient"
import { attempt } from "@/utils/attempt"

const CURRENCY_KEY = "preferred_currency"
const LANGUAGE_KEY = "preferred_language"

/*
 * Currency and language, in one place.
 *
 * The important distinction here is *chosen* vs *detected*. A user who has
 * never opened Settings has `currencyChoice: null`, and follows their device -
 * so the same build shows ₹ in Mumbai and £ in Manchester with nothing to
 * configure, and keeps following if they move. An explicit pick is stored and
 * then wins everywhere, forever, including on their next device.
 *
 * Storing the detected value as though it were a choice would quietly destroy
 * that difference, which is why `null` is a real state rather than a gap to
 * be filled in with a default.
 * **/

/* Device region -> currency, from the OS. `getLocales()[0].currencyCode` is
 * already the right answer on both platforms; we only guard the shape. */
function detectCurrency(): string {
   const locales = getLocales()
   const code = locales?.[0]?.currencyCode
   return typeof code === "string" && code.length === 3 ? code.toUpperCase() : "USD"
}

function detectLanguage(): string {
   const locales = getLocales()
   const tag = locales?.[0]?.languageCode
   return typeof tag === "string" && tag.length >= 2 ? tag.toLowerCase() : "en"
}

interface LocaleState {
   /* What the user explicitly picked, or null while they are following the device. */
   currencyChoice: string | null
   languageChoice: string | null

   /* What the device says right now. */
   detectedCurrency: string
   detectedLanguage: string

   /* True once the persisted choice has been read - screens should not render
    * prices against a default that is about to change under them. */
   isHydrated: boolean

   setCurrency: (code: string | null) => Promise<void>
   setLanguage: (tag: string | null) => Promise<void>
   hydrate: () => Promise<void>
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
   currencyChoice: null,
   languageChoice: null,
   detectedCurrency: detectCurrency(),
   detectedLanguage: detectLanguage(),
   isHydrated: false,

   hydrate: async () => {
      const [currency, language] = await Promise.all([
         AsyncStorage.getItem(CURRENCY_KEY),
         AsyncStorage.getItem(LANGUAGE_KEY),
      ])
      set({
         currencyChoice: currency || null,
         languageChoice: language || null,
         /* Re-read on hydrate: the device region can change between launches. */
         detectedCurrency: detectCurrency(),
         detectedLanguage: detectLanguage(),
         isHydrated: true,
      })
   },

   setCurrency: async code => {
      set({ currencyChoice: code })
      if (code) await AsyncStorage.setItem(CURRENCY_KEY, code)
      else await AsyncStorage.removeItem(CURRENCY_KEY)

      /*
       * Mirror to the account so the choice survives a reinstall and follows
       * the user to a second device. Best-effort on purpose - a signed-out or
       * offline user still gets the local change immediately, and the server
       * copy is a convenience, not the source of truth for this render.
       * **/
      await attempt(() =>
         apiClient.patch("/auth/user/", { preferred_currency: code ?? "" })
      )
   },

   setLanguage: async tag => {
      set({ languageChoice: tag })
      if (tag) await AsyncStorage.setItem(LANGUAGE_KEY, tag)
      else await AsyncStorage.removeItem(LANGUAGE_KEY)

      await attempt(() => apiClient.patch("/auth/user/", { preferred_language: tag ?? "" }))
   },
}))

/* The currency to actually price in: an explicit choice, else the device. */
export const useActiveCurrency = () =>
   useLocaleStore(s => s.currencyChoice ?? s.detectedCurrency)

/* The language to actually render in. */
export const useActiveLanguage = () =>
   useLocaleStore(s => s.languageChoice ?? s.detectedLanguage)

/* Non-reactive read, for code outside React. */
export const getActiveLanguage = () => {
   const s = useLocaleStore.getState()
   return s.languageChoice ?? s.detectedLanguage
}
