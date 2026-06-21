---
type: briefing
target_agent: Jules (Google AI async)
task: READ-ONLY codebase audit — do NOT implement or change any application code
priority: high
---

# READ-ONLY Codebase Audit: MAGPIE_Server Prototype 0.39.3

## ⚠️ CRITICAL: Use the `prototype` branch

**You MUST work on the `prototype` branch.** Do NOT use `main`.

```bash
git checkout prototype
```

All analysis, all file reads, and your final commit MUST be on the `prototype` branch. The `main` branch is outdated and irrelevant to this task.

## What This Is
This is a **documentation task, not an implementation task.** You are reading code and writing a report. You are NOT implementing features, fixing bugs, or modifying application files.

## Your Job
1. **Read every file** in the `prototype` branch and build a complete map of the codebase: what each file/module does, what it exports, what it depends on.
2. **Read `README.md`** at the branch root. For each claim the README makes about the system, check whether the code supports that claim. Note matches and mismatches.
3. **Read `.private/docs/prototype_0_40_0_plan.md`**. For each planned feature/task, check whether the code already implements it (fully, partially, or not at all). Note the status of each.
4. **Write a structured report** called `AUDIT_CodebaseMapping_0_39_3.md` with:
   - Full file tree with one-line descriptions of each file's purpose
   - Module dependency map (what requires/imports what)
   - Feature status table: planned feature → implemented? (yes/partial/no) → evidence (which file, which function)
   - README accuracy table: README claim → accurate? → evidence
   - List of undocumented code (things in the code that neither README nor plan mention)

## What You Must NOT Do
- Do NOT modify SERVER.js or any application file
- Do NOT implement JWT security, ecosystem population, or any feature
- Do NOT create or modify scratchpad files
- The ONLY file you create is the audit report

## Output
Commit `AUDIT_CodebaseMapping_0_39_3.md` to `.private/tasklet_sync/` on the **`prototype` branch** and push. That is your only deliverable.
