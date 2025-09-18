import { useTheme } from "../useTheme"
import { useConversations } from "../queries/converstations"
import { useSpaceStore } from "@/store/useSpaceStore"

export function useConversationTab() {
   const { colors } = useTheme()
   const activeSpace = useSpaceStore(s => s.selectedSpace)

   const {
      data,
      isLoading: loading,
      error,
   } = useConversations({
      space: activeSpace?.id,
   })
   const conversations = data?.pages.flatMap(page => page.results) ?? []

   return {
      conversations,
      loading,
      error,
      colors,
   }
}
