import { Fonts, FontSizes } from "@/constants"
import { View, Text, StyleSheet } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"
import type { LucideIcon } from "lucide-react-native"

interface StatCardProps {
   stat: {
      icon: LucideIcon
      title: string
      value: number
      color: string
      isPercentage?: boolean
   }
   style?: object
   colors: ColorsType
}

export default function TypeCard({ stat, colors }: StatCardProps) {
   return (
      <View style={[styles.typeCard, { borderColor: colors.border }]}>
         <View style={[styles.typeIcon, { backgroundColor: `${stat.color}20` }]}>
            <stat.icon size={20} color={stat.color} />
         </View>
         <View style={styles.typeContent}>
            <Text style={[styles.typeTitle, { color: colors.text }]}>{stat.title}</Text>
            <Text style={[styles.typeValue, { color: stat.color }]}>{stat.value}</Text>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   typeCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      borderBottomWidth: 1,
   },
   typeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   typeContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   typeTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
   },
   typeValue: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
})
