import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { MoreVertical } from "lucide-react-native"
import Animated, { FadeInRight } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export const SpaceList = ({
  spaces,
  onDelete,
}: {
  spaces: any[]
  onDelete: (id: string, name: string) => void
}) => {
  const { colors } = useTheme()

  return (
    <>
      {spaces.map((space, index) => (
        <Animated.View key={space.id} entering={FadeInRight.delay(400 + index * 100).springify()}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <View style={styles.content}>
              <View style={styles.left}>
                <View style={[styles.iconWrap, { backgroundColor: `${space.color}20` }]}>
                  <Text style={styles.emoji}>{space.icon}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={[styles.name, { color: colors.text }]}>{space.name}</Text>
                  <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    {space.documentCount} documents
                  </Text>
                </View>
              </View>
              <View style={styles.right}>
                <View style={[styles.preview, { backgroundColor: space.color + "20" }]}>
                  <View style={[styles.shape, { backgroundColor: space.color }]} />
                </View>
                <TouchableOpacity
                  onPress={() => onDelete(space.id, space.name)}
                  style={styles.moreBtn}
                >
                  <MoreVertical size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  desc: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  preview: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  shape: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  moreBtn: {
    padding: 4,
  },
})
