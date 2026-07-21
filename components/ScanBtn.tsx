import { StyleSheet } from "react-native"
import { ScanSearch } from "lucide-react-native"
import { useDocumentScan } from "@/hooks/useDocumentScan"
import { useTheme } from "@/hooks/useTheme"
import { Radii, elevation } from "@/constants/Design"
import { PressableScale } from "@/components/motion"

import type { PressableProps } from "react-native"

interface ScanBtnProps extends PressableProps {}

/*
 * The centre tab action.
 *
 * This was a hardcoded white circle with a black glyph, which disappeared
 * entirely against the light theme's white background. It now uses the brand
 * colour so it reads as the primary action in either theme.
 * **/
export default function ScanBtn(props: ScanBtnProps) {
   const { handleDocumentScan } = useDocumentScan()
   const { colors } = useTheme()

   return (
      <PressableScale
         {...props}
         style={[styles.scanBtn, { backgroundColor: colors.primary }, elevation(colors, 2)]}
         onPress={handleDocumentScan}
         accessibilityRole="button"
         accessibilityLabel="Scan a document"
      >
         <ScanSearch size={26} color={colors.onPrimary} />
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   scanBtn: {
      padding: 21,
      borderRadius: Radii.lg,
      top: -10,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
})
