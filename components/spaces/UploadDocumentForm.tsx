import React from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import * as DocumentPicker from "expo-document-picker"
import { Button, TextInput } from "@/components"
import DropdownSelector, { renderIcon } from "../DropDownSelector"
import { DocumentPickerAsset } from "expo-document-picker"
import { attempt } from "@/utils/attempt"
import { addDocumentToSpace } from "@/services/api"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants/Fonts"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { Drawer } from "../Drawer"
import { useQueryClient } from "@tanstack/react-query"
import {
  FileText,
  FileImage,
  File,
  SquarePen,
  Presentation,
  FileDiff,
  ChevronDown,
  FileType,
  LucideIcon,
  Upload,
  CloudUpload,
  FileUpIcon,
} from "lucide-react-native"

const schema = z.object({
  displayName: z.string().min(1, "Name is required"),
  documentType: z.string().min(1, "Please select a type"),
  file: z.custom<DocumentPickerAsset>().refine(f => f?.size && f.size <= 10 * 1024 * 1024, {
    message: "File must be smaller than 10MB",
  }),
})

type FormData = z.infer<typeof schema>

interface Props {
  spaceId: string
  onUploadSuccess: () => void
  onCancel: () => void
}

export const UploadDocumentForm = ({ spaceId, onUploadSuccess, onCancel }: Props) => {
  const { colors, isDark } = useTheme()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      documentType: "",
      file: undefined,
    },
  })

  const pickDocument = async () => {
    const result = await attempt(
      DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      })
    )
    if (!result.ok || !result.data?.assets?.length) {
      return
    }

    const file = result.data.assets[0]

    if (file.size && file.size > 10 * 1024 * 1024) {
      Alert.alert("File too large", "Please select a file smaller than 10 MB.")
      return
    }

    setValue("file", file)
    setValue("displayName", file.name ?? "")
  }

  const onSubmit = async (data: FormData) => {
    const file = {
      uri: data.file.uri,
      name: data.file.name,
      type: data.file.mimeType || "application/octet-stream",
    }
    const resp = await attempt(
      addDocumentToSpace({
        space: spaceId,
        document_file: file,
        display_name: data.displayName,
        document_type: data.documentType,
      })
    )

    if (!resp.ok) {
      const errorMessage = getErrorMessage(resp.error)
      Alert.alert("Error", errorMessage)
      return
    }

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "documents"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "stats"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      }),
    ])

    onUploadSuccess()
    Alert.alert("Success", "Document uploaded successfully")
  }

  return (
    <Drawer>
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
          <TouchableOpacity
            onPress={pickDocument}
            style={[styles.picker, { borderColor: colors.border }]}
          >
            <Controller
              control={control}
              name="file"
              render={({ field }) => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <FileUpIcon color={colors.textMuted} size={18} />
                  <Text style={[styles.pickerText, { color: colors.textMuted }]}>
                    {field.value?.name ?? "Select a document"}
                  </Text>
                </View>
              )}
            />
          </TouchableOpacity>
          {errors.file && <Text style={styles.error}>{errors.file.message}</Text>}

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
                          flex: 1,
                          flexDirection: "row",
                          borderColor: colors.border,
                          backgroundColor: colors.card,
                        },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {renderIcon(Icon, colors)}
                        <Text style={[styles.pickerText, { color: colors.textMuted }]}>
                          {field.value || "Select a type"}
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
            onPress={handleSubmit(onSubmit)}
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
    paddingHorizontal: 16,
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
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    padding: 14,
    marginBottom: 10,
    justifyContent: "center",
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
