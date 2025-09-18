import React, { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import TopTabBar from "@/components/tabs/TopTabBar"
import DocumentTab from "@/components/tabs/DocumentTab"
import ConversationsTab from "@/components/tabs/ConversationsTab"
import FilesTab from "@/components/tabs/FilesTab"
import { useLocalSearchParams } from "expo-router"

const tabs = [{ name: "Document" }, { name: "Conversation" }, { name: "Files" }]

export default function ScanMenuScreen() {
   const { colors } = useTheme()
   const params = useLocalSearchParams<{ tab?: string }>()
   const [selectedTab, setSelectedTab] = useState(0)

   useEffect(() => {
      if (params.tab === "conversation") {
         setSelectedTab(1)
      }
   }, [params])

   const renderContent = () => {
      switch (selectedTab) {
         case 0:
            return <DocumentTab />
         case 1:
            return <ConversationsTab />
         case 2:
            return <FilesTab />
         default:
            return null
      }
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <TopTabBar tabs={tabs} selectedTab={selectedTab} onTabPress={setSelectedTab} />
         <View style={{ flex: 1 }}>{renderContent()}</View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 15,
   },
})
