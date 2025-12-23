import type { User } from "@/types"
import { Globe, Shield, HelpCircle, LogOut, KeyRound, User as UserIcon } from "lucide-react-native"
import type { ThemeMode } from "@/hooks/useTheme"
import type { Router } from "expo-router"

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
   router: Router
   handleLogout: () => void
}): SettingsGroup[] {
   return [
      {
         title: "Account",
         items: [
            {
               icon: UserIcon,
               title: "Profile",
               value: `${user?.username}`,
               onPress: () => {
                  router.push("/profile")
               },
            },
            {
               icon: KeyRound,
               title: "Change Password",
               onPress: () => router.push("/(application)/change_password"),
            },
            {
               icon: Shield,
               title: "Privacy & Security",
               onPress: () => router.push("/privacy"),
            },
         ],
      },
      {
         title: "Preferences",
         items: [
            {
               icon: Globe,
               title: "Language",
               value: "English",
               onPress: () => {
                  //router.push("/language")
               },
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
         title: "Support",
         items: [
            {
               icon: HelpCircle,
               title: "Help & Support",
               onPress: () => router.push("/help"),
            },
         ],
      },
      {
         title: "Account Actions",
         items: [
            {
               icon: LogOut,
               title: "Sign Out",
               onPress: handleLogout,
               danger: true,
            },
         ],
      },
   ]
}
