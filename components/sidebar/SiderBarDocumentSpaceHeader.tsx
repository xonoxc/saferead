import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CustomBackBtn } from "../CustomBackBtn"
import { Folder, Plus } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"
import { useTheme } from "@/hooks/useTheme"

interface SideBarDocumentSpaceHeaderProps {
  onClose: () => void
  spaceName?: string
  spaceColor?: string
  handleAddDocument: () => void
}

export default function SideBarDocumentSpaceHeader({
  onClose,
  spaceName,
  spaceColor,
  handleAddDocument,
}: SideBarDocumentSpaceHeaderProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.header}>
      <CustomBackBtn onPress={onClose} />
      {spaceName ? (
        <View style={styles.sideBarTitle}>
          <Folder size={24} color={spaceColor || colors.primary} />
          <Text style={[styles.title, { color: spaceColor || colors.text }]}>{spaceName}</Text>
        </View>
      ) : (
        <Text style={[styles.title, { color: colors.text }]}>Your Documents</Text>
      )}
      <TouchableOpacity
        style={[styles.addDocumentButton, { backgroundColor: colors.background }]}
        onPress={handleAddDocument}
      >
        <Plus size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 30,
    marginBottom: 24,
  },
  sideBarTitle: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  addDocumentButton: {
    alignItems: "center",
    padding: 5,
    justifyContent: "center",
    borderRadius: 100,
  },
})
