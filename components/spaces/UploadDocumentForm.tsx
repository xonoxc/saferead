import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Controller } from "react-hook-form"
import {
  SquarePen,
  Presentation,
  FileDiff,
  ChevronDown,
  FileType,
  LucideIcon,
  FileText,
  FileImage,
  File,
} from "lucide-react-native"

import { Button, TextInput } from "@/components"
import { Drawer } from "../Drawer"
import DropdownSelector, { renderIcon } from "../DropDownSelector"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants/Fonts"
import { useUploadDocumentForm } from "@/hooks/screens/useUploadDocumentForm"
import { DocumentPicker } from "./DocumentPicker"

interface Props {
  spaceId: string
  onUploadSuccess: () => void
  onCancel: () => void
}

export const UploadDocumentForm = ({ spaceId, onUploadSuccess, onCancel }: Props) => {
  const { colors } = useTheme()
  const { control, errors, isSubmitting, pickDocument, handleSubmit } = useUploadDocumentForm({
    spaceId,
    onUploadSuccess,
  })

  return (
    <Drawer visible>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Upload Document</Text>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          <DocumentPicker control={control} errors={errors} onPress={pickDocument} />

          <Controller
            control={control}
            name="displayName"
            render={({ field }) => (
              <TextInput
                label="Display Name"
                placeholder="Document display name"
                leftAccessory={<SquarePen size={18} color={colors.accent} />}
                value={field.value}
                onChangeText={field.onChange}
                error={errors.displayName?.message}
                style={{ color: colors.text }}
              />
            )}
          />

          <Controller
            control={control}
            name="documentType"
            render={({ field }) => (
              <DropdownSelector
                label="Document Type"
                selected={field.value}
                onSelect={field.onChange}
                renderTrigger={(open, selectedOption) => {
                  const Icon = (selectedOption?.icon ?? FileType) as LucideIcon

                  return (
                    <TouchableOpacity
                      onPress={open}
                      style={[
                        styles.picker,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.card,
                        },
                      ]}
                    >
                      <View style={styles.pickerContent}>
                        {renderIcon(Icon, colors)}
                        <Text
                          style={[
                            styles.pickerText,
                            { color: field.value ? colors.text : colors.textMuted },
                          ]}
                        >
                          {field.value || "Select Document type"}
                        </Text>
                        <ChevronDown color={colors.accent} size={18} />
                      </View>
                    </TouchableOpacity>
                  )
                }}
                options={[
                  {
                    label: "PDF",
                    value: "pdf",
                    icon: <FileDiff size={18} color={colors.accent} />,
                  },
                  {
                    label: "Word Document",
                    value: "docx",
                    icon: <Presentation size={18} color={colors.accent} />,
                  },
                  {
                    label: "Text",
                    value: "txt",
                    icon: <FileText size={18} color={colors.accent} />,
                  },
                  {
                    label: "Image",
                    value: "image",
                    icon: <FileImage size={18} color={colors.accent} />,
                  },
                  {
                    label: "Other",
                    value: "other",
                    icon: <File size={18} color={colors.accent} />,
                  },
                ]}
              />
            )}
          />
          {errors.documentType && <Text style={styles.error}>{errors.documentType.message}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isSubmitting ? "Uploading..." : "Upload Document"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            fullWidth
          />
        </View>
      </View>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
  },
  cancel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  picker: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    padding: 14,
    marginBottom: 10,
    justifyContent: "center",
  },
  pickerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  error: {
    color: "#EF4444",
    marginTop: 2,
    marginBottom: 12,
    fontSize: FontSizes.sm,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
})
