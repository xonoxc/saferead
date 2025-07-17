import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { isWeb } from "./helpers/platform"
import { serverURL } from "@/constants/server"
import { attempt } from "./attempt"
import { Alert } from "react-native"
import { router } from "expo-router"
import { useUserStore } from "@/store/useUserStore"
import { useGlobalErrorStore } from "@/store/useGlobalErrorStore"

const AUTH_HEADER = "Authorization"

export async function getAccessToken(): Promise<string | null> {
  const result = await attempt(
    isWeb() ? AsyncStorage.getItem("access_token") : SecureStore.getItemAsync("access_token")
  )

  if (!result.ok) {
    console.warn("Failed to load token:", result.error)
    return null
  }

  return result.data
}

export const apiClient = axios.create({
  baseURL: serverURL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  async config => {
    if (config.url?.includes("/auth/login") || config.url?.includes("/auth/registration")) {
      return config
    }

    const token = await getAccessToken()
    if (token) {
      config.headers[AUTH_HEADER] = `token ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      Alert.alert("Session Expired", "Your session has expired. logging you out...")

      const { clearUser } = useUserStore.getState()
      await clearUser()

      router.replace("/(auth)/login")
    } else if (error?.response?.status === 500) {
      const { setError } = useGlobalErrorStore.getState()

      setError({
        message: "Internal Server Error",
        code: "500",
      })
    }
    return Promise.reject(error)
  }
)
