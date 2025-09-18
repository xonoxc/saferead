import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native"
import {
   ArrowLeft,
   MessageCircle,
   Mail,
   Phone,
   ExternalLink,
   ChevronDown,
   ChevronRight,
   Search,
   Book,
   Video,
   FileText,
} from "lucide-react-native"
import Animated, {
   FadeInDown,
   FadeInRight,
   useSharedValue,
   useAnimatedStyle,
   withSpring,
   withTiming,
} from "react-native-reanimated"
import { router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface FAQItem {
   id: string
   question: string
   answer: string
   category: string
}

interface SupportOption {
   icon: any
   title: string
   description: string
   action: () => void
   color: string
}

export default function HelpSupportScreen() {
   const { colors } = useTheme()
   const [searchQuery, setSearchQuery] = useState("")
   const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

   const faqData: FAQItem[] = [
      {
         id: "1",
         question: "How do I analyze a legal document?",
         answer:
            "You can analyze documents by uploading files, scanning with your camera, or pasting text directly into the chat. Our AI will provide risk assessment, key terms, and recommendations.",
         category: "Analysis",
      },
      {
         id: "2",
         question: "What file formats are supported?",
         answer:
            "We support PDF, Word documents, images (JPG, PNG), and plain text files. For best results, use high-quality scans or digital documents.",
         category: "Documents",
      },
      {
         id: "3",
         question: "How accurate is the AI analysis?",
         answer:
            "Our AI provides highly accurate analysis based on legal patterns and terminology. However, always consult with a qualified attorney for important legal decisions.",
         category: "Analysis",
      },
      {
         id: "4",
         question: "Can I share documents with my team?",
         answer:
            "Yes! Pro users can share documents and collaborate with team members. Upgrade to Pro to unlock collaboration features.",
         category: "Collaboration",
      },
      {
         id: "5",
         question: "Is my data secure?",
         answer:
            "Absolutely. We use bank-level encryption and never store your documents permanently. All analysis is done securely and your data is protected.",
         category: "Security",
      },
      {
         id: "6",
         question: "How do I organize documents with Spaces?",
         answer:
            "Spaces help you organize documents by category. Create spaces for different types of contracts, clients, or projects to keep everything organized.",
         category: "Organization",
      },
   ]

   const supportOptions: SupportOption[] = [
      {
         icon: MessageCircle,
         title: "Live Chat",
         description: "Get instant help from our support team",
         action: () => {
            // Open chat support
         },
         color: colors.primary,
      },
      {
         icon: Mail,
         title: "Email Support",
         description: "Send us a detailed message",
         action: () => {
            Linking.openURL("mailto:support@legalassist.com")
         },
         color: colors.secondary,
      },
      {
         icon: Phone,
         title: "Phone Support",
         description: "Speak directly with our team",
         action: () => {
            Linking.openURL("tel:+1-800-LEGAL-AI")
         },
         color: colors.success,
      },
   ]

   const quickLinks = [
      {
         icon: Book,
         title: "User Guide",
         description: "Complete guide to using LegalAssist",
         action: () => {},
      },
      {
         icon: Video,
         title: "Video Tutorials",
         description: "Watch step-by-step tutorials",
         action: () => {},
      },
      {
         icon: FileText,
         title: "Legal Resources",
         description: "Educational legal content",
         action: () => {},
      },
   ]

   const filteredFAQs = faqData.filter(
      faq =>
         faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
         faq.category.toLowerCase().includes(searchQuery.toLowerCase())
   )

   const categories = [...new Set(faqData.map(faq => faq.category))]

   const toggleFAQ = (id: string) => {
      setExpandedFAQ(expandedFAQ === id ? null : id)
   }

   const FAQItem: React.FC<{ item: FAQItem; index: number }> = ({ item, index }) => {
      const isExpanded = expandedFAQ === item.id
      const rotateValue = useSharedValue(0)
      const heightValue = useSharedValue(0)

      React.useEffect(() => {
         rotateValue.value = withSpring(isExpanded ? 180 : 0)
         heightValue.value = withTiming(isExpanded ? 1 : 0, { duration: 300 })
      }, [isExpanded, heightValue, rotateValue])

      const rotateStyle = useAnimatedStyle(() => ({
         transform: [{ rotate: `${rotateValue.value}deg` }],
      }))

      const expandStyle = useAnimatedStyle(() => ({
         opacity: heightValue.value,
         maxHeight: heightValue.value * 200,
      }))

      return (
         <Animated.View
            entering={FadeInRight.delay(index * 100).springify()}
            style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}
         >
            <TouchableOpacity
               style={styles.faqHeader}
               onPress={() => toggleFAQ(item.id)}
               activeOpacity={0.7}
            >
               <View style={styles.faqHeaderContent}>
                  <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "15" }]}>
                     <Text style={[styles.categoryText, { color: colors.primary }]}>
                        {item.category}
                     </Text>
                  </View>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
               </View>
               <Animated.View style={rotateStyle}>
                  <ChevronDown size={20} color={colors.textSecondary} />
               </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[styles.faqAnswer, expandStyle]}>
               <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>
                  {item.answer}
               </Text>
            </Animated.View>
         </Animated.View>
      )
   }

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         {/* Header */}
         <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={[styles.header, { backgroundColor: colors.background }]}
         >
            <TouchableOpacity
               style={[styles.backButton, { backgroundColor: colors.surface }]}
               onPress={() => router.back()}
            >
               <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
               <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  We&apos;re here to help you succeed
               </Text>
            </View>
         </Animated.View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Support Options */}
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Get Support</Text>
               <View style={styles.supportGrid}>
                  {supportOptions.map((option, index) => (
                     <Animated.View
                        key={index}
                        entering={FadeInRight.delay(300 + index * 100).springify()}
                        style={styles.supportOptionWrapper}
                     >
                        <TouchableOpacity
                           style={[
                              styles.supportOption,
                              { backgroundColor: colors.card, borderColor: colors.border },
                           ]}
                           onPress={option.action}
                           activeOpacity={0.7}
                        >
                           <View
                              style={[styles.supportIcon, { backgroundColor: option.color + "15" }]}
                           >
                              <option.icon size={24} color={option.color} />
                           </View>
                           <Text style={[styles.supportTitle, { color: colors.text }]}>
                              {option.title}
                           </Text>
                           <Text
                              style={[styles.supportDescription, { color: colors.textSecondary }]}
                           >
                              {option.description}
                           </Text>
                           <ExternalLink
                              size={16}
                              color={colors.textMuted}
                              style={styles.externalIcon}
                           />
                        </TouchableOpacity>
                     </Animated.View>
                  ))}
               </View>
            </Animated.View>

            {/* Quick Links */}
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Links</Text>
               <View style={styles.quickLinksGrid}>
                  {quickLinks.map((link, index) => (
                     <Animated.View
                        key={index}
                        entering={FadeInRight.delay(600 + index * 100).springify()}
                     >
                        <TouchableOpacity
                           style={[
                              styles.quickLink,
                              { backgroundColor: colors.card, borderColor: colors.border },
                           ]}
                           onPress={link.action}
                           activeOpacity={0.7}
                        >
                           <View
                              style={[styles.quickLinkIcon, { backgroundColor: colors.surface }]}
                           >
                              <link.icon size={20} color={colors.primary} />
                           </View>
                           <View style={styles.quickLinkContent}>
                              <Text style={[styles.quickLinkTitle, { color: colors.text }]}>
                                 {link.title}
                              </Text>
                              <Text
                                 style={[
                                    styles.quickLinkDescription,
                                    { color: colors.textSecondary },
                                 ]}
                              >
                                 {link.description}
                              </Text>
                           </View>
                           <ChevronRight size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                     </Animated.View>
                  ))}
               </View>
            </Animated.View>

            {/* FAQ Section */}
            <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Frequently Asked Questions
               </Text>

               {/* Search */}
               <View
                  style={[
                     styles.searchContainer,
                     { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
               >
                  <Search size={20} color={colors.textMuted} />
                  <TextInput
                     value={searchQuery}
                     onChangeText={setSearchQuery}
                     placeholder="Search FAQs..."
                     style={styles.searchInput}
                  />
               </View>

               {/* Categories */}
               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesContainer}
               >
                  {categories.map((category, index) => (
                     <Animated.View
                        key={category}
                        entering={FadeInRight.delay(800 + index * 50).springify()}
                     >
                        <TouchableOpacity
                           style={[styles.categoryChip, { backgroundColor: colors.primary + "15" }]}
                           onPress={() => setSearchQuery(category)}
                        >
                           <Text style={[styles.categoryChipText, { color: colors.primary }]}>
                              {category}
                           </Text>
                        </TouchableOpacity>
                     </Animated.View>
                  ))}
               </ScrollView>

               {/* FAQ List */}
               <View style={styles.faqList}>
                  {filteredFAQs.map((item, index) => (
                     <FAQItem key={item.id} item={item} index={index} />
                  ))}
               </View>

               {filteredFAQs.length === 0 && searchQuery && (
                  <Animated.View entering={FadeInDown.springify()} style={styles.noResults}>
                     <Text style={[styles.noResultsText, { color: colors.textMuted }]}>
                        No FAQs found for &quot;{searchQuery}&quot;
                     </Text>
                     <Button
                        title="Clear Search"
                        onPress={() => setSearchQuery("")}
                        variant="outline"
                        size="small"
                     />
                  </Animated.View>
               )}
            </Animated.View>

            {/* Contact Footer */}
            <Animated.View
               entering={FadeInDown.delay(900).springify()}
               style={[styles.contactFooter, { backgroundColor: colors.card }]}
            >
               <Text style={[styles.contactTitle, { color: colors.text }]}>Still need help?</Text>
               <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                  Our support team is available 24/7 to assist you with any questions or issues.
               </Text>
               <Button
                  title="Contact Support"
                  onPress={() => supportOptions[0].action()}
                  variant="primary"
                  size="large"
                  fullWidth
               />
            </Animated.View>
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 20,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 20,
   },
   backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
   },
   headerContent: {
      flex: 1,
   },
   title: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.bold,
      marginBottom: 4,
   },
   subtitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
   },
   content: {
      flex: 1,
      paddingHorizontal: 20,
   },
   section: {
      marginBottom: 32,
   },
   sectionTitle: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 16,
   },
   supportGrid: {
      gap: 16,
   },
   supportOptionWrapper: {
      marginBottom: 16,
   },
   supportOption: {
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      position: "relative",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   },
   supportIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
   },
   supportTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
      marginBottom: 4,
   },
   supportDescription: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      lineHeight: 20,
   },
   externalIcon: {
      position: "absolute",
      top: 16,
      right: 16,
   },
   quickLinksGrid: {
      gap: 12,
   },
   quickLink: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
   },
   quickLinkIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   quickLinkContent: {
      flex: 1,
   },
   quickLinkTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   quickLinkDescription: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      gap: 12,
      marginBottom: 16,
   },
   searchInput: {
      flex: 1,
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
   },
   categoriesContainer: {
      marginBottom: 20,
   },
   categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
   },
   categoryChipText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
   faqList: {
      gap: 12,
   },
   faqItem: {
      borderRadius: 12,
      borderWidth: 1,
      overflow: "hidden",
   },
   faqHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
   },
   faqHeaderContent: {
      flex: 1,
      marginRight: 12,
   },
   categoryBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 8,
   },
   categoryText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.medium,
      textTransform: "uppercase",
   },
   faqQuestion: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      lineHeight: 20,
   },
   faqAnswer: {
      overflow: "hidden",
   },
   faqAnswerText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      lineHeight: 22,
      paddingHorizontal: 16,
      paddingBottom: 16,
   },
   noResults: {
      alignItems: "center",
      paddingVertical: 32,
      gap: 16,
   },
   noResultsText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
   contactFooter: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 32,
      alignItems: "center",
   },
   contactTitle: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 8,
      textAlign: "center",
   },
   contactDescription: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 20,
   },
})
