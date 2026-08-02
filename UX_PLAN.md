# SafeRead — UX Repair Plan

The backlog that `/improve-ux` works through. Companion to [ROADMAP.md](ROADMAP.md), which
owns feature and release work; this file owns **navigation, feedback, and interface
consistency** only.

**Audited:** 2026-08-02, against `main`-equivalent working tree on branch `code-improvement`.
Every finding below was read in the source or reproduced against the backend — none are
inferred from naming. File:line references are from the audit and must be re-verified before
editing (they drift).

**Scope:** the Expo app (`.`) plus the four backend endpoints the app's dead flows depend on
(`../saferead_backend/`). The Next.js marketing site is out of scope.

---

## How to use this

Say **`/improve-ux`**. The skill (`.claude/skills/improve-ux/SKILL.md`) picks the first
unchecked task in the lowest incomplete phase, does it, verifies it against its **Done when**,
ticks the box, and logs one line. By default it keeps going through the phase; `/improve-ux
UX-07` does one named task, `/improve-ux phase A` does one phase.

**Phases are ordered by damage, not by effort.** Phase A is "the app traps or lies to the
user"; Phase E is polish. Do not reorder.

### Conventions

- Frontend paths are relative to this repo; backend paths to `../saferead_backend/`.
- Match surrounding style: **3-space indent, no semicolons**, `@/*` path alias.
- Design tokens only — `Spacing`, `Radii`, `Type`, `Motion`, `elevation`, `withAlpha` from
  `constants/Design.ts`; colours from `useTheme().colors`. **Never** a raw hex or a raw
  pixel number in a new style. `Type` (a full text style) over bare `FontSizes`.
- **The palette rule is law:** chrome is desaturated so colour means something. Saturation is
  reserved for the risk ramp (`riskLow/Medium/High/Critical`) and status. Do not introduce a
  hue to make a screen look livelier.
- Never write `entering={FadeInDown…}` — use `<FadeInView>` (see UX-22 for why).
- Every new interactive element gets `accessibilityRole` **and** `accessibilityLabel`, and
  `hitSlop` if its visual target is under 44pt.
- Verification is `tsc --noEmit` plus the task's own check. Never tick a box you could not
  verify; say so and leave it open.
- Never commit or push unless asked.

---

## Phase A — Dead ends and dead controls

*The app currently contains screens you cannot leave, buttons that do nothing, and one flow
that is broken end to end. Nothing else matters until these are gone.*

- [ ] **UX-01 — Password recovery is broken end to end**
  `app/(auth)/forgot-password.tsx`, `app/(auth)/reset-password.tsx`, `app/(auth)/_layout.tsx`,
  `app.json`, `../saferead_backend/user_auth/urls.py`

  Three independent breaks stacked on one flow:
  1. `POST /auth/password/reset/` **500s**. dj-rest-auth builds the email link by reversing
     `password_reset_confirm`; Django's `auth.urls` and allauth's urls are both absent from
     `config/urls.py`, so it raises `NoReverseMatch`. Verified 2026-08-02:
     `reverse('password_reset_confirm')` → `NoReverseMatch`, same for
     `account_reset_password_from_key` and `rest_password_reset_confirm`.
  2. `reset-password.tsx` is **unreachable**. Nothing in the app navigates to it, it is not
     declared in `(auth)/_layout.tsx`'s `Stack`, and `app.json` has a `scheme`
     (`com.saferead.app`) but no linking config that maps an emailed URL to `uid`/`token`.
  3. `forgot-password.tsx` calls `showBottomAlert(...)` then `router.back()` on the next line
     — the success alert is raised on a screen that is being popped.

  **Change.** Backend: add a `password/reset/confirm/<uidb64>/<token>/` route named
  `password_reset_confirm` so the reverse resolves, pointing at a minimal view that redirects
  into the app's deep link (`com.saferead.app://reset-password?uid=…&token=…`) with an HTML
  fallback page for desktop. Override `PASSWORD_RESET_SERIALIZER`'s email template so the link
  is that URL. Frontend: declare `forgot-password` and `reset-password` in the auth `Stack`,
  add the deep-link path to `app.json`, and move `router.back()` into the success alert's
  `onPress` so the alert is acknowledged before the screen leaves.

  **UI.** No new screens. `forgot-password` keeps its layout; the success message changes to
  name the address it sent to ("If an account exists for jordan@acme.com…") because a generic
  confirmation gives a user who typed the wrong address nothing to notice.

  **Done when:** `POST /auth/password/reset/` returns 200 (not 500) for a real address —
  assert it in `../saferead_backend/user_auth/tests.py`; the emailed link opens
  `reset-password` with both params populated on a device; and submitting it logs the user in
  with the new password.

