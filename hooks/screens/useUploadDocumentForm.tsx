import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as DocumentPicker from "expo-document-picker"
import { useForm } from "react-hook-form"
import { Alert } from "react-native"
import { z } from "zod"

import { addDocumentToSpace } from "@/services/space.service"
import { uploadDocumentFormSchema as schema } from "@/utils/validation/docs"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"

type FormData = z.infer<typeof schema>

interface UseUploadDocumentFormProps {
  spaceId: string
  onUploadSuccess: () => void
}

export function useUploadDocumentForm({ spaceId, onUploadSuccess }: UseUploadDocumentFormProps) {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      documentType: "",
      file: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const file = {
        uri: data.file.uri,
        name: data.file.name,
        type: data.file.mimeType || "application/octet-stream",
      }
      return addDocumentToSpace({
        space: spaceId,
        document_file: file,
        display_name: data.displayName,
        document_type: data.documentType,
      })
    },
    onSuccess: async () => {
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
    },
    onError: error => {
      const errorMessage = getErrorMessage(error)
      Alert.alert("Error", errorMessage)
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

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return {
    control,
    errors,
    isSubmitting: mutation.isPending,
    pickDocument,
    handleSubmit: handleSubmit(onSubmit),
  }
}
