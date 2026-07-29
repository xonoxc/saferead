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

- [x] **T-03 — `original_filename` stores the storage path, not the name**
  `../saferead_backend/scanner/models.py`
  `save()` assigns `document_file.name`, which includes the `documents/` prefix, so the app
  shows `documents/acme_terms_of…`. Use `os.path.basename()`. Include a data migration for
  existing rows.
  **Done when:** a new scan shows a clean filename, and existing rows are backfilled.

- [x] **T-04 — Registration discards its auth token**
  `hooks/useAuth.tsx`
  `POST /auth/registration/` returns `{key}` (201), but the app routes to Sign In and makes
  the user log in again immediately. Store the key the way `login` does and go straight in.
  **Done when:** registering lands on the authenticated home screen, no second login.

- [x] **T-05 — Analytics shows "Avg Confidence 0%" beside a 95% document**
  `hooks/queries/docs.ts`, `config/mutationCache.ts`
  `/scanner/documents/stats/` is fetched once and never invalidated after a scan finishes.
  Use the existing `meta: { invalidatedQueries: [...] }` convention.
  **Done when:** completing a scan updates the Analytics panel without an app restart.

- [x] **T-06 — Space RAG answers ungrounded when a space has no index** *(lower priority
  than first written — RAG itself is healthy)*
  `../saferead_backend/user_space/rag_utils.py`, `user_space/chatbot_service.py`
  Corrected 2026-07-23: RAG is **working** (verified — 3 chunks indexed, 3 query hits,
  grounded answer at confidence 0.9). Gemini embeddings sit on a separate quota from the
  429'd generation model. The remaining real defect is defensive: when a space genuinely has
  no index, chat still answers from the model's own knowledge instead of saying so, and
  Gemini is still a single point of failure for embeddings with no fallback.
  **Done when:** querying an unindexed space returns an explicit "not indexed yet" state
  rather than a confident ungrounded answer.

- [x] **T-08 — Create endpoints return 201 without the object's `id`**
  `../saferead_backend/user_space/serializers.py`, `user_space/views.py`
  `UserSpaceCreateSerializer` and `SpaceDocumentCreateSerializer` list only input fields, so
  `POST /user_space/spaces/` and `/user_space/documents/` echo the request back with no `id`,
  `processing_status`, or timestamps. Latent today — the app only invalidates its list caches
  and never reads the response — but it blocks "create then navigate into it" and any upload
  progress UI. Return the full read serializer from `create()`.
  **Done when:** both creates return a body containing `id`, verified by test.

- [x] **T-07 — A retrying document is marked `failed` first**
  `../saferead_backend/scanner/tasks.py`
  The error path saves `status='failed'` and only then calls `self.retry()`, so a document
  that will succeed on attempt 2 shows as failed in between. Only mark failed once retries
  are exhausted.
  **Done when:** a forced transient failure shows `processing`, not `failed`, between attempts.

- [x] **T-09 — An anonymous scan cannot be saved** *(found by T-11, fixed 2026-07-29)*
  `../saferead_backend/user_plan/utils.py`, `scanner/tests.py`
  `DocumentScan.user` is `null=True` and the model calls the anonymous scan "the free front
  door", but `track_document_scan` fires on every insert and hands `instance.user` to
  `track_usage`, which writes a `UserUsage` row whose `user_id` is NOT NULL — so
  `DocumentScan.objects.create(user=None, ...)` raised an IntegrityError. Resolved in favour
  of the model's stated intent: `track_usage` now returns early for `None`/anonymous rather
  than the field losing `null=True`. Anonymous use is throttled, not quota'd — there is
  nothing to key a quota on without an account.
  **Done when:** creating a `DocumentScan` with no user either works or is rejected by the
  model, not by a signal three apps away — with a test either way.

## Phase 1 — Tests and CI

Corrected 2026-07-29: tests were *not* all empty scaffolding — `llm/tests.py` and
`contracts/tests.py` already held real suites, but nothing could run them (see T-10). The
gap in Phases 1 is now the apps below plus CI, not the harness.

