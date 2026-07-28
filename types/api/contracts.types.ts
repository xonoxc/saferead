/*
 * Response shapes for the obligation graph (`/contracts/*`).
 *
 * These mirror `contracts/serializers.py` field for field. Where the backend
 * uses `choices`, the union is spelled out rather than widened to `string` —
 * the whole reason this schema exists is that these values are queryable, and
 * a typo'd filter should fail at compile time rather than silently return an
 * empty list.
 * **/

import type { PaginatedResponse } from "./documents.types"

export type { PaginatedResponse }

/* ---------------------------------------------------------------- enums -- */

export const CONTRACT_TYPES = [
   "msa",
   "sow",
   "nda",
   "vendor",
   "employment",
   "lease",
   "other",
] as const
export type ContractType = (typeof CONTRACT_TYPES)[number]

/*
 * Phase 1 extracts four types only. Anything else is marked `unsupported`
 * rather than run through a taxonomy that does not fit it.
 * **/
export const SUPPORTED_CONTRACT_TYPES: ContractType[] = ["msa", "sow", "nda", "vendor"]

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
   msa: "Master Services Agreement",
   sow: "Statement of Work",
   nda: "Non-Disclosure Agreement",
   vendor: "Vendor Agreement",
   employment: "Employment Agreement",
   lease: "Lease",
   other: "Other",
}

/* Short forms for chips and dense list rows. */
export const CONTRACT_TYPE_SHORT: Record<ContractType, string> = {
   msa: "MSA",
   sow: "SOW",
   nda: "NDA",
   vendor: "Vendor",
   employment: "Employment",
   lease: "Lease",
   other: "Other",
}

export type ContractStatus = "draft" | "in_review" | "active" | "expired" | "terminated"

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
   draft: "Draft",
   in_review: "In review",
   active: "Active",
   expired: "Expired",
   terminated: "Terminated",
}

export type ExtractionStatus = "pending" | "processing" | "completed" | "failed" | "unsupported"

export const CLAUSE_TYPES = [
   "payment_terms",
   "ip_ownership",
   "liability",
   "indemnification",
   "termination",
   "confidentiality",
   "non_compete",
   "auto_renewal",
   "dispute_resolution",
   "warranty",
   "force_majeure",
   "assignment",
] as const
export type ClauseType = (typeof CLAUSE_TYPES)[number]

export const CLAUSE_TYPE_LABELS: Record<ClauseType, string> = {
   payment_terms: "Payment terms",
   ip_ownership: "IP ownership",
   liability: "Limitation of liability",
   indemnification: "Indemnification",
   termination: "Termination",
   confidentiality: "Confidentiality",
   non_compete: "Non-compete",
   auto_renewal: "Auto-renewal",
   dispute_resolution: "Dispute resolution",
   warranty: "Warranty",
   force_majeure: "Force majeure",
   assignment: "Assignment",
}

export type RiskLevel = "low" | "medium" | "high" | "critical"

export type ObligationDirection = "we_owe" | "they_owe"
export type ObligationType = "payment" | "deliverable" | "notice" | "renewal" | "restriction"
export type ObligationStatus = "pending" | "met" | "missed" | "waived"

export const OBLIGATION_TYPE_LABELS: Record<ObligationType, string> = {
   payment: "Payment",
   deliverable: "Deliverable",
   notice: "Notice",
   renewal: "Renewal",
   restriction: "Restriction",
}

export type EventType = "renewal" | "notice_deadline" | "payment_due" | "expiry"

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
   renewal: "Renewal",
   notice_deadline: "Notice deadline",
   payment_due: "Payment due",
   expiry: "Expiry",
}

export type ActionType =
   | "review"
   | "approve"
   | "reject"
   | "comment"
   | "renegotiate"
   | "renew"
   | "terminate"

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
   review: "Reviewed",
   approve: "Approved",
   reject: "Rejected",
   comment: "Commented",
   renegotiate: "Renegotiating",
   renew: "Renewed",
   terminate: "Terminated",
}

export type OrgRole = "owner" | "admin" | "member" | "viewer"

/* Roles allowed to change data, mirroring `Membership.WRITE_ROLES`. */
export const WRITE_ROLES: OrgRole[] = ["owner", "admin", "member"]
export const ADMIN_ROLES: OrgRole[] = ["owner", "admin"]

/* --------------------------------------------------------------- models -- */

export interface Organization {
   id: string
   name: string
   slug: string
   industry_code: string | null
   owner: string
   seat_count: number
   my_role: OrgRole | null
   contract_count?: number
   created_at: string
}

export interface Membership {
   id: string
   user: string
   username: string
   email: string
   role: OrgRole
   is_active: boolean
   created_at: string
}

export interface Counterparty {
   id: string
   display_name: string
   normalized_name: string
   aliases: string[]
   domain: string | null
   industry_code: string | null
   contract_count?: number
   created_at: string
}

