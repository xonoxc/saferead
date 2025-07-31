import { useSpaceStore } from "@/store/useSpaceStore"
import { useTheme } from "../useTheme"
import { useRef, useState } from "react"
import { KeyboardAwareScrollViewProps, KeyboardController } from "react-native-keyboard-controller"
import { useInstantJSONResponse } from "../queries/converstations"
import { useDrawerAlert } from "../alerts/useAlert"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { useKeyBoardVisiblity } from "../kayboard/useKeyboardVisiblity"
import { usePreventTabSwitch } from "../blocking/usePreventTabSwitch"

export type ChatContextSources = {
  id: string
  name: string
  type: string
}

export type Chats = { text: string; sender: "user" | "bot"; sources?: ChatContextSources[] }[]

export default function useChat() {
  const { colors } = useTheme()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState<Chats>([])
  const [aboortController, setAbortController] = useState<AbortController>(new AbortController())
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  const scrollViewRef = useRef<KeyboardAwareScrollViewProps>(null)

  const selectedSpace = useSpaceStore(s => s.selectedSpace)
  const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)
  const activeConversationId = useSpaceStore(s => s.activeConverstationId)

  const showBottomMessage = useDrawerAlert()
  const getStreamingResponse = useInstantJSONResponse()

  const [isKeyboardVisible, setKeyboardVisible] = useState(KeyboardController.isVisible())
  useKeyBoardVisiblity(setKeyboardVisible)

  /*
   * this is to prevent the users from leaving the screen when in chat mode
   * **/
  usePreventTabSwitch(
    !!selectedSpace?.id,
    () => setSelectedSpace(null),
    "You are in a space chat. Are you sure you want to leave?"
  )

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
    const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 100
    setShowScrollToBottom(!isNearBottom)
  }

  const scrollToBottom = () => {
    scrollViewRef.current?.scrolltoEnd({ animated: true })
  }

  const handleSend = async (overrideMessage?: string) => {
    KeyboardController.dismiss()
    setKeyboardVisible(false)

    const content = (overrideMessage ?? message).trim()
    if (!content) return

    const userMessage = { text: content, sender: "user" as const }
    setChatHistory(prev => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    setIsTyping(true)
    const resp = await attempt(
      getStreamingResponse({ message: content, conversation_id: activeConversationId! })
    )
    if (!resp?.ok) {
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

  /*const handleSend = async () => {
    KeyboardController.dismiss()

    if (!message.trim()) return

    const userMessage = { text: message, sender: "user" as const }
    setChatHistory(prev => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    setChatHistory(prev => {
      const index = prev.length
      botIndexRef.current = index
      return [...prev, { text: "", sender: "bot" }]
    })

    console.log("Sending message to bot:", {
      message,
      conversation_id: activeConversationId,
    })

    const resp = await getStreamingResponse(
      { message, conversation_id: activeConversationId! },
      chunk => {
        const cleanChunk = chunk?.trim()
        if (!cleanChunk) return

        setChatHistory(prev => {
          const updated = [...prev]
          const botIndex = botIndexRef.current
          if (botIndex !== null && updated[botIndex]) {
            updated[botIndex].text += cleanChunk
          }
          return updated
        })
      },
      aboortController.signal
    )

    if (!resp?.ok) {
      const errorMessage = getErrorMessage(resp?.error)
      showBottomMessage({
        type: "error",
        title: "Error",
        message: errorMessage || "Failed to get response from bot",
        actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
    }

    setIsTyping(false)
  } */

  const isChatEmpty = () => chatHistory.length === 0

  const cancelResponse = () => {
    if (aboortController) {
      aboortController.abort("User cancelled the request")
      setAbortController(new AbortController())
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

  const handlePromptSeggestionPress = (text: string) => {
    handleSend(text)
  }

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
  }
}
