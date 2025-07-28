import React from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native"
import { CircleDot, FileCheck2, Send } from "lucide-react-native"
import { SpaceIndicator } from "./spaceindicator/SpaceIndicator"

import { Fonts, FontSizes } from "@/constants/Fonts"
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"
import { isIOS } from "@/utils/helpers/platform"
import useChat, { ChatContextSources } from "@/hooks/chat/useChat"

import type { ColorsType } from "@/hooks/useTheme"

export function ChatView() {
  const {
    colors,
    message,
    setMessage,
    isTyping,
    chatHistory,
    isKeyboardVisible,
    handleSend,
    cancelResponse,
  } = useChat()

  const handleInputSideButtonPress = () => {
    if (isTyping) {
      cancelResponse()
    } else {
      handleSend()
    }
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={isIOS() ? "padding" : "height"}
          keyboardVerticalOffset={isKeyboardVisible ? 0 : 90}
        >
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <View style={styles.headerContent}>
              <SpaceIndicator />
            </View>
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
          >
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
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 16,
                          }}
                        >
                          <Text style={{ fontSize: 12, color: colors.text }}>
                            <FileCheck2 size={16} color={colors.card} />
                            {doc.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )
            })}
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
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
              },
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
              onPress={handleInputSideButtonPress}
              disabled={!message.trim()}
            >
              {isTyping ? (
                <CircleDot size={24} color={colors.background} />
              ) : (
                <Send size={24} color={colors.background} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  )
}

function ChatBubble({
  chat,
  index,
  colors,
}: {
  chat: {
    text: string
    sender: "user" | "bot"
    sources?: ChatContextSources[]
  }
  index: number
  colors: ColorsType
}) {
  return (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 14,
    paddingTop: 20,
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
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
})
