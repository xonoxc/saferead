import {
  ChevronDown,
  FileLock2,
  FileText,
  FileType,
  LucideIcon,
  Scale,
  ShieldCheck,
} from "lucide-react-native"
import DropdownSelector, { renderIcon, type DropdownOption } from "../DropDownSelector"
import { StyleSheet, TouchableOpacity, Text, View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

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
  const { colors } = useTheme()

  return (
    <DropdownSelector
      selected={selectedType}
      options={documentTypeOptions}
      onSelect={onSelect}
      triggerText="Select Document Type"
      /* renderTrigger={(open, selectedOption) => {
        const Icon = (selectedOption?.icon ?? FileType) as LucideIcon

        return (
          <TouchableOpacity
            onPress={open}
            style={[
              styles.picker,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <View style={styles.pickerContent}>
              {renderIcon(Icon, colors, colors.card)}
              <Text style={[styles.pickerText, { color: colors.text }]}>Select Document Type</Text>
              <ChevronDown color={colors.accent} size={18} />
            </View>
          </TouchableOpacity>
        )
      }} */
    />
  )
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    padding: 14,
    marginBottom: 10,
    justifyContent: "center",
  },
  pickerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
})
