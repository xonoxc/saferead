import React from "react"
import { View, Modal, StyleSheet } from "react-native"
import { LoadingSpinner } from "./LoadingSpinner"
import { useTheme } from "@/hooks/useTheme"

interface ModalLoadingSpinnerProps {
   visible: boolean
   message?: string
}

export const ModalLoadingSpinner = ({ visible, message }: ModalLoadingSpinnerProps) => {
   const { colors } = useTheme()

   return (
      <Modal transparent visible={visible} animationType="fade">
         <View style={styles.container}>
            <View style={[styles.innerContainer, { backgroundColor: colors.surface }]}>
               <LoadingSpinner message={message} />
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
   },
   innerContainer: {
      padding: 32,
      borderRadius: 16,
   },
})
