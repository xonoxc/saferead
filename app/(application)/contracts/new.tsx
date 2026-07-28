import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { Check, ChevronLeft, FileText, FolderOpen, Info } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useSpaces, useSpaceDocuments } from "@/hooks/queries/spaces"
import { useCreateContract } from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { EmptyState, SectionHeader } from "@/components/contracts"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"

import type { UserSpaceDocument } from "@/types/api/spaces.documents.types"

/*
 * Register a contract.
 *
 * The document picker is not optional decoration — extraction reads
 * `SpaceDocument.extracted_text`, so a contract with no source document would
 * sit at "Queued for analysis" forever. Rather than let someone create that
 * row and wonder why nothing happens, the Create button stays disabled until a
 * document is chosen, and the copy says why.
 *
 * Reusing space documents rather than adding a second upload path is
 * deliberate: that pipeline already extracts and indexes text, so a contract
 * registered here is answerable in chat too, from the same bytes.
 * **/
export default function NewContractScreen() {
   const { colors } = useTheme()

   const [spaceId, setSpaceId] = useState<string | null>(null)
   const [document, setDocument] = useState<UserSpaceDocument | null>(null)
   const [title, setTitle] = useState("")
   const [counterparty, setCounterparty] = useState("")
   const [error, setError] = useState<string | undefined>()

   const { data: spacesData, isLoading: spacesLoading } = useSpaces()
   const { data: docsData, isLoading: docsLoading } = useSpaceDocuments(spaceId ?? "", !!spaceId)
   const createContract = useCreateContract()

   const spaces = spacesData?.pages?.flatMap(p => p.results) ?? []
   const documents: UserSpaceDocument[] = docsData?.pages?.flatMap(p => p.results) ?? []

   const onCreate = async () => {
      if (!document) return

      setError(undefined)
      const result = await attempt(() =>
         createContract.mutateAsync({
            title: title.trim() || document.effective_name || document.display_name,
            source_document: document.id,
            ...(counterparty.trim() && { counterparty_name: counterparty.trim() }),
         })
      )

      if (!result.ok) {
         setError(getErrorMessage(result.error))
         return
      }

      /* Replace rather than push: backing out of a freshly created contract
       * should land on the portfolio, not on the form that made it. */
      router.replace(`/(application)/contracts/${result.data.id}`)
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.topBar}>
            <PressableScale
               onPress={() => router.back()}
               accessibilityRole="button"
               accessibilityLabel="Go back"
               hitSlop={8}
               style={StyleSheet.flatten([styles.iconBtn, { backgroundColor: colors.surface }])}
            >
               <ChevronLeft size={19} color={colors.text} strokeWidth={2.2} />
            </PressableScale>
         </View>

         <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
         >
            <FadeInView style={styles.header}>
               <Text style={[styles.title, { color: colors.text }]}>Add a contract</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Pick a document you have already uploaded. SafeRead reads it, pulls out the
                  clauses and dates, and checks every quote against the original.
               </Text>
            </FadeInView>

            <ErrorMessage message={error} />

            {spacesLoading ? (
               <ActivityIndicator color={colors.primary} style={styles.loading} />
            ) : spaces.length === 0 ? (
               <EmptyState
                  icon={FolderOpen}
                  title="No documents yet"
                  body="Contracts are read from documents in your spaces. Upload one first, then come back here."
                  actionLabel="Go to spaces"
                  onAction={() => router.replace("/(application)/(tabs)/spaces")}
               />
            ) : (
               <>
                  <View style={styles.section}>
                     <SectionHeader title="Space" />
                     <View style={styles.chipWrap}>
                        {spaces.map(space => {
                           const selected = spaceId === space.id
                           return (
                              <PressableScale
                                 key={space.id}
                                 onPress={() => {
                                    setSpaceId(space.id)
                                    setDocument(null)
                                 }}
                                 accessibilityRole="button"
                                 accessibilityState={{ selected }}
                                 style={StyleSheet.flatten([
                                    styles.chip,
                                    {
                                       backgroundColor: selected ? colors.primary : colors.surface,
                                       borderColor: selected ? colors.primary : colors.border,
                                    },
                                 ])}
                              >
                                 <Text
                                    style={[
                                       styles.chipText,
                                       { color: selected ? colors.onPrimary : colors.textSecondary },
                                    ]}
                                 >
                                    {space.title}
                                 </Text>
                              </PressableScale>
                           )
                        })}
                     </View>
                  </View>

                  {spaceId && (
                     <View style={styles.section}>
                        <SectionHeader title="Document" count={documents.length} />
                        {docsLoading ? (
                           <ActivityIndicator color={colors.textMuted} style={styles.loading} />
                        ) : documents.length === 0 ? (
                           <EmptyState
                              compact
                              icon={FileText}
                              title="This space is empty"
                              body="Add a document to it and it will show up here."
                           />
                        ) : (
                           <View style={styles.stack}>
                              {documents.map(doc => (
                                 <DocumentOption
                                    key={doc.id}
                                    doc={doc}
                                    selected={document?.id === doc.id}
                                    onSelect={() => {
                                       setDocument(doc)
                                       if (!title) setTitle(doc.effective_name || doc.display_name)
                                    }}
                                 />
                              ))}
                           </View>
                        )}
                     </View>
                  )}

                  {document && (
                     <FadeInView style={styles.section}>
                        <SectionHeader title="Details" />
                        <View style={styles.form}>
                           <TextInput
                              label="Contract title"
                              value={title}
                              onChangeText={setTitle}
                              placeholder="Acme MSA 2026"
                              autoCapitalize="words"
                           />
                           <TextInput
                              label="Other party (optional)"
                              value={counterparty}
                              onChangeText={setCounterparty}
                              placeholder="Acme Industrial Supply"
                              autoCapitalize="words"
                              autoCorrect={false}
                           />
                        </View>

                        <View
                           style={[
                              styles.hint,
                              { backgroundColor: colors.surface, borderColor: colors.border },
                           ]}
                        >
                           <Info size={13} color={colors.textMuted} strokeWidth={2.2} />
                           <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                              Leave these blank and SafeRead fills them in from the document
                              itself. Anything you type wins over what it reads.
                           </Text>
                        </View>
                     </FadeInView>
                  )}

                  <Button
                     title={document ? "Add contract" : "Pick a document first"}
                     onPress={onCreate}
                     disabled={!document}
                     loading={createContract.isPending}
                     fullWidth
                     size="large"
                  />
               </>
            )}
         </ScrollView>
      </View>
   )
}

