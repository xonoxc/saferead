import { View, StyleSheet, Text } from "react-native"
import { useState } from "react"
import { useTheme } from "@/hooks/useTheme"

import { DocumentTypeSelector } from "@/components/documents/DocumentTypeSelector"
import { Drawer } from "@/components/Drawer"
import { Button } from "@/components/Button"

import { useTabBarVisibilty } from "@/hooks/useTabBarVisiblitiy"
import { FloatingUploadButton } from "@/components/analyize/FloadingUploadBtn"

import type {
   DocumentTypeSelectorProps,
   DocumentType,
} from "@/components/documents/DocumentTypeSelector"
import type { AnalyzeDocument } from "@/types/docs"

interface UploadChipProps extends DocumentTypeSelectorProps {
   onDocumentUpload: () => Promise<AnalyzeDocument | null>
   onAnalyze: (document: AnalyzeDocument, type: DocumentType) => void
}

export function UploadChip({
   onDocumentUpload,
   onSelect,
   selectedType,
   onAnalyze,
}: UploadChipProps) {
   const { colors } = useTheme()
   const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false)
   const [uploadedDocument, setUploadedDocument] = useState<AnalyzeDocument | null>(null)

   useTabBarVisibilty(!isBottomSheetVisible)

   const handleUploadPress = async () => {
      const document = await onDocumentUpload()
      if (document) {
         setUploadedDocument(document)
         setIsBottomSheetVisible(true)
      }
   }

   const handleAnalyzePress = () => {
      if (uploadedDocument) {
         onAnalyze(uploadedDocument, selectedType)
         setIsBottomSheetVisible(false)
         setUploadedDocument(null)
      }
   }

   return (
      <>
         <FloatingUploadButton handleUploadPress={handleUploadPress} />

         <Drawer visible={isBottomSheetVisible} enableAbsolute position="bottom">
            <View style={[styles.bottomSheetContent, { backgroundColor: colors.card }]}>
               <Text style={[styles.sheetTitle, { color: colors.text }]}>Select Document Type</Text>

               <View style={styles.typeSelectorContainer}>
                  <DocumentTypeSelector selectedType={selectedType} onSelect={onSelect} />
               </View>

               <View style={styles.buttonContainer}>
                  <Button
                     title="Cancel"
                     variant="secondary"
                     onPress={() => {
                        setIsBottomSheetVisible(false)
                        setUploadedDocument(null)
                     }}
                  />
                  <Button title="Analyze" onPress={handleAnalyzePress} />
               </View>
            </View>
         </Drawer>
      </>
   )
}

const styles = StyleSheet.create({
   floatingButtonContainer: {
      position: "absolute",
      bottom: 80,
      right: 20,
      zIndex: 100,
   },
   floatingButton: {
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   loader: {
      width: 24,
      height: 24,
      borderWidth: 3,
      borderRadius: 12,
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: "transparent",
   },
   uploadAction: {
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 50,
   },
   bottomSheetContent: {
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
   },
   sheetTitle: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 20,
   },
   typeSelectorContainer: {
      marginBottom: 30,
   },
   buttonContainer: {
      flexDirection: "row",
      width: "50%",
      gap: 12,
   },
})
