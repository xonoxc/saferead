import React, { useState } from "react"
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"

import { SelectField } from "./SelectField"
import { TextSearchField } from "./TextSearchField"
import { DateRangeField } from "./DateRangeField"
import { FilterHeader } from "./FilterSectionHeader"
import { Fonts, FontSizes } from "@/constants"

import type { FilterField } from "@/types/filter"

interface UniversalFilterProps {
   visible: boolean
   onClose: () => void
   onApply: (filters: Record<string, any>) => void
   currentFilters: Record<string, any>
   fields: FilterField[]
}

export const UniversalFilter = ({
   visible,
   onClose,
   onApply,
   currentFilters,
   fields,
}: UniversalFilterProps) => {
   const { colors } = useTheme()
   const [filters, setFilters] = useState(currentFilters)

   const updateFilter = (key: string, value: any) => {
      setFilters(prev => ({
         ...prev,
         [key]: value,
      }))
   }

   const handleApply = () => {
      onApply(filters)
      onClose()
   }

   const handleReset = () => {
      setFilters({})
      onApply({})
      onClose()
   }

   return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
         <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FilterHeader title="Filter" onClose={onClose} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
               {fields.map(field => {
                  switch (field.type) {
                     case "select":
                     case "boolean":
                        return (
                           <SelectField
                              key={field.key}
                              field={field}
                              value={filters[field.key]}
                              onChange={(val: any) => updateFilter(field.key, val)}
                           />
                        )
                     case "dateRange":
                        return (
                           <DateRangeField
                              key={field.key}
                              field={field}
                              from={filters[`${field.key}_gte`]}
                              to={filters[`${field.key}_lte`]}
                              onChange={(from: string, to: string) => {
                                 updateFilter(`${field.key}_gte`, from)
                                 updateFilter(`${field.key}_lte`, to)
                              }}
                           />
                        )
                     case "text":
                        return (
                           <TextSearchField
                              key={field.key}
                              field={field}
                              value={filters[field.key]}
                              onChange={(val: string) => updateFilter(field.key, val)}
                           />
                        )
                     default:
                        return null
                  }
               })}
            </ScrollView>

            <View style={styles.actions}>
               <TouchableOpacity
                  onPress={handleReset}
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
               >
                  <Text style={[styles.actionBtnText, { color: colors.background }]}>Reset</Text>
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={handleApply}
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
               >
                  <Text style={[styles.actionBtnText, { color: colors.background }]}>Apply</Text>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
   },
   title: {
      fontSize: 20,
      fontWeight: "600",
   },
   content: {
      flex: 1,
      padding: 20,
   },
   actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      gap: 12,
   },
   actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
   },
   actionBtnText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
   },
})
