# SafeRead — Mobile App (Expo / React Native)

Onboarding knowledge file. Read this before searching; it should answer "where does X live?"
Paired backend OKF: `../saferead_backend/CLAUDE.md` (separate repo, also a working dir).

**Roadmap:** [ROADMAP.md](ROADMAP.md) is the ordered backlog toward an app store release.
When the user says "run today's task", the `todays-task` skill
(`.claude/skills/todays-task/SKILL.md`) takes the next unchecked item, does exactly that one,
verifies it, and logs it. One ~30-minute task per run — the budget is deliberate.

## What this is

Expo Router app (SDK 57, RN 0.86, React 19) that scans/uploads legal documents (terms,
privacy policies, contracts), gets AI risk analysis from the Django backend, and lets users
group documents into "Spaces" and chat with them via RAG.

## Commands

```bash
pnpm dev            # expo start
pnpm ios            # expo run:ios
pnpm android        # expo run:android
pnpm lint           # expo lint
pnpm format         # prettier --write .
```

Preview via `.claude/launch.json` → config name `saferead-web` (expo web, port 8081).

Env: `sample.env` → `.env`. Only `EXPO_PUBLIC_*` vars reach the client.
`EXPO_PUBLIC_API_URL` must be a LAN IP on a physical device, not `localhost`.

## Conventions

- Path alias `@/*` → repo root (`tsconfig.json`). `strict: true`, `verbatimModuleSyntax: true`.
- Prettier: 3-space indent, no semicolons — match surrounding style.
- Barrel exports exist for `components/`, `constants/`, `components/chat`,
  `components/skeletons`, `components/motion`, `components/onboarding`.
- Validation is zod (`utils/validation/*.ts`) + react-hook-form via `@hookform/resolvers`.
- Icons: `lucide-react-native` and `@expo/vector-icons`.

## Directory map

| Path | Holds |
|---|---|
| `app/(auth)/` | welcome, login, register, forgot/reset password |
| `app/(application)/(tabs)/` | index (home), contracts, scan, spaces, chat; analyize + premium + settings are `href: null` (routable, no tab) |
| `app/(application)/` | analysisres, profile, spaces/[id], contracts/[id], contracts/new, help, language, privacy, change_password, scan_menu_screen |
| `components/<feature>/` | feature-scoped UI: chat, spaces, documents, home, analyize, onboarding, profile, settings, tabs, filters, skeletons, motion |
| `hooks/queries/` | react-query hooks (docs, spaces, converstations, plans) |
| `hooks/screens/` | per-screen logic hooks — screens stay thin |
| `services/*.service.ts` | raw axios calls; **all HTTP lives here** |
| `store/` | zustand stores |
| `types/api/` | response shapes mirroring backend serializers |
| `utils/` | apiclient, attempt, errors, docs (picker/scanner), helpers, validation |
| `constants/` | Colors, Design (Spacing/Radii/Motion/TabBar), Fonts, Document, filters, server |

## Architecture

**Provider tree** — `app/_layout.tsx`: SafeAreaProvider → ThemeProvider → AuthProvider →
ErrorBoundary → DrawerAlertRenderer → GestureHandlerRootView → AppContent
(KeyboardProvider + Stack). Offline is short-circuited by `useNetworkStatus` → `OfflineScreen`.

**QueryClientProvider is NOT at the root** — it lives in `app/(application)/_layout.tsx:35`.
Auth screens have no react-query available.

**HTTP** — `utils/apiclient.ts`: axios instance, `baseURL = serverURL`, 120s timeout.
Request interceptor attaches `Authorization: token <access_token>` (DRF TokenAuth — note the
lowercase `token` scheme, not `Bearer`), skipping `/auth/login` and `/auth/registration`.
Response interceptor: `ERR_NETWORK` → friendly message; `401` → alert, `clearUser()`,
redirect to `/(auth)/login`.

**Token storage** — `expo-secure-store` on native, `AsyncStorage` on web
(`isWeb()` in `utils/helpers/platform.ts`). Key: `access_token`.

**Error style** — `utils/attempt.ts` wraps promises into `{ ok, data, error }`; prefer it
over bare try/catch in services and hooks.

**Mutation invalidation** — `config/mutationCache.ts` installs a global `onSuccess` that
reads `meta.invalidatedQueries` off a mutation and invalidates those keys. Add
`meta: { invalidatedQueries: [["spaces"]] }` instead of hand-rolling invalidation.

