import React from "react"
import { View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { LoadingSpinner } from "@/components/LoadingSpinner"

const AnalyzeScreenSkeleton = () => {
   const { colors } = useTheme()

   return (
      <View
         style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
         }}
      >
         <LoadingSpinner loaderMessage="Loading History...." fontSize="sm" />
      </View>
   )
}

export default AnalyzeScreenSkeleton
