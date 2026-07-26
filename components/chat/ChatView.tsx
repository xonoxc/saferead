import React from "react"
import { View, StyleSheet } from "react-native"
import { SpaceIndicator } from "./spaceindicator/SpaceIndicator"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"
import { isIOS } from "@/utils/helpers/platform"
import useChat from "@/hooks/chat/useChat"
import ChatGreeting from "./ChatGreeting"

import { TypingBubble } from "./TypingBubble"
import { ChatToolBar } from "./ChatToolBar"
import { ChatHistory } from "./ChatHistory"
import { ScrollToBottomButton } from "./ScrollToBottomButton"
import { Spacing } from "@/constants/Design"

/*
 * Space chat UI.
 *
 * The header moved to the analyze tab (removed upgrade button).
 * Focus is on the message area: space selector at the top, history in the middle,
 * smooth composer at the bottom with multiline grow + focus state.
 * **/
export function ChatView() {
   const {
      colors,
      message,
      setMessage,
      isTyping,
      isChatEmpty,
      chatHistory,
      isKeyboardVisible,
      handleInputSideButtonPress,
      handlePromptSeggestionPress,
      scrollViewRef,
      scrollToBottom,
      handleScroll,
      showScrollToBottom,
      onScrollBeginDrag,
      onScrollEndDrag,
   } = useChat()

   return (
      <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
         <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
            <View style={{ flex: 1 }}>
               {/* Space selector inline with the chat area */}
               <View style={[styles.selector, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                  <SpaceIndicator />
               </View>

               {/* Message history with smart scrolling */}
               <KeyboardAwareScrollView
                  ref={scrollViewRef}
                  contentContainerStyle={{
                     paddingHorizontal: Spacing.sm,
                     paddingTop: Spacing.xs,
                     paddingBottom: 16,
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  keyboardDismissMode="interactive"
                  onScrollBeginDrag={onScrollBeginDrag}
                  onScrollEndDrag={onScrollEndDrag}
                  scrollEventThrottle={16}
                  onScroll={handleScroll}
               >
                  {isChatEmpty() ? <ChatGreeting /> : <ChatHistory chatHistory={chatHistory} />}
                  {isTyping && <TypingBubble />}
               </KeyboardAwareScrollView>

               {/* Scroll-to-bottom when history is long */}
               <ScrollToBottomButton onPress={scrollToBottom} visible={showScrollToBottom} />

               {/* Composer: always visible, grows with text */}
               <ChatToolBar
                  message={message}
                  setMessage={setMessage}
                  isTyping={isTyping}
                  isChatEmpty={isChatEmpty}
                  handleInputSideButtonPress={handleInputSideButtonPress}
                  handlePromptSeggestionPress={handlePromptSeggestionPress}
               />
            </View>
         </SafeAreaView>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   selector: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
   },
})