**Query keys** — `["documents", filters]`, `["document", id]`, `["spaces", filters]`,
`["spaces","detail",id]`, `["spaces",id,"documents"]`, `["spaces",id,"stats"]`,
`["conversations", filters]`, `["conversations", id, "messages"]`, `["plans"]`.

**Stores** (zustand, `store/`) — `useUserStore` (user + clearUser), `useSpaceStore`
(selectedSpace, activeConverstationId — note the misspelling, it is load-bearing),
`useDocumentStore` (+ `useActiveFilterCount`), `useAnalysisStore`, `useAlertStore`
(imperative alerts), `tab.ts` (`useTabStore`).

**Plans are entirely server-described.** `/plans/` gives the tiers; `/plans/features/`
gives the *catalogue* — every facility a plan can limit, with its label, unit and section,
straight from `user_plan/catalog.py`. `premium.tsx` renders from both, so a limit added in
the Django admin appears in the app with no client release. Nothing about a tier is
hardcoded here any more: which one is pushed is `is_featured`, what a card advertises is
the catalogue's `on_card` flag, and `utils/helpers/plans.ts` (`planHeadlinePrice`,
`describeFeature`, `featureIsIncluded`) is the only place that turns a feature value into
words.

A plan with `pricing_mode: "contact"` has **no price** — `planHeadlinePrice` returns
"Custom pricing" and the CTA opens `ContactSalesForm`, which posts to `/plans/enquiry/`.
Never render a contact tier's `display_price`: it is `0.00`, which reads as "Free".

**The pricing screen is a selector plus one detail panel**, not a list of cards —
`PlanSelector` (compact price row, sits directly above what it drives) and `PlanDetail`
(hero → headline stats → capabilities → full audit by section). Three passes over the same
catalogue, narrowing as they go.

**Flag polarity is a server field, not something the client can infer.** `ads_enabled:
false` is a *benefit*, so `catalog.Feature.benefit_when_off` is served as
`benefit_when_off` and `featureIsIncluded(value, meta)` reads it. Without it the paid
tiers render "Ad-free" with a dash beside it — their best selling point shown as something
you do not get.

`components/plans/UpgradeCard.tsx` (Settings) renders the live featured plan and returns
`null` when there is no paid tier — it replaced a magenta→indigo `LinearGradient` whose
two hues appear nowhere in the palette, and a hardcoded "Upgrade to Pro" that advertised a
plan the server need not have.

**Alerts** — `useDrawerAlert()` → `showAlert(options)`; `DrawerAlertRenderer` (root) draws the
sheet plus a tap-to-cancel scrim, and mounts `DrawerAlert` *per alert* rather than toggling
`visible`, so the checkbox never arrives pre-ticked from the previous alert.

Passing `suppressKey` adds a "Don't ask me again" checkbox. Suppression is per **operation**
(`delete-contract`, `delete-space`, `delete-document`), persisted as one JSON blob under the
`suppressed_alerts` AsyncStorage key and hydrated once at mount. A suppressed alert is not
dropped — it is *answered*, by running its **last** action. Every call site orders actions the
same way (escape hatch first, the thing you came to do last), and silently skipping instead
would turn "don't ask me again" into "silently refuse to delete". Alerts with no key can never
be silenced, which is right: a one-off error must not teach the app to stay quiet about the
next, different error. Settings grows a "Restore hidden prompts" row while anything is hidden
(`resetSuppressedAlerts`) — a permanently-removed delete confirmation is not acceptable.

**Theming** — `hooks/useTheme.tsx` → `{ colors }`, modes `light | dark | system`.
Palette in `constants/Colors.ts`; spacing/radii/type/motion/elevation in
`constants/Design.ts` (`Type`, `riskColors(colors, level)`, `RISK_LABELS`,
`elevation(colors, level)`, `withAlpha(hex, alpha)`, `TAB_BAR_CLEARANCE`).

**The palette has one governing rule: chrome is desaturated so colour means something.**
Findings carry a four-level risk scale, and that scale is the most important thing on any
contract screen. The old indigo-violet brand with teal accents meant a `critical` flag had
to compete with decoration to be noticed. So: near-neutral surfaces, one ink-navy primary
for actions, saturation reserved for the risk ramp (`riskLow/Medium/High/Critical` +
`…Background`, plus `unverified`) and status. The legacy decorative keys (`vio`, `blueg`,
`red`, `emerald`) still exist for compatibility but are now aliases into the real palette
— **do not reintroduce standalone hues.**

