import React from "react"
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native"
import { Calendar, Pin, PinOff, Tag, CircleCheck, TriangleAlert, Clock } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Spacing, Radii, elevation, withAlpha } from "@/constants/Design"
import { getFileIcon } from "@/utils/helpers/files"
import { useBrowserLink } from "@/hooks/browser/useBrowserLink"
import { FadeInView, PressableScale } from "@/components/motion"

import type { ColorsType } from "@/hooks/useTheme"
import type {
   UserSpaceDocument,
   DocumentProcessingStatus,
} from "@/types/api/spaces.documents.types"

interface UserSpaceDocumentCardProps {
   pinned?: boolean
   document: UserSpaceDocument
   spaceColor?: string
   index?: number
   onPin?: (documentId: string, documentFile: string) => void
}

export function UserSpaceDocumentCard({
   document,
   spaceColor,
   onPin,
   index = 0,
   pinned = false,
}: UserSpaceDocumentCardProps) {
   const { colors } = useTheme()
   const openBrowserLink = useBrowserLink()

   const FileIcon = getFileIcon(document.file_extension)
   const cardColor = spaceColor || colors.primary

   const handlePress = async () => {
      if (document.document_file) {
         await openBrowserLink(document.document_file)
      }
   }

   const handlePinPress = () => {
      if (onPin && document.document_file) {
         onPin(document.id, document.document_file)
      }
   }

   return (
      <FadeInView index={index} style={styles.wrapper}>
         <PressableScale
            style={[
               styles.card,
               { backgroundColor: colors.card, borderColor: colors.border },
               elevation(colors, 1),
            ]}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Open ${document.display_name || document.effective_name}`}
         >
            <View style={styles.header}>
               <View
                  style={[
                     styles.iconContainer,
                     {
                        backgroundColor: withAlpha(cardColor, 0.13),
                        borderColor: withAlpha(cardColor, 0.2),
                     },
                  ]}
               >
                  <FileIcon size={22} color={cardColor} />
               </View>

               <View style={styles.titleContainer}>
                  <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                     {document.display_name || document.effective_name}
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                     {document.file_size}
                  </Text>
               </View>

               {onPin && (
                  <Pressable onPress={handlePinPress} style={styles.pinButton} hitSlop={8}>
                     {pinned ? (
                        <PinOff size={17} color={cardColor} />
                     ) : (
                        <Pin size={17} color={colors.textMuted} />
                     )}
                  </Pressable>
               )}
            </View>

            <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
               <View style={styles.dateContainer}>
                  <Calendar size={13} color={colors.textMuted} />
                  <Text style={[styles.date, { color: colors.textMuted }]}>
                     {new Date(document.created_at).toLocaleDateString()}
                  </Text>

                  {document.tags?.length > 0 && (
                     <>
                        <Tag size={13} color={colors.textMuted} style={styles.tagIcon} />
                        <Text style={[styles.date, { color: colors.textMuted }]}>
                           {document.tags.slice(0, 2).join(", ")}
                        </Text>
                     </>
                  )}
               </View>

               {/*
                * Surfacing indexing state matters: until a document reaches
                * "ready" it cannot be answered from in chat, and previously
                * there was no way to tell that from the UI.
                * **/}
               <ProcessingBadge status={document.processing_status} colors={colors} />
            </View>
         </PressableScale>
      </FadeInView>
   )
}

function ProcessingBadge({
   status,
   colors,
}: {
   status: DocumentProcessingStatus
   colors: ColorsType
}) {
   const config = {
      ready: {
         label: "Ready",
         color: colors.success,
         background: colors.successBackground,
         icon: <CircleCheck size={12} color={colors.success} />,
      },
      processing: {
         label: "Indexing",
         color: colors.primary,
         background: colors.primaryFaded,
         icon: <ActivityIndicator size="small" color={colors.primary} />,
      },
      pending: {
         label: "Queued",
         color: colors.textMuted,
         background: colors.surface,
         icon: <Clock size={12} color={colors.textMuted} />,
      },
      failed: {
         label: "Failed",
         color: colors.error,
         background: colors.errorBackground,
         icon: <TriangleAlert size={12} color={colors.error} />,
      },
   }[status]

   if (!config) return null

   return (
      <View style={[styles.badge, { backgroundColor: config.background }]}>
         {config.icon}
         <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   wrapper: {
      paddingHorizontal: Spacing.md,
   },
   card: {
      borderRadius: Radii.md,
      padding: Spacing.sm,
      marginVertical: Spacing.xxs + 2,
      borderWidth: 1,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
   },
   iconContainer: {
      width: 44,
      height: 44,
      borderRadius: Radii.sm,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.sm,
      borderWidth: 1,
   },
   titleContainer: {
      flex: 1,
   },
   title: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   subtitle: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
   footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: Spacing.sm,
      paddingTop: Spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
   },
   dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
   },
   date: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      marginLeft: Spacing.xxs + 1,
   },
   tagIcon: {
      marginLeft: Spacing.xs,
   },
   badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xxs,
      paddingHorizontal: Spacing.xs,
      paddingVertical: 4,
      borderRadius: Radii.pill,
   },
   badgeText: {
      fontSize: 11,
      fontFamily: Fonts.medium,
   },
   pinButton: {
      padding: Spacing.xs,
   },
})
