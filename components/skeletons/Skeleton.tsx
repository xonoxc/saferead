import React from "react"
import { View, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"

interface SkeletonProps {
   width: number | string
   height: number | string
   borderRadius?: number
   style?: any
}

const Skeleton = ({ width, height, borderRadius = 4, style }: SkeletonProps) => {
   const { colors } = useTheme()

   return (
      <View
         style={[
            styles.skeleton,
            {
               width,
               height,
               borderRadius,
               backgroundColor: colors.skeletonBackground,
            },
            style,
         ]}
      >
         <View
            style={[
               styles.shimmer,
               {
                  backgroundColor: colors.skeletonShimmer,
               },
            ]}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   skeleton: {
      overflow: "hidden",
      backgroundColor: "#eee",
   },
   shimmer: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.4,
   },
})

export default Skeleton
