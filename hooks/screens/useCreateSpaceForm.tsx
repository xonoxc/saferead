import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { colors_palette, type SpaceIconName } from "@/constants/spaceform"
import { createSpaceSchema } from "@/utils/validation/space"

import type { z } from "zod"

export type CreateSpaceFormProps = {
  onCreate: (
    title: string,
    desc: string,
    color: string,
    icon: SpaceIconName,
    privacy: "private" | "public",
    is_favorite: boolean
  ) => Promise<void>
}

type CreateSpaceFormType = z.infer<typeof createSpaceSchema>

export default function useCreateSpaceForm({ onCreate }: CreateSpaceFormProps) {
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    reset,
    setValue,
    watch,
  } = useForm<CreateSpaceFormType>({
    mode: "onChange",
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      title: "",
      desc: "",
      color: colors_palette[0],
      icon: "folder",
      privacy: "private",
      is_favorite: false,
    },
  })

  const handleSubmit = async (data: CreateSpaceFormType) => {
    await onCreate(data.title, data.desc, data.color, data.icon, data.privacy, data.is_favorite)
    reset()
  }

  return {
    /* form specific properties */
    control,
    handleFormSubmit,
    formState,
    handleSubmit,
    setValue,
    watch,
  }
}
