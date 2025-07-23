import React from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Plus } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { router } from "expo-router"
import { scanDocument } from "@/hooks/useAnalysis"

export function ScanButton() {
  const { colors } = useTheme()

  const handlePress = async () => {
    await scanDocument()
    router.push("/(application)/(tabs)/documents")
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <View style={[styles.inner, { backgroundColor: colors.primary }]}>
        <Plus color="white" size={24} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f472b6", // pink~! 🌸
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})
