import { View, Text, StyleSheet, Platform, Pressable } from "react-native"
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"
import { BlurView } from "expo-blur"
import * as Haptics from "expo-haptics"

import { useTheme } from "@/hooks/useTheme"
import { useTabStore } from "@/store/tab"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Motion, Radii, Spacing, TabBar, elevation } from "@/constants/Design"
import ScanBtn from "@/components/ScanBtn"

import type { ColorsType } from "@/hooks/useTheme"
import type { Tabs } from "expo-router"

/*
 * Derived from the public `Tabs` component rather than reaching into
 * `expo-router/build/react-navigation/*`, so an SDK bump that reshuffles those
 * internals cannot silently break this file.
 * **/
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>>[0]

/* The route that renders the raised centre action instead of a normal tab. */
const CENTRE_ROUTE = "scan"

/*
 * The bottom tab bar.
 *
 * This replaces a `tabBarStyle` object that only applied in full on Android and
 * web - the iOS branch returned nothing but `position: absolute`, so the bar
 * had a different height, background and alignment on every platform. Owning
 * the whole bar means one layout everywhere, and it lets the bar animate itself
 * out of the way instead of being switched off with `display: "none"`.
 * **/
export function BottomTabBar({ state, descriptors, navigation }: TabBarProps) {
   const { colors, isDark } = useTheme()
   const tabVisible = useTabStore(s => s.tabVisible)

   /*
    * Slide out rather than unmount. `display: "none"` made the bar pop in and
    * out, and it also meant the hide-on-scroll gesture read as a glitch.
    * **/
   const containerStyle = useAnimatedStyle(() => ({
      transform: [
         {
            translateY: withSpring(tabVisible ? 0 : 160, Motion.spring),
         },
      ],
      opacity: withTiming(tabVisible ? 1 : 0, { duration: Motion.fast }),
   }))

   /*
    * `href: null` screens (premium) are kept in the navigator so they stay
    * routable, but expo-router marks them by hiding the tab item. Honour that
    * flag here or they would reappear now that the bar is hand-rolled.
    * **/
   const visibleRoutes = state.routes.filter(route => {
      const itemStyle = StyleSheet.flatten(descriptors[route.key]?.options.tabBarItemStyle)
      return itemStyle?.display !== "none"
   })

   return (
      <Animated.View
         style={[styles.container, { pointerEvents: tabVisible ? "auto" : "none" }, containerStyle]}
      >
         <View
            style={[
               styles.bar,
               {
                  backgroundColor: Platform.OS === "ios" ? "transparent" : colors.elevated,
                  borderColor: colors.border,
               },
               elevation(colors, 3),
            ]}
         >
            {/*
             * iOS gets a real material blur so content scrolling underneath
             * stays faintly visible. Android's blur is still expensive enough
             * to drop frames on a list, so it takes the solid surface above.
             * **/}
            {Platform.OS === "ios" && (
               <BlurView
                  intensity={40}
                  tint={isDark ? "systemThickMaterialDark" : "systemThickMaterialLight"}
                  style={[StyleSheet.absoluteFill, styles.blur]}
               />
            )}

            {visibleRoutes.map(route => {
               const { options } = descriptors[route.key]
               /* Index within the full route list, which is what state.index tracks. */
               const isFocused = state.routes[state.index]?.key === route.key

               if (route.name === CENTRE_ROUTE) {
                  return <ScanBtn key={route.key} />
               }

               const onPress = () => {
                  const event = navigation.emit({
                     type: "tabPress",
                     target: route.key,
                     canPreventDefault: true,
                  })

                  if (isFocused || event.defaultPrevented) return

                  if (Platform.OS !== "web") {
                     Haptics.selectionAsync()
                  }

                  navigation.navigate(route.name, route.params)
               }

               return (
                  <TabBarItem
                     key={route.key}
                     colors={colors}
                     isFocused={isFocused}
                     label={options.title ?? route.name}
                     icon={options.tabBarIcon}
                     onPress={onPress}
                  />
               )
            })}
         </View>
      </Animated.View>
   )
}

interface TabBarItemProps {
   colors: ColorsType
   isFocused: boolean
   label: string
   icon: TabBarProps["descriptors"][string]["options"]["tabBarIcon"]
   onPress: () => void
}

/*
 * A single tab.
 *
 * The active state is carried by three things at once - a tinted pill, the icon
 * colour and the label weight - because icon colour alone is easy to miss at a
 * glance, which is what made the previous icon-only bar hard to read.
 * **/
function TabBarItem({ colors, isFocused, label, icon, onPress }: TabBarItemProps) {
   const pillStyle = useAnimatedStyle(() => ({
      opacity: withTiming(isFocused ? 1 : 0, { duration: Motion.fast }),
      transform: [{ scale: withSpring(isFocused ? 1 : 0.8, Motion.springQuick) }],
   }))

   const contentStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: withSpring(isFocused ? -1 : 0, Motion.springQuick) }],
   }))

   const tint = isFocused ? colors.primary : colors.textMuted

   return (
      <Pressable
         accessibilityRole="button"
         accessibilityState={{ selected: isFocused }}
         accessibilityLabel={label}
         onPress={onPress}
         style={styles.item}
         /* The row is short, so widen the touch target rather than the visuals. */
         hitSlop={{ top: 8, bottom: 8 }}
      >
         <Animated.View
            style={[styles.pill, { backgroundColor: colors.primaryFaded }, pillStyle]}
         />

         <Animated.View style={[styles.itemContent, contentStyle]}>
            {icon?.({ focused: isFocused, color: tint, size: 22 })}

            <Text
               numberOfLines={1}
               style={[
                  styles.label,
                  {
                     color: tint,
                     fontFamily: isFocused ? Fonts.semiBold : Fonts.medium,
                  },
               ]}
            >
               {label}
            </Text>
         </Animated.View>
      </Pressable>
   )
}

const styles = StyleSheet.create({
   container: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: TabBar.gap,
      paddingHorizontal: TabBar.inset,
   },
   bar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: TabBar.height,
      borderRadius: TabBar.radius,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: Spacing.xs,
      /*
       * The raised centre action pokes out of the top of the bar, so the bar
       * must not clip its own children.
       * **/
      overflow: "visible",
   },
   blur: {
      borderRadius: TabBar.radius,
      overflow: "hidden",
   },
   item: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: TabBar.height,
   },
   pill: {
      position: "absolute",
      top: 6,
      bottom: 6,
      left: Spacing.xxs,
      right: Spacing.xxs,
      borderRadius: Radii.md,
      pointerEvents: "none",
   },
   itemContent: {
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      pointerEvents: "none",
   },
   label: {
      fontSize: FontSizes.xs - 2,
      letterSpacing: 0.1,
      includeFontPadding: false,
   },
})

export default BottomTabBar
