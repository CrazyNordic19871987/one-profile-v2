---
name: design-review
description: "Reviews a component or feature design for completeness, UX quality, and consistency with the Neon Cyberpunk theme."
argument-hint: "[path-to-component]"
user-invocable: true
allowed-tools: Read, Glob, Grep
---

When this skill is invoked:

1. **Read the target component** in full.

2. **Check design completeness**:
   - [ ] Has clear visual hierarchy
   - [ ] Loading state implemented
   - [ ] Empty state handled
   - [ ] Error state handled
   - [ ] Responsive on mobile + desktop

3. **Check Neon Cyberpunk theme consistency**:
   - [ ] Uses .neon-card for containers
   - [ ] Uses .neon-text-* for colored text
   - [ ] Uses .neon-glow-* for emphasis
   - [ ] Consistent spacing and typography

4. **Check interaction quality**:
   - [ ] Hover effects on interactive elements
   - [ ] Transitions are smooth (0.2-0.3s)
   - [ ] Micro-animations for feedback
   - [ ] Touch targets ≥ 44px on mobile

5. **Check i18n**:
   - [ ] All user-facing text uses t()
   - [ ] No hardcoded English/Russian strings

6. **Output the review**:

```
## Design Review: [Component Name]

### Completeness: [X/5 passing]
### Theme Consistency: [X/4 passing]
### Interactions: [X/4 passing]
### i18n: [X/2 passing]

### Issues
[Problems found]

### Recommendations
[Improvements]

### Verdict: [APPROVED / NEEDS REVISION]
```
