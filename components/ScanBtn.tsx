import { StyleSheet, Pressable } from "react-native"
import { ScanSearch } from "lucide-react-native"
import { useDocumentScan } from "@/hooks/useDocumentScan"

import type { PressableProps } from "react-native"

interface ScanBtnProps extends PressableProps {}

export default function ScanBtn(props: ScanBtnProps) {
   const { handleDocumentScan } = useDocumentScan()

   return (
      <Pressable {...props} style={styles.scanBtn} onPress={handleDocumentScan}>
         <ScanSearch size={26} color={"black"} />
      </Pressable>
   )
}

const styles = StyleSheet.create({
   scanBtn: {
      backgroundColor: "#ffffff",
      padding: 21,
      borderRadius: 20,
      top: -10,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
})
