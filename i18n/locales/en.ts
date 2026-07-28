/*
 * English is the reference locale: every other file is typed against its
 * shape, so a missing key in a translation is a compile error rather than a
 * blank label discovered by a user.
 *
 * Note the absence of `as const`. With it, `Translations` would pin each value
 * to its literal English text and every translated string would fail to
 * assign - the type has to describe the *keys*, not the copy.
 * **/
export const en = {
   common: {
      cancel: "Cancel",
      save: "Save",
      done: "Done",
      retry: "Retry",
      search: "Search",
      back: "Back",
      approx: "approx.",
   },
   auth: {
      signIn: "Sign In",
      signUp: "Sign up",
      createAccount: "Create Account",
      joinToday: "Join SafeRead today",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      enterUsername: "Enter your username",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
   },
   settings: {
      title: "Settings",
      account: "Account",
      preferences: "Preferences",
      support: "Support",
      accountActions: "Account Actions",
      theme: "Theme",
      profile: "Profile",
      changePassword: "Change Password",
      privacySecurity: "Privacy & Security",
      language: "Language",
      currency: "Currency",
      helpSupport: "Help & Support",
      signOut: "Sign Out",
   },
   currency: {
      title: "Currency",
      subtitle: "Plan prices are shown in this currency. Converted amounts are approximate.",
      useDevice: "Use my device region",
      currently: "Currently {{code}}",
      searchPlaceholder: "Search currencies...",
      noMatch: "No currency matches “{{query}}”.",
      billedIn: "billed in {{code}}",
   },
   language: {
      title: "Language",
      subtitle: "Choose the language SafeRead speaks to you in.",
      useDevice: "Use my device language",
      searchPlaceholder: "Search languages...",
      noMatch: "No language matches “{{query}}”.",
   },
   spaces: {
      title: "Spaces",
      createNew: "Create New Space",
      updateSpace: "Update Space",
      spaceName: "Space Name",
      descriptionOptional: "Description (optional)",
      enterName: "Enter name",
      enterDescription: "Enter description",
      chooseColor: "Choose Color",
      chooseIcon: "Choose Icon",
      privacy: "Privacy",
      favouriteSpace: "Favourite Space?",
      createSpace: "Create Space",
      creating: "Creating...",
      updating: "Updating...",
   },
}

export type Translations = typeof en
