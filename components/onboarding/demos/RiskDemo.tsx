import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Shield } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export const RiskDemo: React.FC = () => {
  const { colors } = useTheme()

  return (
    <View style={styles.riskDemo}>
      <View style={[styles.riskCard, { backgroundColor: colors.card }]}>
        <View style={styles.riskHeader}>
          <Shield size={20} color={colors.success} />
          <Text style={[styles.riskTitle, { color: colors.text }]}>Risk Assessment</Text>
        </View>
        <View style={styles.riskLevel}>
          <Text style={[styles.riskLevelText, { color: colors.success }]}>LOW RISK</Text>
        </View>
        <Text style={[styles.riskDescription, { color: colors.textSecondary }]}>
          Standard terms with favorable conditions
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  riskDemo: {
    width: "100%",
    maxWidth: 280,
  },
  riskCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  riskTitle: {
    padding: 10,
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
  },
  riskLevel: {
    marginBottom: 8,
  },
  riskLevelText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  riskDescription: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
})
