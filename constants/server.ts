/*
 * Backend base URL.
 *
 * Set EXPO_PUBLIC_API_URL in .env (see sample.env). On a physical device this
 * must be your machine's LAN IP, not localhost, since the device resolves
 * localhost to itself.
 */
export const serverURL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000"

/*
 * Whether any social sign-in provider is actually configured.
 *
 * One source of truth so the UI cannot promise a provider that does not exist.
 * The auth screens used to render an "or continue with" divider unconditionally
 * — with no Google client ID set, the Google button was commented out and the
 * divider was left separating nothing from nothing.
 * **/
export const SOCIAL_AUTH_ENABLED = Boolean(
   process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS
)
