import Constants from "expo-constants"

/*
 * Backend base URL.
 *
 * Resolution order, most explicit first:
 *
 * 1. `EXPO_PUBLIC_API_URL` — set it to point at staging, production, or a
 *    backend that is not on this machine. An explicit value always wins.
 * 2. In development, the LAN IP Metro is already serving this bundle from.
 * 3. `http://localhost:8000`, which is right on a simulator and nowhere else.
 *
 * Step 2 exists because a hardcoded LAN IP is wrong the moment DHCP renews the
 * lease, and the failure it produces is maximally unhelpful: the device dials
 * an address with nothing on it, axios waits out its full 120-second timeout,
 * and the user is told "The request timed out. Please try again." Trying again
 * cannot help — nothing is listening. That is exactly what happened here, with
 * `.env` pinned to 192.168.29.20 after the machine had moved to .21.
 *
 * Metro already knows the answer: the device fetched this very bundle from it,
 * so `hostUri` is by construction an address the device can reach. Taking the
 * host from there means the dev URL cannot go stale, because it is derived
 * from a connection that is demonstrably working.
 *
 * Note this only fixes *dev*. A release build has no Metro and no `hostUri`,
 * so `EXPO_PUBLIC_API_URL` is required there — and being required is correct,
 * since guessing a production hostname is not a thing to do quietly.
 */
const DEFAULT_API_PORT = 8000

function devHostURL(): string | null {
   /* e.g. "192.168.29.21:8081" — host and Metro's port, not ours. */
   const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost
   const host = hostUri?.split(":")[0]?.trim()

   if (!host || host === "localhost" || host === "127.0.0.1") return null
   return `http://${host}:${DEFAULT_API_PORT}`
}

export const serverURL =
   process.env.EXPO_PUBLIC_API_URL?.trim() || devHostURL() || "http://localhost:8000"

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