export interface ContractClause {
   id: string
   clause_type: ClauseType
   clause_type_display: string
   extracted_text: string
   page_ref: number | null
   char_start: number | null
   char_end: number | null
   /*
    * False when the quoted span could not be re-found in the source document.
    * The finding is still shown, but it must be visibly marked — never
    * rendered as though it carried a citation it does not have.
    * **/
   span_verified: boolean
   risk_level: RiskLevel
   plain_english: string
   suggested_redline: string
   benchmark_percentile: number | null
   /* The clause type is absent from the contract. Often the real finding. */
   is_missing: boolean
   created_at: string
}

export interface Obligation {
   id: string
   contract: string
   contract_title: string
   counterparty_name: string | null
   source_clause: string | null
   direction: ObligationDirection
   obligation_type: ObligationType
   description: string
   amount: string | null
   currency: string
   due_date: string | null
   recurrence_rule: string
   status: ObligationStatus
   assigned_to: string | null
   assigned_to_username: string | null
   is_overdue: boolean
   created_at: string
   updated_at: string
}

export interface ContractEvent {
   id: string
   contract: string
   contract_title: string
   event_type: EventType
   event_date: string
   notice_days_required: number | null
   /*
    * When action must be taken, which is `event_date` minus the notice period.
    * This — not `event_date` — is the date a deadline list must sort and
    * filter on: a renewal 45 days out needing 60 days notice is already late.
    * **/
   action_by_date: string
   description: string
   alert_sent_at: string | null
   resolution: string | null
   is_unresolved: boolean
   created_at: string
}

export interface ContractAction {
   id: string
   contract: string
   actor: string | null
   actor_username: string | null
   action_type: ActionType
   notes: string
   clause: string | null
   created_at: string
}

export interface ContractListItem {
   id: string
   title: string
   contract_type: ContractType
   status: ContractStatus
   counterparty: string | null
   counterparty_name: string | null
   owner: string | null
   effective_date: string | null
   term_end_date: string | null
   total_value: string | null
   currency: string
   extraction_status: ExtractionStatus
   extraction_confidence: number | null
   clause_count?: number
   open_obligation_count?: number
   highest_risk: RiskLevel | null
   created_at: string
   updated_at: string
}

export interface ContractDetail extends ContractListItem {
   source_document: string | null
   extraction_model: string
   extraction_provider: string
   extraction_error: string
   extracted_at: string | null
   clauses: ContractClause[]
   obligations: Obligation[]
   events: ContractEvent[]
   actions: ContractAction[]
   missing_clause_types: ClauseType[]
   disclaimer: string
}

/* --------------------------------------------------------- aggregates --- */

export interface CurrencyTotal {
   currency: string
   amount: string
}

/*
 * Obligation money is denominated by the *contract*, not by the reader.
 * A €50,000 payable is €50,000 whatever currency the user prefers to browse
 * in, so these are never converted to the display currency — they are grouped
 * by their own currency instead. `*_total` is the largest single currency,
 * `*_currency` names it, and `*_is_mixed` says whether there is more behind it.
 * **/
export interface ObligationSummary {
   we_owe_total: string
   we_owe_currency: string
   we_owe_is_mixed: boolean
   we_owe_breakdown: CurrencyTotal[]
   they_owe_total: string
   they_owe_currency: string
   they_owe_is_mixed: boolean
   they_owe_breakdown: CurrencyTotal[]
   overdue_count: number
   due_next_30_days: number
   /* An obligation nobody owns is an invitation to add a seat. */
   unassigned_count: number
   by_status: Partial<Record<ObligationStatus, number>>
}

export interface OrgStats {
   seat_count: number
   contract_count: number
   extracted_count: number
   counterparty_count: number
   open_obligations: number
   overdue_obligations: number
   expiring_90_days: number
   critical_clauses: number
   actions_last_30_days: number
}

/* ------------------------------------------------------------ requests -- */

export interface CreateContractRequest {
   title: string
   contract_type?: ContractType
   status?: ContractStatus
   source_document?: string
   counterparty?: string
   counterparty_name?: string
   effective_date?: string
   term_end_date?: string
   total_value?: string
   currency?: string
}

export interface LogActionRequest {
   action_type: ActionType
   notes?: string
   clause?: string
   /* Closes the alert that prompted this work. */
   resolves_event?: string
}

export interface ContractFilterOptions {
   contract_type?: ContractType
   status?: ContractStatus
   counterparty?: string
   search?: string
   ordering?: string
}

export type ContractsListResponse = PaginatedResponse<ContractListItem>
export type ObligationsListResponse = PaginatedResponse<Obligation>
export type CounterpartiesListResponse = PaginatedResponse<Counterparty>
export type OrganizationsListResponse = PaginatedResponse<Organization>
