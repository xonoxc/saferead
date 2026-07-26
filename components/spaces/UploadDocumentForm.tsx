import React from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { Controller } from "react-hook-form"
import { FileUp, RefreshCw, Sparkles } from "lucide-react-native"

import { Button } from "@/components"
import { Drawer } from "../Drawer"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants/Fonts"
import { Spacing, Radii, withAlpha } from "@/constants/Design"
import { useUploadDocumentForm } from "@/hooks/screens/useUploadDocumentForm"
import { getFileIcon } from "@/utils/helpers/files"

interface Props {
   spaceId: string
   onUploadSuccess: () => void
   onCancel: () => void
}

function formatSize(bytes?: number) {
   if (!bytes) return ""
   if (bytes < 1024) return `${bytes} B`
   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/*
 * Pick a file, upload it. That is the whole form.
 *
 * It previously also asked for a display name and a document type. Both are
 * derived from the file on the server now, so the two inputs only added steps
 * and a way for the stated type to contradict the actual file.
 * **/
export const UploadDocumentForm = ({ spaceId, onUploadSuccess, onCancel }: Props) => {
   const { colors } = useTheme()
   const { control, errors, isSubmitting, pickDocument, handleSubmit } = useUploadDocumentForm({
      spaceId,
      onUploadSuccess,
   })

   return (
      <Drawer enableAbsolute visible>
         <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
               <Text style={[styles.title, { color: colors.text }]}>Add document</Text>
               <Pressable onPress={onCancel} hitSlop={8}>
                  <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
               </Pressable>
            </View>

            <View style={styles.content}>
               <Controller
                  control={control}
                  name="file"
                  render={({ field }) => {
                     const file = field.value
                     const Icon = file ? getFileIcon(`.${file.name?.split(".").pop()}`) : FileUp

                     return (
                        <Pressable
                           onPress={pickDocument}
                           style={[
                              styles.dropZone,
                              {
                                 borderColor: file ? colors.primary : colors.border,
                                 backgroundColor: file
                                    ? withAlpha(colors.primary, 0.06)
                                    : colors.card,
                              },
                           ]}
                        >
                           <View
                              style={[
                                 styles.iconTile,
                                 { backgroundColor: withAlpha(colors.primary, 0.12) },
                              ]}
                           >
                              <Icon size={24} color={colors.primary} />
                           </View>

                           {file ? (
                              <>
                                 <Text
                                    style={[styles.fileName, { color: colors.text }]}
                                    numberOfLines={2}
                                    ellipsizeMode="middle"
                                 >
                                    {file.name}
                                 </Text>
                                 <View style={styles.replaceRow}>
                                    <RefreshCw size={13} color={colors.textMuted} />
                                    <Text style={[styles.replaceText, { color: colors.textMuted }]}>
                                       {formatSize(file.size)} · Tap to choose another
                                    </Text>
                                 </View>
                              </>
                           ) : (
                              <>
                                 <Text style={[styles.dropTitle, { color: colors.text }]}>
                                    Choose a file
                                 </Text>
                                 <Text style={[styles.dropHint, { color: colors.textMuted }]}>
                                    PDF, Word, text or an image · up to 10 MB
                                 </Text>
                              </>
                           )}
                        </Pressable>
                     )
                  }}
               />

               {errors.file && (
                  <Text style={[styles.error, { color: colors.error }]}>{errors.file.message}</Text>
               )}

               <View style={styles.autoNote}>
                  <Sparkles size={14} color={colors.textMuted} />
                  <Text style={[styles.autoNoteText, { color: colors.textMuted }]}>
                     The name and type are detected from your file. Once indexed, you can ask
                     questions about it in this space.
                  </Text>
               </View>
            </View>

            <View style={styles.footer}>
               <Button
                  title={isSubmitting ? "Uploading..." : "Upload document"}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  fullWidth
               />
            </View>
         </View>
      </Drawer>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      height: "100%",
      paddingHorizontal: Spacing.md,
      zIndex: 9999,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.lg,
   },
   title: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
   },
   cancel: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
   },
   content: {
      flex: 1,
      paddingTop: Spacing.sm,
   },
   dropZone: {
      borderWidth: 1,
      borderStyle: "dashed",
      borderRadius: Radii.lg,
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing.md,
      alignItems: "center",
      gap: Spacing.xs,
   },
   iconTile: {
      width: 52,
      height: 52,
      borderRadius: Radii.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.xs,
   },
   dropTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
   },
   dropHint: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
   fileName: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      textAlign: "center",
   },
   replaceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 2,
   },
   replaceText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
   error: {
      marginTop: Spacing.xs,
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
   autoNote: {
      flexDirection: "row",
      gap: Spacing.xs,
      marginTop: Spacing.lg,
      paddingRight: Spacing.sm,
   },
   autoNoteText: {
      flex: 1,
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      lineHeight: 17,
   },
   footer: {
      paddingVertical: Spacing.lg,
      paddingBottom: Spacing.xxl,
   },
})
