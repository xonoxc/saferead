import { useEffect, useState, createContext, useContext } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Colors from "@/constants/Colors"

export type ThemeMode = "light" | "dark" | "system"
export type ColorsType = typeof Colors.light

interface ThemeContextType {
   mode: ThemeMode
   isDark: boolean
   colors: ColorsType
   setTheme: (mode: ThemeMode) => void
   isThemeLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const systemScheme = useColorScheme()
   const [mode, setModeState] = useState<ThemeMode>("system")
   const [isThemeLoading, setIsThemeLoading] = useState(true)

   useEffect(() => {
      AsyncStorage.getItem("theme_mode").then(saved => {
         if (saved === "light" || saved === "dark" || saved === "system") {
            setModeState(saved)
         }
         setIsThemeLoading(false)
      })
   }, [])

   const setTheme = (newMode: ThemeMode) => {
      setModeState(newMode)
      AsyncStorage.setItem("theme_mode", newMode)
   }

   const isDark = mode === "dark" || (mode === "system" && systemScheme === "dark")
   const colors = isDark ? Colors.dark : Colors.light

   return (
      <ThemeContext.Provider value={{ mode, isDark, colors, setTheme, isThemeLoading }}>
         {!isThemeLoading && children}
      </ThemeContext.Provider>
   )
}

export const useTheme = () => {
   const ctx = useContext(ThemeContext)
   if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
   return ctx
}
