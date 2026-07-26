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
| `app/(application)/(tabs)/` | index (home), analyize, scan, spaces, premium, settings |
| `app/(application)/` | analysisres, profile, spaces/[id], help, language, privacy, change_password, scan_menu_screen |
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

**Theming** — `hooks/useTheme.tsx` → `{ colors }`, modes `light | dark | system`.
Palette in `constants/Colors.ts`; spacing/radii/motion/elevation in `constants/Design.ts`
(`elevation(colors, level)`, `withAlpha(hex, alpha)`, `TAB_BAR_CLEARANCE`).

**Motion** — `Motion.spring` / `Motion.springQuick` are tuned to a damping ratio of ~1.0
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
`useInstantJSONResponse` (90s timeout, AbortController), blocks tab switching while
responding. `useInstantChatResponse` is the streaming variant (fetch + ReadableStream) —
currently unused by `useChat`, which uses the JSON one.

## API surface used (see backend OKF for the server side)

Auth: `POST /auth/login/`, `POST /auth/registration/`, `GET /auth/user/`, `/auth/google/`
Documents: `/scanner/documents/` (list, create multipart, detail, delete), `/scanner/documents/stats/`
Spaces: `/user_space/spaces/` (+ `/{id}/documents/`, `/{id}/stats/`, `/{id}/toggle_favorite/`,
`/{id}/active-conversation/`), `/user_space/documents/` (create multipart, `/{id}/toggle_pin/`)
Chat: `/user_space/conversations/`, `/user_space/messages/?conversation=<id>`,
`POST /user_space/chatbot/instant-response/`
Plans: `GET /plans/`

Backend pagination is PageNumberPagination, `PAGE_SIZE: 10`.

## Gotchas

- `package.json` `name` is still `bolt-expo-starter` (scaffold leftover).
- Filenames with typos are real and referenced widely: `hooks/queries/converstations.ts`,
  `components/ErrorBoundry.tsx`, `hooks/kayboard/`, `hooks/spaceIndecator/`,
  `app/(application)/(tabs)/analyize.tsx`.
- `android/` and `ios/` are checked in — this is a prebuild (dev-client) setup, not managed Expo.
