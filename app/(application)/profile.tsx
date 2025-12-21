import { ProfileActions } from "@/components/profile/ProfileActions"
import { ProfileAvatar } from "@/components/profile/ProfileAvatar"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStats } from "@/components/profile/ProfileStats"
import { useProfileScreen } from "@/hooks/screens/useProfileScreen"
import { useTheme } from "@/hooks/useTheme"
import { ScrollView, View } from "react-native"

export default function ProfileScreen() {
   const { colors } = useTheme()
   const {
      user,
      form,
      isEditing,
      startEditing,
      stopEditing,
      onSubmit,
      animatedStyle,
      handleAvatarPress,
   } = useProfileScreen()

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         <ProfileHeader isEditing={isEditing} onEdit={startEditing} onCancel={stopEditing} />

         <ScrollView>
            <ProfileAvatar
               user={user}
               animatedStyle={animatedStyle}
               editable={isEditing}
               onPress={handleAvatarPress}
            />
            <ProfileStats user={user} />
            <ProfileForm form={form} onSubmit={onSubmit} isEditing={isEditing} />
         </ScrollView>
      </View>
   )
}
