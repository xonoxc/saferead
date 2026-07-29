import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import Skeleton from "./Skeleton"
import { useTheme } from "@/hooks/useTheme"
import { TAB_BAR_CLEARANCE } from "@/constants/Design"

/*
 * The space list, mid-load.
 *
 * It used to skeletonise the header too, and the screen returned it *instead*
 * of the whole layout. But the header does not depend on the request — and it
 * carries the search field, the create button and the only route to Settings
 * from this tab, all of which were unavailable for as long as the load took.
 * The screen now renders the real header above this, so drawing a grey
 * placeholder over the top of it would just be a duplicate.
 * **/
const SpacesScreenSkeleton = () => {
   const { colors } = useTheme()

   return (
      <ScrollView
         style={[styles.container, { backgroundColor: colors.background }]}
         contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
         showsVerticalScrollIndicator={false}
      >
         <View style={styles.listContainer}>
            {[...Array(5)].map((_, index) => (
               <Skeleton
                  key={index}
                  width="100%"
                  height={80}
                  borderRadius={12}
                  style={{ marginBottom: 12 }}
               />
            ))}
         </View>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   listContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
   },
})

export default SpacesScreenSkeleton
