import { View, TouchableOpacity, StyleSheet } from "react-native"

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

         <View style={styles.headerActions}>
            <TouchableOpacity onPress={onCreateBtnPress}>
               <Plus size={20} color={space.color} />
            </TouchableOpacity>

            <Animated.View style={animatedStyle}>
               <TouchableOpacity onPress={onFavoritePress}>
                  <Heart size={20} color={space.color} />
               </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={onSettingsPress}>
               <Settings size={20} color={space.color} />
            </TouchableOpacity>
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
      flexDirection: "row",
      gap: 12,
   },
})
