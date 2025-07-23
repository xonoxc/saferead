import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { createSpaceSchema, updateSpaceSchema } from "@/utils/validation/space"

type Mode = "create" | "update"

export type CreateSpaceForm = z.infer<typeof createSpaceSchema>
export type UpdateSpaceForm = z.infer<typeof updateSpaceSchema>

export type SpaceFormData = CreateSpaceForm | UpdateSpaceForm

export function useSpaceHookForm({
  mode,
  onSubmit,
  defaultValues,
}: {
  mode: Mode
  onSubmit: (data: SpaceFormData) => void
  defaultValues?: Partial<SpaceFormData>
}) {
  const schema = mode === "create" ? createSpaceSchema : updateSpaceSchema

  const methods = useForm<SpaceFormData>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues,
  })

  return {
    ...methods,
    handleSubmit: methods.handleSubmit(onSubmit),
  }
}
