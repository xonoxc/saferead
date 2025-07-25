import { View } from "react-native"
import { LoadingSpinner } from "../LoadingSpinner"

import { useTheme } from "@/hooks/useTheme"

export default function SideBarLoadingState() {
  const { colors } = useTheme()

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <LoadingSpinner />
    </View>
  )
}
