import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { useTheme } from "@/hooks/useTheme"
import { useDocument } from "@/hooks/queries/docs"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { router, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function DocumentAnalyisResultScreen() {
   const { colors } = useTheme()
   const insets = useSafeAreaInsets()

   /*
    * Two ways in, both still supported: the home screen pushes `?id=`, while
    * the upload/list paths drop the row into the store and push bare. Either
    * one supplies the id, which is all the poll below needs.
    */
   const { id } = useLocalSearchParams<{ id?: string }>()
   const snapshot = useAnalysisStore(s => s.analysisResult)
   const documentId = id ?? snapshot?.id ?? ""

   /*
    * Analysis runs on a Celery worker, so an upload responds `pending` with
    * empty results and only fills in seconds-to-minutes later. This screen used
    * to render that store snapshot once and never look again, which is why a
    * fresh scan sat there looking blank while the worker was still reading it.
    */
   const { data } = useDocument(documentId)

   /*
    * The snapshot seeds the first frame so the filename and status render
    * instantly - but only when it is the *same* document. Without that guard,
    * arriving from the home screen (which passes an id and never writes the
    * store) shows the previously-opened scan until the fetch lands.
    */
   const analysis = data?.data ?? (snapshot?.id === documentId ? snapshot : undefined)

   const handleBackPress = () => router.back()

   if (!analysis) return <Fallback />

   return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
         <DocumentAnalysisView onBack={handleBackPress} analysis={analysis} />
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
