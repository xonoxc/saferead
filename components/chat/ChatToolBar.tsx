import React, { useState } from "react"
import { Pressable, View, StyleSheet, TextInput } from "react-native"
import { CircleDot, Paperclip, Send } from "lucide-react-native"
import Animated, { FadeIn } from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { Spacing, Radii, TAB_BAR_CLEARANCE, withAlpha } from "@/constants/Design"
import { PromptSuggestionBar } from "./promptChips/PromptSuggestionBar"

export function ChatToolBar({
   message,
   setMessage,
   isTyping,
   isChatEmpty,
   handleInputSideButtonPress,
   handlePromptSeggestionPress,
   onAttachPress,
}: {
   message: string
   setMessage: (text: string) => void
   isTyping: boolean
   isChatEmpty: () => boolean
   handleInputSideButtonPress: () => void
   handlePromptSeggestionPress: (text: string) => void
   /* Absent when there is no space to attach *to*. */
   onAttachPress?: () => void
}) {
   const { colors } = useTheme()
   const [isFocused, setIsFocused] = useState(false)

   const hasText = message.trim().length > 0
   const canSend = hasText && !isTyping

   return (
      <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
         {isChatEmpty() && (
            <Animated.View entering={FadeIn} style={styles.promptSuggestionBarContainer}>
               <PromptSuggestionBar onPromptSelect={handlePromptSeggestionPress} />
            </Animated.View>
         )}

         <View
            style={[
               styles.composerWrapper,
               {
                  borderColor: isFocused ? colors.primary : colors.border,
                  backgroundColor: colors.card,
               },
            ]}
         >
            {/*
             * Adds a document to the space being chatted with, so the next
             * question can be answered from it. It sits in the composer rather
             * than only on the space screen because the moment you discover a
             * document is missing is the moment you ask about it.
             * **/}
            {onAttachPress && (
               <Pressable
                  onPress={onAttachPress}
                  style={styles.attachButton}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Add a document to this space"
                  accessibilityHint="Uploads a file the assistant can answer from"
               >
                  <Paperclip size={20} color={colors.textMuted} strokeWidth={2.2} />
               </Pressable>
            )}

            <TextInput
               style={[
                  styles.input,
                  {
                     color: colors.text,
                  },
               ]}
               value={message}
               onChangeText={setMessage}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               placeholder="Ask a question..."
               placeholderTextColor={colors.textMuted}
               multiline
               maxLength={5000}
               editable={!isTyping}
            />

            <Pressable
               style={[
                  styles.sendButton,
                  {
                     backgroundColor: canSend ? colors.primary : withAlpha(colors.primary, 0.4),
                  },
               ]}
               onPress={handleInputSideButtonPress}
               disabled={!canSend}
               accessibilityRole="button"
               accessibilityLabel={isTyping ? "Cancel message" : "Send message"}
               accessibilityHint={isTyping ? "Stop generating response" : "Send your message"}
            >
               {isTyping ? (
                  <CircleDot size={20} color="white" />
               ) : (
                  <Send size={20} color="white" />
               )}
            </Pressable>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   inputContainer: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      /*
       * Chat is a tab now, so the floating tab bar sits over this composer
       * rather than being hidden for the duration of the conversation. Reserve
       * its clearance or the send button ends up underneath it.
       * **/
      paddingBottom: TAB_BAR_CLEARANCE,
      gap: Spacing.md,
   },
   promptSuggestionBarContainer: {
      paddingBottom: Spacing.xs,
   },
   composerWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      borderWidth: 1,
      borderRadius: Radii.lg,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      gap: Spacing.sm,
   },
   input: {
      flex: 1,
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.xs,
      minHeight: 40,
      maxHeight: 100,
   },
   attachButton: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Spacing.xs,
   },
   sendButton: {
      width: 36,
      height: 36,
      borderRadius: Radii.md,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Spacing.xs,
   },
})