- [ ] **UX-02 — `scan_menu_screen` is orphaned, and takes twelve components with it**
  `app/(application)/scan_menu_screen.tsx`, `app/(application)/_layout.tsx`,
  `components/tabs/TopTabBar.tsx`, `components/tabs/DocumentTab/*` (7 files),
  `components/tabs/ConversationsTab/*` (2), `components/tabs/FilesTab/*` (2),
  `hooks/screens/useConverSationTab.ts`, `hooks/screens/useDocumentScreen.tsx`

  Nothing in the app navigates to `scan_menu_screen`. It is registered in the stack, it has
  **no back control of its own**, and it renders a three-tab shell (Documents /
  Conversations / Files) whose functionality is duplicated by the Spaces tab, the Chat tab and
  the Analyze screen. `FilesTab/index.tsx:47` pushes `/spaces/${activeSpace.id}` from inside
  it.

  It also holds the **only** `suppressKey: "delete-document"` call site
  (`DocumentTab/DocumentTabCard.tsx:27`) — so that suppression key can never be set, while the
  reachable document delete (UX-19) has no key at all.

  **Change.** Delete the screen, its `Stack.Screen` entry, and the component subtree, after
  confirming with `grep` that nothing outside it imports each file. Move the
  `delete-document` suppressKey to the live call site as part of UX-19. If the Conversations
  list is worth keeping, it belongs on the Chat tab — file it as a new task rather than
  keeping a dead screen alive as its host.

  **UI.** Net removal. No user-visible change; the screen is unreachable today.

  **Done when:** `grep -rn "scan_menu_screen\|TopTabBar\|DocumentTab\|ConversationsTab\|FilesTab"`
  over `app/` and `components/` returns nothing, `tsc --noEmit` is clean, and the app builds.

- [ ] **UX-03 — Three loading states are permanent dead ends on failure**
  `app/(application)/analysisres.tsx:40,49-55`, `app/(application)/contracts/[id].tsx:96-102`,
  `app/(application)/spaces/[id].tsx:74-80`

  All three render a bare loader when the record is absent, with **no back control and no
  error branch** — so a 404, a deleted row, a wrong-workspace id or a failed request leaves
  the user on a spinner (or, in `analysisres`, an unthemed `<Text>No analysis result found.</Text>`
  with no styling, no safe area and no exit) with no way out but killing the app.
  `analysisres`'s fallback also renders on the *first* frame of a normal open from Home, since
  `useDocument` has not resolved and the store snapshot belongs to a different document.

  **Change.** One shared pattern, applied to all three: read `isLoading`, `isError` and `error`
  from the query; render a top bar with a working back control **outside** every branch (the
  chrome-must-not-live-in-a-conditional rule the Contracts tab already follows); loading →
  skeleton or spinner *under* that bar; error → the contracts `EmptyState` with the real
  message from `getErrorMessage(error)` and a **Try again** action wired to `refetch`;
  resolved-but-empty → a distinct "this no longer exists" state whose action goes back to the
  list, not to a retry.

  **UI.** Reuse `components/contracts/EmptyState.tsx` (compact card, no particles) so a failed
  load looks the same in all three places. Back control is the existing 34pt `iconBtn` +
  `ChevronLeft` pattern from `contracts/[id].tsx:218-227`.

  **Done when:** with the backend stopped, each of the three screens shows a titled error with
  a working **Try again** and a working back; and opening a valid record still works. Verify by
  navigating to a fabricated UUID in each.

- [ ] **UX-04 — `+not-found` is unthemed and invisible in dark mode**
  `app/+not-found.tsx`

  No `useTheme`, no background colour, and `styles.text` sets no colour — so it renders default
  black text over the themed dark background. `<Link href="/">` also sends a signed-out user to
  a route that immediately redirects to `welcome`, which reads as the button doing nothing.

  **Change.** Theme it, and route on auth state: authenticated → `/(application)/(tabs)`,
  otherwise → `/(auth)/welcome`.

  **UI.** Match `components/contracts/EmptyState.tsx` — icon in a `primaryFaded` tile, `Type.subheading`
  title, `Type.bodySmall` body, one primary `Button`. Copy: "That screen doesn't exist" /
  "The link may be old, or the item was deleted."

  **Done when:** the screen is legible in both themes (check with `resize_window` colorScheme),
  and its action lands somewhere real in both auth states.

