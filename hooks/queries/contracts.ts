import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useOrgStore } from "@/store/useOrgStore"

import {
   createContract,
   createOrganization,
   deleteContract,
   getContract,
   getContracts,
   getCounterparties,
   getExpiringContracts,
   getObligationSummary,
   getObligations,
   getContractsMissingProtection,
   getOrgMembers,
   getOrgStats,
   getOrganizations,
   getUpcomingEvents,
   inviteToOrg,
   logContractAction,
   reextractContract,
   updateObligation,
} from "@/services/contracts.service"

import type {
   ClauseType,
   ContractFilterOptions,
   ContractsListResponse,
   ExtractionStatus,
} from "@/types/api/contracts.types"

/*
 * Extraction runs on a Celery worker, so a freshly registered contract comes
 * back `pending` and only becomes useful a few seconds later. Nothing pushes
 * that transition, so anything showing a contract mid-extraction has to poll —
 * same pattern as document analysis in `queries/docs.ts`.
 *
 * The interval is longer than the 3s used for scans: extraction walks twelve
 * clause types over the whole document and routinely takes 20-60s, so a 3s
 * poll would be roughly fifteen wasted round-trips per contract.
 * **/
export const EXTRACTION_IN_PROGRESS: ExtractionStatus[] = ["pending", "processing"]
export const EXTRACTION_POLL_INTERVAL_MS = 5000

export const isExtractionInProgress = (status: unknown): boolean =>
   typeof status === "string" && EXTRACTION_IN_PROGRESS.includes(status as ExtractionStatus)

/* ------------------------------------------------------ organizations --- */

/*
 * The caller's orgs.
 *
 * Almost every other hook here depends on there being one, and "no org yet" is
 * a normal state rather than an error — the backend deliberately returns an
 * empty list instead of a 403. `useCurrentOrg` collapses that into the single
 * question screens actually ask.
 * **/
export const useOrganizations = () =>
   useQuery({
      queryKey: ["organizations"],
      queryFn: getOrganizations,
      staleTime: 5 * 60 * 1000,
   })

/*
 * The workspace the user is working in, and the list of the ones they could
 * switch to.
 *
 * Two things here are load-bearing, and both were previously wrong.
 *
 * **A failed query is not an empty one.** `hasOrg` used to be
 * `!isLoading && !!org`, which is false when the request *errored* just as
 * surely as when the account genuinely has no workspace — so every network
 * blip rendered `OrgSetupPrompt`, told the user they had no workspace, and
 * invited them to create one. They did, repeatedly. The database ended up with
 * duplicate workspaces per user, created by someone who had one all along and
 * was being told otherwise by a screen that could not tell a timeout from an
 * empty list. `hasOrg` is now answerable only once the query has actually
 * succeeded, and `isError` is surfaced so callers show a retry instead.
 *
 * **`results[0]` is not a selection.** The backend orders by name, so the
 * "current" workspace was whichever sorted first alphabetically — stable, but
 * arbitrary, and it made a second workspace unreachable. The stored choice wins
 * when it still resolves to a workspace the user belongs to; falling back to
 * the first entry covers the first run and the case where a saved workspace
 * has since been left or deleted.
 * **/
export const useCurrentOrg = () => {
   const { data, isLoading, isSuccess, isError, error, refetch } = useOrganizations()
   const { selectedOrgId, hydrated } = useOrgStore()

   const organizations = data?.results ?? []
   const selected = selectedOrgId
      ? (organizations.find(candidate => candidate.id === selectedOrgId) ?? null)
      : null
   const org = selected ?? organizations[0] ?? null

   return {
      org,
      orgId: org?.id ?? null,
      organizations,
      /* True only when the server confirmed one. Never inferred from silence. */
      hasOrg: isSuccess && !!org,
      /* True only when the server confirmed the *absence* of one. */
      needsOrg: isSuccess && organizations.length === 0,
      isLoading: isLoading || !hydrated,
      isError,
      error,
      refetch,
   }
}

/*
 * Switching workspaces.
 *
 * Every contracts query is keyed without the org id, because the server infers
 * the org from the request — so switching has to clear those caches or the new
 * workspace renders the previous one's contracts. Removing rather than
 * invalidating: invalidation keeps showing stale data while it refetches, and
 * showing one workspace's agreements under another's name is the one mistake
 * this feature must never make.
 * **/
export const useSwitchOrg = () => {
   const queryClient = useQueryClient()
   const selectOrg = useOrgStore(state => state.selectOrg)

   return async (orgId: string | null) => {
      await selectOrg(orgId)

      for (const key of ORG_SCOPED_QUERY_KEYS) {
         queryClient.removeQueries({ queryKey: [key] })
      }
   }
}

/* Everything the server resolves through the caller's current org. */
const ORG_SCOPED_QUERY_KEYS = [
   "contracts",
   "obligations",
   "events",
   "counterparties",
   "benchmarks",
] as const

