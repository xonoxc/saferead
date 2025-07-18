import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { colors_palette, iconOptions } from "@/constants/spaceform"
import { createSpaceSchema } from "@/utils/validation/space"
import type { LucideIcon } from "lucide-react-native"

export type CreateSpaceFormProps = {
  onCreate: (
    title: string,
    desc: string,
    color: string,
    icon: LucideIcon,
    privacy: "private" | "public",
    is_favorite: boolean
  ) => void
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
      icon: iconOptions[0],
      privacy: "private",
      is_favorite: false,
    },
  })

  const handleSubmit = (data: CreateSpaceFormType) => {
    const result = onCreate(
      data.title,
      data.desc,
      data.color,
      data.icon,
      data.privacy,
      data.is_favorite
    )
    console.log("Space created:", result)
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
