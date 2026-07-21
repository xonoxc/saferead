import React from "react"

import { View, StyleSheet } from "react-native"
import { ChatBubble } from "./ChatBubble"
import { ChatSources } from "./ChatSources"

import { useTheme } from "@/hooks/useTheme"
import { Spacing } from "@/constants/Design"

import type { Chats } from "@/hooks/chat/useChat"

export function ChatHistory({ chatHistory }: { chatHistory: Chats }) {
   const { colors } = useTheme()

   return (
      <>
         {chatHistory.map((chat, index) => {
            return (
               <View key={index} style={styles.row}>
                  <ChatBubble
                     chat={chat}
                     index={index}
                     colors={colors}
                     totalCount={chatHistory.length}
                  />

                  {chat.sender === "bot" && <ChatSources colors={colors} chat={chat} />}
               </View>
            )
         })}
      </>
   )
}

const styles = StyleSheet.create({
   row: {
      marginBottom: Spacing.xs,
   },
})
