import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import * as DocumentPicker from "expo-document-picker"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { addDocumentToSpace } from "@/services/space.service"
import { uploadDocumentFormSchema as schema } from "@/utils/validation/docs"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { useDrawerAlert } from "../alerts/useAlert"

type FormData = z.infer<typeof schema>

interface UseUploadDocumentFormProps {
   spaceId: string
   onUploadSuccess: () => void
}

export function useUploadDocumentForm({ spaceId, onUploadSuccess }: UseUploadDocumentFormProps) {
   const showBottomAlert = useDrawerAlert()

   const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
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
         /*
          * Only the file is sent. The server reads the extension for
          * document_type and the filename for display_name, so there is nothing
          * here for the two to disagree about.
          * **/
         return addDocumentToSpace({
            space: spaceId,
            document_file: file,
         })
      },
      onSuccess: async () => {
         onUploadSuccess()

         showBottomAlert({
            type: "success",
            title: "Upload started",
            message: "Your document is uploading and will be ready to chat with shortly.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
      },
      onError: error => {
         showBottomAlert({
            type: "error",
            title: "Upload Error",
            message: getErrorMessage(error),
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
      },
      meta: {
         invalidatedQueries: [
            ["spaces", spaceId, "documents"],
            ["spaces", spaceId, "stats"],
            ["spaces"],
         ],
      },
   })

   const pickDocument = async () => {
      const result = await attempt(() =>
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
         showBottomAlert({
            type: "error",
            title: "File too large",
            message: "Please select a file smaller than 10 MB.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      setValue("file", file, { shouldValidate: true })
   }

   const onSubmit = (data: FormData) => mutation.mutate(data)

   return {
      control,
      errors,
      isSubmitting: mutation.isPending,
      pickDocument,
      handleSubmit: handleSubmit(onSubmit),
   }
}
