import SpaceDetailsOpenChatBtn from "@/components/spaces/SpaceDetails/SpaceDetailsOpenChatBtn"
import type { Space } from "@/types"
import type { ViewStyle } from "react-native"
import type { AnimatedStyle, SharedValue } from "react-native-reanimated"

/*
 * Reanimated hands back an opaque style handle rather than a plain object, so
 * the prop is typed by what the library produces instead of by the shape the
 * worklet happens to return today.
 * **/
export type OpenInChatBtnAnimatedStyleProps = AnimatedStyle<ViewStyle>

export interface OpenInChatButtonProps {
   handleOpenChat: () => void
   space: Space
   isSubjectVisible: SharedValue<number>
   animatedStyle: OpenInChatBtnAnimatedStyleProps
}

export function OpenInChatButton({
   handleOpenChat,
   space,
   isSubjectVisible,
   animatedStyle,
}: OpenInChatButtonProps) {
   if (!isSubjectVisible) return null

   return (
      <SpaceDetailsOpenChatBtn
         onPress={handleOpenChat}
         color={space.color}
         visibility={isSubjectVisible}
         animatedStyle={animatedStyle}
      />
   )
}
