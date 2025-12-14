import { FileLock2, FileText, Scale, ShieldCheck } from "lucide-react-native"
import DropdownSelector, { type DropdownOption } from "../DropDownSelector"
import { type ColorsType, useTheme } from "@/hooks/useTheme"

export type DocumentType = "terms" | "privacy" | "legal" | "other"

export interface DocumentTypeSelectorProps {
   selectedType: DocumentType
   onSelect: (type: DocumentType) => void
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
   selectedType,
   onSelect,
}) => {
   const { colors } = useTheme()
   return (
      <DropdownSelector
         selected={selectedType}
         selectorStyles={{
            borderRadius: 24,
            backgroundColor: colors.background,
         }}
         options={getSelectorOptions(colors)}
         onSelect={onSelect}
         triggerText="Select Document Type"
      />
   )
}

function getSelectorOptions(
   colors: ColorsType,
   modifiedIconColor?: string
): DropdownOption<DocumentType>[] {
   const iconColor = modifiedIconColor || colors.textMuted

   return [
      {
         value: "terms",
         label: "Terms & Conditions",
         icon: <ShieldCheck size={20} color={iconColor} />,
      },
      {
         value: "privacy",
         label: "Privacy Policy",
         icon: <FileLock2 size={20} color={iconColor} />,
      },
      {
         value: "legal",
         label: "Legal Agreement",
         icon: <Scale size={20} color={iconColor} />,
      },
      {
         value: "other",
         label: "Other Document",
         icon: <FileText size={20} color={iconColor} />,
      },
   ]
}
