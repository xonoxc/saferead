export const DOCUMENT_FILTER_STATUS_OPTIONS = [
   { value: "", label: "All Status" },
   { value: "completed", label: "Completed" },
   { value: "processing", label: "Processing" },
   { value: "failed", label: "Failed" },
]

export const DOCUMENT_TYPE_OPTIONS = [
   { value: "", label: "All Types" },
   { value: "terms", label: "Terms & Conditions" },
   { value: "privacy", label: "Privacy Policy" },
   { value: "legal", label: "Legal Agreement" },
   { value: "other", label: "Other Document" },
]

export const DOCUMENTS_ORDERING_OPTIONS = [
   { value: "-created_at", label: "Newest First" },
   { value: "created_at", label: "Oldest First" },
   { value: "-confidence_score", label: "Highest Confidence" },
   { value: "confidence_score", label: "Lowest Confidence" },
   { value: "-processed_at", label: "Recently Processed" },
   { value: "processed_at", label: "Oldest Processed" },
]
