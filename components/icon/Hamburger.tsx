import React from "react"
import Svg, { Rect } from "react-native-svg"

export const MinimalHamburgerIcon = ({ color = "#E0E0E0", size = 24 }) => {
  const barWidth = size * 0.6
  const barHeight = size * 0.1

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect
        x={(size - barWidth) / 2}
        y={size * 0.25}
        width={barWidth}
        height={barHeight}
        rx={2}
        fill={color}
      />
      <Rect
        x={(size - barWidth) / 2}
        y={size * 0.45}
        width={barWidth * 0.8}
        height={barHeight}
        rx={2}
        fill={color}
      />
      <Rect
        x={(size - barWidth) / 2}
        y={size * 0.65}
        width={barWidth * 0.6}
        height={barHeight}
        rx={2}
        fill={color}
      />
    </Svg>
  )
}
