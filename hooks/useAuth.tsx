import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { User } from "@/types"
import { attempt, attemptSync } from "@/utils/attempt"
import { isWeb } from "@/utils/helpers/platform"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { apiClient } from "@/utils/apiclient"
import { useUserStore } from "@/store/useUserStore"

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
  logout: () => Promise<{
    success: boolean
    message?: string
    error?: string
  }>
  // refreshToken: () => Promise<void>
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
  const [isLoading, setIsLoading] = useState(true)

  const user = useUserStore(s => s.user)
  const setUser = useUserStore(s => s.setUser)
  const clearUser = useUserStore(s => s.clearUser)

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
    const result = await attempt(
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

  /* const deleteSecureItem = async (key: string) => {
    if (isWeb()) {
      await AsyncStorage.removeItem(key)
    } else {
      await SecureStore.deleteItemAsync(key)
    }
  } */

  const loadStoredAuth = async () => {
    setIsLoading(true)
    const token = await getSecureItem("access_token")

    if (token) {
      const storedUserData = await getSecureItem("user_data")
      if (storedUserData) {
        const parsedUserData = attemptSync(JSON.parse(storedUserData) as User)
        if (parsedUserData.ok) {
          setUser(parsedUserData.data)
        }
      } else {
        const resp = await attempt<User>(apiClient.get("/auth/user/"))
        if (resp.ok) {
          const userData = resp.data
          await setSecureItem("user_data", JSON.stringify(userData))
          setUser(userData)
        } else {
          await logout()
        }
      }
    }
    setIsLoading(false)
  }

  const login = async (data: {
    username: string
    password: string
  }): Promise<{
    success: boolean
    message: string
  }> => {
    const result = await attempt<{ key: string }>(apiClient.post("/auth/login/", data))
    if (!result.ok) {
      return {
        success: false,
        message: getErrorMessage(result.error),
      }
    }
    const token = result.data.key

    const accessTokenSetAttempt = await attempt(setSecureItem("access_token", token))
    if (!accessTokenSetAttempt.ok) {
      return {
        success: false,
        message: "Failed to store access token",
      }
    }

    const resp = await attempt<User>(
      apiClient.get("/auth/user/", {
        headers: {
          Authorization: `token ${token}`,
        },
      })
    )
    if (!resp.ok) {
      const logoutResp = await logout()
      if (!logoutResp.success) {
        return {
          success: false,
          message: "Failed to logout after login error",
        }
      }
      return {
        success: false,
        message: "Failed to fetch user data",
      }
    }

    const userData = resp.data
    await setSecureItem("user_data", JSON.stringify(userData))
    setUser(userData)

    return {
      success: true,
      message: "Login successful",
    }
  }

  const logout = async () => {
    await clearUser()

    return {
      success: true,
      message: "Logout successful",
    }
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

	const resp = await attempt(
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
    const result = await attempt(apiClient.post("/auth/registration/", data))
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

    const result = await attempt(AsyncStorage.setItem("user_data", JSON.stringify(updatedUser)))
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
        /* refreshToken, */
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
