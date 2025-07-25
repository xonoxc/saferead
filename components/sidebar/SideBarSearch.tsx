import Animated, { FadeInDown } from "react-native-reanimated"
import SearchBar from "../search/SearchBar"

interface SidebarSearchProps {
  searchQuery: string
  handleSearch: (text: string) => void
  setShowFilter: (show: boolean) => void
}

export default function SidebarSearch({
  searchQuery,
  handleSearch,
  setShowFilter,
}: SidebarSearchProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 1,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        placeholder="Search documents..."
        showFilter
        onFilterPress={() => setShowFilter(true)}
      />
    </Animated.View>
  )
}