- [ ] **UX-05 — The Premium upgrade button does nothing**
  `app/(application)/(tabs)/premium.tsx:112-116`, `components/plans/UpgradeCard.tsx`,
  `../saferead_backend/user_plan/views.py`

  `onPress={() => {}}` on the primary CTA of the pricing screen. There is no toast, no error,
  no navigation — a user selects Professional, taps "Upgrade to Professional", and nothing
  happens at all. The backend is honest about this (paid tiers answer **501**, contact tiers
  **400**, because no processor is wired), but the client never asks, so the user gets silence
  instead of the 501.

  This is also ROADMAP **T-35**, which is a store-rejection risk. This task is the UX half:
  *stop lying*, whether or not IAP ever lands.

  **Change.** Until a processor exists, a paid tier must not offer a purchase. Replace the dead
  button with a **notify-me** affordance that posts to `/plans/enquiry/` (the endpoint already
  exists, is `AllowAny`, and is throttled) carrying the plan — reusing `ContactSalesForm`'s
  submit path. If the product decision is to hide paid tiers entirely for v1, gate on a single
  `PAID_TIERS_ENABLED` constant in `constants/server.ts` so it is one line to flip back.

  **UI.** Keep `PlanSelector` and `PlanDetail` exactly as they are — the tier comparison is the
  screen's real value and stays. Only the CTA block changes: primary button label "Tell me when
  this is available", plus the existing `ctaNoteText` line reading "Not yet available for
  self-service purchase." Do not grey the button out — a disabled button with no explanation is
  the same dead end in a different costume.

  **Done when:** no button in the app initiates a purchase that cannot complete; the notify
  path returns 201 and shows a success alert; tapping the featured plan on `UpgradeCard` in
  Settings reaches the same honest state.

- [ ] **UX-06 — The Privacy & Security screen is entirely decorative**
  `app/(application)/privacy.tsx:83-101,273`

  `privacyControls` is three rows — each with a `ChevronRight` promising a destination — whose
  `action` is `() => {}`. "Contact Privacy Team" is `onPress={() => {}}`. The footer says
  "Last updated: December 2024". The screen is reachable from Settings → Privacy & Security, so
  every one of those is a live dead control.

  ROADMAP **T-36** needs this screen to actually work before a store build.

  **Change.** Cut what cannot be delivered and make the rest real. Keep: the plain-English
  explanation of what leaves the device (documents are uploaded and sent to third-party LLM
  providers — say so, it is the disclosure Apple and Google both require), a link to the hosted
  privacy policy via `Linking.openURL`, and `settings.LEGAL_DISCLAIMER`. Add: **Delete my
  account**, which is the one control that must exist (see UX-07). Delete the three no-op
  control rows and the dead contact button rather than wiring them to placeholder screens.

  **UI.** Convert to the `SettingsGroup`/`SettingsItem` components already used by the Settings
  screen so Privacy reads as part of Settings rather than a bespoke page with its own type
  scale. Drop the eleven staggered `FadeInDown.delay(…)` entrances (see UX-22). Replace the
  hardcoded date with a `PRIVACY_POLICY_UPDATED` constant in `constants/server.ts`.

  **Done when:** no control on the screen is a no-op, the policy link opens, and the disclosure
  names third-party LLM processing explicitly.

- [ ] **UX-07 — Account deletion does not exist anywhere in the app**
  `components/profile/ProfileActions.tsx`, `app/(application)/profile.tsx:1`,
  `app/(application)/privacy.tsx`, `hooks/screens/useSettingsGroup.ts`,
  `../saferead_backend/user_auth/` (new endpoint)

  `ProfileActions` holds "Change Password" and "Delete Account" as two `// TODO` no-ops — and
  is **imported by `profile.tsx:1` but never rendered**, so it is dead code wrapping dead
  buttons. There is no delete path anywhere else. Apple 5.1.1(v) and Google both require an
  in-app account deletion path; this blocks submission (ROADMAP T-36).

  **Change.** Backend: `DELETE /auth/user/delete/` (authenticated, requires the account
  password in the body as re-authentication), which deletes the `UserProfile` and everything
  cascading from it, and drops the auth token. Frontend: delete `ProfileActions.tsx` and its
  unused import; add a single **Delete account** row to Settings under "Account actions" beside
  Sign out.

  **UI.** `danger: true` row, same treatment as Sign out. Confirmation is a `DrawerAlert` with
  `type: "error"` and **no `suppressKey`** — this is the one confirmation that must never be
  silenceable. Copy names what goes: "Your account, every scan, every space and every contract
  will be permanently deleted. This cannot be undone." Actions ordered escape-hatch-first
  (`Cancel`, then `Delete account` as `destructive`), per the alert convention. Require typing
  the password before the destructive action enables.

  **Done when:** a test account can delete itself from Settings, the row is gone from the
  database, the app returns to `welcome`, and the old token 401s. Asserted in
  `../saferead_backend/user_auth/tests.py`.

