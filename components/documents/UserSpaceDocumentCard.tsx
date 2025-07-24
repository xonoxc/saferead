import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Calendar, Tag } from "lucide-react-native"
import * as WebBrowser from "expo-web-browser"
import { useTheme } from "@/hooks/useTheme"
import { UserSpaceDocument } from "@/types/api/spaces.documents.types"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { getFileIcon } from "@/utils/helpers/files"
import { attempt } from "@/utils/attempt"

interface UserSpaceDocumentCardProps {
  document: UserSpaceDocument
  spaceColor?: string
}

export function UserSpaceDocumentCard({ document, spaceColor }: UserSpaceDocumentCardProps) {
  const { colors } = useTheme()

  const FileIcon = getFileIcon(document.file_extension)
  const cardColor = spaceColor || colors.primary

  const handlePress = async () => {
    if (!document.document_file) return

    const resp = await attempt(WebBrowser.openBrowserAsync(document.document_file))
    if (!resp.ok) {
      Alert.alert("Error", "Could not open the document.")
      return
    }
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: cardColor + "20", borderColor: cardColor + "30" },
          ]}
        >
          <FileIcon size={24} color={cardColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {document.display_name}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {document.file_size}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.textMuted} />
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {new Date(document.created_at).toLocaleDateString()}
          </Text>
        </View>
        {document.tags && document.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Tag size={14} color={colors.textMuted} />
            <Text style={[styles.tagText, { color: colors.textMuted }]}>
              {document.tags.slice(0, 2).join(", ")}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#00000010",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    marginLeft: 6,
  },
})
