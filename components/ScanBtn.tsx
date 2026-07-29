import { View, StyleSheet } from "react-native"
import { ScanLine } from "lucide-react-native"

import { useDocumentScan } from "@/hooks/useDocumentScan"
import { useTheme } from "@/hooks/useTheme"
import { Radii, TabBar, elevation } from "@/constants/Design"
import { PressableScale } from "@/components/motion"

/*
 * The centre tab action.
 *
 * It is a sibling of the normal tabs inside the bar rather than a tab button,
 * so it sizes itself instead of inheriting the tab layout. The previous version
 * relied on `flex: 1` plus a negative `top` inside a tab slot, which meant its
 * size changed with the number of tabs and it drifted out of alignment.
 * **/
export default function ScanBtn() {
   const { handleDocumentScan } = useDocumentScan()
   const { colors } = useTheme()

   return (
      <View style={styles.slot}>
         <PressableScale
            style={[
               styles.button,
               {
                  backgroundColor: colors.primary,
                  /*
                   * A ring in the page colour separates the raised action from
                   * the bar beneath it, so it reads as sitting above the bar
                   * rather than as a coloured blob stuck to it.
                   * **/
                  borderColor: colors.background,
               },
               elevation(colors, 3),
            ]}
            onPress={handleDocumentScan}
            accessibilityRole="button"
            accessibilityLabel="Scan a document"
         >
            {/*
             * Sized against the *inner* circle, not the button: a 4px ring in
             * the page colour eats 8px of the 54px diameter, so a 26px glyph
             * was floating in the middle of a 46px well and reading as an
             * undersized icon in an oversized button. ScanSearch also packed a
             * frame and a magnifier into that space — one shape survives the
             * scale, two do not.
             * **/}
            <ScanLine size={30} color={colors.onPrimary} strokeWidth={2.2} />
         </PressableScale>
      </View>
   )
}

const styles = StyleSheet.create({
   slot: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: TabBar.height,
      /* The button lifts out of this slot, so the slot itself must not eat
       * taps meant for the screen behind it. */
      pointerEvents: "box-none",
   },
   button: {
      width: TabBar.actionSize,
      height: TabBar.actionSize,
      borderRadius: Radii.pill,
      borderWidth: 3,
      alignItems: "center",
      justifyContent: "center",
      /* Ride above the bar so the action reads as primary. */
      marginBottom: TabBar.actionLift * 2,
   },
})
