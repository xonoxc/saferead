import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { useTheme } from "@/hooks/useTheme"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { router } from "expo-router"
import { View, Text, SafeAreaView } from "react-native"

export default function DocumentAnalyisResultScreen() {
  const { colors } = useTheme()
  const analysisResult = useAnalysisStore(s => s.analysisResult)

  const handleBackPress = () => router.back()

  if (!analysisResult) return <Fallback />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <DocumentAnalysisView onBack={handleBackPress} analysis={analysisResult} />
    </SafeAreaView>
  )
}

function Fallback() {
  return (
    <View>
      <Text>No analysis result found.</Text>
    </View>
  )
}