- [x] **T-10 — Backend test harness + first real test**
  `../saferead_backend/pyproject.toml`, `llm/tests.py`, `config/test_settings.py`
  Added pytest + pytest-django. Ported the provider-capability tests (stub `requests`,
  assert vision-only providers never get generation calls, assert payload shape).
  Kept the suite in `llm/tests.py` rather than a `llm/tests/` package — one `tests.py` per
  app is the convention the rest of the repo (and T-11/T-12) already follows.
  **Done when:** `uv run pytest` passes with >0 real assertions.

- [x] **T-11 — Test the scan pipeline against a fake provider**
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

- [x] **T-20 — Onboarding uses stale window dimensions**
  `components/onboarding/OnboardingScreen.tsx:7`, `components/onboarding/Onboarding.tsx:20`
  `Dimensions.get("window")` at module scope is captured once at import, so slides keep a
  stale width — visibly clipped text until an interaction forces re-layout. Swap to the
  `useWindowDimensions()` hook.
  **Done when:** onboarding lays out correctly on first paint and survives a rotation.

- [x] **T-21 — "LegalAssist" branding leftovers**
  `app/(auth)/register.tsx` and anywhere else the old name survives
  The register screen still says "Join LegalAssist today".
  **Done when:** a repo-wide search for the old name returns nothing user-facing.

- [x] **T-22 — Status badge colors are misleading**
  `app/(application)/analysisres.tsx`
  `COMPLETED` renders in the same red as `HIGH RISK`. Status and risk need separate scales.
  **Done when:** completed reads as success; risk level keeps its own color.

- [x] **T-23 — Dangling "or continue with" divider**
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

- [x] **T-30 — `DEBUG` defaults to True**
  `../saferead_backend/config/settings.py:31`
  `os.getenv("DEBUG") != "False"` means any unset or misspelled value leaves debug on,
  exposing tracebacks and settings. Invert to fail closed.
  **Done when:** an unset `DEBUG` yields `False`.

- [x] **T-31 — `CORS_ALLOW_ALL_ORIGINS = True` unconditionally**
  `../saferead_backend/config/settings.py:38`
  Set from `CORS_ALLOWED_ORIGINS` and only allow-all when `DEBUG`.
  **Done when:** a disallowed origin is rejected with `DEBUG=False`.

- [x] **T-32 — `QuickAnalyze` is open to the internet with no rate limit**
  `../saferead_backend/scanner/views.py:261`
  The only `AllowAny` endpoint, and it calls an LLM on every request — an unmetered bill for
  anyone who finds it. Add throttling, and auth unless it is deliberately a public demo.
  **Done when:** an unauthenticated flood is throttled, verified by test.

- [x] **T-33 — Unused GeoDjango forces a GDAL dependency**
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
- 2026-07-28 — batch run — Phase 0 cleared plus the doable parts of Phases 2/3.
  **T-03** basename + data migration `0004`, anchored on the `documents/` prefix rather than
  "contains a slash" (a real row read `Scanned Document 7/27/2026` and blind basename would
  have made it `2026`); 3 rows backfilled. **T-04** registration now consumes the `key` it was
  already being handed — verified landing on the authenticated home screen with no second
  login. **T-05** `useDeleteDocument` also invalidates `["documentStats"]` (upload already
  did). **T-06** `_get_relevant_context` returns an ungrounded reason and `empty`/`indexing`
  short-circuit before the model, confidence pinned 0.0 — verified. **T-07** status stays
  `processing` while retries remain — verified both branches. **T-08** `ReadAfterCreateMixin`
  returns the read serializer from create — both endpoints verified returning `id`.
  **T-20** onboarding off module-scope `Dimensions` onto `useWindowDimensions` (3 files).
  **T-21** LegalAssist leftovers gone. **T-22** status badge on its own colour scale.
  **T-23** social divider gated on `SOCIAL_AUTH_ENABLED`. **T-32** scoped throttles on
  quick-analyze — verified 5 anon calls then 429. **Stale boxes corrected:** T-30, T-31 and
  T-33 were already fixed in the code and are now ticked.
  Not done, and why: T-34 (key rotation is yours to do), T-35 (IAP-or-remove is a product
  call), T-36 (needs a hosted policy + your disclosures), T-13/T-14 (workflows can be written
  but "green on a push" needs a push), T-10/11/12 (test harness — next), T-24.
