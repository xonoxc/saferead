import { useState, useEffect, createContext, use } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Colors from "@/constants/Colors"
import { attempt } from "@/utils/attempt"

export type ThemeMode = "light" | "dark" | "system"

interface ThemeContextType {
  mode: ThemeMode
  colors: typeof Colors.light
  isDark: boolean
  setTheme: (mode: ThemeMode) => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme()
  const [mode, setMode] = useState<ThemeMode>("system")

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    const res = await attempt(AsyncStorage.getItem("theme_mode"))
    if (res.ok && res.data) {
      setMode(res.data as ThemeMode)
    } else if (!res.ok) {
      console.error("Failed to load theme:", res.error)
    }
  }

  const setTheme = async (newMode: ThemeMode) => {
    const res = await attempt(AsyncStorage.setItem("theme_mode", newMode))
    if (res.ok) {
      setMode(newMode)
    } else {
      console.error("Failed to save theme:", res.error)
    }
  }

  const isDark = mode === "dark" || (mode === "system" && systemTheme === "dark")
  const colors = isDark ? Colors.dark : Colors.light

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
