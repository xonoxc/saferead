---
name: improve-ux
description: Work through the SafeRead UX repair plan in UX_PLAN.md — fixing dead navigations, dead controls, misleading feedback and interface inconsistency. Use when the user says "improve-ux", "/improve-ux", "fix the UX", "work the UX plan", or names a UX task like "improve-ux UX-07" or "improve-ux phase A".
---

# Improve UX

Executes [UX_PLAN.md](../../../UX_PLAN.md) — the audited backlog of dead navigations, dead
controls and interface inconsistencies in the SafeRead app.

Plan location: `UX_PLAN.md` in the **Expo repo** (`saferead/`). If the session started in
`saferead_backend/`, the path is `../saferead/UX_PLAN.md`. It is one file in one place —
do not create a second copy.

## Scope of this invocation

Parse the user's argument:

| Invocation | Do |
|---|---|
| `/improve-ux` | Work tasks in order from the first unchecked one, continuing until the **current phase** is complete, then stop and report. |
| `/improve-ux UX-07` | That one task only. |
| `/improve-ux phase B` | Every unchecked task in that phase, then stop. |
| `/improve-ux all` | Keep going across phases until the plan is done or the user interrupts. |

Default is one phase, not one task — Phase A tasks compound (UX-03's shared error pattern is
what UX-09 and UX-10's new screens build on) and stopping mid-phase leaves the app in a state
where half the dead ends are fixed and half are not.

**Never reorder phases.** Phase A is "the app traps or lies to the user". A polish task done
before a dead end is fixed is wasted work on a screen that may change.

## Procedure per task

1. **Announce it in one line** — `UX-03 — three loading states are permanent dead ends` — and
   start. Do not present a plan for approval. Do not restate the task back to the user.

2. **Read only the files the task names**, plus anything they import that you must change. Both
   `CLAUDE.md` files are the architecture map — trust them instead of re-deriving structure.
   The task text already contains the evidence; do not re-audit to confirm the bug exists.

3. **Re-verify the line numbers.** The plan's `file:line` references are from the 2026-08-02
   audit and drift with every edit. Find the symbol, not the line.

4. **Fix the root, not the call site.** If three screens share a defect, the plan says so and
   the fix goes in the shared function or component. One guard in the shared place is a smaller
   diff than a guard in every caller, and it is the only version that does not leave the next
   sibling broken.

5. **Implement it, including the UI spec.** Every task has a **UI** paragraph — it is part of
   the task, not a suggestion. A navigational fix that lands the user somewhere real but
   unstyled is half done.

6. **Verify against "Done when".** This is required and it is specific — it names the check.
   Run it. `tsc --noEmit` is the floor, never the whole verification. If the criterion needs the
   backend, `docker compose up -d` in `../saferead_backend` and leave it running. If it needs
   the app, use the preview (`.claude/launch.json` → `saferead-web`) or the iOS simulator tools.
   **If it cannot be verified, say so plainly and leave the box unchecked.**

7. **Close out.** Tick `- [x]` and append one line to the Log:
   `- YYYY-MM-DD — UX-NN — <what changed, and how it was verified>`.
   If the task turned out bigger than one sitting, split it in place: do the first half, tick
   nothing, and leave the remainder as a new numbered task with its own Done when.

8. **Next task, or stop** per the scope table above.

## House rules these fixes must not break

These are the invariants the plan was written against. Violating one turns a UX fix into a
regression, and several of them were expensive to learn.

- **Design tokens only.** `Spacing`, `Radii`, `Type`, `Motion`, `elevation`, `withAlpha` from
  `constants/Design.ts`; colours from `useTheme().colors`. No raw hex, no raw pixel numbers in
  a new style.
- **Chrome is desaturated so colour means something.** Saturation belongs to the risk ramp and
  to status. Do not add a hue to make a screen feel less plain.
- **`<FadeInView>`, never raw `entering={…}`.** A failed animation must degrade to no
  animation, never to no content. This is UX-22's whole subject — do not add file 36 while
  fixing the other 35.
- **Screen chrome must not live inside a conditional branch.** The header, the back control and
  the route out render in *every* state — loading, empty, error, success. This is the root
  cause of UX-03 and UX-09; re-creating it elsewhere is the same bug in a new place.
- **Never gate a create-this-for-me screen on the absence of data — gate it on the *confirmed*
  absence of data.** `hasOrg` vs `needsOrg` in `hooks/queries/contracts.ts`. A network blip
  that renders "you have no workspace" made users create duplicates that are still in the
  database.
- **Alert actions are ordered escape-hatch first, the thing you came to do last.** A suppressed
  alert runs its *last* action, so this ordering is load-bearing, not stylistic. Destructive
  confirmations use `type: "error"`; account deletion carries no `suppressKey`.
- **Use `rest_framework.test.APIClient().force_authenticate(user)` in backend tests** —
  `client.force_login()` leaves the request anonymous because DRF's defaults are Token + Basic
  with no `SessionAuthentication`, and every call 401s.
- **`X-Org` is set centrally** in `utils/apiclient.ts`. Do not add it at a call site.
- Analysis payloads carry a `disclaimer`. Any screen rendering analysis renders it.
- Never describe the product as a lawyer, and never add social proof — no logo walls, no
  testimonials, no invented figures. Every number shown must be traceable to something real.

## Token discipline

The user is on a $20 plan. A run that burns the budget exploring and ships nothing is a failed
run.

- **No subagents.** They start cold and re-derive context both `CLAUDE.md` files already hold.
- No repo-wide `grep`/`find` sweeps except where a task explicitly calls for one (UX-22, UX-23,
  UX-24 do). Otherwise scope to a directory.
- Do not re-read a `CLAUDE.md` already in context.
- Do not boot the Docker stack unless a **Done when** needs a live backend.
- Prefer one targeted check over booting the whole app to confirm one thing.

## Environment notes

- Two repos: the Expo app and `../saferead_backend` (Django). Both have a `CLAUDE.md`; read the
  relevant one before searching.
- Expo: `pnpm dev`; preview config `saferead-web` on port 8081. `EXPO_PUBLIC_*` values are
  inlined at bundle time — after changing `.env`, restart with `--clear` or the old value keeps
  being served.
- Backend: `docker compose up -d`, API on `:8000`. Tests without Docker:
  `DEBUG=True DATABASE_URL="sqlite:///$PWD/.test.sqlite3" uv run python manage.py test`.
- 3-space indent, no semicolons in the Expo repo. Prettier: `pnpm format`.
- Never commit or push unless the user asks.

## Relationship to ROADMAP.md

`ROADMAP.md` owns features and the release gate; this plan owns navigation, feedback and
consistency. Three tasks overlap deliberately and should be cross-ticked when done:

| UX task | ROADMAP task |
|---|---|
| UX-05 (dead upgrade button) | T-35 (purchase flow must work or be removed) |
| UX-06, UX-07 (privacy screen, account deletion) | T-36 (store compliance) |
| UX-03, UX-04 (dead-end loading states) | T-24 (empty and error state pass) |

When one of these is finished here, tick it there too and note the cross-reference in both
Logs. Do not run `todays-task` work from this skill, or UX work from that one.

## When the plan is empty

If every box in Phases A–D is ticked, say so, summarise what Phase E still gates before a store
build, and ask whether to run the device walkthrough (UX-25) or add new work. **Do not invent
UX tasks unprompted** — this plan is grounded in an audit, and a task with no evidence behind it
is a redesign wearing a bug's clothes.
