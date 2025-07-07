declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string
      EXPO_PUBLIC_AI_API_KEY: string
      EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
      EXPO_PUBLIC_GOOGLE_CLIENT_ID: string
      EXPO_PUBLIC_APPLE_CLIENT_ID: string
    }
  }
}

export {}

