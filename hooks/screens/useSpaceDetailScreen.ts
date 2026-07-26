import { useState } from "react"
import { FileText, TrendingUp, type LucideIcon } from "lucide-react-native"
import { useSharedValue, useAnimatedStyle, withSequence, withSpring } from "react-native-reanimated"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
   usePinDocumentMutation,
   useSpace,
   useSpaceConversation,
   useSpaceDocuments,
   useToggleFavoriteSpace,
} from "@/hooks/queries/spaces"
import { updateSpace } from "@/services/space.service"
import { useSpaceStore } from "@/store/useSpaceStore"
import { Motion } from "@/constants/Design"

import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { useQueryClient } from "@tanstack/react-query"
import { useDrawerAlert } from "../alerts/useAlert"

import type { ColorsType } from "../useTheme"
import type { UpdateSpaceForm } from "../forms/useSpaceHookForm"
import type { Space } from "@/types"
import type { UserSpaceDocument } from "@/types/api/spaces.documents.types"

export type SpaceDetailsStat = {
   icon: LucideIcon
   label: string
   value: number
   color: string
}

export function useSpaceDetailsScreen({ colors }: { colors: ColorsType }) {
   const { id } = useLocalSearchParams<{ id: string }>()
   const router = useRouter()

   const setSpace = useSpaceStore(s => s.setSelectedSpace)
   const setActiveConverstationId = useSpaceStore(s => s.setActiveConverstationId)

   const showBottomAlert = useDrawerAlert()

   const queryClient = useQueryClient()

   const scale = useSharedValue(1)
   const [isSheetVisible, setSheetVisible] = useState(false)
   const [isUploadDocFormVisible, setIsUploadDocFormVisible] = useState(false)

   /*
    * Fetch the space directly rather than hunting for it in the paginated list,
    * which never resolved for spaces beyond the first page.
    * **/
   const { data: space, isLoading: isLoadingSpace } = useSpace(id)

   const toggleFavouriteSpace = useToggleFavoriteSpace(space?.id as string)
   const pinDocumentToSpace = usePinDocumentMutation()

   const { resolveConversation, isResolvingConversation } = useSpaceConversation()

   /*
    * Read from the documents endpoint instead of the space payload's
    * recent_documents, which is capped at five - so a sixth upload looked like
    * it had silently failed.
    * **/
   const { data: documentPages, isLoading: isLoadingDocuments } = useSpaceDocuments(id)
   const documents = documentPages?.pages.flatMap(page => page.results) ?? []

   const pinnedDocuments = documents.filter(doc => doc.is_pinned)
   const recentDocuments = documents.filter(doc => !doc.is_pinned)

   const headerTransformAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
   }))

   const handleFavoritePress = async () => {
      /*
       * A brief press-in and release, not a bounce.
       *
       * This has to be a sequence, not a spring with a completion callback that
       * assigns back to `scale`. Assigning to a shared value cancels whatever
       * animation is already on it and runs that animation's callback - so a
       * callback which itself assigns to `scale` re-enters the setter and
       * recurses until the stack blows.
       *
       * The callback form survived here for a while only because it was tuned
       * to 0.9 with Reanimated's soft defaults, which take enough frames that
       * the callback lands on a later frame instead of inside the setter. At
       * pressScale (0.98) with a stiff critically-damped spring the travel is
       * small enough to settle within the first frame, which is what turned it
       * into "Maximum call stack size exceeded" on the first tap.
       */
      scale.value = withSequence(
         withSpring(Motion.pressScale, Motion.springQuick),
         withSpring(1, Motion.springQuick)
      )

      if (!space) return

      const resp = await attempt(() => toggleFavouriteSpace.mutateAsync())
      if (!resp.ok) {
         const errorMessage = getErrorMessage(resp.error)

         showBottomAlert({
            type: "error",
            title: "Error",
            message: errorMessage || "Failed to toggle favorite status of space",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })

         return
      }
      showBottomAlert({
         title: "Success",
         message: space.is_favorite ? "Removed from favorites" : "Added to favorites",
         actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
   }

   /*
    * Open the space's existing chat thread, creating one only the first time.
    * This previously created a brand new conversation on every tap, so the
    * transcript appeared to vanish each time chat was reopened.
    * **/
   const handleOpenChat = async () => {
      if (!space) return

      const resp = await attempt(() => resolveConversation(space.id))

      if (!resp.ok) {
         const errorMessage = getErrorMessage(resp.error)
         showBottomAlert({
            type: "error",
            title: "Error",
            message: errorMessage || "Failed to open chat for this space",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      setSpace(space)
      setActiveConverstationId(resp.data.id)

      router.push("/(application)/(tabs)/analyize")
   }

   const handlePinDocumentToSpace = async (documentId: string, document_file: string) => {
      if (!space?.id) return

      const resp = await attempt(() =>
         pinDocumentToSpace.mutateAsync({
            id: documentId,
            space: space.id,
            document_file_url: document_file,
         })
      )
      if (!resp.ok) {
         const errorMessage = getErrorMessage(resp.error)

         showBottomAlert({
            type: "error",
            title: "Error",
            message: errorMessage || "Failed to pin document to space",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      showBottomAlert({
         title: "Success",
         message: "Document pinned to space successfully",
         actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
   }

   const stats = space ? getSpaceStates(space, documents) : []

   /*
    *
    * So that the upload form and the sheet do not overlap,
    * we toggle visibility of one when the other is opened.
    * **/
   const toggleSheetVisiblity = () => {
      if (isUploadDocFormVisible) {
         setIsUploadDocFormVisible(false)
      }
      setSheetVisible(prev => !prev)
   }
   const toggleUploadFormVisibilty = () => {
      if (isSheetVisible) {
         setSheetVisible(false)
      }
      setIsUploadDocFormVisible(prev => !prev)
   }

   const handleUpdateSpace = async (data: UpdateSpaceForm) => {
      if (!space?.id) return

      const resp = await attempt(() => updateSpace(space.id, data))
      if (!resp.ok) {
         showBottomAlert({
            title: "Error",
            message: getErrorMessage(resp.error) || "Failed to update space",
            actions: [
               {
                  text: "OK",
                  style: "primary",
                  onPress: () => {},
               },
            ],
         })

         return
      }

      await queryClient.invalidateQueries({
         queryKey: ["spaces"],
      })

      toggleSheetVisiblity()
   }

   return {
      space,
      stats,
      pinnedDocuments,
      recentDocuments,
      handleFavoritePress,
      handlePinDocumentToSpace,
      handleOpenChat,
      isSheetVisible,
      isUploadDocFormVisible,
      isResolvingConversation,
      isLoadingSpace,
      isLoadingDocuments,
      documents,
      setSheetVisible,
      headerTransformAnimatedStyle,
      toggleSheetVisiblity,
      toggleUploadFormVisibilty,
      router,
      colors,
      handleUpdateSpace,
   }
}

function getSpaceStates(space: Space, documents: UserSpaceDocument[]): SpaceDetailsStat[] {
   return [
      {
         icon: FileText,
         label: "Documents",
         value: space.document_count,
         color: space.color,
      },
      {
         // "Indexed" counts documents whose text has been extracted and
         // embedded, which is what makes them answerable in chat. This used to
         // report recent_documents.length, which is just a five-item preview.
         icon: TrendingUp,
         label: "Indexed",
         value: documents.filter(doc => doc.processing_status === "ready").length,
         color: space.color,
      },
   ]
}
