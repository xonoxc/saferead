import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { Check, ChevronDown } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export type DocumentType = 'terms' | 'privacy' | 'legal' | 'other'

interface DocumentTypeOption {
  value: DocumentType
  label: string
}

const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: 'terms', label: 'Terms & Conditions' },
  { value: 'privacy', label: 'Privacy Policy' },
  { value: 'legal', label: 'Legal Agreement' },
  { value: 'other', label: 'Other Document' },
]

interface DocumentTypeSelectorProps {
  selectedType: DocumentType
  onSelect: (type: DocumentType) => void
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = DOCUMENT_TYPES.find(type => type.value === selectedType)

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Document Type</Text>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.selectedText, { color: colors.text }]}>
          {selectedOption?.label || 'Select document type'}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Document Type</Text>
            {DOCUMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[styles.option, { borderBottomColor: colors.border }]}
                onPress={() => {
                  onSelect(type.value)
                  setIsOpen(false)
                }}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{type.label}</Text>
                {selectedType === type.value && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
})