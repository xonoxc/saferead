import { BlurView } from "expo-blur"
import { StyleSheet } from "react-native"

export const BlurTabBarBackground = () => (
  <BlurView intensity={30} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
)
