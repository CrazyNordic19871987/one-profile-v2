---
name: sprint-plan
description: "Generates or updates a sprint plan for ONE! Profile development."
argument-hint: "[new|update|status]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

When this skill is invoked:

1. **Scan current state**:
   - Check git log for recent commits
   - Check for TODO comments in codebase
   - Review design docs in design/ folder

2. **For `new`**, generate a sprint plan:

```markdown
# Sprint [N] — [Date Range]

## Sprint Goal
[One sentence]

## Tasks

### Must Have
| Task | Est. | Status |
|------|------|--------|

### Should Have
| Task | Est. | Status |
|------|------|--------|

### Nice to Have
| Task | Est. | Status |
|------|------|--------|

## Risks
| Risk | Mitigation |
|------|------------|

## Definition of Done
- [ ] All Must Have tasks complete
- [ ] Build passes (npm run build)
- [ ] No TypeScript errors
- [ ] i18n keys added for new text
```

3. **For `status`**, show current progress.

4. **For `update`**, modify existing sprint based on completed work.
