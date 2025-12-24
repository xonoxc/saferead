import { useSpaceStore } from "@/store/useSpaceStore"
import { useTheme } from "../useTheme"
import { useEffect, useRef, useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"
import { useInstantJSONResponse } from "../queries/converstations"
import { useDrawerAlert } from "../alerts/useAlert"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { useKeyBoardVisibility } from "../kayboard/useKeyboardVisiblity"
import { usePreventTabSwitch } from "../blocking/usePreventTabSwitch"
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated"
import { isAbortError } from "@/utils/errors"

export type ChatContextSources = {
   id: string
   name: string
   type: string
}

export type Chats = {
   text: string
   sender: "user" | "bot"
   sources?: ChatContextSources[]
}[]

export default function useChat() {
   const { colors } = useTheme()
   const [message, setMessage] = useState("")
   const [isTyping, setIsTyping] = useState(false)
   const [chatHistory, setChatHistory] = useState<Chats>([])
   const [_, setShowScrollToBottom] = useState<boolean>(false)

   const scrollViewRef = useRef<ScrollView | null>(null)
   const abortControllerRef = useRef<AbortController | null>(null)

   const selectedSpace = useSpaceStore(s => s.selectedSpace)
   const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)
   const activeConversationId = useSpaceStore(s => s.activeConverstationId)

   const showBottomMessage = useDrawerAlert()
   const getStreamingResponse = useInstantJSONResponse()

   const [isKeyboardVisible, setKeyboardVisible] = useState(KeyboardController.isVisible())
   useKeyBoardVisibility(setKeyboardVisible)

   /*
    * this is to prevent the users from leaving the screen when in chat mode
    * **/
   usePreventTabSwitch(
      !!selectedSpace?.id,
      () => setSelectedSpace(null),
      "You are in a space chat. Are you sure you want to leave?"
   )

   /*
    * this is to handle the cleanup of the abort controller
    * **/
   useEffect(() => {
      return () => {
         const activeAbortController = abortControllerRef.current
         if (activeAbortController) {
            activeAbortController.abort()
         }
      }
   }, [])

   const handleScroll = (event: any) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
      const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 100
      setShowScrollToBottom(!isNearBottom)
   }

   const scrollToBottom = () => {
      if (scrollViewRef.current) {
         scrollViewRef.current.scrollToEnd({ animated: true })
      }
   }

   const handleSend = async (overrideMessage?: string) => {
      scrollToBottom()

      KeyboardController.dismiss()
      setKeyboardVisible(false)

      const content = (overrideMessage ?? message).trim()
      if (!content) return

      const userMessage = { text: content, sender: "user" as const }
      setChatHistory(prev => [...prev, userMessage])
      setMessage("")
      setIsTyping(true)

      setIsTyping(true)

      if (abortControllerRef.current) abortControllerRef.current.abort()

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const resp = await attempt(() =>
         getStreamingResponse(
            { message: content, conversation_id: activeConversationId! },
            abortController.signal
         )
      )
      if (!resp.ok) {
         if (isAbortError(resp.error)) {
            return
         }

         const errorMessage = getErrorMessage(resp?.error)
         showBottomMessage({
            type: "error",
            title: "Error",
            message: errorMessage || "Failed to get response from bot",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })

         setIsTyping(false)
         return
      }

      setChatHistory(prev => [
         ...prev,
         {
            text: resp.data.response,
            sender: "bot",
            sources: resp.data.referenced_documents || [],
         },
      ])

      setIsTyping(false)
   }

   const isChatEmpty = () => chatHistory.length === 0

   const cancelResponse = () => {
      if (abortControllerRef.current) {
         abortControllerRef.current.abort("User cancelled the response")
         abortControllerRef.current = null
         setIsTyping(false)
      }
   }

   const handleInputSideButtonPress = () => {
      if (isTyping) {
         cancelResponse()
      } else {
         handleSend()
      }
   }

   const handlePromptSeggestionPress = (text: string) => handleSend(text)

   return {
      colors,
      message,
      setMessage,
      isChatEmpty,
      isTyping,
      chatHistory,
      setChatHistory,
      handleInputSideButtonPress,
      handlePromptSeggestionPress,
      isKeyboardVisible,
      handleSend,
      scrollViewRef,
      scrollToBottom,
      handleScroll,
   }
}
