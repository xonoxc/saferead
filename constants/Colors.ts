/*
 * Theme palettes.
 *
 * The "light" palette used to hold dark values, so light mode rendered as pure
 * black. Both themes are now genuine. Every key that existed before is kept so
 * no existing consumer breaks.
 *
 * Brand direction: an indigo-violet primary reads as considered and modern
 * without the generic-SaaS feel of a plain blue, with teal as the supporting
 * accent that space colours already draw from.
 * **/

const Colors = {
   light: {
      // Brand
      primary: "#5B5BD6",
      primaryFaded: "rgba(91, 91, 214, 0.12)",
      primarySoft: "#EEEEFB",
      onPrimary: "#FFFFFF",
      secondary: "#0F1117",
      accent: "#6B7280",

      // Status
      success: "#059669",
      successBackground: "#ECFDF5",
      warning: "#D97706",
      warningBackground: "#FFFBEB",
      error: "#DC2626",
      errorBackground: "#FEF2F2",

      // Surfaces, flat to raised
      background: "#FFFFFF",
      surface: "#F6F7F9",
      card: "#FFFFFF",
      elevated: "#FFFFFF",

      // Text
      text: "#0F1117",
      textSecondary: "#4B5162",
      textTertiary: "rgba(15, 17, 23, 0.45)",
      textMuted: "#868C9B",

      // Lines and depth
      border: "rgba(15, 17, 23, 0.09)",
      borderLight: "#ECEEF2",
      borderStrong: "rgba(15, 17, 23, 0.16)",
      shadow: "#0F1117",
      overlay: "rgba(15, 17, 23, 0.45)",

      // Component specifics
      forgotPassword: "#2563EB",
      skeletonBackground: "#EDEFF3",
      skeletonShimmer: "#F8F9FB",

      // Legacy decorative keys, kept so existing screens keep compiling
      vio: "#6366F1",
      blueg: "#0EA5E9",
      red: "#DC2626",
      emerald: "#059669",
   },

   dark: {
      // Brand
      primary: "#7C7CF0",
      primaryFaded: "rgba(124, 124, 240, 0.16)",
      primarySoft: "#1E1E38",
      onPrimary: "#FFFFFF",
      secondary: "#E7E8EC",
      accent: "#9CA3AF",

      // Status
      success: "#34D399",
      successBackground: "#06251C",
      warning: "#FBBF24",
      warningBackground: "#2A1D05",
      error: "#F87171",
      errorBackground: "#2E1315",

      // Surfaces, flat to raised
      background: "#0B0C10",
      surface: "#131519",
      card: "#191C22",
      elevated: "#20242C",

      // Text
      text: "#F3F4F6",
      textSecondary: "#A8AEBB",
      textTertiary: "rgba(243, 244, 246, 0.45)",
      textMuted: "#767D8C",

      // Lines and depth
      border: "rgba(255, 255, 255, 0.09)",
      borderLight: "#22262E",
      borderStrong: "rgba(255, 255, 255, 0.18)",
      shadow: "#000000",
      overlay: "rgba(0, 0, 0, 0.6)",

      // Component specifics
      forgotPassword: "#60A5FA",
      skeletonBackground: "#191C22",
      skeletonShimmer: "#242832",

      // Legacy decorative keys, kept so existing screens keep compiling
      vio: "#818CF8",
      blueg: "#38BDF8",
      red: "#F87171",
      emerald: "#34D399",
   },
}

/*
 * Exported both ways: constants/index.ts re-exports this module with `export *`,
 * which needs at least one named export to be valid.
 * **/
export { Colors }
export default Colors
