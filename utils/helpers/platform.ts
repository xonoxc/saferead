import { Platform } from "react-native"

/*
 *
 * Utility functions to check the platform
 * **/
export function isAndroid() {
  return Platform.OS === "android"
}

/*
 * check if the platform is iOS
 */
export function isIOS() {
  return Platform.OS === "ios"
}

/*
 * check if the platform is web
 */
export function isWeb() {
  return Platform.OS === "web"
}
