import React from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import * as DocumentPicker from "expo-document-picker"
import { Button, TextInput, DropdownSelector } from "@/components"
import { DocumentPickerAsset } from "expo-document-picker"
import { attempt } from "@/utils/attempt"
import { addDocumentToSpace } from "@/services/api"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants/Fonts"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { Drawer } from "../Drawer"

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
  const { colors } = useTheme()

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
    const result = await attempt(DocumentPicker.getDocumentAsync({}))
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
    const resp = await attempt(
      addDocumentToSpace({
        space: spaceId,
        document_file: data.file,
        display_name: data.displayName,
        document_type: data.documentType,
      })
    )

    if (!resp.ok) {
      const errorMessage = getErrorMessage(resp.error)
      Alert.alert("Error", errorMessage)
      return
    }

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
                <Text style={[styles.pickerText, { color: colors.textMuted }]}>
                  {field.value?.name ?? "Select a document"}
                </Text>
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
                options={[
                  { label: "PDF", value: "pdf" },
                  { label: "Word Document", value: "docx" },
                  { label: "Text", value: "txt" },
                  { label: "Image", value: "image" },
                  { label: "Other", value: "other" },
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
