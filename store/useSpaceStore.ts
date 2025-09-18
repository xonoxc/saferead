import { create } from "zustand"

import type { Space } from "@/types"

interface SpaceState {
   selectedSpace: Space | null
   setSelectedSpace: (space: Space | null) => void

   activeConverstationId: string | null
   setActiveConverstationId: (id: string | null) => void
}

export const useSpaceStore = create<SpaceState>(set => ({
   /*
    * space thingie
    * **/
   selectedSpace: null,
   setSelectedSpace: space => set({ selectedSpace: space }),
   /*
    * active conversation thingie
    * **/

   activeConverstationId: null,
   setActiveConverstationId: id => set({ activeConverstationId: id }),
}))
