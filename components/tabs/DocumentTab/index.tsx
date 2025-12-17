import React from "react"
import { View, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/useTheme"

import DocumentTabContent from "@/components/tabs/DocumentTab/DocumentTabContent"

export default function DocumentTab() {
   const { colors } = useTheme()

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={{ flex: 1 }}>
            <DocumentTabContent />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      zIndex: 10000,
   },
})
