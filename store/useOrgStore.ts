import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { attempt } from "@/utils/attempt"

const SELECTED_ORG_KEY = "selected_org_id"

/*
 * Which workspace the user is currently working in.
 *
 * Only the *id* is stored, never the org object. The name, seat count and
 * contract count all change server-side, and a cached copy of them would go
 * stale silently — the id is the one part that is stable, and React Query
 * already owns the rest.
 *
 * This exists because the app previously had no concept of a selection at all:
 * `useCurrentOrg` returned `results[0]` from a list the backend orders by name,
 * so a user with two workspaces could only ever reach whichever sorted first
 * alphabetically, and had no way to know the other was there. Persisting the
 * choice is what makes a second workspace reachable rather than theoretical.
 *
 * `hydrated` is a real state, not a detail. Until storage has been read we do
 * not know whether there is a saved choice, and treating "not yet loaded" as
 * "nothing saved" would flash the wrong workspace on every cold start — and
 * worse, send an `X-Org` header for it.
 * **/
interface OrgState {
   selectedOrgId: string | null
   hydrated: boolean

   hydrate: () => Promise<void>
   selectOrg: (id: string | null) => Promise<void>
}

export const useOrgStore = create<OrgState>(set => ({
   selectedOrgId: null,
   hydrated: false,

   hydrate: async () => {
      const result = await attempt(() => AsyncStorage.getItem(SELECTED_ORG_KEY))
      set({ selectedOrgId: result.ok ? result.data : null, hydrated: true })
   },

   selectOrg: async id => {
      /* State first: the switch should feel instant, and a storage write that
       * fails is a lost preference next launch, not a failed switch now. */
      set({ selectedOrgId: id })

      await attempt(() =>
         id
            ? AsyncStorage.setItem(SELECTED_ORG_KEY, id)
            : AsyncStorage.removeItem(SELECTED_ORG_KEY)
      )
   },
}))

/*
 * Read the selection outside React — the axios interceptor needs it to set the
 * `X-Org` header, and interceptors are not components.
 * **/
export const getSelectedOrgId = (): string | null => useOrgStore.getState().selectedOrgId
