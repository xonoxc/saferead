import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import * as AuthSession from "expo-auth-session"
import * as Crypto from "expo-crypto"
import { User, AuthTokens } from "@/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
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
        const { accessToken, expiresAt } = JSON.parse(tokens) as AuthTokens
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
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
        subscriptionTier: "free",
        preferences: {
          language: "en",
          theme: "system",
          fontSize: "medium",
          dyslexiaFriendly: false,
          textToSpeech: false,
          hapticFeedback: true,
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockTokens: AuthTokens = {
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        expiresAt: Date.now() + 3600000, // 1 hour
      }

      await storeAuthData(mockUser, mockTokens)
      setUser(mockUser)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "com.legalassist.app",
        path: "auth",
      })

      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
        scopes: ["openid", "profile", "email"],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        state: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          redirectUri + Date.now(),
          { encoding: Crypto.CryptoEncoding.HEX }
        ),
        codeChallenge: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          redirectUri,
          { encoding: Crypto.CryptoEncoding.BASE64 }
        ),
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      })

      const result = await request.promptAsync({
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      })

      if (result.type === "success") {
        // Exchange authorization code for tokens
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
            code: result.params.code,
            redirectUri,
            extraParams: {},
          },
          {
            tokenEndpoint: "https://oauth2.googleapis.com/token",
          }
        )

        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        )
        const googleUser = await userInfoResponse.json()

        // Create user object
        const user: User = {
          id: googleUser.id,
          email: googleUser.email,
          firstName: googleUser.given_name || "",
          lastName: googleUser.family_name || "",
          avatar: googleUser.picture,
          subscriptionTier: "free",
          preferences: {
            language: "en",
            theme: "system",
            fontSize: "medium",
            dyslexiaFriendly: false,
            textToSpeech: false,
            hapticFeedback: true,
            notifications: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const tokens: AuthTokens = {
          accessToken: tokenResponse.accessToken || "",
          refreshToken: tokenResponse.refreshToken || "",
          expiresAt: Date.now() + (tokenResponse.expiresIn || 3600) * 1000,
        }

        await storeAuthData(user, tokens)
        setUser(user)
      } else {
        throw new Error("Google login was cancelled or failed")
      }
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock successful registration
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        subscriptionTier: "free",
        preferences: {
          language: "en",
          theme: "system",
          fontSize: "medium",
          dyslexiaFriendly: false,
          textToSpeech: false,
          hapticFeedback: true,
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockTokens: AuthTokens = {
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        expiresAt: Date.now() + 3600000, // 1 hour
      }

      await storeAuthData(mockUser, mockTokens)
      setUser(mockUser)
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

      // Simulate refresh token API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock new tokens
      const newTokens: AuthTokens = {
        accessToken: "new_mock_access_token",
        refreshToken: "new_mock_refresh_token",
        expiresAt: Date.now() + 3600000,
      }

      const userData = await AsyncStorage.getItem("user_data")
      if (userData) {
        const user = JSON.parse(userData)
        await storeAuthData(user, newTokens)
        setUser(user)
      }
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
        loginWithGoogle,
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
