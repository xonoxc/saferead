export interface User {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  avatar?: string
  subscriptionTier: "free" | "pro" | "enterprise"
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  language: string
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  dyslexiaFriendly: boolean
  textToSpeech: boolean
  hapticFeedback: boolean
  notifications: boolean
}

export interface Document {
  id: string
  title: string
  type: "contract" | "legal" | "agreement" | "other"
  content: string
  originalFormat: "pdf" | "image" | "text"
  fileSize: number
  createdAt: string
  updatedAt: string
  analysis?: DocumentAnalysis
  isEncrypted: boolean
  tags: string[]
  shared: boolean
  sharedWith: string[]
}

export interface DocumentAnalysis {
  summary: string
  keyTerms: KeyTerm[]
  riskAssessment: RiskAssessment
  riskyPoints?: number
  favorablePoints?: number
  deadlines: Deadline[]
  recommendations: string[]
  sensitiveInfo: SensitiveInfo[]
  sections: DocumentSection[]
}

export interface KeyTerm {
  term: string
  definition: string
  importance: "high" | "medium" | "low"
  position: number
}

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high"
  risks: Risk[]
}

export interface Risk {
  type: string
  description: string
  severity: "low" | "medium" | "high"
  mitigation: string
}

export interface Deadline {
  date: string
  description: string
  type: "payment" | "signature" | "review" | "other"
  daysRemaining: number
}

export interface SensitiveInfo {
  type: "ssn" | "email" | "phone" | "address" | "financial" | "other"
  content: string
  position: number
  redacted: boolean
}

export interface DocumentSection {
  title: string
  content: string
  analysis: string
  importance: "high" | "medium" | "low"
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "monthly" | "yearly"
  features: string[]
  documentsLimit: number
  aiAnalysisLimit: number
  collaborators: number
}

export interface Space {
  id: string
  name: string
  description: string
  documentCount: number
  color: string
  icon: string
  createdAt: string
  updatedAt: string
}

export interface VoiceNote {
  id: string
  documentId: string
  audioUri: string
  transcription: string
  timestamp: number
  duration: number
}