- [ ] **UX-08 — Help & Support advertises four channels; one works**
  `app/(application)/help.tsx:100,109-119,130-142,389`

  - Live chat: `action: () => {}`.
  - Phone: `Linking.openURL("tel:+1-800-LEGAL-AI")` — a **fabricated US vanity number**, and
    `tel:` URIs do not dial letters, so it fails on every device. The product is India-first
    (₹ pricing, `Asia/Kolkata`, `eng+hin+mar` OCR).
  - Three "resources" (user guide, video tutorials, documentation): all `action: () => {}`.
  - The screen's bottom primary CTA calls `supportOptions[0].action()` — the dead live chat.
  - Email (`mailto:support@saferead.app`) is the only one that does anything, and only if that
    mailbox exists.

  **Change.** Reduce to what is real. Keep the FAQ and the searchable categories — those are
  genuinely useful and fully local. Keep email, pointing at a mailbox that exists. Delete live
  chat, the phone number and the three resource links. Re-point the bottom CTA at email.

  **UI.** With three of four channels gone the support block becomes one card rather than a
  grid — collapse it instead of leaving a one-item grid with two empty cells. Move the FAQ up:
  it is now the screen's primary content, not a section below the contact options. Also review
  the FAQ answers themselves against the current product — "paste text directly into the chat"
  describes a capability the chat composer does not have.

  **Done when:** every affordance on the screen either performs an action or is gone, and the
  FAQ text matches what the app actually does.

- [ ] **UX-09 — The scan-history screen has no header, no back, and no tab**
  `app/(application)/(tabs)/analyize.tsx`, `components/analyize/AnalyticsPanel.tsx`,
  `components/tabs/BottomTabBar.tsx`

  `analyize` is `href: null`, so it is filtered out of the bar's `visibleRoutes` — pushing to it
  leaves **no tab appearing selected**, the screen renders no title, no back control and no
  `SettingsButton`, and its only entry point is Home → "See all". The same shape applies to
  `settings` and `premium`: they are tab routes pushed as leaves, so the floating tab bar hovers
  over them with nothing highlighted.

  **Change.** Give `analyize` the standard screen header used by the four real tabs — eyebrow +
  title + `SettingsButton` — plus a back control, since it is entered by push. Confirm `settings`
  and `premium` keep their own back controls (they do) and decide deliberately whether the tab
  bar should be visible on them; if not, hide it via `useTabStore` on focus rather than by
  restructuring routes.

  **UI.** Header matches `contracts.tsx:139-164` exactly: `Type.overline` eyebrow ("ACTIVITY"),
  `Type.title` ("Scans"), actions right-aligned. `AnalyticsPanel`'s bespoke "Analytics" heading
  and its own type scale go away in favour of that header; the panel keeps only the stat cards.

  **Done when:** every screen reachable by push has a visible way back that is not the OS
  gesture, and no screen renders a tab bar with nothing selected.

- [ ] **UX-10 — Eight different Home affordances all land on the same unfiltered list**
  `app/(application)/(tabs)/index.tsx:98,103,111,138,144,145,152,212,273`,
  `app/(application)/(tabs)/contracts.tsx`

  "3 obligations are overdue", "2 deadlines are closing in", "1 contract has a critical
  clause", money owed, money owed to you, portfolio contract count, the deadline section's
  "See all", and the workspace pitch CTA **all call
  `router.push("/(application)/(tabs)/contracts")`** with no parameters. The user taps a
  specific, urgent, counted claim and gets the same undifferentiated contract list every time —
  and obligations and events are not even contract rows, so two of those counts have no
  representation on the destination at all.

  This is the single biggest navigational defect in the app: the command centre is well
  designed and its links go nowhere in particular.

  **Change.** Make the destination answer the question that was tapped.
  - `contracts.tsx` already has `panelFilters` state and a `UniversalFilter`; accept the same
    keys as route params via `useLocalSearchParams` and seed the filter state from them, so
    "critical clauses" pushes `?risk=critical` and lands on a filtered portfolio with the chip
    row showing what was applied.
  - Obligations and deadlines need a destination that shows *them*. Add
    `app/(application)/contracts/obligations.tsx` (list + `direction` filter + the
    `onToggleDone` mutation that already exists in `useUpdateObligation`) and
    `app/(application)/contracts/deadlines.tsx` (the `/contracts/events/upcoming/` list, sorted
    on `action_by_date` per the dates rule). Route the overdue/closing/money rows there.

  **UI.** When a list arrives pre-filtered it must say so: render the active filter as a
  removable chip above the list (reuse `components/filters/SelectableChip.tsx`) with a "Clear"
  affordance, so a user who lands on 3 of their 40 contracts is never left thinking 37 vanished.
  The two new screens reuse `ObligationRow` and `DeadlineRow` verbatim — they exist and are
  already used on the detail screen.

  **Done when:** every counted claim on Home navigates to a view showing exactly those items,
  the applied filter is visible and clearable, and no two different claims share a destination.

