import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
//import { useAuthRequest } from "expo-auth-session"
import { makeRedirectUri } from "expo-auth-session"
import { User, AuthTokens } from "@/types"
//import * as WebBrowser from "expo-web-browser"
import { attempt } from "@/utils/attempt"

//import { discovery } from "expo-auth-session/build/providers/Google"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  /* promptGoogleAuth: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult> */
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateUser: (user: Partial<User>) => Promise<void>
}

/* WebBrowser.maybeCompleteAuthSession() */
/*
const authConfig = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID!,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS!,
}
*/
const AuthContext = createContext<AuthContextType | null>(null)

const redirectURI = makeRedirectUri({
  path: "auth",
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /* 
   * const [_, response, promptAsync] = useAuthRequest({
    ...authConfig,
  })
  */
  useEffect(() => {
    loadStoredAuth()
  }, [])
  /*
  useEffect(() => {
    loginWithGoogle()
  }, [response])
*/
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
    console.log("redirect uri", redirectURI)
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
  /*
  const loginWithGoogle = async () => {
    if (response?.type === "success") {
      const userInfo = getUserInfo(response.authentication?.accessToken as string)
      if (!userInfo) {
        console.error("Failed to fetch user info")
        return
      }

      console.log(userInfo)
    }
  }

  const getUserInfo = async (token: string) => {
    if (!token) return

    const resp = await attempt(() =>
      fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    )

    if (!resp.ok) {
      console.error("Failed to fetch user info:", resp.error)
      return
    }

    const userInfo = await resp.data.json()

    return userInfo
  }
*/
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
        /*  promptGoogleAuth: promptAsync, */
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
