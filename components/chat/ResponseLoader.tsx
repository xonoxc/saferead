import React from "react"
import { Fonts, FontSizes } from "@/constants"
import { View, Text, StyleSheet } from "react-native"

export default function ResponseLoader() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thinking....</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    width: 50,
    height: "100%",
    backgroundColor: "rgba(0, 255, 255, 0.7)",
    borderRadius: 10,
  },
  text: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: "#fff",
  },
})
