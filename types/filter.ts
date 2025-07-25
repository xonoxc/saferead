export interface FilterFieldOption {
  label: string
  value: string | number | boolean
}

export interface FilterField {
  key: string
  label: string
  type: "select" | "boolean" | "range" | "dateRange" | "text"
  icon?: React.ReactNode
  options?: FilterFieldOption[]
}

export interface BaseFilterOptions {
  created_at_gte?: string
  created_at_lte?: string
  ordering?: string
  search?: string
  updated_at?: string
  created_at?: string
}
