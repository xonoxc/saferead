import {
   Folder,
   FileText,
   Handshake,
   Building,
   Scale,
   ClipboardList,
   Lock,
   BarChart,
   Briefcase,
   Pencil,
} from "lucide-react-native"

export const colors_palette = [
   "#4ECDC4",
   "#FF6B6B",
   "#45B7D1",
   "#96CEB4",
   "#FFEAA7",
   "#DDA0DD",
   "#98D8C8",

   "#F9A825",
   "#AB47BC",
   "#FF7043",
   "#29B6F6",
   "#66BB6A",
   "#EF5350",
   "#BA68C8",
   "#FFB74D",
   "#81C784",
   "#90CAF9",
   "#FFD54F",
   "#A1887F",
   "#B0BEC5",
]

export const privacyOptions = ["private", "public"]

export const iconMap = {
   folder: Folder,
   filetext: FileText,
   handshake: Handshake,
   building: Building,
   scale: Scale,
   clipboardlist: ClipboardList,
   lock: Lock,
   barchart: BarChart,
   briefcase: Briefcase,
   pencil: Pencil,
} as const

export type SpaceIconName = keyof typeof iconMap
