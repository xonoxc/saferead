import { create } from "zustand"

interface TabState {
   tabVisible: boolean
   setTabBarVisibility(visible: boolean): void
}

export const useTabStore = create<TabState>(set => {
   return {
      tabVisible: true,
      setTabBarVisibility: (visible: boolean) => set({ tabVisible: visible }),
   }
})
