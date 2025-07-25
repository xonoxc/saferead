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
    type: "text",
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
      { label: "PDF", value: "pdf" },
      { label: "Word", value: "word" },
      { label: "Spreadsheet", value: "spreadsheet" },
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
    type: "text",
  },
]
