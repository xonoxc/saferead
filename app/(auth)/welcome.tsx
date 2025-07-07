import React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { Link } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"

export default function WelcomeScreen() {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400",
            }}
            style={[styles.image, { borderColor: colors.border }]}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>SafeRead</Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your AI-powered legal document
          </Text>

          <Text style={[styles.description, { color: colors.textMuted }]}>
            Analyze contracts, understand legal terms, and protect your interests with advanced AI
            technology.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/(auth)/register" asChild>
          <Button title="Get Started" variant="primary" size="large" fullWidth onPress={() => {}} />
        </Link>

        <Link href="/(auth)/login" asChild>
          <Button title="Sign In" variant="outline" size="large" fullWidth onPress={() => {}} />
        </Link>

        <Link href="/(tabs)/premium" asChild>
          <Button title="Premium" variant="outline" size="large" fullWidth onPress={() => {}} />
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 48,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 20,
  },
})
