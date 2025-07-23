import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Send } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useSpaceStore } from "@/store/useSpaceStore"
import { SpaceIndicator } from "./spaceindicator/SpaceIndicator"

import { Fonts, FontSizes } from "@/constants/Fonts"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { SafeAreaView } from "react-native-safe-area-context"

export function ChatView() {
  const { colors } = useTheme()
  const { selectedSpace } = useSpaceStore()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ text: string; sender: "user" | "bot" }[]>([])

  useEffect(() => {
    if (selectedSpace) {
      setChatHistory([
        { text: `Welcome to ${selectedSpace.title}! How can I help you?`, sender: "bot" },
      ])
    }
  }, [selectedSpace])

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = { text: message, sender: "user" as const }
      setChatHistory(prev => [...prev, newMessage])
      setMessage("")
      setIsTyping(true)

      setTimeout(() => {
        const botResponse = {
          text: "This is a simulated response.",
          sender: "bot" as const,
        }
        setChatHistory(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1500)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerContent}>
          <SpaceIndicator />
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={80}
        enableOnAndroid
      >
        {chatHistory.map((chat, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(100 * index).springify()}
            style={[
              styles.chatBubble,
              chat.sender === "user" ? styles.userBubble : styles.botBubble,
              {
                backgroundColor: chat.sender === "user" ? colors.primary : colors.card,
              },
            ]}
          >
            <Text
              style={{
                color: chat.sender === "user" ? colors.background : colors.text,
                fontFamily: Fonts.regular,
              }}
            >
              {chat.text}
            </Text>
          </Animated.View>
        ))}
        {isTyping && (
          <Animated.View
            entering={FadeIn}
            style={[styles.chatBubble, styles.botBubble, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: colors.text, fontFamily: Fonts.regular }}>Typing...</Text>
          </Animated.View>
        )}
      </KeyboardAwareScrollView>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask a question..."
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Send size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  spaceBadge: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    paddingHorizontal: 14,
    flexDirection: "row",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
})
