import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { isWeb } from "./helpers/platform"
import { serverURL } from "@/constants/server"
import { attempt } from "./attempt"

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
    const token = await getAccessToken()
    if (token) {
      config.headers[AUTH_HEADER] = `token ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)
