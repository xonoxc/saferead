import { create } from "zustand"

import type { Space } from "@/types"

interface SpaceState {
  selectedSpace: Space | null
  setSelectedSpace: (space: Space | null) => void
}

export const useSpaceStore = create<SpaceState>(set => ({
  selectedSpace: null,
  setSelectedSpace: space => set({ selectedSpace: space }),
}))
