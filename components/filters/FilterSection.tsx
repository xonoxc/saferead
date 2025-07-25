import { View, Text, StyleSheet } from "react-native"
import { ReactNode } from "react"
import { useTheme } from "@/hooks/useTheme"

interface FilterSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
}

export const FilterSection = ({ title, icon, children }: FilterSectionProps) => {
  const { colors } = useTheme()
  return (
    <View style={styles.section}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.children}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  children: {
    gap: 8,
    flexWrap: "wrap",
  },
})
