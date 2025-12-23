import Animated from "react-native-reanimated"

import { View, Pressable, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { iconMap } from "@/constants/spaceform"

import type { ControllerRenderProps } from "react-hook-form"

interface IConSelectorProps {
   field: ControllerRenderProps<any, "icon">
   selectedColor: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SpaceIconSelector({
   selectedColor,
   field: { onChange, value },
}: IConSelectorProps) {
   const { colors } = useTheme()

   return (
      <View style={styles.grid}>
         {Object.entries(iconMap).map(([IconName, Icon]) => {
            const isSelected = value === IconName

            return (
               <AnimatedPressable
                  key={IconName}
                  style={[
                     styles.icon,
                     {
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderRadius: isSelected ? 35 : 16,
                        borderColor: isSelected ? colors.card : "transparent",
                        borderWidth: 2,
                     },
                  ]}
                  onPress={() => {
                     onChange(IconName)
                  }}
               >
                  <Icon size={24} color={isSelected ? colors.background : selectedColor} />
               </AnimatedPressable>
            )
         })}
      </View>
   )
}

const styles = StyleSheet.create({
   grid: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 12,
   },
   color: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "transparent",
   },
   selected: {
      borderColor: "#FFF",
      elevation: 4,
   },
   icon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
   },
   iconText: {
      fontSize: 24,
   },
})
