import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native"
import { Filter, X, Calendar, TrendingUp, FileText, Clock } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"

export interface FilterOptions {
  status?: string
  document_type?: string
  confidence_score_gte?: number
  confidence_score_lte?: number
  created_at_gte?: string
  created_at_lte?: string
  ordering?: string
  search?: string
}

interface DocumentFilterProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
]

const DOCUMENT_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'terms', label: 'Terms & Conditions' },
  { value: 'privacy', label: 'Privacy Policy' },
  { value: 'legal', label: 'Legal Agreement' },
  { value: 'other', label: 'Other Document' },
]

const ORDERING_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'created_at', label: 'Oldest First' },
  { value: '-confidence_score', label: 'Highest Confidence' },
  { value: 'confidence_score', label: 'Lowest Confidence' },
  { value: '-processed_at', label: 'Recently Processed' },
  { value: 'processed_at', label: 'Oldest Processed' },
]

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const { colors } = useTheme()
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      ordering: '-created_at',
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
          {/* Status Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Clock size={20} color={colors.primary} />
              <Text style={[styles.filterTitle, { color: colors.text }]}>Status</Text>
            </View>
            <View style={styles.optionsGrid}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: filters.status === option.value ? colors.primary : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => updateFilter('status', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: filters.status === option.value ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Document Type Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <FileText size={20} color={colors.primary} />
              <Text style={[styles.filterTitle, { color: colors.text }]}>Document Type</Text>
            </View>
            <View style={styles.optionsGrid}>
              {DOCUMENT_TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: filters.document_type === option.value ? colors.primary : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => updateFilter('document_type', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: filters.document_type === option.value ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Confidence Score Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={[styles.filterTitle, { color: colors.text }]}>Confidence Score</Text>
            </View>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeInput}>
                <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>Min %</Text>
                <TextInput
                  value={filters.confidence_score_gte?.toString() || ''}
                  onChangeText={(text) => updateFilter('confidence_score_gte', text ? parseFloat(text) / 100 : undefined)}
                  placeholder="0"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={styles.rangeInput}>
                <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>Max %</Text>
                <TextInput
                  value={filters.confidence_score_lte?.toString() ? (filters.confidence_score_lte * 100).toString() : ''}
                  onChangeText={(text) => updateFilter('confidence_score_lte', text ? parseFloat(text) / 100 : undefined)}
                  placeholder="100"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={[styles.filterTitle, { color: colors.text }]}>Date Range</Text>
            </View>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeInput}>
                <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>From</Text>
                <TextInput
                  value={filters.created_at_gte || ''}
                  onChangeText={(text) => updateFilter('created_at_gte', text)}
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                />
              </View>
              <View style={styles.rangeInput}>
                <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>To</Text>
                <TextInput
                  value={filters.created_at_lte || ''}
                  onChangeText={(text) => updateFilter('created_at_lte', text)}
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          {/* Sort Order */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Filter size={20} color={colors.primary} />
              <Text style={[styles.filterTitle, { color: colors.text }]}>Sort Order</Text>
            </View>
            <View style={styles.optionsGrid}>
              {ORDERING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: filters.ordering === option.value ? colors.primary : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => updateFilter('ordering', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: filters.ordering === option.value ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title="Reset"
            onPress={handleReset}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            style={styles.actionButton}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    flexDirection: 'row',
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
  input: {
    minHeight: 40,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
})