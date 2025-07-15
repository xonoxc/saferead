import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

const icons = ["📁", "📄", "🤝", "🏢", "⚖️", "📋", "🔒", "📊", "💼", "📝"]
const colors_palette = ["#4ECDC4", "#FF6B6B", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]

export const CreateSpaceForm = ({
  onCreate,
  onCancel,
}: {
  onCreate: (name: string, desc: string, color: string, icon: string) => void
  onCancel: () => void
}) => {
  const { colors } = useTheme()
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [color, setColor] = useState(colors_palette[0])
  const [icon, setIcon] = useState(icons[0])

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a space name")
      return
    }
    onCreate(name, desc, color, icon)
    setName("")
    setDesc("")
    setColor(colors_palette[0])
    setIcon(icons[0])
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Create New Space</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          label="Space Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />
        <TextInput
          label="Description (Optional)"
          value={desc}
          onChangeText={setDesc}
          placeholder="Enter description"
          multiline
          numberOfLines={3}
        />

        <Text style={[styles.label, { color: colors.text }]}>Choose Color</Text>
        <View style={styles.grid}>
          {colors_palette.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.color, { backgroundColor: c }, c === color && styles.selected]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Choose Icon</Text>
        <View style={styles.grid}>
          {icons.map(i => (
            <TouchableOpacity
              key={i}
              style={[
                styles.icon,
                { backgroundColor: colors.surface },
                i === icon && { backgroundColor: colors.primary + "20" },
              ]}
              onPress={() => setIcon(i)}
            >
              <Text style={styles.iconText}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Create Space" onPress={handleSubmit} variant="primary" fullWidth />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
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
    paddingHorizontal: 20,
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
})
