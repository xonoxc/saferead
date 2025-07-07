import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import { User, AuthTokens } from "@/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateUser: (user: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  const getSecureItem = async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key)
    } else {
      return await SecureStore.getItemAsync(key)
    }
  }

  const setSecureItem = async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value)
    } else {
      await SecureStore.setItemAsync(key, value)
    }
  }

  const deleteSecureItem = async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key)
    } else {
      await SecureStore.deleteItemAsync(key)
    }
  }

  const loadStoredAuth = async () => {
    try {
      const tokens = await getSecureItem("auth_tokens")
      if (tokens) {
        const { expiresAt } = JSON.parse(tokens) as AuthTokens
        if (Date.now() < expiresAt) {
          const userData = await AsyncStorage.getItem("user_data")
          if (userData) {
            setUser(JSON.parse(userData))
          }
        } else {
          await refreshToken()
        }
      }
    } catch (error) {
      console.error("Failed to load stored auth:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      const { user, tokens } = data

      await storeAuthData(user, tokens)
      setUser(user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      const { user, tokens } = data

      await storeAuthData(user, tokens)
      setUser(user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await deleteSecureItem("auth_tokens")
      await AsyncStorage.removeItem("user_data")
      setUser(null)
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const refreshToken = async () => {
    try {
      const tokens = await getSecureItem("auth_tokens")
      if (!tokens) return

      const { refreshToken } = JSON.parse(tokens) as AuthTokens

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        await logout()
        return
      }

      const data = await response.json()
      const { user, tokens: newTokens } = data

      await storeAuthData(user, newTokens)
      setUser(user)
    } catch (error) {
      console.error("Failed to refresh token:", error)
      await logout()
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = { ...user, ...userData } as User
      await AsyncStorage.setItem("user_data", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Failed to update user:", error)
      throw error
    }
  }

  const storeAuthData = async (user: User, tokens: AuthTokens) => {
    await Promise.all([
      setSecureItem("auth_tokens", JSON.stringify(tokens)),
      AsyncStorage.setItem("user_data", JSON.stringify(user)),
    ])
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
