import { useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from "react-native"
import { Building2, Check, ChevronDown, Plus, X } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useCurrentOrg, useSwitchOrg, useCreateOrganization } from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"

/*
 * Which workspace you are in, and how to get to another.
 *
 * Rendered as a header control rather than buried in Settings because it
 * answers a question the user has *while reading the list* — "whose contracts
 * am I looking at?" — and because a switcher nobody can find is the same as no
 * switcher. It hides itself when there is only one workspace: a control with a
 * single option is noise, and the name is already in the screen header.
 * **/
export function WorkspaceSwitcher() {
   const { colors } = useTheme()
   const { org, organizations } = useCurrentOrg()
   const switchOrg = useSwitchOrg()
   const [open, setOpen] = useState(false)
   const [creating, setCreating] = useState(false)

   if (!org) return null

   const onPick = async (id: string) => {
      if (id !== org.id) await switchOrg(id)
      setOpen(false)
   }

   return (
      <>
         <Pressable
            onPress={() => setOpen(true)}
            style={[styles.trigger, { backgroundColor: colors.surface }]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Workspace: ${org.name}. Tap to switch.`}
         >
            <Building2 size={13} color={colors.textSecondary} strokeWidth={2.2} />
            <Text style={[styles.triggerText, { color: colors.text }]} numberOfLines={1}>
               {org.name}
            </Text>
            <ChevronDown size={13} color={colors.textSecondary} strokeWidth={2.2} />
         </Pressable>

         <Modal
            visible={open}
            transparent
            animationType="fade"
            onRequestClose={() => {
               setOpen(false)
               setCreating(false)
            }}
         >
            <Pressable
               style={styles.backdrop}
               onPress={() => {
                  setOpen(false)
                  setCreating(false)
               }}
            >
               {/* Swallows taps so pressing inside the sheet does not dismiss it. */}
               <Pressable
                  style={[styles.sheet, { backgroundColor: colors.background }]}
                  onPress={() => {}}
               >
                  <View style={styles.sheetHeader}>
                     <Text style={[styles.sheetTitle, { color: colors.text }]}>Workspaces</Text>
                     <Pressable
                        onPress={() => {
                           setOpen(false)
                           setCreating(false)
                        }}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                     >
                        <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
                     </Pressable>
                  </View>

                  {creating ? (
                     <CreateWorkspaceForm
                        onDone={() => {
                           setCreating(false)
                           setOpen(false)
                        }}
                        onCancel={() => setCreating(false)}
                     />
                  ) : (
                     <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
                        {organizations.map(candidate => {
                           const active = candidate.id === org.id
                           return (
                              <Pressable
                                 key={candidate.id}
                                 onPress={() => onPick(candidate.id)}
                                 style={[styles.row, { borderBottomColor: colors.border }]}
                                 accessibilityRole="button"
                                 accessibilityState={{ selected: active }}
                              >
                                 <View style={styles.rowText}>
                                    <Text
                                       style={[styles.rowName, { color: colors.text }]}
                                       numberOfLines={1}
                                    >
                                       {candidate.name}
                                    </Text>
                                    <Text
                                       style={[styles.rowMeta, { color: colors.textSecondary }]}
                                    >
                                       {candidate.seat_count === 1
                                          ? "1 seat"
                                          : `${candidate.seat_count} seats`}
                                    </Text>
                                 </View>
                                 {active && (
                                    <Check size={16} color={colors.primary} strokeWidth={2.4} />
                                 )}
                              </Pressable>
                           )
                        })}

                        <Pressable
                           onPress={() => setCreating(true)}
                           style={styles.row}
                           accessibilityRole="button"
                        >
                           <Plus size={16} color={colors.primary} strokeWidth={2.4} />
                           <Text style={[styles.rowName, { color: colors.primary }]}>
                              New workspace
                           </Text>
                        </Pressable>
                     </ScrollView>
                  )}
               </Pressable>
            </Pressable>
         </Modal>
      </>
   )
}

/*
 * Creating a second workspace, from inside the switcher.
 *
 * Deliberately not `OrgSetupPrompt`: that screen is the first-run pitch and
 * spends most of its height explaining why workspaces exist. Someone who
 * already has one has read that argument and just needs a name field.
 * **/
function CreateWorkspaceForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
   const [name, setName] = useState("")
   const [error, setError] = useState<string | undefined>()
   const { mutateAsync, isPending } = useCreateOrganization()

   const onCreate = async () => {
      const trimmed = name.trim()
      if (!trimmed) {
         setError("Give your workspace a name first.")
         return
      }

      setError(undefined)
      const result = await attempt(() => mutateAsync({ name: trimmed }))

      if (!result.ok) {
         setError(getErrorMessage(result.error))
         return
      }
      /* `useCreateOrganization` has already switched us into it. */
      onDone()
   }

   return (
      <View style={styles.form}>
         <ErrorMessage message={error} />
         <TextInput
            label="Workspace name"
            value={name}
            onChangeText={setName}
            placeholder="Acme Industrial Supply"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            autoFocus
            onSubmitEditing={onCreate}
         />
         <Button title="Create workspace" onPress={onCreate} loading={isPending} fullWidth />
         <Button title="Cancel" onPress={onCancel} variant="ghost" fullWidth />
      </View>
   )
}

const styles = StyleSheet.create({
   trigger: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      maxWidth: 200,
   },
   triggerText: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
      flexShrink: 1,
   },
   backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
   },
   sheet: {
      borderTopLeftRadius: Radii.lg,
      borderTopRightRadius: Radii.lg,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xl,
      maxHeight: "70%",
   },
   sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: Spacing.sm,
   },
   sheetTitle: {
      ...Type.subheading,
      fontFamily: Fonts.bold,
   },
   list: { flexGrow: 0 },
   row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
   },
   rowText: { flex: 1, gap: 2 },
   rowName: {
      ...Type.body,
      fontFamily: Fonts.semiBold,
   },
   rowMeta: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   form: { gap: Spacing.sm, paddingTop: Spacing.xs },
})

export default WorkspaceSwitcher