`Type` is a full text style per role (size + lineHeight + tracking), not a bare size.
`FontSizes` still exists and still works; prefer `Type` for anything that wraps, because
unset leading is what made the plain-English clause paragraphs look cramped.

`components/RiskBadge.tsx` is the only sanctioned way to draw a risk level. It pairs an
icon with the colour (red-vs-amber is exactly the pair colour-blind users cannot
distinguish) and treats `is_missing` and `span_verified: false` as first-class states
rather than folding them into "low".

**Home is a command centre, not a report.** `app/(application)/(tabs)/index.tsx` used to show
total documents / completed / failed / avg confidence — four true numbers that change nothing.
It now answers "what needs me today?" and orders content by how fast it decays: attention hero
(overdue + closing deadlines + critical clauses), money both directions, portfolio size as
context, deadlines, then recent scans last. A user with **no org** gets a different screen
entirely (`WorkspacePitch`) — an empty command centre showing four zeroes would be accurate and
useless.

**Contracts client** — `types/api/contracts.types.ts` mirrors the DRF serializers with the
`choices` unions spelled out; `services/contracts.service.ts` holds the HTTP; `hooks/queries/
contracts.ts` has the hooks. `useCurrentOrg()` is the gate every contracts screen checks —
"no org yet" is a normal state (the API returns an empty list, not a 403), and `OrgSetupPrompt`
handles it. Extraction is polled at `EXTRACTION_POLL_INTERVAL_MS` (5s, longer than the 3s scan
poll — extraction walks 12 clause types and takes 20-60s), gated on status so a settled list
stops waking the app.

**A contract needs a `source_document`.** Extraction reads `SpaceDocument.extracted_text`, so
`contracts/new.tsx` requires picking a space document and disables Create until one is chosen —
without it the row sits at "Queued for analysis" forever.

**Dates** — `utils/helpers/dates.ts`. `parseApiDate` exists because `new Date("2027-03-12")` is
UTC midnight, which renders as the *previous day* in any negative UTC offset; a due date showing
a day early is worse than none. Deadline UI always sorts and colours on `action_by_date`, never
`event_date` — a renewal 65 days out needing 90 days notice is already 25 days late, and
`DeadlineRow` is built to make exactly that visible.

**Motion** — **never write `entering={FadeInDown…}` directly; use `<FadeInView>`.** Reanimated
sets the element to `opacity: 0` up front and relies on its driver to bring it back, and on web
that driver does not reliably start for a screen mounted during a hard page load — content stays
invisible permanently. `FadeInView` skips `entering` on web for that reason. A failed animation
must degrade to *no animation*, never *no content*. (~23 older files still use the raw API and
are still affected.)

**Animating from a boolean prop needs a shared value, not a closure.** This project builds
with the React Compiler (`transform.reactCompiler`), which memoises worklet closures — so
`useAnimatedStyle(() => ({ color: withTiming(selected ? a : b) }))` captures `selected`
once and never sees it change, and `useDerivedValue(() => withTiming(...))` restarts its
timing from wherever it had reached on every render. Both leave a selected/unselected pair
stranded mid-transition. The form that holds: `useSharedValue` + a `useEffect` on the prop
that assigns `progress.value`, with the style reading only `progress.value`
(`components/plans/PlanSelector.tsx`).

**A `PressableScale` in a horizontal `ScrollView` row stretches; its child does not.** The
row aligns `stretch`, so every pressable is as tall as the tallest card, while an inner
view sizes to its own content — leaving a dead strip of tap target below the shorter ones
that looks like a broken button. Give the inner card `flex: 1` so the visible surface *is*
the tap target.

`Motion.spring` / `Motion.springQuick` are tuned to a damping ratio of ~1.0
(`damping / (2 * sqrt(stiffness * mass))`), i.e. they settle without overshooting. Keep
that ratio when retuning: make a spring faster by raising stiffness *and* damping together,
never by lowering damping. Always use the tokens rather than inline `withSpring(x, {...})` —
Reanimated's defaults are ratio 0.5 and visibly bounce. `FadeInView` is deliberately eased
(`Easing.out(Easing.cubic)`), not `.springify()`: sprung entrances overshoot, and across a
staggered list that reads as the screen wobbling into place.

