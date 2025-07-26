import Animated, { FadeInDown } from "react-native-reanimated"
import SearchBar from "@/components/search/SearchBar"

interface DocumentTabSearchProps {
  searchQuery: string
  handleSearch(text: string): void
  setShowFilter(show: boolean): void
}

export default function DocumentTabSearch({
  searchQuery,
  handleSearch,
  setShowFilter,
}: DocumentTabSearchProps) {
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
