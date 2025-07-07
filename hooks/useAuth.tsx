import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import * as AuthSession from "expo-auth-session"
import * as Crypto from "expo-crypto"
import { User, AuthTokens } from "@/types"
import { attempt } from "@/utils/attempt"

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

  const storeAuthData = async (user: User, tokens: AuthTokens) => {
    const result = await attempt(() =>
      Promise.all([
        setSecureItem("auth_tokens", JSON.stringify(tokens)),
        AsyncStorage.setItem("user_data", JSON.stringify(user)),
      ])
    )
    if (!result.ok) {
      console.error("Failed to store auth data:", result.error)
      return
    }
  }

  const deleteSecureItem = async (key: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key)
    } else {
      await SecureStore.deleteItemAsync(key)
    }
  }

  const refreshToken = async () => {
    const tokenRes = await attempt(() => getSecureItem("auth_tokens"))
    if (!tokenRes.ok) {
      console.error("Failed to get auth tokens:", tokenRes.error)
      return
    }

    const tokens = tokenRes.data
    if (!tokens) return

    const { refreshToken } = JSON.parse(tokens) as AuthTokens
    if (!refreshToken) {
      console.error("No refresh token available")
      return
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    const newTokens: AuthTokens = {
      accessToken: "new_mock_access_token",
      refreshToken: "new_mock_refresh_token",
      expiresAt: Date.now() + 3600000,
    }

    const userdataRes = await attempt(() => AsyncStorage.getItem("user_data"))
    if (!userdataRes.ok) {
      console.error("Failed to get user data:", userdataRes.error)
      return
    }

    const userData = userdataRes.data

    if (userData) {
      const user = JSON.parse(userData)
      await storeAuthData(user, newTokens)

      setUser(user)
    }
    await logout()
  }

  const loadStoredAuth = async () => {
    const result = await attempt(() => getSecureItem("auth_tokens"))
    if (!result.ok) {
      console.log("Failed to load auth tokens:", result.error)
      return
    }

    const tokens = result.data

    if (!tokens) {
      const result = await attempt(refreshToken)
      if (!result.ok) {
        console.error("Failed to refresh token:", result.error)
        return
      }
    }

    const { expiresAt } = JSON.parse(tokens as string) as AuthTokens
    if (Date.now() < expiresAt) {
      const userData = await AsyncStorage.getItem("user_data")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }

    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    // TODO: implement login functionality
  }

  const logout = async () => {
    const result = await attempt(() => deleteSecureItem("auth_tokens"))
    if (!result.ok) {
      console.error("Failed to delete auth tokens:", result.error)
      return
    }
    const removeResult = await attempt(() => AsyncStorage.removeItem("user_data"))
    if (!removeResult.ok) {
      console.error("Failed to remove user data:", removeResult.error)
      return
    }
    setUser(null)
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
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

    const authResp = await attempt(() =>
      request.promptAsync({
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      })
    )

    if (!authResp.ok) {
      console.error("Google login failed:", authResp.error)
      setIsLoading(false)
      return
    }

    const result = authResp.data

    if (result.type === "success") {
      const tokenAttemptResponse = await attempt(() =>
        AuthSession.exchangeCodeAsync(
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
      )
      if (!tokenAttemptResponse.ok) {
        console.error("Failed to exchange code for tokens:", tokenAttemptResponse.error)
        setIsLoading(false)
        return
      }

      const tokenResponse = tokenAttemptResponse.data

      const userInfoFetchResponse = await attempt(() =>
        fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        )
      )

      if (!userInfoFetchResponse.ok) {
        console.error("Failed to fetch user info:", userInfoFetchResponse.error)
        setIsLoading(false)
        return
      }
      const userInfoResponse = userInfoFetchResponse.data

      const googleUserAttempt = await attempt(() => userInfoResponse.json())
      if (!googleUserAttempt.ok) {
        console.error("Failed to parse user info:", googleUserAttempt.error)
        return
      }
      const googleUser = googleUserAttempt.data

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

      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // TODO: implement registration functionality
  }

  const updateUser = async (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData } as User

    const result = await attempt(() =>
      AsyncStorage.setItem("user_data", JSON.stringify(updatedUser))
    )
    if (!result.ok) {
      console.error("Failed to update user data:", result.error)
      return
    }
    setUser(updatedUser)
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
