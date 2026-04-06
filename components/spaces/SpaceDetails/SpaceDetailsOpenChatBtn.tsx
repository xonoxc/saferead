import React from "react"
import { StyleSheet, Pressable, Text } from "react-native"
import { MessageSquare } from "lucide-react-native"
import Animated from "react-native-reanimated"
import { Fonts, FontSizes } from "@/constants"

import type { SharedValue } from "react-native-reanimated"
import type { OpenInChatBtnAnimatedStyleProps } from "@/components/spaces/SpaceDetails/OpenInChatBtn"

interface SpaceDetailsOpenChatBtnProps {
   onPress?: () => void
   color: string
   visibility: SharedValue<number>
   animatedStyle: OpenInChatBtnAnimatedStyleProps
}

export default function SpaceDetailsOpenChatBtn({
   onPress,
   color,
   animatedStyle,
}: SpaceDetailsOpenChatBtnProps) {
   return (
      <Animated.View style={[styles.chatButtonContainer, animatedStyle]}>
         <Pressable onPress={onPress} style={[styles.chatButton, { backgroundColor: color }]}>
            <MessageSquare size={28} color={"white"} />
            <Text style={[styles.chatButtonText, { color: "white" }]}>Open in chat</Text>
         </Pressable>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   chatButtonContainer: {
      position: "absolute",
      bottom: 30,
      right: 18,
      zIndex: 10,
      alignItems: "flex-end",
   },
   chatButton: {
      width: "70%",
      height: 60,
      borderRadius: 20,
      gap: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      paddingHorizontal: 16,
      shadowRadius: 4,
   },
   chatButtonText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.semiBold,
      color: "white",
   },
})