export const useCreateOrganization = () => {
   const switchOrg = useSwitchOrg()

   return useMutation({
      mutationFn: createOrganization,
      /* Land in the workspace you just made. Creating one and staying in
       * another reads as the button having done nothing. */
      onSuccess: async created => {
         if (created?.id) await switchOrg(created.id)
      },
      meta: { invalidatedQueries: [["organizations"]] },
   })
}

export const useOrgMembers = (orgId: string | null) =>
   useQuery({
      queryKey: ["organizations", orgId, "members"],
      queryFn: () => getOrgMembers(orgId!),
      enabled: !!orgId,
   })

export const useInviteToOrg = (orgId: string | null) =>
   useMutation({
      mutationFn: ({ user, role }: { user: string; role?: "owner" | "admin" | "member" | "viewer" }) =>
         inviteToOrg(orgId!, user, role),
      meta: { invalidatedQueries: [["organizations"]] },
   })

export const useOrgStats = (orgId: string | null) =>
   useQuery({
      queryKey: ["organizations", orgId, "stats"],
      queryFn: () => getOrgStats(orgId!),
      enabled: !!orgId,
   })

/* ----------------------------------------------------------- contracts -- */

export const useContracts = (filters?: ContractFilterOptions, enabled = true) => {
   const query = useInfiniteQuery<ContractsListResponse>({
      queryKey: ["contracts", filters],
      queryFn: ({ pageParam = 1 }) => getContracts(pageParam as number, filters),
      getNextPageParam: lastPage => {
         if (!lastPage.next) return undefined
         const match = lastPage.next.match(/page=(\d+)/)
         return match ? parseInt(match[1]) : undefined
      },
      initialPageParam: 1,
      enabled,
      /* Poll only while something in the list is still extracting. */
      refetchInterval: q => {
         const pages = q.state.data?.pages
         if (!pages) return false
         const waiting = pages.some(page =>
            page.results.some(c => isExtractionInProgress(c.extraction_status))
         )
         return waiting ? EXTRACTION_POLL_INTERVAL_MS : false
      },
   })

   return query
}

export const useContract = (contractId: string | undefined) =>
   useQuery({
      queryKey: ["contracts", "detail", contractId],
      queryFn: () => getContract(contractId!),
      enabled: !!contractId,
      refetchInterval: q =>
         isExtractionInProgress(q.state.data?.extraction_status)
            ? EXTRACTION_POLL_INTERVAL_MS
            : false,
   })

export const useCreateContract = () =>
   useMutation({
      mutationFn: createContract,
      meta: { invalidatedQueries: [["contracts"], ["organizations"]] },
   })

export const useDeleteContract = () =>
   useMutation({
      mutationFn: deleteContract,
      meta: { invalidatedQueries: [["contracts"], ["organizations"]] },
   })

export const useReextractContract = () =>
   useMutation({
      mutationFn: reextractContract,
      meta: { invalidatedQueries: [["contracts"]] },
   })

/*
 * Logging an action can also resolve an event, so the deadline list and the
 * org stats both go stale — invalidate them alongside the contract itself.
 * **/
export const useLogContractAction = (contractId: string) =>
   useMutation({
      mutationFn: (data: Parameters<typeof logContractAction>[1]) =>
         logContractAction(contractId, data),
      meta: {
         invalidatedQueries: [["contracts"], ["contract-events"], ["organizations"]],
      },
   })

export const useExpiringContracts = (days = 60, enabled = true) =>
   useQuery({
      queryKey: ["contracts", "expiring", days],
      queryFn: () => getExpiringContracts(days),
      enabled,
   })

export const useContractsMissingProtection = (clause?: ClauseType, enabled = true) =>
   useQuery({
      queryKey: ["contracts", "missing-protections", clause ?? "any"],
      queryFn: () => getContractsMissingProtection(clause),
      enabled,
   })

/* --------------------------------------------------------- obligations -- */

export const useObligations = (
   filters?: { direction?: string; status?: string; ordering?: string },
   enabled = true
) =>
   useQuery({
      queryKey: ["obligations", filters],
      queryFn: () => getObligations(1, filters),
      enabled,
   })

export const useObligationSummary = (enabled = true) =>
   useQuery({
      queryKey: ["obligations", "summary"],
      queryFn: () => getObligationSummary(),
      enabled,
   })

export const useUpdateObligation = () =>
   useMutation({
      mutationFn: ({
         id,
         ...data
      }: { id: string } & Parameters<typeof updateObligation>[1]) => updateObligation(id, data),
      meta: {
         invalidatedQueries: [["obligations"], ["contracts"], ["organizations"]],
      },
   })

/* -------------------------------------------------------------- events -- */

export const useUpcomingEvents = (days = 30, enabled = true) =>
   useQuery({
      queryKey: ["contract-events", "upcoming", days],
      queryFn: () => getUpcomingEvents(days),
      enabled,
   })

/* ------------------------------------------------------ counterparties -- */

export const useCounterparties = (search?: string, enabled = true) =>
   useQuery({
      queryKey: ["counterparties", search ?? ""],
      queryFn: () => getCounterparties(1, search),
      enabled,
   })
