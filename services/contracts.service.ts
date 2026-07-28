import { apiClient } from "@/utils/apiclient"

import type {
   ClauseType,
   ContractAction,
   ContractDetail,
   ContractEvent,
   ContractFilterOptions,
   ContractsListResponse,
   CounterpartiesListResponse,
   CreateContractRequest,
   LogActionRequest,
   Membership,
   Obligation,
   ObligationsListResponse,
   ObligationSummary,
   Organization,
   OrganizationsListResponse,
   OrgRole,
   OrgStats,
} from "@/types/api/contracts.types"

/*
 * All contracts endpoints are org-scoped server-side. The org is resolved from
 * the `X-Org` header when present, and otherwise from the caller's single
 * membership — so a one-org user (which is nearly everyone at this stage) never
 * has to pass it. `withOrg` exists for the day someone belongs to two.
 * **/
const orgHeader = (orgId?: string) => (orgId ? { headers: { "X-Org": orgId } } : {})

/* ------------------------------------------------------ organizations --- */

export async function getOrganizations() {
   const resp = await apiClient.get<OrganizationsListResponse>("/contracts/organizations/")
   return resp.data
}

export async function createOrganization(data: { name: string; industry_code?: string }) {
   const resp = await apiClient.post<Organization>("/contracts/organizations/", data)
   return resp.data
}

export async function getOrgMembers(orgId: string) {
   const resp = await apiClient.get<Membership[]>(`/contracts/organizations/${orgId}/members/`)
   return resp.data
}

export async function inviteToOrg(orgId: string, user: string, role: OrgRole = "member") {
   const resp = await apiClient.post<Membership>(`/contracts/organizations/${orgId}/invite/`, {
      user,
      role,
   })
   return resp.data
}

export async function getOrgStats(orgId: string) {
   const resp = await apiClient.get<OrgStats>(`/contracts/organizations/${orgId}/stats/`)
   return resp.data
}

/* ----------------------------------------------------------- contracts -- */

export async function getContracts(
   page?: number,
   filters: ContractFilterOptions = {},
   orgId?: string
) {
   const resp = await apiClient.get<ContractsListResponse>("/contracts/contracts/", {
      params: { ...(page && { page }), ...filters },
      ...orgHeader(orgId),
   })
   return resp.data
}

export async function getContract(contractId: string) {
   const resp = await apiClient.get<ContractDetail>(`/contracts/contracts/${contractId}/`)
   return resp.data
}

export async function createContract(data: CreateContractRequest, orgId?: string) {
   const resp = await apiClient.post<ContractDetail>(
      "/contracts/contracts/",
      data,
      orgHeader(orgId)
   )
   return resp.data
}

export async function deleteContract(contractId: string) {
   return apiClient.delete(`/contracts/contracts/${contractId}/`)
}

/*
 * Re-run extraction. The server resets `extraction_status` to `pending` and
 * queues the task, so the caller should start polling the detail endpoint.
 * **/
export async function reextractContract(contractId: string) {
   const resp = await apiClient.post(`/contracts/contracts/${contractId}/reextract/`)
   return resp.data
}

/*
 * Record work against a contract. Passing `resolves_event` closes out the
 * alert that prompted the work, which is what turns a notification into
 * something a team can see has been handled.
 * **/
export async function logContractAction(contractId: string, data: LogActionRequest) {
   const resp = await apiClient.post<ContractAction>(
      `/contracts/contracts/${contractId}/actions/`,
      data
   )
   return resp.data
}

export async function getExpiringContracts(days = 60, orgId?: string) {
   const resp = await apiClient.get<ContractsListResponse>("/contracts/contracts/expiring/", {
      params: { days },
      ...orgHeader(orgId),
   })
   return resp.data
}

/*
 * Contracts recorded as *lacking* a clause type — the query a prose summary
 * structurally cannot answer, because absence leaves nothing to search for.
 * **/
export async function getContractsMissingProtection(clause?: ClauseType, orgId?: string) {
   const resp = await apiClient.get<ContractsListResponse>(
      "/contracts/contracts/missing-protections/",
      { params: { ...(clause && { clause }) }, ...orgHeader(orgId) }
   )
   return resp.data
}

/* --------------------------------------------------------- obligations -- */

export async function getObligations(
   page?: number,
   filters: { direction?: string; status?: string; assigned_to?: string; ordering?: string } = {},
   orgId?: string
) {
   const resp = await apiClient.get<ObligationsListResponse>("/contracts/obligations/", {
      params: { ...(page && { page }), ...filters },
      ...orgHeader(orgId),
   })
   return resp.data
}

export async function getObligationSummary(orgId?: string) {
   const resp = await apiClient.get<ObligationSummary>(
      "/contracts/obligations/summary/",
      orgHeader(orgId)
   )
   return resp.data
}

/*
 * Only `status` and `assigned_to` are writable — extraction owns an
 * obligation's content, people own who it belongs to and whether it is done.
 * **/
export async function updateObligation(
   obligationId: string,
   data: { status?: string; assigned_to?: string | null; due_date?: string | null }
) {
   const resp = await apiClient.patch<Obligation>(
      `/contracts/obligations/${obligationId}/`,
      data
   )
   return resp.data
}

/* -------------------------------------------------------------- events -- */

/*
 * Upcoming deadlines. The server filters on `action_by_date`, not `event_date`,
 * so a renewal 45 days out that needs 60 days notice does not appear here as
 * comfortably distant — it has already passed the point of being actionable.
 * **/
export async function getUpcomingEvents(days = 30, orgId?: string) {
   const resp = await apiClient.get<ContractEvent[]>("/contracts/events/upcoming/", {
      params: { days },
      ...orgHeader(orgId),
   })
   return resp.data
}

/* ------------------------------------------------------ counterparties -- */

export async function getCounterparties(page?: number, search?: string, orgId?: string) {
   const resp = await apiClient.get<CounterpartiesListResponse>("/contracts/counterparties/", {
      params: { ...(page && { page }), ...(search && { search }) },
      ...orgHeader(orgId),
   })
   return resp.data
}

export async function getCounterpartyContracts(counterpartyId: string) {
   const resp = await apiClient.get<ContractsListResponse>(
      `/contracts/counterparties/${counterpartyId}/contracts/`
   )
   return resp.data
}
