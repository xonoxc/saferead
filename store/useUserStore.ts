import { create } from "zustand"
import * as SecureStore from "expo-secure-store"
import { attempt } from "@/utils/attempt"
import { isWeb } from "@/utils/helpers/platform"
import AsyncStorage from "@react-native-async-storage/async-storage"

import type { User } from "@/types"

interface UserStoreState {
   user: User | null
   setUser: (user: User) => void
   clearUser: () => Promise<void>
}

export const useUserStore = create<UserStoreState>(set => ({
   user: null,
   setUser: user => set({ user }),
   clearUser: async () => {
      await attempt(
         Promise.all([
            isWeb()
               ? AsyncStorage.removeItem("access_token")
               : SecureStore.deleteItemAsync("access_token"),
            isWeb()
               ? AsyncStorage.removeItem("user_data")
               : SecureStore.deleteItemAsync("user_data"),
         ])
      )
      set({ user: null })
   },
}))
