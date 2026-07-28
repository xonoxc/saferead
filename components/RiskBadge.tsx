import { View, Text, StyleSheet } from "react-native"
import { AlertTriangle, CircleSlash, ShieldCheck, ShieldAlert, HelpCircle } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type, riskColors, RISK_LABELS } from "@/constants"

import type { RiskLevel } from "@/constants"

/*
 * The single way a risk level is drawn.
 *
 * Three things are deliberate here:
 *
 * 1. **Icon plus colour, never colour alone.** Roughly one man in twelve has
 *    some form of colour-vision deficiency, and this badge is the difference
 *    between "standard terms" and "do not sign this". Red-versus-amber is
 *    exactly the pair that fails, so the shape carries the meaning too.
 *
 * 2. **Words, not numbers.** "Negotiate" tells someone what to do; "risk: 3"
 *    makes them work it out. The labels live in RISK_LABELS so every surface
 *    says the same word.
 *
 * 3. **`missing` and `unverified` are first-class states, not risk levels.**
 *    A clause that is *absent* from the contract and a claim whose quote could
 *    not be found in the source document are both important and neither is a
 *    point on the low-to-critical scale. Flattening them into "low" would hide
 *    the two findings most worth a second look.
 * **/

interface RiskBadgeProps {
   level: RiskLevel | null | undefined
   /* The clause type is absent from the document — often the real finding. */
   isMissing?: boolean
   /* The quoted span could not be located in the source text. */
   unverified?: boolean
   size?: "small" | "medium"
}

export function RiskBadge({ level, isMissing, unverified, size = "medium" }: RiskBadgeProps) {
   const { colors } = useTheme()
   const compact = size === "small"
   const iconSize = compact ? 12 : 14

   if (isMissing) {
      return (
         <Badge
            fg={colors.riskHigh}
            bg={colors.riskHighBackground}
            label="Not present"
            compact={compact}
            icon={<CircleSlash size={iconSize} color={colors.riskHigh} strokeWidth={2.5} />}
         />
      )
   }

   if (unverified) {
      return (
         <Badge
            fg={colors.unverified}
            bg={colors.unverifiedBackground}
            label="Unverified quote"
            compact={compact}
            icon={<HelpCircle size={iconSize} color={colors.unverified} strokeWidth={2.5} />}
         />
      )
   }

   const { fg, bg } = riskColors(colors, level)
   const label = level ? RISK_LABELS[level] : "Unrated"

   const icon =
      level === "critical" ? (
         <AlertTriangle size={iconSize} color={fg} strokeWidth={2.5} />
      ) : level === "high" ? (
         <ShieldAlert size={iconSize} color={fg} strokeWidth={2.5} />
      ) : level === "medium" ? (
         <ShieldAlert size={iconSize} color={fg} strokeWidth={2.5} />
      ) : (
         <ShieldCheck size={iconSize} color={fg} strokeWidth={2.5} />
      )

   return <Badge fg={fg} bg={bg} label={label} icon={icon} compact={compact} />
}

function Badge({
   fg,
   bg,
   label,
   icon,
   compact,
}: {
   fg: string
   bg: string
   label: string
   icon: React.ReactNode
   compact: boolean
}) {
   return (
      <View
         accessibilityRole="text"
         accessibilityLabel={`Risk: ${label}`}
         style={[
            styles.badge,
            compact ? styles.compact : styles.regular,
            { backgroundColor: bg },
         ]}
      >
         {icon}
         <Text style={[styles.label, compact && styles.labelCompact, { color: fg }]}>{label}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   badge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      borderRadius: Radii.xs,
      gap: 5,
   },
   regular: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 5,
   },
   compact: {
      paddingHorizontal: 6,
      paddingVertical: 3,
      gap: 4,
   },
   label: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
      includeFontPadding: false,
   },
   labelCompact: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
   },
})

export default RiskBadge
