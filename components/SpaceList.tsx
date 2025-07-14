import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Trash2 } from "lucide-react-native"
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
      {spaces.map(space => (
        <Animated.View
          key={space.id}
          entering={FadeInRight.duration(400).springify()}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow ?? "#000",
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.9} style={styles.touchWrap}>
            <View style={styles.content}>
              {/* Left */}
              <View style={styles.left}>
                <View style={[styles.iconWrap, { backgroundColor: `${space.color}20` }]}>
                  <Text style={styles.emoji}>{space.icon}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={[styles.name, { color: colors.text }]}>{space.name}</Text>
                  <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    <Text style={{ color: colors.primary, fontWeight: "600" }}>
                      {space.documentCount}
                    </Text>{" "}
                    documents
                  </Text>
                </View>
              </View>

              {/* Right */}
              <View style={styles.right}>
                <View style={[styles.preview, { backgroundColor: space.color + "20" }]}>
                  <View style={[styles.shape, { backgroundColor: space.color }]} />
                </View>

                <TouchableOpacity
                  onPress={() => onDelete(space.id, space.name)}
                  style={[styles.moreBtn, { backgroundColor: colors.error + "10" }]}
                >
                  <Trash2 size={18} color={colors.error} />
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
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  touchWrap: {
    borderRadius: 16,
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
    width: 56,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  shape: {
    width: 28,
    height: 16,
    borderRadius: 4,
  },
  moreBtn: {
    padding: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
})
