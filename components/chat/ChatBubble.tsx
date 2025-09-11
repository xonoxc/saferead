import { Chats } from "@/hooks/chat/useChat"
import Animated, { FadeInDown } from "react-native-reanimated"
import { StyleSheet } from "react-native"
import { Fonts, FontSizes } from "@/constants"

import type { ColorsType } from "@/hooks/useTheme"

import Markdown from "react-native-markdown-display"

export function ChatBubble({
  chat,
  index,
  colors,
}: {
  chat: Chats[number]
  index: number
  colors: ColorsType
}) {
  const markdownStyles = getMarkdownStyles(colors, chat)

  return (
    <Animated.View
      key={index}
      entering={FadeInDown.delay(100 * index).springify()}
      style={[
        styles.chatBubble,
        {
          maxWidth: chat.sender === "user" ? "80%" : "100%",
          paddingHorizontal: chat.sender === "user" ? 16 : 0,
        },
        chat.sender === "user" ? styles.userBubble : styles.botBubble,
        {
          backgroundColor: chat.sender === "user" ? colors.primary : colors.background,
        },
      ]}
    >
      <Markdown style={markdownStyles} mergeStyle={true}>
        {chat.text}
      </Markdown>
    </Animated.View>
  )
}

function getMarkdownStyles(colors: ColorsType, chat: Chats[number]) {
  return {
    body: {
      color: chat.sender === "user" ? colors.background : colors.text,
      fontSize: FontSizes.xxs,
      fontFamily: chat.sender === "bot" ? Fonts.medium : Fonts.semiBold,
      lineHeight: 18,
    },
    bullet_list: {
      marginVertical: 6,
      paddingLeft: 2,
    },
    blockquote: {
      borderLeftWidth: 2,
      borderLeftColor: colors.textMuted,
      paddingLeft: 8,
      marginVertical: 6,
      color: colors.textMuted,
      fontFamily: Fonts.medium,
    },
    ordered_list: {
      marginVertical: 6,
      paddingLeft: 4,
    },
    bullet_list_icon: {
      color: colors.textMuted,
    },
    strong: {
      fontFamily: Fonts.semiBold,
      color: colors.text,
    },
    paragraph: {
      marginBottom: 8,
    },
    code_inline: {
      backgroundColor: colors.surface,
      color: colors.text,
      fontFamily: Fonts.medium,
      fontSize: FontSizes.xxs,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    list_item: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
  } as any
}

const styles = StyleSheet.create({
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
})
