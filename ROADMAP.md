# SafeRead — Future Map

The backlog that `run today's task` works through. One task per run, ~30 minutes.

**Goal:** ship to the iOS and Android app stores.
**Created:** 2026-07-23. **Payments:** mocked for now (see T-35 before submitting).

## How to use this

Say **"run today's task"**. The `todays-task` skill picks the first unchecked task in the
lowest incomplete phase, does only that, verifies it, ticks the box, and appends one line to
the Log. It then stops — it does not roll on to the next task.

To do something specific instead: "run today's task T-21".

Phases 0→2 are ordered by your priorities. **Phase 3 is a release gate** — every box there
must be ticked before a store build goes out, regardless of what else is done.

## Conventions

- Task size is one sitting. If a task turns out bigger, split it in place, do the first half,
  and leave the rest as a new task rather than blowing the run.
- Every task names its files. Read those, not the whole repo — the `CLAUDE.md` in each repo
  is the map, so no re-exploration.
- Backend paths are relative to `../saferead_backend/`, frontend paths to this repo.
- "Done when" is the acceptance check. If it can't be verified, the box does not get ticked.

---

## Phase 0 — Broken core flows

Things that are shipped and wrong today. Verified live on 2026-07-23.

- [x] **T-01 — Move analysis off the web request onto Celery** *(done 2026-07-23)*
  `../saferead_backend/scanner/signals.py`, `scanner/tasks.py`
  `analyze_document_async()` is a misnomer: it runs the whole LLM round-trip inline in the
  `post_save` signal, so the upload POST blocks for its full duration and the Celery worker
  receives nothing. Replace the body with `analyze_document_task.delay(instance.id)` and
  delete the duplicated logic, keeping `tasks.py` as the single implementation.
  **Done when:** worker logs `Received task: scanner.tasks.analyze_document_task`, and the
  upload POST returns `status: "pending"` in well under a second.

- [x] **T-02 — Make the client follow a pending scan to completion** *(done 2026-07-23)*
  `hooks/queries/docs.ts`, `hooks/useDocumentStats.ts`
  Added a `refetchInterval` that polls at 3s while any doc is `pending`/`processing` and
  returns `false` (stops) otherwise — on `useDocuments`, `useDocument`, and `useDocumentStats`
  (the home screen renders entirely off the stats query).

- [ ] **T-03 — `original_filename` stores the storage path, not the name**
  `../saferead_backend/scanner/models.py`
  `save()` assigns `document_file.name`, which includes the `documents/` prefix, so the app
  shows `documents/acme_terms_of…`. Use `os.path.basename()`. Include a data migration for
  existing rows.
  **Done when:** a new scan shows a clean filename, and existing rows are backfilled.

- [ ] **T-04 — Registration discards its auth token**
  `hooks/useAuth.tsx`
  `POST /auth/registration/` returns `{key}` (201), but the app routes to Sign In and makes
  the user log in again immediately. Store the key the way `login` does and go straight in.
  **Done when:** registering lands on the authenticated home screen, no second login.

- [ ] **T-05 — Analytics shows "Avg Confidence 0%" beside a 95% document**
  `hooks/queries/docs.ts`, `config/mutationCache.ts`
  `/scanner/documents/stats/` is fetched once and never invalidated after a scan finishes.
  Use the existing `meta: { invalidatedQueries: [...] }` convention.
  **Done when:** completing a scan updates the Analytics panel without an app restart.

- [ ] **T-06 — Space RAG answers ungrounded when a space has no index** *(lower priority
  than first written — RAG itself is healthy)*
  `../saferead_backend/user_space/rag_utils.py`, `user_space/chatbot_service.py`
  Corrected 2026-07-23: RAG is **working** (verified — 3 chunks indexed, 3 query hits,
  grounded answer at confidence 0.9). Gemini embeddings sit on a separate quota from the
  429'd generation model. The remaining real defect is defensive: when a space genuinely has
  no index, chat still answers from the model's own knowledge instead of saying so, and
  Gemini is still a single point of failure for embeddings with no fallback.
  **Done when:** querying an unindexed space returns an explicit "not indexed yet" state
  rather than a confident ungrounded answer.

