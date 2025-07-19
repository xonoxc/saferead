import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { FileText, Calendar } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { UserSpaceDocument } from "@/types/api/spaces.documents.types"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface UserSpaceDocumentCardProps {
  document: UserSpaceDocument
  onPress?: () => void
}

export const UserSpaceDocumentCard: React.FC<UserSpaceDocumentCardProps> = ({
  document,
  onPress,
}) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FileText size={20} color={colors.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {document.display_name}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {document.document_type}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.textMuted} />
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {new Date(document.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {document.tags && document.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {document.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.surface }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
            </View>
          ))}
          {document.tags.length > 3 && (
            <Text style={[styles.moreTagsText, { color: colors.textMuted }]}>
              +{document.tags.length - 3} more
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  content: {
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  moreTagsText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
})
