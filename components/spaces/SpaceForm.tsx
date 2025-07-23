import React, { useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native"
import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { colors_palette, iconMap } from "@/constants/spaceform"
import { Controller, ControllerRenderProps, useWatch } from "react-hook-form"
import { Globe, LockIcon } from "lucide-react-native"
import { Drawer } from "../Drawer"
import { Space } from "@/types"
import { useSpaceHookForm, SpaceFormData } from "@/hooks/forms/useSpaceHookForm"
import { useSlidingSelector } from "@/hooks/animation/useSlidingSelector"

export const SpaceForm = ({
  onCreate,
  onCancel,
  space,
}: {
  onCreate: (data: SpaceFormData) => Promise<void>
  onCancel: () => void
  space?: Space
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
    <Drawer>
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
            render={({ field }) => <IconSelector field={field} selectedColor={selectedColor} />}
          />

          <Text style={[styles.label, { color: colors.text }]}>Privacy</Text>
          <Controller
            control={control}
            name="privacy"
            render={({ field }) => <PrivacySelector field={field} />}
          />

          <Controller
            control={control}
            name="is_favorite"
            render={({ field: { onChange, value } }) => (
              <View style={styles.favoriteContainer}>
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

interface IConSelectorProps {
  field: ControllerRenderProps<any, "icon">
  selectedColor: string
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const IconSelector = ({ selectedColor, field: { onChange, value } }: IConSelectorProps) => {
  const { colors } = useTheme()

  return (
    <View style={styles.grid}>
      {Object.entries(iconMap).map(([IconName, Icon]) => {
        const isSelected = value === IconName

        return (
          <AnimatedTouchableOpacity
            key={IconName}
            style={[
              styles.icon,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderRadius: isSelected ? 35 : 16,
                borderColor: isSelected ? colors.card : "transparent",
                borderWidth: 2,
              },
            ]}
            onPress={() => {
              onChange(IconName)
            }}
          >
            <Icon size={24} color={isSelected ? colors.background : selectedColor} />
          </AnimatedTouchableOpacity>
        )
      })}
    </View>
  )
}

interface PrivacySelectorProps {
  field: ControllerRenderProps<any, "privacy">
}

const PrivacySelector: React.FC<PrivacySelectorProps> = ({ field: { value, onChange } }) => {
  const { colors } = useTheme()
  const options = ["private", "public"]
  const index = options.indexOf(value)
  const bgStyle = useSlidingSelector(index, index * 160)

  return (
    <View style={[styles.privacyContainer, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            width: "50%",
            height: "100%",
            backgroundColor: colors.primary,
          },
          bgStyle,
        ]}
      />
      {options.map(option => {
        const Icon = option === "private" ? LockIcon : Globe
        const isSelected = value === option
        const iconColor = isSelected ? colors.background : colors.text
        const textColor = isSelected ? colors.card : colors.text

        return (
          <TouchableOpacity
            key={option}
            style={[styles.privacyOption]}
            onPress={() => onChange(option)}
          >
            <Icon size={14} color={iconColor} />
            <Text
              style={{
                color: textColor,
                fontFamily: Fonts.medium,
                marginLeft: 6,
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40 },
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  favoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
})
