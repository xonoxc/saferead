import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { FileCheck2, X } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"
import { Drawer } from "@/components/Drawer"

import type { Chats } from "@/hooks/chat/useChat"
import type { ColorsType } from "@/hooks/useTheme"

export function ChatSources({ chat, colors }: { chat: Chats[number]; colors: ColorsType }) {
   const [isDrawerOpen, setDrawerOpen] = useState(false)

   if (!chat.sources || chat.sources.length === 0) return null

   return (
      <>
         <TouchableOpacity
            onPress={() => setDrawerOpen(true)}
            style={[
               styles.button,
               {
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
               },
            ]}
         >
            <FileCheck2 size={16} color={colors.textMuted} />
            <Text style={[styles.buttonText, { color: colors.text }]}>
               {chat.sources.length} Sources
            </Text>
         </TouchableOpacity>

         <Drawer visible={isDrawerOpen} enableAbsolute position="bottom">
            <SourceDrawerList
               sources={chat.sources}
               colors={colors}
               onClose={() => setDrawerOpen(false)}
            />
         </Drawer>
      </>
   )
}

function SourceDrawerList({
   sources,
   colors,
   onClose,
}: {
   sources: Chats[number]["sources"]
   colors: ColorsType
   onClose: () => void
}) {
   return (
      <View style={styles.drawerContent}>
         <View style={styles.drawerHeader}>
            <Text style={[styles.drawerTitle, { color: colors.text }]}>Sources</Text>
            <TouchableOpacity
               onPress={onClose}
               style={[
                  styles.closeButton,
                  {
                     backgroundColor: colors.surface,
                     borderColor: colors.border,
                  },
               ]}
            >
               <X strokeWidth={2} size={16} color={colors.primary} />
               <Text style={[styles.closeButtonText, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
         </View>
         {sources.map((doc, i) => (
            <View
               key={i}
               style={[
                  styles.sourceItem,
                  {
                     borderColor: colors.border,
                     backgroundColor: colors.background,
                  },
               ]}
            >
               <FileCheck2 size={16} color={colors.textMuted} />
               <Text style={[styles.sourceText, { color: colors.text }]}>{doc.name}</Text>
            </View>
         ))}
      </View>
   )
}

const styles = StyleSheet.create({
   button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      flexDirection: "row",
      width: "30%",
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
   },
   buttonText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.semiBold,
   },
   drawerContent: {
      padding: 16,
      zIndex: 1000,
   },
   drawerHeader: {
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
   },
   drawerTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
   closeButton: {
      borderWidth: 1,
      padding: 12,
      flexDirection: "row",
      gap: 8,
      justifyContent: "space-between",
      borderRadius: 12,
      alignItems: "center",
   },
   closeButtonText: {
      fontFamily: Fonts.medium,
      fontSize: FontSizes.sm,
   },
   sourceItem: {
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderRadius: 10,
      padding: 10,
      marginBottom: 8,
   },
   sourceText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
      flexShrink: 1,
   },
})
