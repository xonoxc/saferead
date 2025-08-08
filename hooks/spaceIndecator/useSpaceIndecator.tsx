import { useSpaces } from "@/hooks/queries/spaces"
import { useSpaceStore } from "@/store/useSpaceStore"
import { useTheme } from "@/hooks/useTheme"
import { Box } from "lucide-react-native"

import type { DropdownOption } from "@/components/DropDownSelector"
import type { Space } from "@/types"
import { useAnimatedStyle, withTiming } from "react-native-reanimated"

export function useSpaceIndecator() {
  const { colors } = useTheme()
  const { data, isLoading } = useSpaces()

  const selectedSpace = useSpaceStore(s => s.selectedSpace)
  const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)
  const isHeaderSpaceIndecatorEnabled = useSpaceStore(s => s.isHeaderSpaceIndicatorEnabled)

  const animatedSpaceIndecatorStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isHeaderSpaceIndecatorEnabled ? 1 : 0, {
      duration: 300,
    }),
    transform: [
      { translateX: withTiming(isHeaderSpaceIndecatorEnabled ? 0 : -100, { duration: 300 }) },
    ],
  }))

  const spaces = data?.pages.flatMap(page => page.results) || []

  const options: DropdownOption<Space>[] = spaces.map(space => ({
    label: space.title,
    value: space,
    icon: <Box color={colors.text} size={18} />,
  }))

  const handleSelect = (space: Space) => {
    setSelectedSpace(space)
  }

  return {
    colors,
    selectedSpace,
    isLoading,
    options,
    handleSelect,
    animatedSpaceIndecatorStyles,
  }
}
