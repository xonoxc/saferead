import { Chats } from "@/hooks/chat/useChat"
import Animated, { FadeInDown } from "react-native-reanimated"
import { Text, StyleSheet } from "react-native"
import { Fonts, FontSizes } from "@/constants"

import type { ColorsType } from "@/hooks/useTheme"

export function ChatBubble({
  chat,
  index,
  colors,
}: {
  chat: Chats[number]
  index: number
  colors: ColorsType
}) {
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
      <Text
        style={{
          color: chat.sender === "user" ? colors.background : colors.text,
          fontSize: FontSizes.xxs,
          fontFamily: chat.sender === "bot" ? Fonts.medium : Fonts.semiBold,
        }}
      >
        {chat.text}
      </Text>
    </Animated.View>
  )
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
