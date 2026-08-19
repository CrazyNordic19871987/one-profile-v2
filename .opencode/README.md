# ONE! Profile — OpenCode Studio (Adapted)

Adapted from [OpenCode Game Studios](https://github.com/traftG/opencode-game-studio) for a gamified learning platform.

## Agents

| Agent | Role | Use For |
|-------|------|---------|
| `gamification-designer` | Progression, badges, ship evolution, prestige | "How should the XP curve work?" |
| `economy-designer` | Coins/gems balance, reward tuning | "Are mission rewards balanced?" |
| `ux-designer` | UI/UX, responsive layout, interactions | "How should the mobile nav work?" |

## Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| `code-review` | `/code-review [file]` | Review React/TS code quality |
| `design-review` | `/design-review [component]` | Review component design |
| `sprint-plan` | `/sprint-plan [new\|update\|status]` | Plan development sprints |
| `brainstorm` | `/brainstorm [area]` | Ideate new features |

## Usage Examples

```
# In OpenCode session:
@gamification-designer "Design a prestige reset mechanic"
@economy-designer "Analyze our coin sink/faucet balance"
@ux-designer "How should the badge hover effect work?"

# Skills:
/code-review src/components/BadgeSystem.tsx
/design-review src/components/MissionSystem.tsx
/sprint-plan new
/brainstorm achievement-system
```

## Files

```
.opencode/
├── opencode.json          # Agent configuration
├── agents/
│   ├── gamification-designer.md
│   ├── economy-designer.md
│   └── ux-designer.md
└── skills/
    ├── code-review/SKILL.md
    ├── design-review/SKILL.md
    ├── sprint-plan/SKILL.md
    └── brainstorm/SKILL.md
```
