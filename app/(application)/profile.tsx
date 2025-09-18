import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import {
   ArrowLeft,
   Camera,
   CreditCard as Edit3,
   X,
   User,
   Calendar,
   Shield,
} from "lucide-react-native"
import Animated, {
   FadeInDown,
   FadeInRight,
   useSharedValue,
   useAnimatedStyle,
   withSpring,
} from "react-native-reanimated"
import { router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"

export default function ProfileScreen() {
   const { colors } = useTheme()
   const { user, updateUser } = useAuth()
   const [isEditing, setIsEditing] = useState(false)
   const [isLoading, setIsLoading] = useState(false)

   const [formData, setFormData] = useState({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      username: user?.username || "",
   })

   const [errors, setErrors] = useState<Record<string, string>>({})

   const scale = useSharedValue(1)

   const showBottomAlert = useDrawerAlert()

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
   }))

   const validateForm = () => {
      const newErrors: Record<string, string> = {}

      if (!formData.firstName.trim()) {
         newErrors.firstName = "First name is required"
      }

      if (!formData.lastName.trim()) {
         newErrors.lastName = "Last name is required"
      }

      if (!formData.email.trim()) {
         newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = "Please enter a valid email"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSave = async () => {
      if (!validateForm()) return

      setIsLoading(true)
      const resp = await attempt(
         updateUser({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            username: formData.username,
         })
      )
      if (!resp.ok) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: getErrorMessage(resp.error) || "Failed to update profile",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      showBottomAlert({
         title: "Success",
         message: "Profile updated successfully!",
         actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
      setIsEditing(false)
   }

   const handleCancel = () => {
      setFormData({
         firstName: user?.first_name || "",
         lastName: user?.last_name || "",
         email: user?.email || "",
         username: user?.username || "",
      })
      setErrors({})
      setIsEditing(false)
   }

   const handleAvatarPress = () => {
      scale.value = withSpring(0.9, {}, () => {
         scale.value = withSpring(1)
      })

      showBottomAlert({
         title: "Change Profile Photo",
         message: "Choose how you want to update your profile photo",
         actions: [
            { text: "Camera", style: "primary", onPress: () => {} },
            { text: "Photo Library", style: "primary", onPress: () => {} },
            { text: "Cancel", style: "primary", onPress: () => {} },
         ],
      })
   }

   const updateFormData = (key: string, value: string) => {
      setFormData(prev => ({ ...prev, [key]: value }))
      if (errors[key]) {
         setErrors(prev => ({ ...prev, [key]: "" }))
      }
   }

   const profileStats = [
      {
         icon: Shield,
         label: "Account Type",
         value: user?.subscriptionTier?.toUpperCase() || "FREE",
         color: colors.primary,
      },
      {
         icon: Calendar,
         label: "Member Since",
         value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : "2024",
         color: colors.secondary,
      },
   ]

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
               <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Manage your account information
               </Text>
            </View>

            <TouchableOpacity
               style={[
                  styles.editButton,
                  { backgroundColor: isEditing ? colors.error + "15" : colors.primary + "15" },
               ]}
               onPress={() => (isEditing ? handleCancel() : setIsEditing(true))}
            >
               {isEditing ? (
                  <X size={20} color={colors.error} />
               ) : (
                  <Edit3 size={20} color={colors.primary} />
               )}
            </TouchableOpacity>
         </Animated.View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Card */}
            <Animated.View
               entering={FadeInDown.delay(200).springify()}
               style={[styles.profileCard, { backgroundColor: colors.card }]}
            >
               {/* Avatar Section */}
               <View style={styles.avatarSection}>
                  <Animated.View style={animatedStyle}>
                     <TouchableOpacity
                        style={[styles.avatarContainer, { borderColor: colors.border }]}
                        onPress={handleAvatarPress}
                        disabled={!isEditing}
                     >
                        {user?.avatar ? (
                           <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ) : (
                           <View
                              style={[
                                 styles.avatarPlaceholder,
                                 { backgroundColor: colors.primary + "15" },
                              ]}
                           >
                              <User size={40} color={colors.primary} />
                           </View>
                        )}

                        {isEditing && (
                           <View
                              style={[styles.cameraOverlay, { backgroundColor: colors.primary }]}
                           >
                              <Camera size={16} color={colors.background} />
                           </View>
                        )}
                     </TouchableOpacity>
                  </Animated.View>

                  <View style={styles.avatarInfo}>
                     <Text style={[styles.displayName, { color: colors.text }]}>
                        {user?.first_name} {user?.last_name}
                     </Text>
                     <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                        {user?.email}
                     </Text>
                  </View>
               </View>

               {/* Stats */}
               <View style={styles.statsContainer}>
                  {profileStats.map((stat, index) => (
                     <Animated.View
                        key={index}
                        entering={FadeInRight.delay(300 + index * 100).springify()}
                        style={[styles.statItem, { backgroundColor: colors.surface }]}
                     >
                        <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
                           <stat.icon size={16} color={stat.color} />
                        </View>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                           {stat.label}
                        </Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                     </Animated.View>
                  ))}
               </View>
            </Animated.View>

            {/* Form Section */}
            <Animated.View
               entering={FadeInDown.delay(400).springify()}
               style={[styles.formSection, { backgroundColor: colors.card }]}
            >
               <Text style={[styles.formTitle, { color: colors.text }]}>Personal Information</Text>

               <View style={styles.formGrid}>
                  <View style={styles.formRow}>
                     <View style={styles.formField}>
                        <TextInput
                           label="First Name"
                           value={formData.firstName}
                           onChangeText={value => updateFormData("firstName", value)}
                           placeholder="Enter first name"
                           editable={isEditing}
                           error={errors.firstName}
                        />
                     </View>
                     <View style={styles.formField}>
                        <TextInput
                           label="Last Name"
                           value={formData.lastName}
                           onChangeText={value => updateFormData("lastName", value)}
                           placeholder="Enter last name"
                           editable={isEditing}
                           error={errors.lastName}
                        />
                     </View>
                  </View>

                  <TextInput
                     label="Username"
                     value={formData.username}
                     onChangeText={value => updateFormData("username", value)}
                     placeholder="Enter username"
                     editable={isEditing}
                     error={errors.username}
                  />

                  <TextInput
                     label="Email Address"
                     value={formData.email}
                     onChangeText={value => updateFormData("email", value)}
                     placeholder="Enter email address"
                     keyboardType="email-address"
                     autoCapitalize="none"
                     editable={isEditing}
                     error={errors.email}
                  />
               </View>

               {isEditing && (
                  <Animated.View entering={FadeInDown.springify()} style={styles.formActions}>
                     <Button
                        title="Save Changes"
                        onPress={handleSave}
                        loading={isLoading}
                        variant="primary"
                        size="large"
                        fullWidth
                     />
                  </Animated.View>
               )}
            </Animated.View>

            {/* Account Actions */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Actions</Text>

               <View style={styles.actionsList}>
                  <TouchableOpacity
                     style={[
                        styles.actionItem,
                        { backgroundColor: colors.card, borderColor: colors.border },
                     ]}
                     onPress={() => {}}
                  >
                     <View style={styles.actionLeft}>
                        <View
                           style={[styles.actionIcon, { backgroundColor: colors.warning + "15" }]}
                        >
                           <Shield size={20} color={colors.warning} />
                        </View>
                        <View style={styles.actionContent}>
                           <Text style={[styles.actionTitle, { color: colors.text }]}>
                              Change Password
                           </Text>
                           <Text
                              style={[styles.actionDescription, { color: colors.textSecondary }]}
                           >
                              Update your account password
                           </Text>
                        </View>
                     </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={[
                        styles.actionItem,
                        { backgroundColor: colors.card, borderColor: colors.border },
                     ]}
                     onPress={() => {}}
                  >
                     <View style={styles.actionLeft}>
                        <View style={[styles.actionIcon, { backgroundColor: colors.error + "15" }]}>
                           <X size={20} color={colors.error} />
                        </View>
                        <View style={styles.actionContent}>
                           <Text style={[styles.actionTitle, { color: colors.error }]}>
                              Delete Account
                           </Text>
                           <Text
                              style={[styles.actionDescription, { color: colors.textSecondary }]}
                           >
                              Permanently delete your account
                           </Text>
                        </View>
                     </View>
                  </TouchableOpacity>
               </View>
            </Animated.View>

            {/* Security Note */}
            <Animated.View
               entering={FadeInDown.delay(800).springify()}
               style={[styles.securityNote, { backgroundColor: colors.surface }]}
            >
               <View style={[styles.securityIcon, { backgroundColor: colors.success + "15" }]}>
                  <Shield size={20} color={colors.success} />
               </View>
               <View style={styles.securityContent}>
                  <Text style={[styles.securityTitle, { color: colors.text }]}>
                     Your data is secure
                  </Text>
                  <Text style={[styles.securityText, { color: colors.textSecondary }]}>
                     All profile information is encrypted and stored securely. We never share your
                     personal data with third parties.
                  </Text>
               </View>
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
   editButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
   },
   content: {
      flex: 1,
      paddingHorizontal: 20,
   },
   profileCard: {
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
   },
   avatarSection: {
      alignItems: "center",
      marginBottom: 24,
   },
   avatarContainer: {
      position: "relative",
      marginBottom: 16,
   },
   avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
   },
   avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
   },
   cameraOverlay: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
   },
   avatarInfo: {
      alignItems: "center",
   },
   displayName: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 4,
   },
   userEmail: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
   },
   statsContainer: {
      flexDirection: "row",
      gap: 12,
   },
   statItem: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
   },
   statIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
   },
   statLabel: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      marginBottom: 4,
      textAlign: "center",
   },
   statValue: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.bold,
      textAlign: "center",
   },
   formSection: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
   },
   formTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
      marginBottom: 20,
   },
   formGrid: {
      gap: 16,
   },
   formRow: {
      flexDirection: "row",
      gap: 16,
   },
   formField: {
      flex: 1,
   },
   formActions: {
      marginTop: 24,
   },
   section: {
      marginBottom: 24,
   },
   sectionTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
      marginBottom: 16,
   },
   actionsList: {
      gap: 12,
   },
   actionItem: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
   },
   actionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
   },
   actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   actionContent: {
      flex: 1,
   },
   actionTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   actionDescription: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   securityNote: {
      flexDirection: "row",
      borderRadius: 12,
      padding: 16,
      marginBottom: 32,
   },
   securityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   securityContent: {
      flex: 1,
   },
   securityTitle: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.semiBold,
      marginBottom: 4,
   },
   securityText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      lineHeight: 20,
   },
})
