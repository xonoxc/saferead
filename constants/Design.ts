import { Platform } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"

/*
 * Shared layout and motion tokens.
 *
 * Screens previously hardcoded their own paddings, radii and shadows, so
 * spacing drifted between them. Pulling these into one place is what makes the
 * app read as a single product rather than a set of separate screens.
 * **/

export const Spacing = {
   xxs: 4,
   xs: 8,
   sm: 12,
   md: 16,
   lg: 20,
   xl: 24,
   xxl: 32,
   xxxl: 44,
} as const

/*
 * Corner radii.
 *
 * Pulled in across the board (was 8/12/16/20/26). Heavily rounded corners read
 * as consumer-app friendly, which is the wrong register for something a
 * business uses to decide whether to sign a contract. Tighter corners also let
 * cards sit closer together without the gaps between them looking accidental,
 * which matters on a dense clause list.
 * **/
export const Radii = {
   xs: 6,
   sm: 10,
   md: 14,
   lg: 18,
   xl: 22,
   pill: 999,
} as const

/*
 * Bottom tab bar geometry.
 *
 * The bar floats over the content rather than sitting in the layout flow, so
 * its size is not discoverable from the tree. Every screen that scrolls under
 * it has to reserve `clearance` at the end of its content, and previously each
 * one guessed its own number (110, 120, 130...), which is why the last row was
 * clipped on some screens and swimming in space on others.
 * **/
export const TabBar = {
   /* The floating pill itself. */
   height: 62,
   /* Gap between the pill and the left/right screen edges. */
   inset: 14,
   /* Gap between the pill and whatever sits below it. */
   gap: 12,
   /*
    * Was a full 32 (a perfect capsule). A slightly squarer bar matches the
    * tightened Radii scale — a capsule tab bar above square-ish cards reads as
    * two different apps stacked on top of each other.
    * **/
   radius: 22,
   /* Diameter of the raised centre action. */
   actionSize: 54,
   /* How far the centre action rides above the pill. */
   actionLift: 16,
} as const

/* What a scrolling screen must reserve so its last row clears the bar. */
export const TAB_BAR_CLEARANCE = TabBar.height + TabBar.gap + TabBar.actionLift + Spacing.lg

/*
 * Motion.
 *
 * Durations stay short: entrances should feel like the UI is keeping up with
 * the user, not performing for them. Stagger is per-item delay in lists.
 * **/
export const Motion = {
   instant: 120,
   fast: 180,
   base: 260,
   slow: 380,
   stagger: 35,
   /*
    * Springs below are tuned to a damping ratio of ~1.0 (critically damped),
    * which means they settle without overshooting.
    *
    *    ratio = damping / (2 * sqrt(stiffness * mass))
    *
    * Anything below ~0.9 visibly bounces past its target and back. These were
    * previously 0.73 and 0.58, which read as playful rather than considered -
    * on a screen full of cards and chips the overshoot compounds and the whole
    * UI wobbles. Keep the ratio at ~1.0 when retuning: raise stiffness to make
    * a spring faster, and raise damping to match, rather than dropping damping.
    */

   /* Pressable feedback and shared transitions. ratio 0.98 */
   spring: {
      damping: 26,
      stiffness: 220,
      mass: 0.8,
   },
   /* Small elements like chips and icons - faster, still no overshoot. ratio 1.01 */
   springQuick: {
      damping: 26,
      stiffness: 300,
      mass: 0.55,
   },
   /* How far a card travels on entrance. */
   riseDistance: 10,
   /* Scale applied while a control is held down. */
   pressScale: 0.98,
} as const

/*
 * Elevation.
 *
 * iOS uses layered shadows, Android only understands elevation, so return both
 * and let each platform take what it supports.
 *
 * Every level is roughly half as strong as it was. Soft drop shadows on a page
 * of cards make the whole screen look slightly out of focus, and they compete
 * with the risk colours for attention. Separation now comes mainly from the
 * hairline border and the surface/card contrast, with shadow only hinting at
 * depth. Level 3 stays comparatively strong because the one thing that really
 * does float above the content is the tab bar.
 * **/
