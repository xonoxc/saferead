import { Upload } from "lucide-react-native"
import { Pressable, View, StyleSheet } from "react-native"
import Animated, {
   withRepeat,
   withTiming,
   useSharedValue,
   useAnimatedStyle,
   useAnimatedReaction,
   FadeInDown,
} from "react-native-reanimated"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { useTheme } from "@react-navigation/native"

export function FloatingUploadButton({ handleUploadPress }: { handleUploadPress: () => void }) {
   const { colors } = useTheme()
   const isAnalyzing = useAnalysisStore(state => state.isAnalyzing)

   const rotation = useSharedValue(0)

   useAnimatedReaction(
      () => isAnalyzing,
      (current, previous) => {
         if (current && !previous) {
            rotation.value = withRepeat(withTiming(360, { duration: 700 }), -1, false)
         } else if (!current && previous) {
            rotation.value = withTiming(0, { duration: 300 })
         }
      }
   )

   const spinStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
   }))

   return (
      <Animated.View entering={FadeInDown.delay(150)} style={styles.floatingButtonContainer}>
         <Pressable onPress={handleUploadPress} style={styles.floatingButton}>
            <View style={[styles.uploadAction, { backgroundColor: colors.text }]}>
               {isAnalyzing ? (
                  <Animated.View
                     style={[styles.loader, { borderTopColor: colors.background }, spinStyle]}
                  />
               ) : (
                  <Upload size={24} color={colors.background} />
               )}
            </View>
         </Pressable>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   floatingButtonContainer: {
      position: "absolute",
      bottom: 130,
      right: 20,
      zIndex: 100,
   },
   floatingButton: {
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
   },
   loader: {
      width: 24,
      height: 24,
      borderWidth: 3,
      borderRadius: 12,
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: "transparent",
   },
   uploadAction: {
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 25,
      borderRadius: 50,
   },
})