- [ ] **T-08 — Create endpoints return 201 without the object's `id`**
  `../saferead_backend/user_space/serializers.py`, `user_space/views.py`
  `UserSpaceCreateSerializer` and `SpaceDocumentCreateSerializer` list only input fields, so
  `POST /user_space/spaces/` and `/user_space/documents/` echo the request back with no `id`,
  `processing_status`, or timestamps. Latent today — the app only invalidates its list caches
  and never reads the response — but it blocks "create then navigate into it" and any upload
  progress UI. Return the full read serializer from `create()`.
  **Done when:** both creates return a body containing `id`, verified by test.

- [ ] **T-07 — A retrying document is marked `failed` first**
  `../saferead_backend/scanner/tasks.py`
  The error path saves `status='failed'` and only then calls `self.retry()`, so a document
  that will succeed on attempt 2 shows as failed in between. Only mark failed once retries
  are exhausted.
  **Done when:** a forced transient failure shows `processing`, not `failed`, between attempts.

## Phase 1 — Tests and CI

No safety net exists: every `tests.py` is empty scaffolding.

- [ ] **T-10 — Backend test harness + first real test**
  `../saferead_backend/pyproject.toml`, `llm/tests/`
  Add pytest + pytest-django. Port the provider-capability tests already written during the
  Unlimited-OCR work (stub `requests`, assert vision-only providers never get generation
  calls, assert payload shape).
  **Done when:** `uv run pytest` passes with >0 real assertions.

- [ ] **T-11 — Test the scan pipeline against a fake provider**
  `../saferead_backend/scanner/tests.py`
  Register a fake provider in `PROVIDER_TYPES`, upload a fixture, assert the analysis is
  persisted. No network, no API keys.
  **Done when:** the test passes offline with no keys set.

- [ ] **T-12 — Test plan gating**
  `../saferead_backend/user_plan/tests.py`
  Cover `CanCreateSpacePermission` and `CanScanDocumentPermission` at and over the limit.
  **Done when:** over-limit requests assert 403 with the upgrade message.

- [ ] **T-13 — CI for the backend**
  `.github/workflows/backend.yml`
  Run pytest on push. Postgres service container; no GDAL unless T-33 keeps GeoDjango.
  **Done when:** the workflow is green on a push.

- [ ] **T-14 — CI for the frontend**
  `.github/workflows/frontend.yml`
  `tsc --noEmit` and `expo lint`.
  **Done when:** the workflow is green, and typecheck actually fails on an introduced error.

## Phase 2 — UI polish and features

- [ ] **T-20 — Onboarding uses stale window dimensions**
  `components/onboarding/OnboardingScreen.tsx:7`, `components/onboarding/Onboarding.tsx:20`
  `Dimensions.get("window")` at module scope is captured once at import, so slides keep a
  stale width — visibly clipped text until an interaction forces re-layout. Swap to the
  `useWindowDimensions()` hook.
  **Done when:** onboarding lays out correctly on first paint and survives a rotation.

- [ ] **T-21 — "LegalAssist" branding leftovers**
  `app/(auth)/register.tsx` and anywhere else the old name survives
  The register screen still says "Join LegalAssist today".
  **Done when:** a repo-wide search for the old name returns nothing user-facing.

- [ ] **T-22 — Status badge colors are misleading**
  `app/(application)/analysisres.tsx`
  `COMPLETED` renders in the same red as `HIGH RISK`. Status and risk need separate scales.
  **Done when:** completed reads as success; risk level keeps its own color.

- [ ] **T-23 — Dangling "or continue with" divider**
  `app/(auth)/login.tsx`, `components/GoogleSignInButton.tsx`
  The divider renders even when no social provider is configured, so it separates nothing.
  **Done when:** the divider only appears when a provider is actually available.

- [ ] **T-24 — Empty and error state pass**
  `components/EmptyState.tsx`, `components/ErrorScreen.tsx`, tab screens
  Audit each tab for the no-data and request-failed cases.
  **Done when:** every tab has a deliberate empty state and a retry affordance.

## Phase 3 — Release gate (blocks store submission)

Not front-loaded per your priorities, but **every box here must be ticked before a store
build ships.** Each is a real rejection or incident risk.

