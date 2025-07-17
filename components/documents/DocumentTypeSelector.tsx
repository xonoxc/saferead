import { DropdownSelector, DropdownOption } from "../DropDownSelector"

export type DocumentType = "terms" | "privacy" | "legal" | "other"

interface DocumentTypeSelectorProps {
  selectedType: DocumentType
  onSelect: (type: DocumentType) => void
}

const documentTypeOptions: DropdownOption<DocumentType>[] = [
  { value: "terms", label: "Terms & Conditions" },
  { value: "privacy", label: "Privacy Policy" },
  { value: "legal", label: "Legal Agreement" },
  { value: "other", label: "Other Document" },
]

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <DropdownSelector
      label="Document Type"
      selected={selectedType}
      options={documentTypeOptions}
      onSelect={onSelect}
    />
  )
}