export function elevation(colors: ColorsType, level: 0 | 1 | 2 | 3 = 1) {
   if (level === 0) {
      return {}
   }

   const config = {
      1: { opacity: 0.03, radius: 4, offsetY: 1, elevation: 1 },
      2: { opacity: 0.06, radius: 10, offsetY: 3, elevation: 3 },
      3: { opacity: 0.12, radius: 22, offsetY: 10, elevation: 8 },
   }[level]

   return Platform.select({
      ios: {
         shadowColor: colors.shadow,
         shadowOpacity: config.opacity,
         shadowRadius: config.radius,
         shadowOffset: { width: 0, height: config.offsetY },
      },
      android: {
         elevation: config.elevation,
      },
      default: {
         shadowColor: colors.shadow,
         shadowOpacity: config.opacity,
         shadowRadius: config.radius,
         shadowOffset: { width: 0, height: config.offsetY },
      },
   })
}

/*
 * Type scale.
 *
 * `FontSizes` gives a size and nothing else, so every screen picked its own
 * line height — or, more often, none at all, leaving the platform default.
 * That is survivable for labels and stat tiles; it is not survivable for the
 * paragraph of plain-English explanation that now sits under every clause,
 * where unset leading makes multi-line text look cramped and unreadable.
 *
 * Each entry is a complete text style. Line heights are ~1.25 for display
 * sizes (tight, so headings read as one object) and ~1.5 for body (loose, so
 * paragraphs are comfortable). Negative tracking on the large sizes only:
 * Inter needs it above ~20px and is hurt by it below ~14px.
 * **/
export const Type = {
   display: { fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
   title: { fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
   heading: { fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
   subheading: { fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
   body: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
   bodySmall: { fontSize: 14, lineHeight: 21, letterSpacing: 0 },
   caption: { fontSize: 13, lineHeight: 18, letterSpacing: 0 },
   micro: { fontSize: 11, lineHeight: 14, letterSpacing: 0.2 },
   /* Section headers above a list. Small, spaced, upper case at the call site. */
   overline: { fontSize: 11, lineHeight: 14, letterSpacing: 0.8 },
} as const

/*
 * Risk presentation.
 *
 * The backend returns `low | medium | high | critical` on every clause, plus a
 * `span_verified` flag. Mapping those onto colour in one place is what keeps a
 * critical finding looking identical on the contract detail screen, in a list
 * row and inside a filter chip — and stops a screen inventing its own idea of
 * what "high" looks like.
 * **/
export type RiskLevel = "low" | "medium" | "high" | "critical"

export function riskColors(colors: ColorsType, level: RiskLevel | null | undefined) {
   switch (level) {
      case "critical":
         return { fg: colors.riskCritical, bg: colors.riskCriticalBackground }
      case "high":
         return { fg: colors.riskHigh, bg: colors.riskHighBackground }
      case "medium":
         return { fg: colors.riskMedium, bg: colors.riskMediumBackground }
      case "low":
         return { fg: colors.riskLow, bg: colors.riskLowBackground }
      default:
         /* No risk level at all - an unextracted or missing clause. */
         return { fg: colors.unverified, bg: colors.unverifiedBackground }
   }
}

export const RISK_LABELS: Record<RiskLevel, string> = {
   low: "Standard",
   medium: "Worth knowing",
   high: "Negotiate",
   critical: "Critical",
}

/*
 * Translate a space's hex colour into a soft background tint.
 *
 * Space colours come from the server as opaque hex, which is far too heavy to
 * sit behind text or fill an icon tile.
 * **/
export function withAlpha(hexColor: string | null | undefined, alpha: number): string {
   /*
    * A space saved before `color` had a default, or any payload where the field
    * comes back null, used to throw here on `.replace` - and because the result
    * feeds native views like LinearGradient, the failure surfaced as a crash on
    * whichever screen happened to render that space rather than as a bad colour.
    * **/
   if (typeof hexColor !== "string" || !hexColor) return "transparent"

   const hex = hexColor.replace("#", "")

   if (hex.length !== 6) return hexColor

   const r = parseInt(hex.slice(0, 2), 16)
   const g = parseInt(hex.slice(2, 4), 16)
   const b = parseInt(hex.slice(4, 6), 16)

   if ([r, g, b].some(Number.isNaN)) return hexColor

   return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
