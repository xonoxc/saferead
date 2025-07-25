import type { FilterField } from "@/types/filter"

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