- [ ] **T-30 — `DEBUG` defaults to True**
  `../saferead_backend/config/settings.py:31`
  `os.getenv("DEBUG") != "False"` means any unset or misspelled value leaves debug on,
  exposing tracebacks and settings. Invert to fail closed.
  **Done when:** an unset `DEBUG` yields `False`.

- [ ] **T-31 — `CORS_ALLOW_ALL_ORIGINS = True` unconditionally**
  `../saferead_backend/config/settings.py:38`
  Set from `CORS_ALLOWED_ORIGINS` and only allow-all when `DEBUG`.
  **Done when:** a disallowed origin is rejected with `DEBUG=False`.

- [ ] **T-32 — `QuickAnalyze` is open to the internet with no rate limit**
  `../saferead_backend/scanner/views.py:261`
  The only `AllowAny` endpoint, and it calls an LLM on every request — an unmetered bill for
  anyone who finds it. Add throttling, and auth unless it is deliberately a public demo.
  **Done when:** an unauthenticated flood is throttled, verified by test.

- [ ] **T-33 — Unused GeoDjango forces a GDAL dependency**
  `../saferead_backend/config/settings.py`, `pyproject.toml`
  `django.contrib.gis` + `postgis` engine + `geopy`, and no model has a geometry field. It is
  why `manage.py check` fails on macOS. Removing it needs a DB engine change and migration
  review — do this deliberately, not in passing.
  **Done when:** `manage.py check` passes on macOS with no GDAL installed.

- [ ] **T-34 — Secret hygiene before release**
  `../saferead_backend/django.env`, `.env`
  Rotate the Gemini and Groq keys used in development, confirm neither env file is tracked,
  and move production secrets to the deploy platform.
  **Done when:** `git log --all -- django.env .env` shows nothing, and keys are rotated.

- [ ] **T-35 — Purchase flow must work or be removed**
  `app/(application)/(tabs)/premium.tsx`, `../saferead_backend/user_plan/views.py`
  `PurchasePlan` has no provider wired up. Apple and Google both reject non-functional
  purchase UI, and both require their own IAP for digital subscriptions — Stripe/PayPal will
  not pass review. Either implement store IAP or remove the purchase affordance for v1.
  **Done when:** the Premium tab either completes a real purchase or makes no purchase offer.

- [ ] **T-36 — Store compliance paperwork**
  `app/(application)/privacy.tsx`
  Privacy policy URL, data-safety / privacy-nutrition disclosures covering documents uploaded
  and sent to third-party LLMs, and account deletion — Apple and Google both require an
  in-app delete path.
  **Done when:** disclosures are complete and account deletion works end to end.

---

## Log

Newest last. One line per completed run: date, task, outcome.

- 2026-07-23 — roadmap created; no task run yet.
- 2026-07-23 — T-01 — Analysis dispatched to Celery via `transaction.on_commit`; the inline
  duplicate in `signals.py` removed and `tasks.py` made the single implementation (ported its
  stricter <50-char extraction guard, the display-name prompt label, and error_message reset).
  Verified: upload POST 3s-blocking → **0.134s** returning `pending`; state machine now
  observable as pending → processing → completed; worker executed 4 tasks with no loop or
  errors; reanalyze still dispatches (200 in 0.107s). Exposed T-02 as load-bearing.
- 2026-07-23 — T-02 — Polling added to `useDocuments`/`useDocument`/`useDocumentStats`
  (`refetchInterval` = 3s while pending/processing, else false). Verified live in the browser:
  with the worker paused a doc sat `pending`, the home screen polled stats at a measured
  3.13s cadence (Resource Timing API, 18 requests, gaps 3110–3212ms); restarting the worker
  completed the doc, the UI updated 1→2 docs / 95%→94% confidence with **no manual refresh**,
  and polling then stopped (frozen at 18 requests, 30s silent). tsc clean, no console errors.
- 2026-07-23 — health check — scan (text + image), spaces, and RAG chat all pass; frontend
  `tsc --noEmit` clean. **Correction:** space RAG is *not* broken — Gemini embeddings are on a
  separate quota from the 429'd generation model, verified with 3 indexed chunks and a
  grounded answer. T-06 reframed and deprioritised. New defect found → T-08.
