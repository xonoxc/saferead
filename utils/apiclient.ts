import axios, { type AxiosError } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { isWeb } from "./helpers/platform"
import { serverURL } from "@/constants/server"
import { attempt } from "./attempt"
import { router } from "expo-router"
import { useUserStore } from "@/store/useUserStore"
import { useGlobalErrorStore } from "@/store/useGlobalErrorStore"
import { useAlertStore } from "@/store/useAlertStore"

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
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  transitional: {
    clarifyTimeoutError: true,
  },
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

apiClient.interceptors.response.use(response => response, handleApiError)

export async function handleApiError(error: AxiosError): Promise<never> {
  const status = error?.response?.status

  switch (true) {
    case error.code === "ERR_NETWORK": {
      error.message = "Can’t connect. Please check your internet."
      break
    }

    case status === 401: {
      const showAlert = useAlertStore.getState().showAlert
      showAlert({
        title: "Unauthorized",
        message: "Your session has expired. Please log in again.",
        actions: [
          {
            text: "Login",
            style: "primary",
            onPress: () => {
              router.replace("/(auth)/login")
            },
          },
        ],
      })

      const { clearUser } = useUserStore.getState()
      await clearUser()

      router.replace("/(auth)/login")
      break
    }

    case status === 500: {
      const { setError } = useGlobalErrorStore.getState()

      setError({
        message: "Internal Server Error",
        code: "500",
      })
      break
    }
  }

  return Promise.reject(error)
}
