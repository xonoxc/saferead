import { useSpaceStore } from "@/store/useSpaceStore"
import { useTheme } from "../useTheme"
import { useEffect, useRef, useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"
import { useInstantJSONResponse, useConversationMessages } from "../queries/converstations"
import { useSpaceConversation } from "../queries/spaces"
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
   const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false)
   const [isAtBottom, setIsAtBottom] = useState<boolean>(true)
   const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)

   const scrollViewRef = useRef<ScrollView | null>(null)
   const abortControllerRef = useRef<AbortController | null>(null)
   const hideScrollButtonRef = useRef<number | null>(null)
   const isUserScrollingRef = useRef<boolean>(false)

   const selectedSpace = useSpaceStore(s => s.selectedSpace)
   const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)
   const activeConversationId = useSpaceStore(s => s.activeConverstationId)
   const setActiveConversationId = useSpaceStore(s => s.setActiveConverstationId)

   const showBottomMessage = useDrawerAlert()

   const getStreamingResponse = useInstantJSONResponse()
   const { resolveConversation } = useSpaceConversation()

   /*
    * Make sure the conversation we send messages to actually belongs to the
    * space that is currently selected. Picking a space from the chat dropdown
    * only changed selectedSpace, so messages kept going to whichever
    * conversation was resolved first - or to none at all.
    * **/
   useEffect(() => {
      if (!selectedSpace?.id) return

      let cancelled = false

      const syncConversation = async () => {
         setIsLoadingHistory(true)

         const resp = await attempt(() => resolveConversation(selectedSpace.id))

         if (cancelled) return

         if (!resp.ok) {
            setIsLoadingHistory(false)
            showBottomMessage({
               type: "error",
               title: "Error",
               message: getErrorMessage(resp.error) || "Could not open chat for this space",
               actions: [{ text: "OK", style: "primary", onPress: () => {} }],
            })
            return
         }

         setActiveConversationId(resp.data.id)
      }

      syncConversation()

      return () => {
         cancelled = true
      }
      // Deliberately keyed on the space alone. The alert and mutation helpers are
      // recreated on render, so depending on them would re-resolve the
      // conversation on every render rather than only when the space changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedSpace?.id])

   /*
    * Restore the transcript for whichever conversation is active.
    * **/
   const { data: history, isFetching: isFetchingHistory } =
      useConversationMessages(activeConversationId)

   useEffect(() => {
      if (!activeConversationId) {
         setChatHistory([])
         return
      }

      if (isFetchingHistory || !history) return

      setChatHistory(
         history.results.map(message => ({
            text: message.content,
            sender: message.message_type === "user" ? ("user" as const) : ("bot" as const),
         }))
      )
      setIsLoadingHistory(false)
   }, [activeConversationId, history, isFetchingHistory])

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
    * auto scroll to bottom when new message is added
    * **/
   useEffect(() => {
      if (isAtBottom) {
         scrollToBottom()
      }
   }, [chatHistory.length])

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

   const showScrollToBottomBtnTemporarily = () => {
      if (isAtBottom) return

      setShowScrollToBottom(true)

      if (hideScrollButtonRef.current) {
         clearTimeout(hideScrollButtonRef.current)
         hideScrollButtonRef.current = null
      }

      hideScrollButtonRef.current = setTimeout(() => {
         setShowScrollToBottom(false)
      }, 3000)
   }

   const onScrollBeginDrag = () => {
      isUserScrollingRef.current = true
      showScrollToBottomBtnTemporarily()
   }

   const onScrollEndDrag = () => (isUserScrollingRef.current = false)

   const handleScroll = (event: any) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
      const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 100
      setIsAtBottom(isNearBottom)

      /*
       * Hide the scroll to bottom button if we are at the bottom
       * **/
      if (isAtBottom) {
         setShowScrollToBottom(false)
         return
      }

      /*
       *IGNORE non-user initiated scroll events
       * **/
      if (!isUserScrollingRef.current) return

      showScrollToBottomBtnTemporarily()
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

      /*
       * Without a resolved conversation the request would be sent with an
       * undefined id and rejected by the server, so surface it here instead.
       * **/
      if (!activeConversationId) {
         showBottomMessage({
            type: "error",
            title: "No space selected",
            message: "Pick a space before asking a question.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

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
            { message: content, conversation_id: activeConversationId },
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
      isLoadingHistory: isLoadingHistory || isFetchingHistory,
      chatHistory,
      setChatHistory,
      handleInputSideButtonPress,
      handlePromptSeggestionPress,
      isKeyboardVisible,
      handleSend,
      scrollViewRef,
      scrollToBottom,
      handleScroll,
      showScrollToBottom,
      showScrollToBottomBtnTemporarily,
      onScrollBeginDrag,
      onScrollEndDrag,
   }
}
