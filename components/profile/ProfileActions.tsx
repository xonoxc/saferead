import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Shield, X } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface ActionItem {
   title: string
   description: string
   icon: React.ComponentType<{ size?: number; color?: string }>
   color: string
   onPress?: () => void
}

export function ProfileActions() {
   const { colors } = useTheme()

   const actions: ActionItem[] = [
      {
         title: "Change Password",
         description: "Update your account password",
         icon: Shield,
         color: colors.warning,
         onPress: () => {
            // TODO: router.push("/change-password")
         },
      },
      {
         title: "Delete Account",
         description: "Permanently delete your account",
         icon: X,
         color: colors.error,
         onPress: () => {
            // TODO: show destructive confirmation
         },
      },
   ]

   return (
      <View style={styles.container}>
         <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Actions</Text>

         {actions.map(action => (
            <TouchableOpacity
               key={action.title}
               style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
               onPress={action.onPress}
               activeOpacity={0.85}
            >
               <View style={[styles.iconWrap, { backgroundColor: action.color + "15" }]}>
                  <action.icon size={18} color={action.color} />
               </View>

               <View style={styles.textWrap}>
                  <Text
                     style={[
                        styles.itemTitle,
                        { color: action.color === colors.error ? colors.error : colors.text },
                     ]}
                  >
                     {action.title}
                  </Text>
                  <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                     {action.description}
                  </Text>
               </View>
            </TouchableOpacity>
         ))}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      paddingHorizontal: 20,
      marginBottom: 32,
   },
   sectionTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
      marginBottom: 16,
   },
   item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      marginBottom: 12,
   },
   iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   textWrap: {
      flex: 1,
   },
   itemTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   itemDesc: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
})
