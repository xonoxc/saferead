import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { useTheme } from "@/hooks/useTheme"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { router } from "expo-router"
import { View, Text, SafeAreaView, StyleSheet } from "react-native"

export default function DocumentAnalyisResultScreen() {
  const { analysisResult } = useAnalysisStore()
  const { colors } = useTheme()

  const handleBackPress = () => {
    router.back()
  }

  if (!analysisResult) {
    return (
      <View>
        <Text>No analysis result found.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <DocumentAnalysisView onBack={handleBackPress} analysis={analysisResult} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
