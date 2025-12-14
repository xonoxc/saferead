import { EmptyState } from "@/components/EmptyState"
import type { StateControlProps } from "@/types/state"
import { FileText, Search } from "lucide-react-native"

interface EmptyStateProps {
   searchControl: StateControlProps<string>
}

export function DocumentsEmptyState({ searchControl }: EmptyStateProps) {
   return (
      <EmptyState
         icon={searchControl.value ? Search : FileText}
         title={searchControl.value ? "No Results Found" : "No Documents Yet"}
         description={
            searchControl.value
               ? `No documents match "${searchControl.value}". Try adjusting your search terms or check your spelling.`
               : "Start your legal document analysis journey by adding your first document. Upload files, scan documents, or paste text to get started."
         }
         actionTitle={searchControl.value ? undefined : "Add Your First Document"}
         secondaryActionTitle={searchControl.value ? "Clear Search" : ""}
         onSecondaryAction={searchControl.value ? () => searchControl.onChange("") : () => {}}
         variant={searchControl.value ? "search" : "default"}
         showFloatingElements={!searchControl.value}
      />
   )
}
