import { EmptyState } from "@/components/EmptyState"
import { Box, Search } from "lucide-react-native"
import { View } from "react-native"

export default function SpacesFallback({
  searchQuery,
  setSearchQuery,
  setShowCreateModal,
}: {
  searchQuery?: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setShowCreateModal: (show: boolean) => void
}) {
  const details = getFallbackDetails(searchQuery)

  const handleActionButtonPress = () => {
    if (searchQuery) setSearchQuery("")
    else setShowCreateModal(true)
  }

  const handleSecondaryActionPress = () => {
    if (!searchQuery) return
    setSearchQuery("")
  }

  return (
    <View style={{ paddingTop: 110 }}>
      <EmptyState
        icon={searchQuery ? Search : Box}
        title={details.title}
        description={details.description}
        actionTitle={details.actionTitle}
        onAction={handleActionButtonPress}
        secondaryActionTitle={details.secondaryActionTitle}
        onSecondaryAction={handleSecondaryActionPress}
        variant={details.variant as "search" | "default"}
        showFloatingElements={!searchQuery}
      />
    </View>
  )
}

function getFallbackDetails(searchQuery?: string) {
  const description = searchQuery
    ? `No spaces match "${searchQuery}". Try adjusting your search terms or create a new space.`
    : "Organize your legal documents by creating spaces. Group contracts, agreements, and other documents for better organization and faster access."

  const title = searchQuery ? "No Spaces Found" : "No Spaces Yet"
  const actionTitle = searchQuery ? "Create New Space" : "Create Your First Space"
  const secondaryActionTitle = searchQuery ? "Clear Search" : undefined
  const variant = searchQuery ? "search" : "default"

  return {
    title,
    description,
    actionTitle,
    secondaryActionTitle,
    variant,
  }
}
