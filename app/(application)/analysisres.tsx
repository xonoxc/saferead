import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { useTheme } from "@/hooks/useTheme"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { router } from "expo-router"
import { View, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function DocumentAnalyisResultScreen() {
   const { colors } = useTheme()
   const insets = useSafeAreaInsets()
   const analysisResult = useAnalysisStore(s => s.analysisResult)

   const handleBackPress = () => router.back()

   if (!analysisResult) return <Fallback />

   return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
         <DocumentAnalysisView onBack={handleBackPress} analysis={analysisResult} />
      </View>
   )
}

function Fallback() {
   return (
      <View>
         <Text>No analysis result found.</Text>
      </View>
   )
}
