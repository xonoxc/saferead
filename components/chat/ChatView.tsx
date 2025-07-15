import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native"
import { X, Send } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Space } from "@/types"
import { Fonts, FontSizes } from "@/constants/Fonts"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { useHeaderHeight } from "@react-navigation/elements"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { isIOS } from "@/utils/helpers/platform"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

interface ChatViewProps {
  space: Space
  onExit: () => void
}

export function ChatView({ space, onExit }: ChatViewProps) {
  const { colors } = useTheme()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{ text: string; sender: "user" | "bot" }>>(
    []
  )
  const scrollViewRef = useRef<ScrollView>(null)
  const headerHeight = useHeaderHeight()
  const tabBarHeight = useBottomTabBarHeight()

  useEffect(() => {
    setChatHistory([{ text: `Welcome to ${space.name}! How can I help you?`, sender: "bot" }])
  }, [space])

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

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [chatHistory])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={isIOS() ? "padding" : undefined}
        style={[styles.container, { backgroundColor: colors.background }]}
        keyboardVerticalOffset={
          useBottomTabBarHeight() + useHeaderHeight() + useSafeAreaInsets().top
        }
      >
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.spaceBadge, { backgroundColor: space.color }]}>{space.name}</Text>
            <TouchableOpacity onPress={onExit}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
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
        </ScrollView>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spaceBadge: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
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
    borderRadius: 24,
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
