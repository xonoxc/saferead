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
