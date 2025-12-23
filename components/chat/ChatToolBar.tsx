import { Pressable, View, StyleSheet, TextInput } from "react-native"
import { CircleDot, Send } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { PromptSuggestionBar } from "./promptChips/PromptSuggestionBar"

export function ChatToolBar({
   message,
   setMessage,
   isTyping,
   isChatEmpty,
   handleInputSideButtonPress,
   handlePromptSeggestionPress,
}: {
   message: string
   setMessage: (text: string) => void
   isTyping: boolean
   isChatEmpty: () => boolean
   handleInputSideButtonPress: () => void
   handlePromptSeggestionPress: (text: string) => void
}) {
   const { colors } = useTheme()

   return (
      <View
         style={[
            styles.inputContainer,
            {
               backgroundColor: colors.background,
            },
         ]}
      >
         <View style={styles.promptSuggestionBarContainer}>
            {isChatEmpty() && <PromptSuggestionBar onPromptSelect={handlePromptSeggestionPress} />}
         </View>

         <View style={styles.bottomBarWrapper}>
            <TextInput
               style={[
                  styles.input,
                  {
                     color: colors.text,
                     borderColor: colors.border,
                     backgroundColor: colors.surface,
                  },
               ]}
               value={message}
               onChangeText={setMessage}
               placeholder="Ask a question..."
               placeholderTextColor={colors.textMuted}
            />
            <Pressable
               style={[styles.sendButton, { backgroundColor: colors.text }]}
               onPress={handleInputSideButtonPress}
               disabled={!message.trim()}
            >
               {isTyping ? (
                  <CircleDot size={24} color={colors.background} />
               ) : (
                  <Send size={24} color={colors.background} />
               )}
            </Pressable>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   inputContainer: {
      flexDirection: "column",
      justifyContent: "space-around",
      gap: 8,
      padding: 13,
      paddingBottom: 35,
   },
   bottomBarWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
   },
   promptSuggestionBarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 10,
   },
   input: {
      flex: 1,
      borderRadius: 15,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 12,
      minHeight: 50,
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
   },
   sendButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
   },
})
