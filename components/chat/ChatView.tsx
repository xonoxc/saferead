import React from "react"
import { View, StyleSheet, KeyboardAvoidingView } from "react-native"
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
                  ref={scrollViewRef}
                  contentContainerStyle={{
                     paddingHorizontal: 12,
                     paddingTop: 6,
                     paddingBottom: 100,
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  keyboardDismissMode="interactive"
                  onScrollBeginDrag={onScrollBeginDrag}
                  onScrollEndDrag={onScrollEndDrag}
                  scrollEventThrottle={16}
                  onScroll={handleScroll}
               >
                  <View style={[styles.header, { backgroundColor: colors.background }]}>
                     <View style={styles.headerContent}>
                        <SpaceIndicator />
                     </View>
                  </View>
                  {isChatEmpty() ? <ChatGreeting /> : <ChatHistory chatHistory={chatHistory} />}
                  {isTyping && <TypingBubble />}
               </KeyboardAwareScrollView>

               <ScrollToBottomButton onPress={scrollToBottom} visible={showScrollToBottom} />

               <ChatToolBar
                  message={message}
                  setMessage={setMessage}
                  isTyping={isTyping}
                  isChatEmpty={isChatEmpty}
                  handleInputSideButtonPress={handleInputSideButtonPress}
                  handlePromptSeggestionPress={text => handlePromptSeggestionPress(text)}
               />
            </KeyboardAvoidingView>
         </SafeAreaView>
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
})
