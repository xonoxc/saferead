import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CustomBackBtn } from "../CustomBackBtn"
import { Box, FilePlus } from "lucide-react-native"
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
      {spaceName && (
        <TouchableOpacity
          style={[styles.addDocumentButton, { backgroundColor: colors.primary }]}
          onPress={handleAddDocument}
        >
          <FilePlus size={24} color={colors.background} />
        </TouchableOpacity>
      )}
      {spaceName ? (
        <View style={styles.sideBarTitle}>
          <Box size={24} color={spaceColor || colors.primary} />
          <Text style={[styles.title, { color: spaceColor || colors.text }]}>{spaceName}</Text>
        </View>
      ) : (
        <Text style={[styles.title, { color: colors.text }]}>Your Documents</Text>
      )}

      <CustomBackBtn onPress={onClose} direction="right" />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 30,
    marginBottom: 24,
  },
  sideBarTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
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
    padding: 8,
    justifyContent: "center",
    borderRadius: 12,
  },
})
