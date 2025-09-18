import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"
import { Camera, Upload, MessageCircle, CheckCircle } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export const AnalysisDemo: React.FC = () => {
   const { colors } = useTheme()
   const [isAnalyzing, setIsAnalyzing] = useState(false)

   const handleAnalyze = () => {
      setIsAnalyzing(true)
      setTimeout(() => setIsAnalyzing(false), 2000)
   }

   return (
      <View style={styles.analysisDemo}>
         <View style={styles.uploadOptions}>
            <TouchableOpacity
               style={[styles.uploadOption, { backgroundColor: colors.primary + "15" }]}
               onPress={handleAnalyze}
            >
               <Camera size={24} color={colors.primary} />
               <Text style={[styles.uploadText, { color: colors.primary }]}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.uploadOption, { backgroundColor: colors.secondary + "15" }]}
               onPress={handleAnalyze}
            >
               <Upload size={24} color={colors.secondary} />
               <Text style={[styles.uploadText, { color: colors.secondary }]}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.uploadOption, { backgroundColor: colors.accent + "15" }]}
               onPress={handleAnalyze}
            >
               <MessageCircle size={24} color={colors.secondary} />
               <Text
                  style={[
                     styles.uploadText,
                     { backgroundColor: colors.accent + "15", color: colors.text },
                  ]}
               >
                  Chat
               </Text>
            </TouchableOpacity>

            {isAnalyzing && (
               <Animated.View
                  entering={FadeInUp.springify()}
                  style={[
                     styles.analysisResult,
                     {
                        backgroundColor: colors.success + "15",
                        borderWidth: 2,
                        borderColor: "white",
                     },
                  ]}
               >
                  <CheckCircle size={20} color={colors.success} />
                  <Text style={[styles.resultText, { color: colors.text }]}>
                     Analysis Complete!
                  </Text>
               </Animated.View>
            )}
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   analysisDemo: {
      alignItems: "center",
      gap: 24,
   },
   uploadOptions: {
      flexDirection: "row",
      gap: 16,
   },
   uploadOption: {
      width: 80,
      height: 80,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
   },
   uploadText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
   analysisResult: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
   },
   resultText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
   },
})
