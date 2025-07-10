import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { isWeb } from "./helpers/platform"
import { serverURL } from "@/constants/server"
import { AuthTokens } from "@/types"
import { attempt, attemptSync } from "./attempt"

const AUTH_HEADER = "Authorization"

export async function getAccessToken(): Promise<string | null> {
  const result = await attempt(() =>
    isWeb() ? AsyncStorage.getItem("access_token") : SecureStore.getItemAsync("auth_tokens")
  )

  if (!result.ok) {
    console.warn("Failed to load token:", result.error)
    return null
  }

  const raw = result.data
  if (!raw) return null

  const parsed = attemptSync(
    () =>
      JSON.parse(raw) as {
        access_token: string
      }
  )
  if (!parsed.ok) {
    return null
  }
  return parsed.data.access_token
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
    const token = await getAccessToken()
    if (token) {
      config.headers[AUTH_HEADER] = `token ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)
