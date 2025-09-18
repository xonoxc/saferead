import React from "react"

import { View } from "react-native"
import { ChatBubble } from "./ChatBubble"
import { ChatSources } from "./ChatSources"

import { useTheme } from "@/hooks/useTheme"

import type { Chats } from "@/hooks/chat/useChat"

export function ChatHistory({ chatHistory }: { chatHistory: Chats }) {
   const { colors } = useTheme()

   return (
      <>
         {chatHistory.map((chat, index) => {
            return (
               <View key={index} style={{ marginBottom: 12, flex: 1 }}>
                  <ChatBubble chat={chat} index={index} colors={colors} />

                  {chat.sender === "bot" && <ChatSources colors={colors} chat={chat} />}
               </View>
            )
         })}
      </>
   )
}
