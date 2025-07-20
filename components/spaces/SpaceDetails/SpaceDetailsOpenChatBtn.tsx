import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { MessageSquare } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

export default function SpaceDetailsOpenChatBtn({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.chatButtonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.chatButton}>
        <MessageSquare size={20} color={"white"} />
        <Text style={styles.chatButtonText}>Open Chat</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  chatButtonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  chatButtonText: {
    color: "white",
    fontSize: FontSizes.md,
    fontFamily: Fonts.bold,
  },
})
