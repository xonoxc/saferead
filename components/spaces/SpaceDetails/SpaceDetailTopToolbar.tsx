import { View, Pressable, StyleSheet } from "react-native"

import Animated from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"

import { CustomBackBtn } from "@/components/CustomBackBtn"
import { Heart, Plus, Settings } from "lucide-react-native"
import type { HeaderProps } from "./SpaceDetailsHeader"

export default function SpaceDetailTopBar({
   space,
   animatedStyle,
   onCreateBtnPress,
   onFavoritePress,
   onSettingsPress,
}: HeaderProps) {
   const { colors } = useTheme()

   return (
      <View style={[styles.topBar, { backgroundColor: colors.background }]}>
         <CustomBackBtn style={{ borderColor: space.color }} />

         <View
            style={[
               styles.headerActions,
               {
                  backgroundColor: colors.card,
                  borderColor: space.color + "33",
               },
            ]}
         >
            <Pressable onPress={onCreateBtnPress}>
               <Plus size={20} color={space.color} />
            </Pressable>

            <Animated.View style={animatedStyle}>
               <Pressable onPress={onFavoritePress}>
                  <Heart
                     size={20}
                     color={space.color}
                     fill={space.is_favorite ? space.color : undefined}
                  />
               </Pressable>
            </Animated.View>

            <Pressable onPress={onSettingsPress}>
               <Settings size={20} color={space.color} />
            </Pressable>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   topBar: {
      paddingHorizontal: 14,
      paddingBottom: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 10,
   },
   headerActions: {
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      gap: 30,
   },
})
