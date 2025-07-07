import {
  Camera,
  Upload,
  FileText,
  TrendingUp,
  CircleAlert as AlertCircle,
  Clock,
} from "lucide-react-native"

export const quickActions = [
  {
    icon: Camera,
    title: "Scan Document",
    description: "Use camera to scan legal documents",
    href: "/(tabs)/documents?action=scan",
    color: colors.primary,
  },
  {
    icon: Upload,
    title: "Upload File",
    description: "Import PDF or image files",
    href: "/(tabs)/documents?action=upload",
    color: colors.secondary,
  },
  {
    icon: FileText,
    title: "Text Analysis",
    description: "Analyze text-based documents",
    href: "/(tabs)/documents?action=text",
    color: colors.accent,
  },
]

export const stats = [
  {
    icon: FileText,
    title: "Documents",
    value: documents.length,
    color: colors.primary,
  },
  {
    icon: TrendingUp,
    title: "Analyzed",
    value: documents.filter(d => d.analysis).length,
    color: colors.success,
  },
  {
    icon: AlertCircle,
    title: "High Risk",
    value: documents.filter(d => d.analysis?.riskAssessment?.overallRisk === "high").length,
    color: colors.error,
  },
  {
    icon: Clock,
    title: "Pending",
    value: documents.filter(d => !d.analysis).length,
    color: colors.warning,
  },
]
