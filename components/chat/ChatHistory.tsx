import { useTheme } from "@/hooks/useTheme"

import type { Chats } from "@/hooks/chat/useChat"
import { View, Text } from "react-native"
import React from "react"
import { FileCheck2 } from "lucide-react-native"
import { ChatBubble } from "./ChatBubble"
import { Fonts, FontSizes } from "@/constants"

export function ChatHistory({ chatHistory }: { chatHistory: Chats }) {
  const { colors } = useTheme()

  return (
    <>
      {chatHistory.map((chat, index) => {
        return (
          <View key={index} style={{ marginBottom: 12, flex: 1 }}>
            <ChatBubble chat={chat} index={index} colors={colors} />

            {chat.sender === "bot" && chat.sources && chat?.sources?.length > 0 && (
              <View style={{ marginTop: 4, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {chat.sources.map((doc, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: colors.background,
                      paddingHorizontal: 16,
                      marginRight: 20,
                      paddingVertical: 4,
                      borderRadius: 16,
                      marginBottom: 6,
                      minWidth: 0,
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        borderRadius: 10,
                        flexShrink: 1,
                        padding: 10,
                      }}
                    >
                      <FileCheck2 size={16} color={colors.textMuted} />
                      <Text
                        style={{
                          fontSize: FontSizes.xs,
                          color: colors.text,
                          fontFamily: Fonts.medium,
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 1,
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        {doc.name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )
      })}
    </>
  )
}
