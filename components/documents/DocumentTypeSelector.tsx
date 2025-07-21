import { FileLock2, FileText, Scale, ShieldCheck } from "lucide-react-native"
import DropdownSelector, { type DropdownOption } from "../DropDownSelector"

export type DocumentType = "terms" | "privacy" | "legal" | "other"

interface DocumentTypeSelectorProps {
  selectedType: DocumentType
  onSelect: (type: DocumentType) => void
}

const documentTypeOptions: DropdownOption<DocumentType>[] = [
  {
    value: "terms",
    label: "Terms & Conditions",
    icon: <ShieldCheck />,
  },
  {
    value: "privacy",
    label: "Privacy Policy",
    icon: <FileLock2 />,
  },
  {
    value: "legal",
    label: "Legal Agreement",
    icon: <Scale />,
  },
  {
    value: "other",
    label: "Other Document",
    icon: <FileText />,
  },
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
