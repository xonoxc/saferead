import React, { useState } from "react"
import { View } from "react-native"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"
import useChat from "@/hooks/chat/useChat"
import ChatGreeting from "./ChatGreeting"

import { TypingBubble } from "./TypingBubble"
import { ChatToolBar } from "./ChatToolBar"
import { ChatHistory } from "./ChatHistory"
import { ScrollToBottomButton } from "./ScrollToBottomButton"
import { UploadDocumentForm } from "@/components/spaces/UploadDocumentForm"
import { Spacing } from "@/constants/Design"

/*
 * Space chat UI.
 *
 * Chrome lives entirely in the Chat tab's header above this - the space pill -
 * so everything here is the conversation itself: history, then the composer.
 * **/
export function ChatView() {
   const {
      colors,
      selectedSpace,
      message,
      setMessage,
      isTyping,
      isChatEmpty,
      chatHistory,
      handleInputSideButtonPress,
      handlePromptSeggestionPress,
      scrollViewRef,
      scrollToBottom,
      handleScroll,
      showScrollToBottom,
      onScrollBeginDrag,
      onScrollEndDrag,
   } = useChat()

   const [isUploadVisible, setUploadVisible] = useState(false)

   return (
      <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
         <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
            <View style={{ flex: 1 }}>
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
                  onAttachPress={selectedSpace ? () => setUploadVisible(true) : undefined}
               />
            </View>

            {/*
             * Uploading here adds the document to the space, which is what the
             * assistant retrieves from - so the file becomes context for the
             * conversation rather than an attachment on a single message. It
             * still has to be indexed before it can be answered from, which the
             * form's own success message says.
             * **/}
            {isUploadVisible && selectedSpace && (
               <UploadDocumentForm
                  spaceId={selectedSpace.id}
                  onUploadSuccess={() => setUploadVisible(false)}
                  onCancel={() => setUploadVisible(false)}
               />
            )}
         </SafeAreaView>
      </Animated.View>
   )
}
