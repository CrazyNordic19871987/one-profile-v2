---
name: code-review
description: "Reviews React/TypeScript code for quality, architecture, performance, and best practices in ONE! Profile."
argument-hint: "[path-to-file-or-directory]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

When this skill is invoked:

1. **Read the target file(s)** in full.

2. **Check TypeScript quality**:
   - [ ] No `any` types (use proper interfaces)
   - [ ] All props have explicit types
   - [ ] Unused imports/variables removed
   - [ ] Proper error handling (try/catch for async)

3. **Check React patterns**:
   - [ ] Components are pure (no side effects in render)
   - [ ] useEffect dependencies are correct
   - [ ] State is lifted to appropriate level
   - [ ] No unnecessary re-renders (memo/useMemo where needed)

4. **Check Supabase usage**:
   - [ ] Queries use proper type hints
   - [ ] Error handling for all DB operations
   - [ ] No N+1 query patterns
   - [ ] Proper use of .single() vs .maybeSingle()

5. **Check styling**:
   - [ ] Uses neon CSS utilities (.neon-card, .neon-glow-*, etc.)
   - [ ] Consistent with theme colors
   - [ ] Responsive design (mobile + desktop)

6. **Output the review** in this format:

```
## Code Review: [File Name]

### TypeScript: [X/4 passing]
### React Patterns: [X/4 passing]
### Supabase: [X/4 passing]
### Styling: [X/3 passing]

### Required Changes
[Must-fix items]

### Suggestions
[Nice-to-have improvements]

### Verdict: [APPROVED / CHANGES REQUIRED]
```
