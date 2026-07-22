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

export const Radii = {
   xs: 8,
   sm: 12,
   md: 16,
   lg: 20,
   xl: 26,
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
   height: 64,
   /* Gap between the pill and the left/right screen edges. */
   inset: 16,
   /* Gap between the pill and whatever sits below it. */
   gap: 12,
   radius: 32,
   /* Diameter of the raised centre action. */
   actionSize: 58,
   /* How far the centre action rides above the pill. */
   actionLift: 18,
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
   stagger: 55,
   /* A gentle spring for pressable feedback and shared transitions. */
   spring: {
      damping: 18,
      stiffness: 190,
      mass: 0.8,
   },
   /* Snappier spring for small elements like chips and icons. */
   springQuick: {
      damping: 15,
      stiffness: 280,
      mass: 0.6,
   },
   /* How far a card travels on entrance. */
   riseDistance: 14,
   /* Scale applied while a control is held down. */
   pressScale: 0.97,
} as const

/*
 * Elevation.
 *
 * iOS uses layered shadows, Android only understands elevation, so return both
 * and let each platform take what it supports.
 * **/
export function elevation(colors: ColorsType, level: 0 | 1 | 2 | 3 = 1) {
   if (level === 0) {
      return {}
   }

   const config = {
      1: { opacity: 0.06, radius: 8, offsetY: 2, elevation: 2 },
      2: { opacity: 0.1, radius: 16, offsetY: 6, elevation: 5 },
      3: { opacity: 0.16, radius: 28, offsetY: 12, elevation: 10 },
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
 * Translate a space's hex colour into a soft background tint.
 *
 * Space colours come from the server as opaque hex, which is far too heavy to
 * sit behind text or fill an icon tile.
 * **/
export function withAlpha(hexColor: string, alpha: number): string {
   const hex = hexColor.replace("#", "")

   if (hex.length !== 6) return hexColor

   const r = parseInt(hex.slice(0, 2), 16)
   const g = parseInt(hex.slice(2, 4), 16)
   const b = parseInt(hex.slice(4, 6), 16)

   if ([r, g, b].some(Number.isNaN)) return hexColor

   return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
