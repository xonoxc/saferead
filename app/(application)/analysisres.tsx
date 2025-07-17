import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { router } from "expo-router"
import { View, Text } from "react-native"

export default function DocumentAnalyisResultScreen() {
  const { analysisResult } = useAnalysisStore()

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

  return <DocumentAnalysisView onBack={handleBackPress} analysis={analysisResult} />
}
