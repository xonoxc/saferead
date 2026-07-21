/*
 * Backend base URL.
 *
 * Set EXPO_PUBLIC_API_URL in .env (see sample.env). On a physical device this
 * must be your machine's LAN IP, not localhost, since the device resolves
 * localhost to itself.
 */
export const serverURL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000"