**Background-job polling** — anything a Celery worker finishes after the request returns has
to be polled; nothing is pushed. `queries/docs.ts` polls scan analysis
(`ANALYSIS_POLL_INTERVAL_MS`, 3s) and `queries/spaces.ts` polls space-document indexing
(`INDEXING_POLL_INTERVAL_MS`, 1.5s). Both gate on status (`isAnalysisInProgress` /
`isIndexingInProgress`) and return `false` once nothing is in flight, so a settled list
stops waking the app.

**Chat** — `hooks/chat/useChat.ts` owns the whole space-chat flow: resolves the active
conversation (`useSpaceConversation`), loads history (`useConversationMessages`), sends via
`useInstantJSONResponse` (90s timeout, AbortController). `useInstantChatResponse` is the
streaming variant (fetch + ReadableStream) — currently unused by `useChat`, which uses the
JSON one.

**The tab bar holds four labelled tabs plus the raised scan action, and that is the
ceiling.** At six slots on a 375pt screen each item gets ~55pt, which truncates
"Contracts". When Chat took a slot, Settings gave one up — it is a place you visit and
leave, not one of the four you work in — so it is `href: null` and reached through
`components/settings/SettingsButton.tsx`, which sits in the header of **all four** tabs.
Adding a fifth labelled tab means taking one away.

**Screen chrome must not live inside a conditional branch.** `SettingsButton` is the only
route out of the tab set, and it first shipped inside each screen's success branch — so
Contracts, which early-returns `OrgSetupPrompt` when the user has no org (the state every
new account starts in), had no way to reach Settings at all, and Spaces lost it for the
duration of every load. Both now render the real header above the empty/loading body.
`SpacesScreenSkeleton` no longer draws a header for the same reason: the header does not
depend on the request.

**Chat is its own tab** (`app/(application)/(tabs)/chat.tsx`), not a mode of another screen.
It used to live inside `analyize`, appearing only once `selectedSpace` was set from somewhere
else — an assistant with no address, which also hid the tab bar and needed a bespoke exit
button and a "are you sure you want to leave?" confirmation to escape. The tab now owns that
question itself: no space selected renders a picker, a space selected renders the header pill
(`SpaceIndicator`, switches spaces) plus a back control (clears the selection). The composer
carries a paperclip that uploads into the selected space via `UploadDocumentForm` — a document
added there becomes retrieval context, not a per-message attachment. `ChatToolBar` reserves
`TAB_BAR_CLEARANCE` because the floating bar is no longer hidden during chat.

## API surface used (see backend OKF for the server side)

Auth: `POST /auth/login/`, `POST /auth/registration/`, `GET /auth/user/`, `/auth/google/`
Documents: `/scanner/documents/` (list, create multipart, detail, delete), `/scanner/documents/stats/`
Spaces: `/user_space/spaces/` (+ `/{id}/documents/`, `/{id}/stats/`, `/{id}/toggle_favorite/`,
`/{id}/active-conversation/`), `/user_space/documents/` (create multipart, `/{id}/toggle_pin/`)
Chat: `/user_space/conversations/`, `/user_space/messages/?conversation=<id>`,
`POST /user_space/chatbot/instant-response/`
Plans: `GET /plans/`, `GET /plans/currencies/`, `GET /plans/features/`,
`POST /plans/enquiry/`
Contracts: `/contracts/organizations/` (+ `/{id}/members/`, `/{id}/invite/`, `/{id}/stats/`),
`/contracts/contracts/` (+ `/{id}/reextract/`, `/{id}/actions/`, `/expiring/`,
`/missing-protections/`), `/contracts/obligations/` (+ `/summary/`), `/contracts/events/`
(+ `/upcoming/`), `/contracts/counterparties/`. All org-scoped server-side: the org comes from
the `X-Org` header when sent, otherwise from the caller's single membership — so a one-org user
never passes it.

Backend pagination is PageNumberPagination, `PAGE_SIZE: 10`.

Analysis responses now carry a `disclaimer` string. Render it wherever analysis is shown —
it is served with the payload precisely so no screen has to remember to hardcode it.

## Gotchas

- `package.json` `name` is still `bolt-expo-starter` (scaffold leftover).
- Filenames with typos are real and referenced widely: `hooks/queries/converstations.ts`,
  `components/ErrorBoundry.tsx`, `hooks/kayboard/`, `hooks/spaceIndecator/`,
  `app/(application)/(tabs)/analyize.tsx`.
- `android/` and `ios/` are checked in — this is a prebuild (dev-client) setup, not managed Expo.
