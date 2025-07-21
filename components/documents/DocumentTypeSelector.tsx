import { FileLock2, FileText, Scale, ShieldCheck } from "lucide-react-native"
import DropdownSelector, { type DropdownOption } from "../DropDownSelector"
//import { StyleSheet } from "react-native"
//import { Fonts, FontSizes } from "@/constants"

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

/* const styles = StyleSheet.create({
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
}) */
