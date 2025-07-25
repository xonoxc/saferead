import { View } from "react-native"
import { ReactNode } from "react"

export const ChipGroup = ({ children }: { children: ReactNode }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {children}
    </View>
  )
}
