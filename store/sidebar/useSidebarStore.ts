import { create } from "zustand"
import type { SharedValue } from "react-native-reanimated"

interface SidebarStore {
  translateX: SharedValue<number> | null
  setTranslateX: (value: SharedValue<number>) => void
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

export const useSidebarStore = create<SidebarStore>(set => ({
  translateX: null,
  setTranslateX: value => set({ translateX: value }),
  isOpen: false,
  setIsOpen: val => set({ isOpen: val }),
}))