- [ ] **UX-11 — A deadline can be seen but never resolved**
  `app/(application)/contracts/[id].tsx:132-143`, `components/contracts/DeadlineRow.tsx`,
  `hooks/queries/contracts.ts`

  On the contract detail screen `DeadlineRow` is rendered with `hideContract` and **no
  `onPress`** — it is inert. The backend models resolution properly (`ContractEvent.resolution`
  → `ContractAction`), and Home filters on `is_unresolved`, so an event the user has already
  handled keeps appearing in the attention hero **forever** with no control anywhere in the app
  to clear it. The system's most urgent surface is un-dismissable.

  **Change.** Add a resolve action: `POST` a `ContractAction` and set the event's `resolution`.
  Wire it from `DeadlineRow` on both the detail screen and the new deadlines screen (UX-10).
  Mirror the pattern of `ObligationRow`'s existing `onToggleDone`.

  **UI.** A trailing check control on the row, matching `ObligationRow`'s. Resolving is
  reversible, so no confirmation drawer — but it must be visibly optimistic and it must roll
  back on failure. Once resolved, the row stays in place with a muted, struck treatment for the
  rest of the session rather than vanishing under the finger.

  **Done when:** resolving a deadline on the detail screen removes it from Home's attention
  hero on next refetch, and the action appears in the contract's Activity log.

## Phase B — Honest feedback

*The app has good error machinery and does not use it. These are the places where something
went wrong and the user was told nothing, told JSON, or told a lie.*

