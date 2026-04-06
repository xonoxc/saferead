import SpaceDetailsOpenChatBtn from "@/components/spaces/SpaceDetails/SpaceDetailsOpenChatBtn"
import type { Space } from "@/types"
import type { SharedValue } from "react-native-reanimated"

export type OpenInChatBtnAnimatedStyleProps = {
   opacity: number
   transform: {
      translateY: number
   }[]
}

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
