import { useState, useEffect, createContext, use } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Colors from "@/constants/Colors"

type ThemeMode = "light" | "dark" | "system"

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
    try {
      const savedTheme = await AsyncStorage.getItem("theme_mode")
      if (savedTheme) {
        setMode(savedTheme as ThemeMode)
      }
    } catch (error) {
      console.error("Failed to load theme:", error)
    }
  }

  const setTheme = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem("theme_mode", newMode)
      setMode(newMode)
    } catch (error) {
      console.error("Failed to save theme:", error)
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
