import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native"
import { Filter, X, Calendar, TrendingUp, FileText, Clock } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { TextInput } from "@/components/TextInput"
import {
  Fonts,
  FontSizes,
  DOCUMENT_TYPE_OPTIONS,
  DOCUMENT_FILTER_STATUS_OPTIONS,
  DOCUMENTS_ORDERING_OPTIONS,
} from "@/constants"
import { FilterOptions } from "@/types/docs"

interface DocumentFilterProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

export const DocumentFilter = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}: DocumentFilterProps) => {
  const { colors } = useTheme()
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      ordering: "-created_at",
    }
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const statusFilterProps = { filters, updateFilter }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Filter Documents</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <StatusFilter {...statusFilterProps} />
          <DocumentTypeFilter {...statusFilterProps} />
          <ConfidenceScoreFilter {...statusFilterProps} />
          <DateRangeFilter {...statusFilterProps} />
          <SortOrder {...statusFilterProps} />
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
            <Text style={[styles.actionBtnText, { color: colors.background }]}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function DocumentTypeFilter({
  filters,
  updateFilter,
}: {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
}) {
  const { colors } = useTheme()
  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <FileText size={20} color={colors.primary} />
        <Text style={[styles.filterTitle, { color: colors.text }]}>Document Type</Text>
      </View>
      <View style={styles.optionsGrid}>
        {DOCUMENT_TYPE_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  filters.document_type === option.value ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => updateFilter("document_type", option.value)}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: filters.document_type === option.value ? colors.background : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

function StatusFilter({
  filters,
  updateFilter,
}: {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
}) {
  const { colors } = useTheme()
  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Clock size={20} color={colors.primary} />
        <Text style={[styles.filterTitle, { color: colors.text }]}>Status</Text>
      </View>
      <View style={styles.optionsGrid}>
        {DOCUMENT_FILTER_STATUS_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              {
                backgroundColor: filters.status === option.value ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => updateFilter("status", option.value)}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: filters.status === option.value ? colors.background : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

function ConfidenceScoreFilter({
  filters,
  updateFilter,
}: {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
}) {
  const { colors } = useTheme()
  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <TrendingUp size={20} color={colors.primary} />
        <Text style={[styles.filterTitle, { color: colors.text }]}>Confidence Score</Text>
      </View>
      <View style={styles.rangeContainer}>
        <View style={styles.rangeInput}>
          <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>Min %</Text>
          <TextInput
            value={filters.confidence_score_gte?.toString() || ""}
            onChangeText={text =>
              updateFilter("confidence_score_gte", text ? parseFloat(text) / 100 : undefined)
            }
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rangeInput}>
          <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>Max %</Text>
          <TextInput
            value={
              filters.confidence_score_lte?.toString()
                ? (filters.confidence_score_lte * 100).toString()
                : ""
            }
            onChangeText={text =>
              updateFilter("confidence_score_lte", text ? parseFloat(text) / 100 : undefined)
            }
            placeholder="100"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  )
}

function DateRangeFilter({
  filters,
  updateFilter,
}: {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
}) {
  const { colors } = useTheme()
  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Calendar size={20} color={colors.primary} />
        <Text style={[styles.filterTitle, { color: colors.text }]}>Date Range</Text>
      </View>
      <View style={styles.rangeContainer}>
        <View style={styles.rangeInput}>
          <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>From</Text>
          <TextInput
            value={filters.created_at_gte || ""}
            onChangeText={text => updateFilter("created_at_gte", text)}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={styles.rangeInput}>
          <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>To</Text>
          <TextInput
            value={filters.created_at_lte || ""}
            onChangeText={text => updateFilter("created_at_lte", text)}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
    </View>
  )
}

/*
 *
 * SortOrder Component
 * **/
function SortOrder({
  filters,
  updateFilter,
}: {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
}) {
  const { colors } = useTheme()

  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Filter size={20} color={colors.primary} />
        <Text style={[styles.filterTitle, { color: colors.text }]}>Sort Order</Text>
      </View>
      <View style={styles.optionsGrid}>
        {DOCUMENTS_ORDERING_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              {
                backgroundColor: filters.ordering === option.value ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => updateFilter("ordering", option.value)}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: filters.ordering === option.value ? colors.background : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
    paddingTop: 20,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.semiBold,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  filterTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
  },
  rangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xs,
  },
})
