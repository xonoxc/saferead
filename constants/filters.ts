import type { FilterField } from "@/types/filter"

/*
 * Contracts filters.
 *
 * Contract *type* is deliberately absent: it already has a chip row above the
 * list, and offering the same filter twice lets the two disagree. Only the
 * fields the DRF viewset actually accepts are listed - `status`,
 * `extraction_status` and `ordering` - so nothing here silently no-ops.
 * **/
export const contractFilterFields: FilterField[] = [
   {
      key: "status",
      label: "Status",
      type: "select",
      options: [
         { value: "", label: "Any status" },
         { value: "draft", label: "Draft" },
         { value: "in_review", label: "In review" },
         { value: "active", label: "Active" },
         { value: "expired", label: "Expired" },
         { value: "terminated", label: "Terminated" },
      ],
   },
   {
      key: "extraction_status",
      label: "Analysis",
      type: "select",
      options: [
         { value: "", label: "Any" },
         { value: "completed", label: "Analysed" },
         { value: "processing", label: "Analysing" },
         { value: "pending", label: "Queued" },
         { value: "failed", label: "Failed" },
         { value: "unsupported", label: "Not supported" },
      ],
   },
   {
      key: "ordering",
      label: "Sort by",
      type: "select",
      options: [
         { value: "-created_at", label: "Newest first" },
         { value: "created_at", label: "Oldest first" },
         { value: "term_end_date", label: "Ending soonest" },
         { value: "-total_value", label: "Highest value" },
      ],
   },
]

/*
 *
 * this is a like a config for the spaces filters
 * **/
export const spaceFilterFields: FilterField[] = [
   {
      key: "is_active",
      label: "Active",
      type: "boolean",
      options: [
         { label: "Yes", value: true },
         { label: "No", value: false },
      ],
   },
   {
      key: "is_favorite",
      label: "Favorite",
      type: "boolean",
      options: [
         { label: "Yes", value: true },
         { label: "No", value: false },
      ],
   },
   {
      key: "privacy",
      label: "Privacy",
      type: "select",
      options: [
         { label: "Public", value: "public" },
         { label: "Private", value: "private" },
      ],
   },
   {
      key: "created_at",
      label: "Created Date",
      type: "dateRange",
   },
   {
      key: "ordering",
      label: "Sort by",
      type: "select", // ← changed from "text"
      options: [
         { label: "Recently Created", value: "-created_at" },
         { label: "A-Z", value: "name" },
      ],
   },
]

/*
 *
 * this is a like a config for the document filters
 * **/
export const documentFilterFields: FilterField[] = [
   {
      key: "title",
      label: "Search Title",
      type: "text",
   },
   {
      key: "type",
      label: "Document Type",
      type: "select",
      options: [
         { value: "", label: "All Types" },
         { value: "terms", label: "Terms & Conditions" },
         { value: "privacy", label: "Privacy Policy" },
         { value: "legal", label: "Legal Agreement" },
         { value: "other", label: "Other Document" },
      ],
   },
   {
      key: "status",
      label: "Status",
      type: "select",
      options: [
         { value: "", label: "All Status" },
         { value: "completed", label: "Completed" },
         { value: "processing", label: "Processing" },
         { value: "failed", label: "Failed" },
      ],
   },
   {
      key: "updated_at",
      label: "Last Updated",
      type: "dateRange",
   },
   {
      key: "is_archived",
      label: "Archived?",
      type: "boolean",
      options: [
         { label: "Yes", value: true },
         { label: "No", value: false },
      ],
   },
   {
      key: "ordering",
      label: "Sort By",
      type: "select",
      options: [
         { value: "-created_at", label: "Newest First" },
         { value: "created_at", label: "Oldest First" },
         { value: "-confidence_score", label: "Highest Confidence" },
         { value: "confidence_score", label: "Lowest Confidence" },
         { value: "-processed_at", label: "Recently Processed" },
         { value: "processed_at", label: "Oldest Processed" },
      ],
   },
]
