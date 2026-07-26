---
name: todays-task
description: Run the next task from the SafeRead roadmap in ROADMAP.md. Use when the user says "run today's task", "today's task", "next task", "continue the roadmap", or otherwise asks to keep completing the SafeRead application. Also handles "run today's task T-NN" to pick a specific task.
---

# Run today's task

One task per invocation, roughly 30 minutes of work. The user is on a $20 Claude plan, so
**token discipline is a hard requirement, not a nicety.** A run that burns the budget on
exploration and leaves nothing shipped is a failed run.

## Procedure

1. **Read `ROADMAP.md`.** Pick the first unchecked `- [ ]` task in the lowest-numbered
   incomplete phase. If the user named a task (`run today's task T-21`), use that instead.
   Phase 3 is a release gate — pull from it early only if the user says they are preparing a
   store build.

2. **State the task in one line and start.** Do not present a plan for approval, do not
   restate the roadmap, do not ask which task unless the roadmap is ambiguous or exhausted.

3. **Read only the files the task names.** They are listed on the task. The `CLAUDE.md` in
   each repo is the architecture map — trust it instead of re-deriving structure.

4. **Implement it.** Match surrounding style: 3-space indent and no semicolons in the Expo
   repo; the backend follows the provider/registry patterns described in its `CLAUDE.md`.

5. **Verify against the task's "Done when".** This is required. Run the test, hit the
   endpoint, drive the preview — whatever the criterion actually says. If it cannot be
   verified, say so plainly and leave the box unchecked.

6. **Close out.** Tick the `- [x]` box and append one line to the Log section:
   `- YYYY-MM-DD — T-NN — <what changed, and how it was verified>`.
   If the task was split, edit the roadmap to leave the remainder as a new task.

7. **Stop.** Report what changed in a few lines and what runs next. Do not begin another
   task — the point is a predictable, budget-sized unit of work.

## Token discipline

- No `Agent` / subagent calls. They start cold and re-derive context this repo already
  documents. Everything here is single-session work.
- No repo-wide `grep`/`find` sweeps. If a search is genuinely needed, scope it to a directory.
- Do not re-read `CLAUDE.md` files that are already in context.
- Do not re-run the full docker stack unless the task's verification needs a live backend.
  `docker compose up -d` in `../saferead_backend` when it does; leave it running.
- Prefer a targeted test over booting the whole app to check one thing.

## Environment notes

- Two repos: this Expo app, and `../saferead_backend` (Django). Both have a `CLAUDE.md`.
- The backend needs Docker: `docker compose up -d`, API on `:8000`.
- `EXPO_PUBLIC_*` values are inlined at bundle time — after changing `.env`, Expo must be
  restarted with `--clear` or the old value keeps being served.
- The dev Gemini key is **over quota (429) for generation only** (`gemini-2.0-flash`). Text
  analysis fails over to Groq and works, and image OCR falls back to Tesseract. **Embeddings
  are on a separate quota and are working** — space indexing and RAG chat are verified
  healthy (2026-07-23). Do not diagnose the 429 as a new bug; it is a key rotation (T-34).
- `No vector store found for space <id>` in the logs is the normal empty-space case, not a
  failure.
- `manage.py check` fails on macOS with a GDAL error. That is the unused GeoDjango config
  (T-33), not anything the current task broke.
- Never commit or push unless the user asks.

## When the roadmap is empty

If every box in Phases 0–2 is ticked, say so, summarize what Phase 3 still gates, and ask
whether to start the release gate or add new work — do not invent tasks unprompted.