- 2026-07-29 — T-10 — pytest + pytest-django added (`[dependency-groups] dev`,
  `[tool.pytest.ini_options]` collecting `tests.py` so pytest and `manage.py test` see one
  suite). 13 new provider-capability tests in `llm/tests.py`: the router skips vision-only and
  embeddings-only providers for generation instead of trying and burning their cool-off slot,
  and `UnlimitedOCRProvider` posts the OpenAI-protocol vision body it is supposed to
  (`requests.post` stubbed — endpoint, model, `temperature: 0.0`, data-URI image part,
  Authorization only when keyed, `is_configured` off the URL not a key).
  **The real unblock was the database:** `django.env` points `POSTGRES_HOST` at the Compose
  service `db`, so a host `pytest` died in connection setup — 64 already-written
  `contracts/tests.py` tests had never been runnable. `config/test_settings.py` (sqlite
  in-memory) fixes it; a root `conftest.py` does *not*, because pytest-django runs
  `django.setup()` before initial conftests load. Verified: `uv run pytest` → **106 passed**
  offline, no keys, no Docker. Mutation-checked both new areas — dropping the
  `supports_generation` filter and changing the OCR temperature each fail a test.
- 2026-07-29 — T-11 — 10 tests in `scanner/tests.py` driving `analyze_document_task` end to
  end against `FakeAnalysisProvider`, registered in `PROVIDER_TYPES`/`PROVIDER_DEFAULTS` and
  selected via `LLM_PROVIDER_ORDER`, with `get_router(refresh=True)` on both sides. Real
  router, real provider construction, real LangChain chain (`chat_model` returns a
  `RunnableLambda`), real JSON extraction and sanitisation — only the model is canned.
  Covers: analysis persisted to the row; the document text and the readable type label
  actually reaching the prompt; fenced/prose-wrapped JSON parsed; an unparseable reply
  completing at low confidence rather than failing; a too-short document never reaching the
  model; the T-07 state machine (`processing` while retries remain, `failed` once exhausted,
  via `push_request`); a deleted row reported not raised; and the post-commit dispatch firing
  once on create and not on an ordinary save. Verified: **116 passed** in 7.7s, and 10 passed
  with `OPENROUTER_API_KEY=`/`GEMINI_API_KEY=`/`OPENAI_API_KEY=` blanked — no network, no
  Redis, no Docker. Mutation-checked three ways (drop `risky_points` on save, send an empty
  `document_content`, and the earlier provider mutations) — each fails a test.
  Found → **T-09**: `user_plan` usage tracking makes `DocumentScan.user=None` unsavable even
  though the field is nullable.
- 2026-07-29 — T-09 — `track_usage` returns early for a `None`/anonymous user instead of
  trying to write a `UserUsage` row it cannot key. Guarded in the shared function rather than
  at its eleven call sites — only `track_usage` knows the row needs an owner, and a guard per
  caller would have left the next one to rediscover this. Kept `DocumentScan.user` nullable:
  the model's own comment makes the anonymous scan deliberate product behaviour, and dropping
  `null=True` would have meant a migration to contradict it. 3 tests in `scanner/tests.py` —
  an anonymous scan saves *and* analyses, it records no usage, and a signed-in scan still
  records both `documents_scanned` and `analysis_generated` (the guard must not switch
  quota tracking off for everyone). Verified: **119 passed**; reverting the guard fails
  exactly the two anonymous tests.
- 2026-07-23 — health check — scan (text + image), spaces, and RAG chat all pass; frontend
  `tsc --noEmit` clean. **Correction:** space RAG is *not* broken — Gemini embeddings are on a
  separate quota from the 429'd generation model, verified with 3 indexed chunks and a
  grounded answer. T-06 reframed and deprioritised. New defect found → T-08.
