---
name: skill-sync
description: Automatically sync skills across all Ential apps (Conversio, Don't Be Late, Invoicible, Read-Fast, FocusMode). Use this skill after creating or updating any skill to keep all apps in sync.
allowed-tools: Bash, Read, Write, Glob
---

# Skill Sync

This skill ensures all skills are synchronized across the 5 Ential apps to maintain brand consistency.

## Target Apps

| App | Path |
|-----|------|
| Conversio | `/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/` |
| Don't Be Late | `/Users/ryandrake/Documents/Coding/Dev/Don-t-Be-Late/.claude/skills/` |
| Invoicible | `/Users/ryandrake/Documents/Coding/Dev/Invoicible/.claude/skills/` |
| Read-Fast | `/Users/ryandrake/Documents/Coding/Dev/Read-Fast/.claude/skills/` |
| FocusMode | `/Users/ryandrake/Documents/Coding/Dev/FocusMode/.claude/skills/` |

## When to Use

This skill should be triggered whenever:
1. A skill is created or updated in any of the 5 apps
2. Brand guidelines or frontend-design patterns change
3. The user explicitly asks to sync skills across apps
4. A new skill is added that should be shared

## Shared Skills (Sync These)

These skills should be identical or nearly identical across all apps:

| Skill | Purpose |
|-------|---------|
| `brand-guidelines` | Braun/Dieter Rams color palette, typography, core patterns |
| `frontend-design` | Component patterns, page structure, theme support |
| `skill-sync` | This skill - keeps all apps synchronized |
| `new-page` | Page creation checklist (adapted per app) |

## App-Specific Customizations

While skills are synced, some content is app-specific:

- **App name** in descriptions and examples
- **Component patterns** specific to that app's functionality
- **Layout constraints** based on app type (mobile, desktop, etc.)

## Sync Process

### For New Shared Skills

When creating a new skill that should be shared:

1. Create the skill in one app
2. Copy to all other apps with appropriate customizations:

```bash
# Copy brand-guidelines to all apps
cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/brand-guidelines" "/Users/ryandrake/Documents/Coding/Dev/Don-t-Be-Late/.claude/skills/"
cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/brand-guidelines" "/Users/ryandrake/Documents/Coding/Dev/Invoicible/.claude/skills/"
cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/brand-guidelines" "/Users/ryandrake/Documents/Coding/Dev/Read-Fast/.claude/skills/"
cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/brand-guidelines" "/Users/ryandrake/Documents/Coding/Dev/FocusMode/.claude/skills/"
```

### For Updated Skills

When updating a shared skill:

1. Make changes in the source app
2. Update app-specific content in each destination
3. Sync updated skill to all apps

### Full Sync (All Skills to All Apps)

To sync all shared skills at once (use Conversio as source):

```bash
# Sync brand-guidelines
for app in "Don-t-Be-Late" "Invoicible" "Read-Fast" "FocusMode"; do
  cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/brand-guidelines" "/Users/ryandrake/Documents/Coding/Dev/$app/.claude/skills/"
done

# Sync frontend-design
for app in "Don-t-Be-Late" "Invoicible" "Read-Fast" "FocusMode"; do
  cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/frontend-design" "/Users/ryandrake/Documents/Coding/Dev/$app/.claude/skills/"
done

# Sync skill-sync
for app in "Don-t-Be-Late" "Invoicible" "Read-Fast" "FocusMode"; do
  cp -r "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/skill-sync" "/Users/ryandrake/Documents/Coding/Dev/$app/.claude/skills/"
done
```

## Consistency Checklist

When syncing, verify these elements match across all apps:

### Colors
- [ ] Braun Orange: `#EA5B0C`
- [ ] Warm White: `#F4F4F0`
- [ ] Dark: `#1A1A1A`
- [ ] Surface: `#FFFFFF` / `#2A2A2A`
- [ ] Muted: `#6B6B6B` / `#9A9A9A`
- [ ] Border: `#DCDCDC` / `#3A3A3A`

### Typography
- [ ] Inter for UI text
- [ ] JetBrains Mono for data/numbers
- [ ] Font import URL is identical

### Theme Support
- [ ] Light mode default
- [ ] Dark mode with `.dark` class
- [ ] CSS variables defined

### Footer
- [ ] "Made with Love + Code by Ential"
- [ ] Link to https://ential.com
- [ ] Consistent styling across apps

## Verification Command

To verify skills are in sync:

```bash
# Compare brand-guidelines across apps
diff "/Users/ryandrake/Documents/Coding/Dev/Conversio/.claude/skills/brand-guidelines/SKILL.md" "/Users/ryandrake/Documents/Coding/Dev/Invoicible/.claude/skills/brand-guidelines/SKILL.md"
```

## Important Rules

1. **Always sync after changes** - Don't leave apps out of date
2. **Preserve app-specific content** - Update app names and examples appropriately
3. **Verify consistency** - Check key values match after sync
4. **Use Conversio as source** - When in doubt, use Conversio as the reference app
