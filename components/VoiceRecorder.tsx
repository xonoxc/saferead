import React from "react"
import { View, Text, StyleSheet, Modal, Animated, Pressable } from "react-native"
import { Mic, MicOff, X } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

interface VoiceRecorderProps {
   isVisible: boolean
   isRecording: boolean
   onClose: () => void
   onStopRecording: () => void
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
   isVisible,
   isRecording,
   onClose,
   onStopRecording,
}) => {
   const { colors } = useTheme()
   const pulseAnim = React.useRef(new Animated.Value(1)).current

   React.useEffect(() => {
      if (isRecording) {
         const pulse = Animated.loop(
            Animated.sequence([
               Animated.timing(pulseAnim, {
                  toValue: 1.3,
                  duration: 1000,
                  useNativeDriver: true,
               }),
               Animated.timing(pulseAnim, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
               }),
            ])
         )
         pulse.start()
         return () => pulse.stop()
      }
   }, [isRecording, pulseAnim])

   return (
      <Modal visible={isVisible} transparent animationType="fade">
         <View style={styles.overlay}>
            <View style={[styles.container, { backgroundColor: colors.card }]}>
               <Pressable style={styles.closeButton} onPress={onClose}>
                  <X size={24} color={colors.textSecondary} />
               </Pressable>

               <View style={styles.content}>
                  <Text style={[styles.title, { color: colors.text }]}>Voice Recording</Text>

                  <Animated.View
                     style={[
                        styles.recordButton,
                        {
                           backgroundColor: isRecording ? colors.error : colors.primary,
                           transform: [{ scale: pulseAnim }],
                        },
                     ]}
                  >
                     <Pressable style={styles.recordButtonInner} onPress={onStopRecording}>
                        {isRecording ? (
                           <MicOff size={40} color="#FFFFFF" />
                        ) : (
                           <Mic size={40} color="#FFFFFF" />
                        )}
                     </Pressable>
                  </Animated.View>

                  <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                     {isRecording ? "Recording... Tap to stop" : "Tap to start recording"}
                  </Text>

                  {isRecording && (
                     <View style={styles.waveform}>
                        {[...Array(5)].map((_, index) => (
                           <Animated.View
                              key={index}
                              style={[styles.waveBar, { backgroundColor: colors.primary }]}
                           />
                        ))}
                     </View>
                  )}
               </View>
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
   },
   container: {
      borderRadius: 20,
      padding: 24,
      margin: 20,
      minWidth: 300,
      alignItems: "center",
   },
   closeButton: {
      position: "absolute",
      top: 16,
      right: 16,
      padding: 4,
   },
   content: {
      alignItems: "center",
      paddingTop: 20,
   },
   title: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.semiBold,
      marginBottom: 32,
   },
   recordButton: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
   },
   recordButtonInner: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
   },
   instruction: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      textAlign: "center",
      marginBottom: 16,
   },
   waveform: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   waveBar: {
      width: 4,
      height: 20,
      borderRadius: 2,
   },
})
