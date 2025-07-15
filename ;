import React, { useState } from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from "react-native"
import { ChevronDown, Check } from "lucide-react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants/Fonts"

export interface DropdownOption<T> {
  label: string
  value: T
  icon?: React.ReactNode
}

interface DropdownSelectorProps<T> {
  label?: string
  selected: T
  options: DropdownOption<T>[]
  onSelect: (value: T) => void
}

export function DropdownSelector<T>({
  label,
  selected,
  options,
  onSelect,
}: DropdownSelectorProps<T>) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === selected)

  return (
    <View style={{ marginBottom: 20 }}>
      {label && <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.card }]}
        onPress={() => setOpen(true)}
      >
        <View style={styles.row}>
          {selectedOption?.icon}
          <Text style={[styles.selectedText, { color: colors.text }]}>
            {selectedOption?.label || "Select..."}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(150)}
            style={[styles.modal, { backgroundColor: colors.card }]}
          >
            <FlatList
              data={options}
              keyExtractor={item => `${item.value}`}
              renderItem={({ item, index }) => {
                const isLast = index === options.length - 1

                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      !isLast ? { borderBottomColor: colors.border } : { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      onSelect(item.value)
                      setOpen(false)
                    }}
                  >
                    <View style={styles.row}>
                      {item.icon}
                      <Text style={[styles.optionText, { color: colors.text }]}>{item.label}</Text>
                    </View>
                    {selected === item.value && <Check size={20} color={colors.primary} />}
                  </TouchableOpacity>
                )
              }}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 8,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    borderRadius: 16,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
})
