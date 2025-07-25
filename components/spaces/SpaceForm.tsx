import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native"
import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { colors_palette } from "@/constants/spaceform"
import SpaceIconSelector from "./SpaceIconSelector"
import { Controller, useWatch } from "react-hook-form"
import { Drawer } from "../Drawer"
import { Space } from "@/types"
import { useSpaceHookForm, SpaceFormData } from "@/hooks/forms/useSpaceHookForm"
import SpacePrivacySelector from "./SpacePrivacySelector"

export const SpaceForm = ({
  onCreate,
  onCancel,
  space,
  useDrawer,
}: {
  onCreate: (data: SpaceFormData) => Promise<void>
  onCancel: () => void
  space?: Space
  useDrawer?: boolean
}) => {
  const { colors } = useTheme()

  const isUpdateMode = !!space

  const { control, handleSubmit, formState } = useSpaceHookForm({
    mode: isUpdateMode ? "update" : "create",
    onSubmit: async (data: SpaceFormData) => {
      await onCreate(data)
    },
    defaultValues: {
      title: space?.title ?? "",
      description: space?.description ?? "",
      color: space?.color ?? colors_palette[0],
      icon: space?.icon ?? "space",
      privacy: space?.privacy ?? "private",
      is_favorite: space?.is_favorite ?? false,
    },
  })

  const selectedColor = useWatch({ control, name: "color" }) ?? colors.text

  return (
    <Drawer enableAbsolute={useDrawer} visible>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isUpdateMode ? "Update Space" : "Create New Space"}
          </Text>
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
                error={formState.errors.title?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Description"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
                error={formState.errors.description?.message}
              />
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Choose Color</Text>
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <View style={styles.colorGridContainer}>
                <View style={styles.grid}>
                  {colors_palette.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.color, { backgroundColor: c }, c === value && styles.selected]}
                      onPress={() => onChange(c)}
                    />
                  ))}
                </View>
              </View>
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Choose Icon</Text>

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <SpaceIconSelector field={field} selectedColor={selectedColor} />
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Privacy</Text>
          <Controller
            control={control}
            name="privacy"
            render={({ field }) => <SpacePrivacySelector field={field} />}
          />

          <Controller
            control={control}
            name="is_favorite"
            render={({ field: { onChange, value } }) => (
              <View style={styles.favoriteContainer}>
                <View style={styles.favouriteContainerChild}>
                  <Text style={[styles.label, { color: colors.text, marginTop: 0 }]}>
                    Faourite Space ?
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: colors.accent, true: colors.primary }}
                    thumbColor={value ? colors.surface : colors.text}
                  />
                </View>
              </View>
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={
              formState.isSubmitting
                ? isUpdateMode
                  ? "Updating..."
                  : "Creating..."
                : isUpdateMode
                  ? "Update Space"
                  : "Create Space"
            }
            onPress={handleSubmit}
            disabled={formState.isSubmitting}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40, flexDirection: "column" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 10,
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
  colorGridContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  favoriteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  favouriteContainerChild: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
})
