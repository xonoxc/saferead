import Svg, { Path } from "react-native-svg"

export function ExitBoxIcon({ size = 24, color = "#fff" }) {
   return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
         {/* Box */}
         <Path d="M3 3h12v18H3z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
         {/* Arrow */}
         <Path
            d="M15 12h6m0 0l-2-2m2 2l-2 2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </Svg>
   )
}
