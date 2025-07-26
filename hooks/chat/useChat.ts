import { useSpaceStore } from "@/store/useSpaceStore"
import { useTheme } from "../useTheme"
import { useEffect, useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"

export default function useChat() {
  const { colors } = useTheme()
  const { selectedSpace } = useSpaceStore()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ text: string; sender: "user" | "bot" }[]>([])

  const isKeyboardVisible = KeyboardController.isVisible()

  useEffect(() => {
    if (selectedSpace) {
      setChatHistory([
        { text: `Welcome to ${selectedSpace.title}! How can I help you?`, sender: "bot" },
      ])
    }
  }, [selectedSpace])

  const handleSend = () => {
    KeyboardController.dismiss()

    if (message.trim()) {
      const newMessage = { text: message, sender: "user" as const }
      setChatHistory(prev => [...prev, newMessage])
      setMessage("")
      setIsTyping(true)

      setTimeout(() => {
        const botResponse = {
          text: "This is a simulated response.",
          sender: "bot" as const,
        }
        setChatHistory(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1500)
    }
  }

  return {
    colors,
    message,
    setMessage,
    isTyping,
    chatHistory,
    setChatHistory,
    isKeyboardVisible,
    handleSend,
  }
}
