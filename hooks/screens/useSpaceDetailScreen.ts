import { useState } from "react"
import { FileText, TrendingUp } from "lucide-react-native"
import {
   useSharedValue,
   useAnimatedStyle,
   withSpring,
   useAnimatedScrollHandler,
   withTiming,
} from "react-native-reanimated"
import { useLocalSearchParams, useRouter } from "expo-router"
import { usePinDocumentMutation, useSpaces, useToggleFavoriteSpace } from "@/hooks/queries/spaces"
import { updateSpace } from "@/services/space.service"
import { useSpaceStore } from "@/store/useSpaceStore"

import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { useQueryClient } from "@tanstack/react-query"
import { useDrawerAlert } from "../alerts/useAlert"

import { useCreateConversationMutation } from "../queries/converstations"

import type { ColorsType } from "../useTheme"
import type { UpdateSpaceForm } from "../forms/useSpaceHookForm"

export function useSpaceDetailsScreen({ colors }: { colors: ColorsType }) {
   const { id } = useLocalSearchParams<{ id: string }>()
   const isChatBtnVisible = useSharedValue(1)
   const prevScrollY = useSharedValue(0)
   const { data: spaces } = useSpaces()
   const router = useRouter()

   const setSpace = useSpaceStore(s => s.setSelectedSpace)
   const setActiveConverstationId = useSpaceStore(s => s.setActiveConverstationId)

   const showBottomAlert = useDrawerAlert()

   const queryClient = useQueryClient()

   const scale = useSharedValue(1)
   const [isSheetVisible, setSheetVisible] = useState(false)
   const [isUploadDocFormVisible, setIsUploadDocFormVisible] = useState(false)

   const flattendSpaces = spaces?.pages.flatMap(page => page.results) ?? []
   const space = flattendSpaces.find(s => s.id === id)

   const toggleFavouriteSpace = useToggleFavoriteSpace(space?.id as string)
   const pinDocumentToSpace = usePinDocumentMutation()

   const { createConversationMutation, isCreatingConversation } = useCreateConversationMutation()

   const pinnedDocuments = space?.recent_documents.filter(doc => doc.is_pinned)
   const recentDocuments = space?.recent_documents.filter(doc => !doc.is_pinned)

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
   }))

   const handleFavoritePress = async () => {
      scale.value = withSpring(0.9, {}, () => {
         scale.value = withSpring(1)
      })

      if (!space) return

      const resp = await attempt(toggleFavouriteSpace.mutateAsync())
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

   const handleOpenChat = async () => {
      if (!space) return

      const resp = await attempt(
         createConversationMutation({
            space: space.id,
            title: `${space.title}:{space.id}`,
         })
      )

      if (!resp.ok) {
         const errorMessage = getErrorMessage(resp.error)
         showBottomAlert({
            type: "error",
            title: "Error",
            message: errorMessage || "Failed to create conversation",
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

      const resp = await attempt(
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

   const stats = [
      {
         icon: FileText,
         label: "Documents",
         value: space?.document_count,
         color: space?.color,
      },
      {
         icon: TrendingUp,
         label: "Analyzed",
         value: space?.recent_documents.length,
         color: space?.color,
      },
   ]

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

      const resp = await attempt(updateSpace(space.id, data))
      if (!resp.ok) {
         showBottomAlert({
            title: "Error",
            message: getErrorMessage(resp.error) || "Failed to update space",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })

         return
      }

      await queryClient.invalidateQueries({
         queryKey: ["spaces"],
      })

      toggleSheetVisiblity()
   }

   const handleDocumentListScroll = useAnimatedScrollHandler({
      onScroll: event => {
         const currentY = event.contentOffset.y
         const deltaY = currentY - prevScrollY.value

         if (deltaY > 5) {
            isChatBtnVisible.value = withTiming(0, { duration: 200 })
         } else if (deltaY < -5) {
            isChatBtnVisible.value = withTiming(1, { duration: 200 })
         }
         prevScrollY.value = currentY
      },
   })

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
      isCreatingConversation,
      isChatBtnVisible,
      setSheetVisible,
      handleDocumentListScroll,
      animatedStyle,
      toggleSheetVisiblity,
      toggleUploadFormVisibilty,
      router,
      colors,
      handleUpdateSpace,
   }
}
