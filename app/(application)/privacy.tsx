import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import {
   ArrowLeft,
   Shield,
   Eye,
   Lock,
   Database,
   Share2,
   Bell,
   Trash2,
   Download,
   ChevronRight,
} from "lucide-react-native"
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"
import { router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface PrivacySection {
   id: string
   title: string
   content: string
   icon: any
   color: string
}

export default function PrivacyScreen() {
   const { colors } = useTheme()
   const [expandedSection, setExpandedSection] = useState<string | null>(null)

   const privacySections: PrivacySection[] = [
      {
         id: "data-collection",
         title: "Data Collection",
         content:
            "We collect only the information necessary to provide our legal analysis services. This includes documents you upload, your account information, and usage analytics to improve our AI models. We never access your documents without explicit permission.",
         icon: Database,
         color: colors.primary,
      },
      {
         id: "data-usage",
         title: "How We Use Your Data",
         content:
            "Your documents are analyzed using our AI models to provide legal insights. We use anonymized data to improve our services. Personal information is used for account management and customer support. We never sell your data to third parties.",
         icon: Eye,
         color: colors.secondary,
      },
      {
         id: "data-security",
         title: "Data Security",
         content:
            "We employ bank-level encryption (AES-256) for all data transmission and storage. Your documents are encrypted at rest and in transit. We use secure cloud infrastructure with regular security audits and compliance certifications.",
         icon: Lock,
         color: colors.success,
      },
      {
         id: "data-sharing",
         title: "Data Sharing",
         content:
            "We do not share your personal data or documents with third parties except as required by law or with your explicit consent. Anonymous, aggregated data may be used for research and service improvement.",
         icon: Share2,
         color: colors.warning,
      },
      {
         id: "data-retention",
         title: "Data Retention",
         content:
            "Documents are automatically deleted after analysis unless you choose to save them. Account data is retained while your account is active. You can request data deletion at any time through your account settings.",
         icon: Trash2,
         color: colors.error,
      },
      {
         id: "your-rights",
         title: "Your Rights",
         content:
            "You have the right to access, modify, or delete your personal data. You can export your data, opt out of analytics, and control notification preferences. Contact us to exercise these rights or for any privacy concerns.",
         icon: Shield,
         color: colors.accent,
      },
   ]

   const privacyControls = [
      {
         title: "Download My Data",
         description: "Export all your personal data and documents",
         icon: Download,
         action: () => {},
      },
      {
         title: "Delete My Account",
         description: "Permanently delete your account and all data",
         icon: Trash2,
         action: () => {},
         danger: true,
      },
      {
         title: "Notification Preferences",
         description: "Control what notifications you receive",
         icon: Bell,
         action: () => {},
      },
   ]

   const toggleSection = (id: string) => {
      setExpandedSection(expandedSection === id ? null : id)
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
               <Text style={[styles.title, { color: colors.text }]}>Privacy & Security</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Your privacy is our priority
               </Text>
            </View>
         </Animated.View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Privacy Overview */}
            <Animated.View
               entering={FadeInDown.delay(200).springify()}
               style={[styles.overviewCard, { backgroundColor: colors.card }]}
            >
               <View style={[styles.overviewIcon, { backgroundColor: colors.primary + "15" }]}>
                  <Shield size={32} color={colors.primary} />
               </View>
               <Text style={[styles.overviewTitle, { color: colors.text }]}>
                  Your Data is Protected
               </Text>
               <Text style={[styles.overviewDescription, { color: colors.textSecondary }]}>
                  We use industry-leading security measures to protect your legal documents and
                  personal information. Your privacy is fundamental to our service.
               </Text>
            </Animated.View>

            {/* Privacy Sections */}
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy Policy</Text>

               {privacySections.map((section, index) => (
                  <Animated.View
                     key={section.id}
                     entering={FadeInRight.delay(400 + index * 100).springify()}
                     style={[
                        styles.privacyItem,
                        { backgroundColor: colors.card, borderColor: colors.border },
                     ]}
                  >
                     <TouchableOpacity
                        style={styles.privacyHeader}
                        onPress={() => toggleSection(section.id)}
                        activeOpacity={0.7}
                     >
                        <View style={styles.privacyHeaderLeft}>
                           <View
                              style={[
                                 styles.privacyIcon,
                                 { backgroundColor: section.color + "15" },
                              ]}
                           >
                              <section.icon size={20} color={section.color} />
                           </View>
                           <Text style={[styles.privacyTitle, { color: colors.text }]}>
                              {section.title}
                           </Text>
                        </View>
                        <ChevronRight
                           size={20}
                           color={colors.textSecondary}
                           style={{
                              transform: [
                                 { rotate: expandedSection === section.id ? "90deg" : "0deg" },
                              ],
                           }}
                        />
                     </TouchableOpacity>

                     {expandedSection === section.id && (
                        <Animated.View
                           entering={FadeInDown.springify()}
                           style={styles.privacyContent}
                        >
                           <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
                              {section.content}
                           </Text>
                        </Animated.View>
                     )}
                  </Animated.View>
               ))}
            </Animated.View>

            {/* Privacy Controls */}
            <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy Controls</Text>

               {privacyControls.map((control, index) => (
                  <Animated.View
                     key={index}
                     entering={FadeInRight.delay(800 + index * 100).springify()}
                  >
                     <TouchableOpacity
                        style={[
                           styles.controlItem,
                           { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                        onPress={control.action}
                        activeOpacity={0.7}
                     >
                        <View style={styles.controlLeft}>
                           <View
                              style={[
                                 styles.controlIcon,
                                 {
                                    backgroundColor: control.danger
                                       ? colors.error + "15"
                                       : colors.surface,
                                 },
                              ]}
                           >
                              <control.icon
                                 size={20}
                                 color={control.danger ? colors.error : colors.textSecondary}
                              />
                           </View>
                           <View style={styles.controlContent}>
                              <Text
                                 style={[
                                    styles.controlTitle,
                                    { color: control.danger ? colors.error : colors.text },
                                 ]}
                              >
                                 {control.title}
                              </Text>
                              <Text
                                 style={[
                                    styles.controlDescription,
                                    { color: colors.textSecondary },
                                 ]}
                              >
                                 {control.description}
                              </Text>
                           </View>
                        </View>
                        <ChevronRight size={16} color={colors.textMuted} />
                     </TouchableOpacity>
                  </Animated.View>
               ))}
            </Animated.View>

            {/* Contact Section */}
            <Animated.View
               entering={FadeInDown.delay(1000).springify()}
               style={[styles.contactSection, { backgroundColor: colors.card }]}
            >
               <Text style={[styles.contactTitle, { color: colors.text }]}>Privacy Questions?</Text>
               <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                  If you have any questions about our privacy practices or want to exercise your
                  rights, our privacy team is here to help.
               </Text>
               <TouchableOpacity
                  style={[styles.contactButton, { backgroundColor: colors.primary }]}
                  onPress={() => {}}
               >
                  <Text style={[styles.contactButtonText, { color: colors.background }]}>
                     Contact Privacy Team
                  </Text>
               </TouchableOpacity>
            </Animated.View>

            {/* Last Updated */}
            <Animated.View entering={FadeInDown.delay(1100).springify()} style={styles.footer}>
               <Text style={[styles.footerText, { color: colors.textMuted }]}>
                  Last updated: December 2024
               </Text>
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
   overviewCard: {
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      marginBottom: 32,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
   },
   overviewIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
   },
   overviewTitle: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 12,
      textAlign: "center",
   },
   overviewDescription: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      textAlign: "center",
      lineHeight: 22,
   },
   section: {
      marginBottom: 32,
   },
   sectionTitle: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 16,
   },
   privacyItem: {
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 12,
      overflow: "hidden",
   },
   privacyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
   },
   privacyHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
   },
   privacyIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   privacyTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      flex: 1,
   },
   privacyContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
   },
   privacyText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      lineHeight: 22,
   },
   controlItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      marginBottom: 12,
   },
   controlLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
   },
   controlIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   controlContent: {
      flex: 1,
   },
   controlTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   controlDescription: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   contactSection: {
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      marginBottom: 32,
   },
   contactTitle: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 12,
      textAlign: "center",
   },
   contactDescription: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 20,
   },
   contactButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
   },
   contactButtonText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
   },
   footer: {
      alignItems: "center",
      paddingBottom: 32,
   },
   footerText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
})
