import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native"
import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated"
import Animated from "react-native-reanimated"
import type { LucideIcon } from "lucide-react-native"
import { colors_palette, iconOptions, privacyOptions } from "@/constants/spaceform"
import useCreateSpaceForm from "@/hooks/screens/useCreateSpaceForm"
import { Controller } from "react-hook-form"

export const CreateSpaceForm = ({
  onCreate,
  onCancel,
}: {
  onCreate: (
    title: string,
    desc: string,
    color: string,
    icon: LucideIcon,
    privacy: "private" | "public",
    is_favorite: boolean
  ) => void
  onCancel: () => void
}) => {
  const { colors } = useTheme()
  const { control, handleFormSubmit, handleSubmit } = useCreateSpaceForm({
    onCreate,
  })

  return (
    <Animated.View
      entering={SlideInDown.duration(200).easing(Easing.out(Easing.exp))}
      exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.exp))}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create New Space</Text>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          bounces={true}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Space Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter name"
              />
            )}
          />
          <Controller
            control={control}
            name="desc"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Description (Optional)"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
              />
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Choose Color</Text>
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <View style={styles.grid}>
                {colors_palette.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.color, { backgroundColor: c }, c === value && styles.selected]}
                    onPress={() => onChange(c)}
                  />
                ))}
              </View>
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Choose Icon</Text>
          <Controller
            control={control}
            name="icon"
            render={({ field: { onChange, value } }) => (
              <View style={styles.grid}>
                {iconOptions.map((IconComp, index) => {
                  const isSelected = IconComp === value
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.icon,
                        {
                          backgroundColor: isSelected ? colors.primary + "20" : colors.surface,
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => onChange(IconComp)}
                    >
                      <IconComp size={24} color={colors.text} />
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Privacy</Text>
          <Controller
            control={control}
            name="privacy"
            render={({ field: { onChange, value } }) => (
              <View style={styles.privacyContainer}>
                {privacyOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.privacyOption,
                      {
                        backgroundColor: value === option ? colors.primary : colors.surface,
                      },
                    ]}
                    onPress={() => onChange(option as "private" | "public")}
                  >
                    <Text
                      style={{
                        color: value === option ? colors.card : colors.text,
                        fontFamily: Fonts.medium,
                      }}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />

          <Controller
            control={control}
            name="is_favorite"
            render={({ field: { onChange, value } }) => (
              <View style={styles.favoriteContainer}>
                <Text style={[styles.label, { color: colors.text, marginTop: 0 }]}>
                  Add to Favorites
                </Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: colors.surface, true: colors.primary }}
                  thumbColor={colors.card}
                />
              </View>
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Create Space"
            onPress={handleFormSubmit(handleSubmit)}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
  },
  cancel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#FFF",
    elevation: 4,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  privacyContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  privacyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    alignItems: "center",
  },
  favoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
})