- [ ] **UX-12 — Plan-limit denials render as raw JSON**
  `hooks/useAnalyzeAction.ts:83`, `utils/helpers/respErrors.ts`, `utils/attempt.ts:129-141`,
  `utils/apiclient.ts:73-105`

  The backend builds a specific, helpful denial message for every plan gate
  (`user_plan/permissions.py` `BasePlanPermission` composes it from the plan's real numbers).
  It never reaches the user. `attempt`'s `serverError()` looks for `data.message || data.error`,
  finds neither in DRF's `{"detail": "…"}` shape, and falls through to
  `JSON.stringify(response.data)`. `useAnalyzeAction` then renders `error.message` **directly**
  — bypassing `getErrorMessage`, which is the function that would have unwrapped it. So hitting
  a scan limit shows an alert whose body is `{"detail":"You have reached..."}`.

  There is also **no 403 branch** in the response interceptor — only 401 — so a quota denial
  gets no upgrade path, just a failed action.

  **Change.** Fix it once, at the root: teach `serverError()` about `detail` and
  `non_field_errors` so every consumer of `attempt` gets prose. Then make `useAnalyzeAction`
  (and every other site rendering `error.message` raw) use `getErrorMessage`. Add a 403 branch
  to `handleApiError` that raises the drawer alert with an **Upgrade** action routing to
  `/premium`.

  **UI.** The quota alert is `type: "info"`, not `error` — being asked to upgrade is not a
  failure. Two actions, escape-hatch first: `Not now`, then `See plans` as `primary`.

  **Done when:** with a Free account at its scan limit, attempting a scan shows the backend's
  own sentence and a working route to the pricing screen — no JSON, no braces. Reproduce by
  setting the Free plan's `documents_scanned` limit to 0 in the admin.

- [ ] **UX-13 — Launching offline shows the normal UI; going offline nukes the app**
  `hooks/net/useNetworkStatus.ts`, `app/_layout.tsx:76-78`, `components/OfflineScreen.tsx`

  `useNetworkStatus` initialises to `false` and only ever updates from
  `addNetworkStateListener`. It never calls `Network.getNetworkStateAsync()`, so an app
  **launched** with no connection renders the full authenticated UI and fails every request
  individually with "Can't connect". And when the listener does fire, `AppContent` replaces the
  **entire tree** with `OfflineScreen` — discarding navigation state, a half-written chat
  message, and an in-flight upload.

  **Change.** Read the initial state once on mount. Then stop replacing the app: render a
  persistent offline banner above the navigator instead, and let cached React Query data stay
  on screen. Reserve the full-screen takeover for the signed-out/first-launch case where there
  is genuinely nothing cached to show.

  **UI.** Banner at the top edge, `colors.warningBackground` on `colors.warning`, one line
  ("You're offline — showing your last synced data"), sliding in with `Motion.springQuick` and
  out again on reconnect. It must not overlay the header content — push the tree down by its
  height, since a banner that covers the back button recreates UX-03.

  **Done when:** launching in airplane mode shows the banner over cached content rather than
  falling through to per-request errors; toggling connectivity mid-session neither unmounts the
  current screen nor loses typed input.

- [ ] **UX-14 — Onboarding replays on every cold start**
  `app/(auth)/_layout.tsx:13-20`, `hooks/useOnBoarding.ts:8-9`

  `useOnboarding` starts at `hasCompletedOnboarding: null, isLoading: true`. The layout's switch
  tests `!isAuthenticated && !hasCompletedOnboarding` **before** `isLoading` — and `null` is
  falsy — so every signed-out cold start renders the full onboarding carousel for the duration
  of the AsyncStorage read, then swaps it out. A returning user sees their first-run experience
  flash on every launch.

  **Change.** Test `isLoading` first, or make `hasCompletedOnboarding` unresolvable-until-known
  by branching on `=== false` rather than falsiness. The second is safer: it cannot regress if
  someone reorders the switch.

  **UI.** During the read, hold the splash rather than flashing a spinner — the read is a few
  milliseconds and a spinner that appears for one frame is worse than nothing.

  **Done when:** on a build where onboarding was completed, force-quitting and relaunching shows
  no onboarding frame at all. Verify by recording the launch, not by eye.

- [ ] **UX-15 — The "unsupported contract" copy names four types; the product supports eight**
  `app/(application)/contracts/[id].tsx:339-345`, `app/(application)/(tabs)/contracts.tsx:29-36`

  The `unsupported` banner reads "SafeRead currently extracts MSAs, SOWs, NDAs and vendor
  agreements." The backend's `Contract.SUPPORTED_TYPES` is **eight** — those four plus
  `employment`, `lease`, `sale_deed` and `settlement` — and the client's own
  `SUPPORTED_CONTRACT_TYPES` already lists all eight. So a user whose rent agreement was
  refused is told a lie about why, and a user reading the banner concludes the product cannot
  do things it can. The header comment in `contracts.tsx` is stale in the same way.

  **Change.** Derive the sentence from `SUPPORTED_CONTRACT_TYPES` + `CONTRACT_TYPE_LABELS`
  rather than writing it out — the whole reason those constants exist is so this cannot drift
  again. Name the type that *was* detected too: the classifier reports it, and "this looks like
  a Power of Attorney, which SafeRead does not analyse yet" is a far better refusal than a list.

  **UI.** No layout change. The banner keeps its `Ban` icon and neutral surface — this is a
  scope limit, not an error, and it must not read as red.

  **Done when:** the banner is generated from the constants (adding a ninth type to the union
  changes the copy with no edit here), and it names the detected type.

- [ ] **UX-16 — The scan button always sends `document_type: "other"`**
  `components/ScanBtn.tsx`, `hooks/useDocumentScan.ts:24,102,127`,
  `store/useAnalysisStore.ts:41`, `components/analyize/UploadOptions.tsx`

  `useDocumentScan` reads `selectedDocumentType` from the store, whose default is `"other"`.
  The only UI that sets it is `DocumentTypeSelector`, rendered inside `UploadChip` on the
  **analyze** screen — which is `href: null` and reached only via Home → "See all". The raised
  centre scan button is the app's primary action and never touches it, so effectively every
  scan is typed `other`. The backend feeds that type into the analysis prompt as a label, so
  the model is being told nothing on almost every request.

  **Change.** Ask in the flow that already asks. `handleDocumentScan` opens a drawer to choose
  camera/gallery/files; add the document type as a second step in the same drawer (or as a
  segmented row inside the first), defaulting to the last used. It is one extra tap on a flow
  that already has three, and it is the tap that improves every result.

  **UI.** Reuse the existing chip row visual from `contracts/new.tsx:114-145`. Four options
  (Terms, Privacy policy, Legal document, Other) with Other pre-selected — never leave a
  required-feeling choice unselected in a flow whose next step is the camera.

  **Done when:** a scan started from the tab bar carries the chosen type end to end — assert the
  value on the created `DocumentScan`, not just in the UI.

## Phase C — Features the UI offers and the app does not have

- [ ] **UX-17 — The language picker changes almost nothing**
  `i18n/locales/{en,es,fr,hi}.ts`, `app/(application)/language.tsx`,
  `hooks/screens/useSettingsGroup.ts`, and every screen

  Four locales ship, Settings has a Language row, and the picker works — but **exactly two
  files call `useTranslation`**: `language.tsx` itself and `useSettingsGroup.ts`. `en.ts` is 85
  lines against 170 screen and component files. A user who picks हिन्दी gets about ten
  translated settings labels and an otherwise entirely English app. That is worse than
  offering no picker, because it looks like a bug in the translation rather than an absence of
  one.

  It also sits badly against the backend, which was deliberately made multilingual —
  `RESPOND_IN_DOCUMENT_LANGUAGE`, Devanagari OCR, `OCR_LANGUAGES=eng+hin+mar`. The analysis
  comes back in Hindi and the chrome around it is in English.

  **Change.** Two honest options; pick one and commit:
  1. **Ship one language.** Remove `es`/`fr`/`hi` and the Language row until the strings exist.
     Smallest diff, no lie.
  2. **Actually localise.** Extract user-facing strings to `en.ts` screen by screen and
     translate. This is many sittings — if chosen, split it here into one task per feature area
     (auth, home, contracts, spaces, chat, settings) and do them in that order.

  Recommended: **(1) now, (2) as its own phase later.** Hindi is the locale that matters for this
  product; shipping it half-done in the same release as Devanagari OCR undersells the OCR work.

  **UI.** If (1): the Preferences group loses a row; nothing else moves. If (2): every screen
  must be re-checked for text truncation — Hindi and French both run longer than English, and
  several headers are `numberOfLines={1}`.

  **Done when:** the set of offered languages equals the set of languages the app is actually
  in, verified by switching to each offered locale and finding no untranslated screen.

- [ ] **UX-18 — A deadline-driven product has no notifications**
  `hooks/screens/useSettingsGroup.ts:107-120`, `app.json`

  Two settings rows are commented out — Text-to-Speech and Notifications — both reading
  `user?.preferences`, a field the API does not return. Beyond the dead rows: the product's core
  claim is that it tells you before a contract auto-renews, and it can only do that while the
  app is open and the user happens to look at Home. There is no push registration, no
  `expo-notifications` plugin in `app.json`, and no `CELERY_BEAT_SCHEDULE` on the backend (the
  backend OKF says so explicitly).

  **Change.** Out of scope to build here — but the commented rows must go, since they are the
  visible half of a promise nothing keeps. Delete them, and file notifications as a real
  feature task on ROADMAP.md rather than leaving a stub in Settings.

  **UI.** Preferences group shrinks. No placeholder, no "coming soon" row — a disabled toggle
  is a dead control (see Phase A).

  **Done when:** no commented-out settings rows remain, and a notifications task exists on the
  roadmap with the backend beat-schedule work named.

## Phase D — Consistency and craft

*Individually small; collectively the reason the app reads as several apps.*

- [ ] **UX-19 — Destructive confirmations are inconsistent, and the live one is unsuppressible**
  `app/(application)/spaces/[id].tsx:48-66`, `app/(application)/(tabs)/contracts.tsx:106-129`,
  `hooks/screens/useSpacesScreen.ts:77`, `store/useAlertStore.ts`

  Three delete confirmations, three different treatments. Deleting a space document uses
  `type: "info"` for a destructive action (contracts uses `type: "error"`), styles Cancel as
  `secondary` (contracts uses `ghost`), and carries **no `suppressKey`** — while the
  `delete-document` key exists only in the dead `DocumentTab` subtree being removed in UX-02.

  **Change.** One helper — `confirmDestructive({ title, message, suppressKey, onConfirm })` —
  used by all three sites. It fixes the type, the action order (escape hatch first, per the
  suppression contract), the button styles, and the key.

  **UI.** Every destructive confirmation in the app looks identical: `type: "error"`, `Cancel`
  as `ghost`, the destructive verb as `destructive`, message naming the specific object and
  what else goes with it. Account deletion (UX-07) uses the same helper with no key.

  **Done when:** all three call sites go through the helper, "don't ask me again" works for
  document deletion, and Settings' "Restore hidden prompts" row lists it.

- [ ] **UX-20 — Two different components are called `EmptyState`**
  `components/EmptyState.tsx`, `components/contracts/EmptyState.tsx`

  Incompatible APIs (`description`/`actionTitle` vs `body`/`actionLabel`/`compact`) and wildly
  different visuals: the root one animates **ten floating particles** and reads
  `Dimensions.get("window")` at module scope (the exact stale-dimensions bug ROADMAP T-20 fixed
  in onboarding, still live here); the contracts one is a quiet card. So the empty state a user
  meets depends on which screen they are on.

  **Change.** Keep the contracts one — it is the quieter, newer, token-based component and it
  matches the palette rule. Move it to `components/EmptyState.tsx`, migrate the root one's call
  sites, and delete the particles. Support the one thing the old one had that the new one lacks
  (a secondary action) if any call site uses it.

  **UI.** All empty states become the compact card. Losing the particle animation is the point:
  decoration competing with a risk ramp is what the palette rule exists to prevent.

  **Done when:** one `EmptyState` exists, no screen imports the other, and `grep -rn
  'Dimensions.get' components/` returns nothing at module scope.

- [ ] **UX-21 — `ErrorScreen` repeats the stale-dimensions bug and animates fifteen particles**
  `components/ErrorScreen.tsx:22,113-115`

  `const { width: screenWidth } = Dimensions.get("window")` at module scope — captured once at
  import, so the layout is wrong after a rotation or on any device whose window differs at
  first import. Plus fifteen `FadeInUp` background elements on a screen whose entire job is to
  say something failed.

  **Change.** `useWindowDimensions()`; delete the particle field.

  **UI.** Same structure, no background animation. An error screen should be calm.

  **Done when:** the screen lays out correctly through a rotation, and renders no decorative
  animated elements.

- [ ] **UX-22 — Thirty-five files use the raw Reanimated `entering` API**
  35 files across `app/` and `components/` — enumerate with
  `grep -rl "entering={Fade\|entering={Slide\|entering={Zoom" --include="*.tsx" app components`

  The project's own rule (CLAUDE.md, "Motion") is: **never write `entering={FadeInDown…}`, use
  `<FadeInView>`** — because Reanimated sets the element to `opacity: 0` and relies on its
  driver to bring it back, and on web that driver does not reliably start for a screen mounted
  during a hard page load, so the content stays invisible **permanently**. A failed animation
  must degrade to no animation, never to no content. Expo web is a supported target
  (`.claude/launch.json` → `saferead-web`).

  The rule is documented and unenforced, and the count has grown to 35 files including
  `ChatView`, `ChatBubble`, `DocumentAnalysisView`, `AnalyticsPanel`, `OfflineScreen` and every
  onboarding demo — i.e. the chat transcript, the analysis result and the first-run experience
  can all render blank on web.

  **Change.** Mechanical migration to `<FadeInView>` (which takes `delay` and `index` for
  stagger). Do it in batches by directory, `tsc --noEmit` after each. Then add a lint rule —
  `no-restricted-syntax` on the `entering` JSX attribute — so file 36 fails CI instead of being
  found in the next audit.

  **UI.** Identical on native. On web, content appears.

  **Done when:** the grep returns zero files, the lint rule fails on a reintroduction, and the
  chat and analysis screens render content on a hard reload of the web build.

- [ ] **UX-23 — Half the app's touch targets are unlabelled**
  Repo-wide; start with `components/spaces/SpaceDetails/SpaceDetailTopToolbar.tsx:32-48`,
  `components/settings/SettingsItem.tsx`, `components/chat/*`, `components/documents/*`

  125 `<Pressable>` elements; 57 carry `accessibilityRole`, 39 carry `accessibilityLabel`. The
  Space detail toolbar's three icon buttons (add document, favourite, settings) have neither,
  and no `hitSlop` on 20pt icons. A screen reader reads them as unlabelled buttons, and the
  favourite toggle does not announce its state.

  **Change.** Sweep by directory. Every `Pressable` gets a role and a label; toggles get
  `accessibilityState={{ selected }}`; anything under 44pt gets `hitSlop`. Where a component
  already wraps `PressableScale`, add the props there rather than at each call site.

  **UI.** No visual change except larger effective touch targets.

  **Done when:** `grep -c "<Pressable\|PressableScale"` and `grep -c accessibilityLabel` are
  within a few of each other, and VoiceOver/TalkBack can complete the scan → read analysis flow
  without hitting an unlabelled control.

- [ ] **UX-24 — Two type systems in the same app**
  `app/(application)/help.tsx`, `privacy.tsx`, `profile.tsx`, `(tabs)/settings.tsx`,
  `components/profile/*`, `components/analyize/*`, `components/tabs/*` vs everything newer

  The newer screens (home, contracts, chat, premium, spaces list) use `Type` + `Spacing` +
  `Radii` tokens. The older ones use bare `FontSizes` and raw pixel numbers (`padding: 20`,
  `borderRadius: 14`, `marginBottom: 32`). `Type` exists because it carries line height and
  tracking per role — the reason the plain-English clause paragraphs stopped looking cramped —
  so the old screens are also worse typography, not just different values.

  **Change.** Migrate the listed files to `Type` and the spacing scale. Mechanical, but do it
  per file with a visual check: `Type.body` is not always the right replacement for
  `FontSizes.md`, and picking by size alone re-creates the cramped leading.

  **UI.** Consistent rhythm and leading across every screen. Expect vertical spacing to shift
  slightly on the migrated screens — that is the point.

  **Done when:** `grep -rn "FontSizes\." app components | wc -l` is zero outside
  `constants/Fonts.ts`, and no `StyleSheet` in `app/` or `components/` contains a raw padding,
  margin or borderRadius number.

## Phase E — Release gate

*Cross-referenced with ROADMAP.md Phase 3. These block a store build.*

- [ ] **UX-25 — Full-flow walkthrough on a real device**
  All screens

  After Phases A–D, walk every route on a physical device in both themes and both text-size
  extremes (system font at smallest and largest accessibility sizes). Record each dead end,
  clipped label and unreachable control found, and file them here as new tasks rather than
  fixing them ad hoc.

  Specific things this audit could not check statically: whether `numberOfLines={1}` headers
  clip at large text sizes; whether the keyboard covers the composer on small screens
  (`KeyboardProvider` is mounted but per-screen behaviour is untested); whether the floating tab
  bar's `TAB_BAR_CLEARANCE` is right on a device without a home indicator.

  **Done when:** a checked-off route list exists in the Log below, with every finding either
  fixed or filed.

---

## Log

Newest last. One line per completed task: date, id, what changed, how it was verified.

- 2026-08-02 — plan created from a full audit of `app/`, `components/`, `hooks/`, `utils/` and
  the four backend endpoints the dead flows depend on. No tasks run yet.
