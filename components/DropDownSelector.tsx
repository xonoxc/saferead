import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native"
import { ChevronDown, Check, LucideIcon, Dot } from "lucide-react-native"
import Animated from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants"

export interface DropdownOption<T> {
  label: string
  value: T
  icon?: LucideIcon
}

interface DropdownSelectorProps<T> {
  label?: string
  selected: T
  options: DropdownOption<T>[]
  onSelect: (value: T) => void

  loading?: boolean
  renderTrigger?: (open: () => void, selectedOption?: DropdownOption<T>) => React.ReactNode
  renderOption?: (
    option: DropdownOption<T>,
    isSelected: boolean,
    onSelect: () => void
  ) => React.ReactNode | null

  containerStyle?: ViewStyle
  labelStyle?: TextStyle
}

export function DropdownSelector<T>({
  label,
  selected,
  options,
  onSelect,

  loading = false,
  renderTrigger,
  renderOption,

  containerStyle,
  labelStyle,
}: DropdownSelectorProps<T>) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === selected)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const SelectedIcon = selectedOption?.icon || Check

  return (
    <View style={[{ marginBottom: 20 }, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textMuted }, labelStyle]}>{label}</Text>
      )}

      {renderTrigger ? (
        renderTrigger(handleOpen, selectedOption)
      ) : (
        <TouchableOpacity
          style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={handleOpen}
        >
          <View style={styles.row}>
            <SelectedIcon />
            <Text style={[styles.selectedText, { color: colors.text }]}>
              {selectedOption?.label || "Select..."}
            </Text>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      <Modal transparent visible={open} animationType="fade" onRequestClose={handleClose}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
          <Animated.View style={[styles.modal, { backgroundColor: colors.card }]}>
            {loading ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <FlatList
                data={options}
                keyExtractor={item => `${item.value}`}
                bounces
                renderItem={({ item, index }): React.ReactElement | null => {
                  const isSelected = item.value === selected
                  const onItemSelect = () => {
                    onSelect(item.value)
                    handleClose()
                  }

                  const ItemIcon = item.icon || Dot

                  if (renderOption) {
                    const result = renderOption(
                      item,
                      isSelected,
                      onItemSelect
                    ) as React.ReactElement | null
                    return result ?? null
                  }

                  const isLast = index === options.length - 1
                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        !isLast ? { borderBottomColor: colors.border } : { borderBottomWidth: 0 },
                      ]}
                      onPress={onItemSelect}
                    >
                      <View style={styles.row}>
                        <ItemIcon size={20} color={colors.text} style={{ marginRight: 8 }} />
                        <Text style={[styles.optionText, { color: colors.text }]}>
                          {item.label}
                        </Text>
                      </View>
                      {isSelected && <Check size={20} color={colors.primary} />}
                    </TouchableOpacity>
                  )
                }}
              />
            )}
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
    padding: 17,
    borderWidth: 1,
    borderRadius: 20,
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
    width: "90%",
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
