/*
 * Theme palettes — "Ink & Signal".
 *
 * The previous palette was an indigo-violet brand with teal accents: friendly,
 * modern, and built for a consumer document scanner. The product it now has to
 * dress is a contract intelligence tool for businesses, and that changes the
 * brief in one specific way that drives every value below.
 *
 * THE RULE: the chrome is desaturated so that colour means something.
 *
 * Findings now carry a four-level risk scale (low / medium / high / critical),
 * and that scale is the most important thing on any screen showing a contract.
 * When the surrounding UI is full of decorative violet, teal and gradient
 * tiles, a `critical` flag has to *compete* with the decoration to be seen —
 * which is exactly backwards. So: near-neutral surfaces, one restrained ink
 * primary for actions, and saturation reserved almost entirely for the risk
 * ramp and status.
 *
 * Ink navy for the primary rather than a brighter blue because this sits next
 * to money and legal obligations; and because navy does not collide
 * semantically with success-green, warning-amber or danger-red the way a
 * violet-to-red ramp does.
 *
 * Every key that existed before is kept, so no existing consumer breaks. The
 * legacy decorative keys at the bottom are now aliases into the real palette
 * rather than separate hues — that alone removes most of the stray colour.
 * **/

const Colors = {
   light: {
      // Brand — deep ink navy. Buttons, focus rings, active tabs.
      primary: "#1D3F73",
      primaryFaded: "rgba(29, 63, 115, 0.10)",
      primarySoft: "#EDF1F8",
      onPrimary: "#FFFFFF",
      // A near-black used for high-contrast fills and headline text.
      secondary: "#0D1520",
      accent: "#5C6B85",

      // Status
      success: "#0F7B5F",
      successBackground: "#E9F6F1",
      warning: "#B7791F",
      warningBackground: "#FDF6E7",
      error: "#B4232B",
      errorBackground: "#FCEDED",
      info: "#2563C9",
      infoBackground: "#EAF1FC",

      /*
       * Risk ramp.
       *
       * Four steps, deliberately not "green → yellow → orange → red" at equal
       * saturation: `low` is muted almost to neutral because a low-risk clause
       * should recede, and `critical` is the single most saturated colour in
       * the entire palette so it cannot be missed on a dense list. The gap
       * between `high` and `critical` is intentionally larger than the others.
       * **/
      riskLow: "#5C6B85",
      riskLowBackground: "#F0F2F6",
      riskMedium: "#B7791F",
      riskMediumBackground: "#FDF6E7",
      riskHigh: "#C2410C",
      riskHighBackground: "#FDF0E8",
      riskCritical: "#A4141C",
      riskCriticalBackground: "#FBE9EA",
      // A clause the model could not find in the source document. Deliberately
      // colourless: unverified is not a risk level, it is an absence of proof.
      unverified: "#8A94A6",
      unverifiedBackground: "#F2F4F7",

      // Surfaces, flat to raised
      background: "#FAFBFC",
      surface: "#F1F3F6",
      card: "#FFFFFF",
      elevated: "#FFFFFF",

      // Text
      text: "#0D1520",
      textSecondary: "#4A5568",
      textTertiary: "rgba(13, 21, 32, 0.45)",
      textMuted: "#8A94A6",

      // Lines and depth
      border: "rgba(13, 21, 32, 0.08)",
      borderLight: "#E8EBF0",
      borderStrong: "rgba(13, 21, 32, 0.16)",
      shadow: "#0D1520",
      overlay: "rgba(13, 21, 32, 0.45)",

      // Component specifics
      forgotPassword: "#2563C9",
      skeletonBackground: "#EAEDF2",
      skeletonShimmer: "#F7F8FA",

      /*
       * Legacy decorative keys. Kept so existing screens keep compiling, but
       * now pointed at the real palette instead of four unrelated hues — the
       * quickest single change that stops stray colour leaking onto screens
       * that should be reading as neutral.
       * **/
      vio: "#1D3F73",
      blueg: "#2563C9",
      red: "#B4232B",
      emerald: "#0F7B5F",
   },

   dark: {
      // Brand — navy does not survive a dark background, so the dark theme
      // lifts it to a legible steel blue rather than keeping the same hex.
      primary: "#7FA6E8",
      primaryFaded: "rgba(127, 166, 232, 0.14)",
      primarySoft: "#18243A",
      onPrimary: "#0A0E14",
      secondary: "#E9EDF3",
      accent: "#9BA6B8",

      // Status
      success: "#3DBE94",
      successBackground: "#0A2620",
      warning: "#E0A83C",
      warningBackground: "#2A2009",
      error: "#F0757C",
      errorBackground: "#2E1417",
      info: "#6FA5F5",
      infoBackground: "#101E33",

      // Risk ramp — same logic as light: low recedes, critical shouts.
      riskLow: "#8A94A6",
      riskLowBackground: "#171D28",
      riskMedium: "#E0A83C",
      riskMediumBackground: "#2A2009",
      riskHigh: "#F08A4B",
      riskHighBackground: "#2E1C0F",
      riskCritical: "#FF6B72",
      riskCriticalBackground: "#38141A",
      unverified: "#6E788B",
      unverifiedBackground: "#161C26",

      // Surfaces, flat to raised
      background: "#0A0E14",
      surface: "#111721",
      card: "#161D28",
      elevated: "#1D2635",

      // Text
      text: "#E9EDF3",
      textSecondary: "#9BA6B8",
      textTertiary: "rgba(233, 237, 243, 0.45)",
      textMuted: "#6E788B",

      // Lines and depth
      border: "rgba(255, 255, 255, 0.08)",
      borderLight: "#1F2836",
      borderStrong: "rgba(255, 255, 255, 0.18)",
      shadow: "#000000",
      overlay: "rgba(0, 0, 0, 0.62)",

      // Component specifics
      forgotPassword: "#6FA5F5",
      skeletonBackground: "#161D28",
      skeletonShimmer: "#212B3B",

      // Legacy decorative keys, now aliases into the real palette.
      vio: "#7FA6E8",
      blueg: "#6FA5F5",
      red: "#F0757C",
      emerald: "#3DBE94",
   },
}

/*
 * Exported both ways: constants/index.ts re-exports this module with `export *`,
 * which needs at least one named export to be valid.
 * **/
export { Colors }
export default Colors
