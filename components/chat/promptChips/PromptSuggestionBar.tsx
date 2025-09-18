import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { PromptChip } from "./Chips"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { WandSparkles } from "lucide-react-native"

interface PromptSuggestionBarProps {
   onPromptSelect: (prompt: string) => void
}

const prompts = [
   "Quick Summary",
   "Key Clauses",
   "Red Flags",
   "Risk Zones",
   "Fine Print",
   "Should Sign?",
   "Define Terms",
   "Doc Compare",
   "Real Impact",
   "Rights Check",
]

export const PromptSuggestionBar = ({ onPromptSelect }: PromptSuggestionBarProps) => {
   const { colors } = useTheme()

   return (
      <View>
         <View style={styles.titleContainer}>
            <WandSparkles color={colors.text} size={18} />
            <Text style={[styles.title, { color: colors.textSecondary }]}>Try:</Text>
         </View>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {prompts.map((prompt, index) => (
               <PromptChip key={index} label={prompt} onPress={onPromptSelect} />
            ))}
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   containerContainer: {
      flexDirection: "column",
      flexWrap: "wrap",
      gap: 1,
      marginTop: 8,
      marginBottom: 8,
   },
   titleContainer: {
      justifyContent: "flex-start",
      flexDirection: "row",
   },
   title: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
      marginBottom: 8,
      marginLeft: 10,
   },
   container: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexGrow: 0,
      gap: 8,
      paddingBottom: 10,
   },
})
