import React, { useState } from "react"
import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   FlatList,
   ActivityIndicator,
   StyleSheet,
   type StyleProp,
   type ViewStyle,
   type TextStyle,
} from "react-native"
import { ChevronDown, Check, Dot, type LucideIcon } from "lucide-react-native"
import { type ColorsType, useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

export interface DropdownOption<T> {
   label: string
   value: T
   icon?: LucideIcon | React.ReactNode
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
   ) => React.ReactElement | null

   triggerText?: string
   triggerTextStyles?: StyleProp<TextStyle>
   selectorStyles?: StyleProp<ViewStyle>
}

export default function DropdownSelector<T>({
   label,
   selected,
   options,
   onSelect,
   renderTrigger,
   renderOption,
   loading = false,
   triggerText,

   triggerTextStyles,
   selectorStyles = {},
}: DropdownSelectorProps<T>) {
   const { colors } = useTheme()
   const [open, setOpen] = useState(false)

   const selectedOption = options.find(opt => opt.value === selected)

   return (
      <View style={{ marginBottom: 20 }}>
         {label && <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>}

         <DropdownTrigger
            selectedOption={selectedOption}
            onOpen={() => setOpen(true)}
            renderTrigger={renderTrigger}
            triggerTextStyles={triggerTextStyles}
            selectorStyles={selectorStyles}
            triggerText={triggerText}
         />

         <Modal
            transparent
            visible={open}
            animationType="slide"
            onRequestClose={() => setOpen(false)}
         >
            <DropdownSheet
               open={open}
               onClose={() => setOpen(false)}
               options={options}
               selected={selected}
               onSelect={onSelect}
               loading={loading}
               renderOption={renderOption}
            />
         </Modal>
      </View>
   )
}

/*
 *
 * Dropdown Trigger Component
 * **/
function DropdownTrigger<T>({
   selectedOption,
   onOpen,
   renderTrigger,
   triggerText,
   triggerTextStyles,
   selectorStyles,
}: {
   selectedOption?: DropdownOption<T>
   onOpen: () => void
   renderTrigger?: (open: () => void, selectedOption?: DropdownOption<T>) => React.ReactNode
   triggerText?: string
   triggerTextStyles?: StyleProp<TextStyle>
   selectorStyles: StyleProp<ViewStyle>
}) {
   const { colors } = useTheme()

   if (renderTrigger) return <>{renderTrigger(onOpen, selectedOption)}</>

   return (
      <TouchableOpacity
         onPress={onOpen}
         style={[
            styles.selector,
            { backgroundColor: colors.card, borderColor: colors.border },
            selectorStyles,
         ]}
      >
         <View style={styles.row}>
            {renderIcon(selectedOption?.icon, colors)}
            <Text style={[styles.selectedText, { color: colors.text }, triggerTextStyles]}>
               {selectedOption?.label || triggerText || "Select an option"}
            </Text>
         </View>
         <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>
   )
}

/*
 *
 * The actual  sheet component
 * **/
function DropdownSheet<T>({
   options,
   selected,
   onSelect,
   renderOption,
   onClose,
   loading,
}: {
   options: DropdownOption<T>[]
   selected: T
   onSelect: (val: T) => void
   renderOption?: (
      option: DropdownOption<T>,
      isSelected: boolean,
      onSelect: () => void
   ) => React.ReactElement | null
   onClose: () => void
   open: boolean
   loading?: boolean
}) {
   const { colors } = useTheme()

   const lastOptionIndex = options.length - 1

   return (
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1}>
         <TouchableOpacity
            style={[
               styles.sheet,
               {
                  backgroundColor: colors.card,
                  borderTopColor: colors.border,
                  shadowColor: colors.shadow,
               },
            ]}
            activeOpacity={1}
         >
            {loading ? (
               <ActivityIndicator color={colors.primary} />
            ) : (
               <FlatList
                  data={options}
                  keyExtractor={(item, i) => `${item.label}-${i}`}
                  renderItem={({ item, index }) => {
                     const isSelected = item.value === selected
                     const isLast = index === lastOptionIndex

                     const handleSelect = () => {
                        onSelect(item.value)
                        onClose()
                     }

                     if (renderOption) {
                        return renderOption(item, isSelected, handleSelect) as React.ReactElement
                     }

                     return (
                        <TouchableOpacity
                           onPress={handleSelect}
                           style={[
                              styles.option,
                              {
                                 borderColor: !isLast ? colors.border : "transparent",
                              },
                           ]}
                        >
                           <View style={styles.row}>
                              {renderIcon(item.icon, colors)}
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
         </TouchableOpacity>
      </TouchableOpacity>
   )
}

/*
 *
 * Utility function to render icons
 * **/
export function renderIcon(
   icon: LucideIcon | React.ReactNode,
   colors: ColorsType,
   fallbackColor?: string
) {
   if (React.isValidElement(icon)) return icon

   const IconComponent = (icon ?? Dot) as LucideIcon
   const iconColor = fallbackColor ?? colors.accent

   return <IconComponent size={20} color={iconColor} style={{ marginRight: 8 }} />
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
   },
   selectedText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      marginLeft: 8,
   },
   row: {
      flexDirection: "row",
      alignItems: "center",
   },
   backdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "transparent",
   },
   sheet: {
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "50%",
      elevation: 10,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
   },
   option: {
      paddingVertical: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
   },
   optionText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      marginLeft: 8,
   },
})