/*
 * A document that can be turned into a contract.
 *
 * Anything not `ready` is shown but not selectable: its text has not been
 * extracted yet, so extraction would have nothing to read. Hiding those rows
 * would be worse — someone looking for a file they just uploaded would think
 * it had vanished.
 * **/
function DocumentOption({
   doc,
   selected,
   onSelect,
}: {
   doc: UserSpaceDocument
   selected: boolean
   onSelect: () => void
}) {
   const { colors } = useTheme()
   const ready = doc.processing_status === "ready"

   return (
      <PressableScale
         onPress={onSelect}
         disabled={!ready}
         accessibilityRole="radio"
         accessibilityState={{ selected, disabled: !ready }}
         style={StyleSheet.flatten([
            styles.docRow,
            {
               backgroundColor: colors.card,
               borderColor: selected ? colors.primary : colors.border,
            },
            !ready && { opacity: 0.5 },
         ])}
      >
         <View style={[styles.docIcon, { backgroundColor: colors.surface }]}>
            <FileText size={15} color={colors.textSecondary} strokeWidth={2.2} />
         </View>

         <View style={styles.docText}>
            <Text numberOfLines={1} style={[styles.docName, { color: colors.text }]}>
               {doc.effective_name || doc.display_name}
            </Text>
            <Text style={[styles.docMeta, { color: colors.textMuted }]}>
               {ready
                  ? `${doc.file_extension?.toUpperCase() ?? "FILE"} · ${doc.file_size}`
                  : doc.processing_status === "failed"
                    ? "Could not read this file"
                    : "Still being processed"}
            </Text>
         </View>

         {selected && (
            <View style={[styles.tick, { backgroundColor: colors.primary }]}>
               <Check size={12} color={colors.onPrimary} strokeWidth={3} />
            </View>
         )}
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   topBar: {
      flexDirection: "row",
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xs,
   },
   iconBtn: {
      width: 34,
      height: 34,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   scroll: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxxl,
      gap: Spacing.lg,
   },
   header: { gap: 4 },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
   },
   subtitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
   },
   section: { gap: 0 },
   stack: { gap: Spacing.xs },
   chipWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.xxs,
   },
   chip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 7,
      borderRadius: Radii.xs,
      borderWidth: StyleSheet.hairlineWidth,
   },
   chipText: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
   docRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
      borderWidth: 1,
   },
   docIcon: {
      width: 30,
      height: 30,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   docText: { flex: 1, gap: 1 },
   docName: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   docMeta: {
      ...Type.micro,
      fontFamily: Fonts.regular,
   },
   tick: {
      width: 20,
      height: 20,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   form: { gap: Spacing.xs },
   hint: {
      flexDirection: "row",
      gap: 6,
      alignItems: "flex-start",
      padding: Spacing.sm,
      borderRadius: Radii.xs,
      borderWidth: StyleSheet.hairlineWidth,
      marginTop: Spacing.sm,
   },
   hintText: {
      ...Type.caption,
      fontFamily: Fonts.regular,
      flex: 1,
   },
   loading: { paddingVertical: Spacing.lg },
})
