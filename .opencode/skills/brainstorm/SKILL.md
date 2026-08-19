---
name: brainstorm
description: "Guided feature ideation for ONE! Profile — from idea to structured feature spec."
argument-hint: "[feature area or 'open']"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, WebSearch, AskUserQuestion
---

When this skill is invoked:

1. **Check existing features**: Read current components and design docs.

2. **Run ideation phases** interactively:

   **Phase 1: Understanding**
   - What problem does this feature solve?
   - Who is the primary user (kid, GM, parent)?
   - What's the constraint (scope, time, technical)?

   **Phase 2: Concept Generation**
   - Generate 2-3 feature concepts
   - Each with: name, description, core mechanic, user benefit
   - Present options with pros/cons

   **Phase 3: Core Design**
   - Define the feature's core loop
   - Map data flow (Supabase tables needed)
   - Define UI components needed
   - List i18n keys required

   **Phase 4: Scope**
   - MVP: What's the minimum viable version?
   - Full: What's the complete vision?
   - Dependencies: What other features does this need?

3. **Save to** `design/features/[feature-name].md`

4. **Suggest next steps**:
   - Build the MVP components
   - Add to sprint plan
   - Design review before implementation
