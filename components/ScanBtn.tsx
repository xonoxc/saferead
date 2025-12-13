import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from "react-native"
import { ScanSearch } from "lucide-react-native"
import { useDocumentScan } from "@/hooks/useDocumentScan"

interface ScanBtnProps extends TouchableOpacityProps {}

export default function ScanBtn(props: ScanBtnProps) {
   const { handleDocumentScan } = useDocumentScan()

   return (
      <TouchableOpacity {...props} style={styles.scanBtn} onPress={handleDocumentScan}>
         <ScanSearch size={26} color={"black"} />
      </TouchableOpacity>
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
