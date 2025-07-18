import { useTheme } from "@react-navigation/native"
import { useState } from "react"

import { colors_palette, iconOptions } from "@/constants/spaceform"
import type { LucideIcon } from "lucide-react-native"
import { Alert } from "react-native"
import { useForm } from "react-hook-form"
import z from "zod"
import { createSpaceSchema } from "@/utils/validation/space"
import { zodResolver } from "@hookform/resolvers/zod"

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
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [color, setColor] = useState(colors_palette[0])
  const [icon, setIcon] = useState<LucideIcon>(iconOptions[0])
  const [privacy, setPrivacy] = useState<"private" | "public">("private")
  const [isFavorite, setIsFavorite] = useState(false)

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
  } = useForm<CreateSpaceFormType>({
    mode: "onChange",
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      title: "",
      desc: "",
    },
  })

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a space name")
      return
    }
    onCreate(title, desc, color, iconOptions[0], privacy, isFavorite)
    setTitle("")
    setDesc("")
    setColor(colors_palette[0])
    setIcon(iconOptions[0])
    setPrivacy("private")
    setIsFavorite(false)
  }

  return {
    /* non-form specific */
    title,
    setTitle,
    desc,
    setDesc,
    color,
    setColor,
    icon,
    setIcon,
    privacy,
    setPrivacy,
    isFavorite,
    setIsFavorite,
    handleSubmit,

    /* form specific properties */
    control,
    handleFormSubmit,
    formState,
  }
}
