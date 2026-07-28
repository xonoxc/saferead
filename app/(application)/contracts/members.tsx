import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { ChevronLeft, UserPlus, Users } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useCurrentOrg, useOrgMembers, useInviteToOrg } from "@/hooks/queries/contracts"
import { Fonts, Radii, Spacing, Type } from "@/constants"
import { FadeInView, PressableScale } from "@/components/motion"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"

import { ADMIN_ROLES, type OrgRole, type Membership } from "@/types/api/contracts.types"

const ROLES: { value: OrgRole; label: string; blurb: string }[] = [
   { value: "member", label: "Member", blurb: "Can add contracts and resolve deadlines." },
   { value: "admin", label: "Admin", blurb: "Everything a member can do, plus manage seats." },
   { value: "viewer", label: "Viewer", blurb: "Read-only." },
]

/*
 * Seats.
 *
 * This screen exists because the home screen's "Invite" nudge used to route to
 * Settings, which has nothing to do with seats — the affordance promised an
 * action the app had no destination for.
 *
 * It is deliberately an *add existing user* flow, not an email invitation:
 * `POST /contracts/organizations/{id}/invite/` resolves a username or email
 * against accounts that already exist and creates the membership in one call.
 * There is no pending-invitation state on the server, so offering to "send an
 * invite" to a stranger would be a promise nothing fulfils. The copy says so
 * rather than letting someone discover it from an error.
 * **/
export default function OrgMembersScreen() {
   const { colors } = useTheme()
   const { org, orgId, isLoading: orgLoading } = useCurrentOrg()

   const [identifier, setIdentifier] = useState("")
   const [role, setRole] = useState<OrgRole>("member")
   const [error, setError] = useState<string | undefined>()
   const [notice, setNotice] = useState<string | undefined>()

   const { data: members, isLoading: membersLoading, refetch } = useOrgMembers(orgId)
   const invite = useInviteToOrg(orgId)

   const canManage = !!org?.my_role && ADMIN_ROLES.includes(org.my_role)

   const onInvite = async () => {
      const trimmed = identifier.trim()
      if (!trimmed) {
         setNotice(undefined)
         setError("Enter the username or email of an existing SafeRead account.")
         return
      }

      setError(undefined)
      setNotice(undefined)

      const result = await attempt(() => invite.mutateAsync({ user: trimmed, role }))
      if (!result.ok) {
         setError(getErrorMessage(result.error))
         return
      }

      setIdentifier("")
      setNotice(`${result.data.username} now has a seat.`)
      refetch()
   }

   if (orgLoading) {
      return (
         <View style={[styles.centre, { backgroundColor: colors.background }]}>
            <ActivityIndicator color={colors.primary} />
         </View>
      )
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
               <Text style={[styles.title, { color: colors.text }]}>Seats</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {org?.name
                     ? `Who can see and act on ${org.name}'s contracts.`
                     : "Who can see and act on your contracts."}
               </Text>
            </FadeInView>

            <View style={styles.section}>
               <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                  {members?.length === 1 ? "1 SEAT" : `${members?.length ?? 0} SEATS`}
               </Text>

               {membersLoading ? (
                  <ActivityIndicator color={colors.textMuted} style={styles.loading} />
               ) : (
                  (members ?? []).map(m => <MemberRow key={m.id} member={m} />)
               )}
            </View>

            {canManage ? (
               <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ADD SOMEONE</Text>
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>
                     They need a SafeRead account already — enter the username or email they signed
                     up with.
                  </Text>

                  <ErrorMessage message={error} />
                  {notice && (
                     <Text style={[styles.notice, { color: colors.success }]}>{notice}</Text>
                  )}

                  <TextInput
                     label="Username or email"
                     value={identifier}
                     onChangeText={setIdentifier}
                     placeholder="jordan or jordan@acme.com"
                     autoCapitalize="none"
                     autoCorrect={false}
                     returnKeyType="done"
                     onSubmitEditing={onInvite}
                  />

                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ROLE</Text>
                  <View style={styles.roleWrap}>
                     {ROLES.map(r => {
                        const selected = role === r.value
                        return (
                           <PressableScale
                              key={r.value}
                              onPress={() => setRole(r.value)}
                              accessibilityRole="button"
                              accessibilityState={{ selected }}
                              style={StyleSheet.flatten([
                                 styles.roleChip,
                                 {
                                    backgroundColor: selected ? colors.primary : colors.surface,
                                    borderColor: selected ? colors.primary : colors.border,
                                 },
                              ])}
                           >
                              <Text
                                 style={[
                                    styles.roleLabel,
                                    { color: selected ? colors.onPrimary : colors.textSecondary },
                                 ]}
                              >
                                 {r.label}
                              </Text>
                           </PressableScale>
                        )
                     })}
                  </View>
                  <Text style={[styles.hint, { color: colors.textMuted }]}>
                     {ROLES.find(r => r.value === role)?.blurb}
                  </Text>

                  <Button
                     title="Add to workspace"
                     onPress={onInvite}
                     loading={invite.isPending}
                     fullWidth
                     size="large"
                  />
               </View>
            ) : (
               <View style={[styles.locked, { backgroundColor: colors.surface }]}>
                  <UserPlus size={16} color={colors.textMuted} strokeWidth={2.2} />
                  <Text style={[styles.hint, { color: colors.textSecondary, flex: 1 }]}>
                     Only an owner or admin can add people to this workspace.
                  </Text>
               </View>
            )}
         </ScrollView>
      </View>
   )
}

function MemberRow({ member }: { member: Membership }) {
   const { colors } = useTheme()

   return (
      <View style={[styles.row, { borderColor: colors.border }]}>
         <View style={[styles.avatar, { backgroundColor: colors.primaryFaded }]}>
            <Users size={15} color={colors.primary} strokeWidth={2.2} />
         </View>
         <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{member.username}</Text>
            {!!member.email && (
               <Text style={[styles.rowBody, { color: colors.textMuted }]}>{member.email}</Text>
            )}
         </View>
         <Text style={[styles.roleTag, { color: colors.textSecondary }]}>{member.role}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   centre: { flex: 1, alignItems: "center", justifyContent: "center" },
   topBar: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.xxs,
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
      paddingBottom: Spacing.xl,
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
   section: { gap: Spacing.xs },
   sectionLabel: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   hint: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   notice: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   loading: { paddingVertical: Spacing.lg },
   row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
   },
   avatar: {
      width: 32,
      height: 32,
      borderRadius: Radii.xs,
      alignItems: "center",
      justifyContent: "center",
   },
   rowText: { flex: 1, gap: 1 },
   rowTitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   rowBody: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   roleTag: {
      ...Type.micro,
      fontFamily: Fonts.semiBold,
      textTransform: "uppercase",
   },
   roleWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.xxs,
   },
   roleChip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 7,
      borderRadius: Radii.xs,
      borderWidth: StyleSheet.hairlineWidth,
   },
   roleLabel: {
      ...Type.caption,
      fontFamily: Fonts.semiBold,
   },
   locked: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radii.sm,
   },
})
