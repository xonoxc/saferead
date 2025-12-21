import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import Animated from "react-native-reanimated"
import { Camera, User as UserIcon } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import type { User } from "@/types"

interface Props {
   user: User | null
   animatedStyle: any
   editable?: boolean
   onPress: () => void
}

export function ProfileAvatar({ user, animatedStyle, editable = false, onPress }: Props) {
   const { colors } = useTheme()

   return (
      <View style={styles.container}>
         <Animated.View style={animatedStyle}>
            <TouchableOpacity
               style={[styles.avatarWrap, { borderColor: colors.border }]}
               onPress={onPress}
               disabled={!editable}
               activeOpacity={0.85}
            >
               {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
               ) : (
                  <View style={[styles.placeholder, { backgroundColor: colors.primary + "15" }]}>
                     <UserIcon size={40} color={colors.primary} />
                  </View>
               )}

               {editable && (
                  <View style={[styles.camera, { backgroundColor: colors.primary }]}>
                     <Camera size={14} color={colors.background} />
                  </View>
               )}
            </TouchableOpacity>
         </Animated.View>

         <Text style={[styles.name, { color: colors.text }]}>{user?.username}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      marginBottom: 24,
   },
   avatarWrap: {
      borderRadius: 50,
      borderWidth: 2,
      padding: 2,
      position: "relative",
   },
   avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
   },
   placeholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
   },
   camera: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
   },
   name: {
      marginTop: 12,
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
   email: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
})
