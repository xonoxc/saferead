import type { User } from "@/types"
import {
   Globe,
   Shield,
   HelpCircle,
   LogOut,
   KeyRound,
   User as UserIcon,
   Coins,
} from "lucide-react-native"
import type { ThemeMode } from "@/hooks/useTheme"
import type { ImperativeRouter } from "expo-router"
import { useActiveCurrency, useActiveLanguage } from "@/store/useLocaleStore"
import { useTranslation } from "@/i18n"
import { languageLabel } from "@/constants/languages"

export type SettingsItem = {
   icon: React.ComponentType<any>
   title: string
   value?: boolean | string
   type?: "toggle"
   onPress: () => void
   danger?: boolean
}

export type SettingsGroup = {
   title: string
   items: SettingsItem[]
}

export default function useSettingsGroups({
   user,
   router,
   handleLogout,
}: {
   user: User | null
   mode: string
   setTheme: (theme: ThemeMode) => void
   router: ImperativeRouter
   handleLogout: () => void
}): SettingsGroup[] {
   /* Read live so the row reflects a change made on the picker the moment the
    * user comes back, without the settings screen having to refetch anything. */
   const { t } = useTranslation()
   const currency = useActiveCurrency()
   const language = useActiveLanguage()

   return [
      {
         title: t("settings.account"),
         items: [
            {
               icon: UserIcon,
               title: t("settings.profile"),
               value: `${user?.username}`,
               onPress: () => {
                  router.push("/profile")
               },
            },
            {
               icon: KeyRound,
               title: t("settings.changePassword"),
               onPress: () => router.push("/(application)/change_password"),
            },
            {
               icon: Shield,
               title: t("settings.privacySecurity"),
               onPress: () => router.push("/privacy"),
            },
         ],
      },
      {
         title: t("settings.preferences"),
         items: [
            {
               icon: Globe,
               title: t("settings.language"),
               value: languageLabel(language),
               onPress: () => router.push("/language"),
            },
            {
               icon: Coins,
               title: t("settings.currency"),
               value: currency,
               onPress: () => router.push("/currency"),
            },
            /* {
               icon: Volume2,
               title: "Text-to-Speech",
               value: user?.preferences?.textToSpeech,
               type: "toggle",
               onPress: () => {},
            },
            {
               icon: Bell,
               title: "Notifications",
               value: user?.preferences?.notifications,
               type: "toggle",
               onPress: () => {},
            }, */
         ],
      },
      {
         title: t("settings.support"),
         items: [
            {
               icon: HelpCircle,
               title: t("settings.helpSupport"),
               onPress: () => router.push("/help"),
            },
         ],
      },
      {
         title: t("settings.accountActions"),
         items: [
            {
               icon: LogOut,
               title: t("settings.signOut"),
               onPress: handleLogout,
               danger: true,
            },
         ],
      },
   ]
}
