//import { useAuthRequest } from "expo-auth-session"
//import { makeRedirectUri } from "expo-auth-session"
import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { User, AuthTokens } from "@/types"
//import * as WebBrowser from "expo-web-browser"
import { attempt, attemptSync } from "@/utils/attempt"
import { isWeb } from "@/utils/helpers/platform"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { apiClient } from "@/utils/apiclient"

//import { discovery } from "expo-auth-session/build/providers/Google"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: { username: string; password: string }) => Promise<{
    success: boolean
    message: string
  }>
  /* promptGoogleAuth: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult> */
  registerUser: (data: {
    email: string
    password1: string
    password2: string
    username: string
  }) => Promise<{
    success: boolean
    message: string
  }>
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
/*
const redirectURI = makeRedirectUri({
  path: "auth",
})
*/
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
    if (isWeb()) {
      return await AsyncStorage.getItem(key)
    } else {
      return await SecureStore.getItemAsync(key)
    }
  }

  const setSecureItem = async (key: string, value: string): Promise<void> => {
    if (isWeb()) {
      await AsyncStorage.setItem(key, value)
    } else {
      await SecureStore.setItemAsync(key, value)
    }
  }

  /* const storeAuthData = async (user: User, tokens: AuthTokens) => {
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
  } */

  const deleteSecureItem = async (key: string) => {
    if (isWeb()) {
      await AsyncStorage.removeItem(key)
    } else {
      await SecureStore.deleteItemAsync(key)
    }
  }

  const loadStoredAuth = async () => {
    const result = await attempt(() => getSecureItem("access_token"))
    if (!result.ok) {
      await logout()
      return
    }

    const rawToken = result.data
    if (!rawToken) {
      await logout()
      return
    }

    const storedUserData = await attempt(() => getSecureItem("user_data"))
    if (storedUserData.ok) {
      const parsedUserData = attemptSync(() => JSON.parse(storedUserData.data as string) as User)
      if (!parsedUserData.ok) {
        await logout()
        return
      }

      const userData = parsedUserData.data

      if (!userData) {
        await logout()
        return
      }

      setUser(userData)
      return
    }

    const resp = await attempt(() => apiClient.get("/auth/user/"))
    if (!resp.ok) {
      await logout()
      return
    }

    const userData = resp.data.data as User

    const storeUserDataAttempt = await attempt(() =>
      setSecureItem("user_data", JSON.stringify(userData))
    )
    if (!storeUserDataAttempt.ok) {
      await logout()
      return
    }

    setUser(userData)
    setIsLoading(false)
  }

  const login = async (data: {
    username: string
    password: string
  }): Promise<{
    success: boolean
    message: string
  }> => {
    const result = await attempt(() => apiClient.post("/auth/login/", data))
    if (!result.ok) {
      return {
        success: false,
        message: getErrorMessage(result.error),
      }
    }

    const token = result.data.data as { key: string }

    const storeAccessTokenAttempt = await attempt(() =>
      setSecureItem(
        "access_token",
        JSON.stringify({
          token: token.key,
        })
      )
    )

    if (!storeAccessTokenAttempt.ok) {
      return {
        success: false,
        message: "Something went wrong!",
      }
    }

    return {
      success: true,
      message: "Login successful",
    }
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
  const registerUser = async (data: {
    email: string
    password1: string
    password2: string
    username: string
  }) => {
    const result = await attempt(() => apiClient.post("/auth/registration/", data))
    if (!result.ok) {
      return {
        success: false,
        message: getErrorMessage(result.error),
      }
    }

    return {
      success: true,
      message: "Registration successful",
    }
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
        registerUser,
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
