import Animated, { FadeInDown } from "react-native-reanimated"
import { StyleSheet, View } from "react-native"
import { Fonts, FontSizes } from "@/constants"
import { Spacing, Radii, Motion } from "@/constants/Design"

import type { ColorsType } from "@/hooks/useTheme"
import type { Chats } from "@/hooks/chat/useChat"

import Markdown from "react-native-markdown-display"

/*
 * Only the newest few bubbles stagger. Scaling the delay by raw index meant a
 * restored transcript of thirty messages made the last one wait three seconds
 * before appearing.
 * **/
const MAX_STAGGERED_BUBBLES = 4

export function ChatBubble({
   chat,
   index,
   colors,
   totalCount = 0,
}: {
   chat: Chats[number]
   index: number
   colors: ColorsType
   totalCount?: number
}) {
   const markdownStyles = getMarkdownStyles(colors, chat)
   const isUser = chat.sender === "user"

   const positionFromEnd = Math.max(0, totalCount - 1 - index)
   const delay =
      positionFromEnd < MAX_STAGGERED_BUBBLES
         ? (MAX_STAGGERED_BUBBLES - positionFromEnd) * Motion.stagger
         : 0

   return (
      <Animated.View
         entering={FadeInDown.duration(Motion.base).delay(delay).springify().damping(20)}
         style={[
            styles.chatBubble,
            isUser ? styles.userBubble : styles.botBubble,
            {
               maxWidth: isUser ? "84%" : "100%",
               backgroundColor: isUser ? colors.primary : "transparent",
               paddingHorizontal: isUser ? Spacing.sm : 0,
               paddingVertical: isUser ? Spacing.xs + 2 : 0,
            },
         ]}
      >
         <Markdown style={markdownStyles} mergeStyle={true}>
            {chat.text}
         </Markdown>

         {/* Assistant answers get a subtle rule so consecutive replies stay separable */}
         {!isUser && <View style={[styles.botDivider, { backgroundColor: colors.borderLight }]} />}
      </Animated.View>
   )
}

function getMarkdownStyles(colors: ColorsType, chat: Chats[number]) {
   const isUser = chat.sender === "user"
   // Filled user bubbles need a colour guaranteed to contrast with the fill,
   // which colors.background is not once primary stops being pure black/white.
   const bodyColor = isUser ? colors.onPrimary : colors.text

   return {
      body: {
         color: bodyColor,
         fontSize: FontSizes.sm,
         fontFamily: isUser ? Fonts.medium : Fonts.regular,
         lineHeight: 21,
      },
      bullet_list: {
         marginVertical: 6,
         paddingLeft: 2,
      },
      blockquote: {
         borderLeftWidth: 2,
         borderLeftColor: colors.primary,
         backgroundColor: colors.surface,
         paddingLeft: Spacing.xs,
         paddingVertical: Spacing.xxs,
         marginVertical: 6,
         color: colors.textSecondary,
         fontFamily: Fonts.regular,
      },
      ordered_list: {
         marginVertical: 6,
         paddingLeft: 4,
      },
      bullet_list_icon: {
         color: isUser ? colors.onPrimary : colors.primary,
      },
      strong: {
         fontFamily: Fonts.semiBold,
         color: bodyColor,
      },
      heading1: { fontFamily: Fonts.bold, fontSize: FontSizes.lg, color: bodyColor, marginTop: 8 },
      heading2: { fontFamily: Fonts.bold, fontSize: FontSizes.md, color: bodyColor, marginTop: 8 },
      heading3: {
         fontFamily: Fonts.semiBold,
         fontSize: FontSizes.sm,
         color: bodyColor,
         marginTop: 6,
      },
      paragraph: {
         marginTop: 0,
         marginBottom: 8,
      },
      code_inline: {
         backgroundColor: isUser ? "rgba(255,255,255,0.18)" : colors.surface,
         color: bodyColor,
         fontFamily: Fonts.mono,
         fontSize: FontSizes.xs,
         paddingHorizontal: 5,
         paddingVertical: 2,
         borderRadius: Radii.xs / 2,
      },
      fence: {
         backgroundColor: colors.surface,
         borderColor: colors.border,
         borderWidth: 1,
         borderRadius: Radii.xs,
         padding: Spacing.xs,
         color: colors.text,
         fontFamily: Fonts.mono,
         fontSize: FontSizes.xs,
      },
      code_block: {
         backgroundColor: colors.surface,
         borderRadius: Radii.xs,
         padding: Spacing.xs,
         color: colors.text,
         fontFamily: Fonts.mono,
         fontSize: FontSizes.xs,
      },
      list_item: {
         flexDirection: "row",
         alignItems: "flex-start",
      },
      hr: {
         backgroundColor: colors.border,
         height: StyleSheet.hairlineWidth,
      },
   } as any
}

const styles = StyleSheet.create({
   chatBubble: {
      borderRadius: Radii.md,
      marginBottom: Spacing.sm,
   },
   userBubble: {
      alignSelf: "flex-end",
      borderBottomRightRadius: Radii.xs / 2,
   },
   botBubble: {
      alignSelf: "flex-start",
      borderBottomLeftRadius: Radii.xs / 2,
   },
   botDivider: {
      height: StyleSheet.hairlineWidth,
      marginTop: Spacing.xs,
      opacity: 0.7,
   },
})
