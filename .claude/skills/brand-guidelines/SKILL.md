---
name: brand-guidelines
description: Use this skill when styling components, creating new pages, or ensuring visual consistency across FocusMode. Contains fonts, colors, and design patterns inspired by Braun/Dieter Rams aesthetics.
allowed-tools: Read, Edit, Write, Glob, Grep
---

# Brand Guidelines - FocusMode

This skill defines the visual identity for FocusMode, following Braun/Dieter Rams design principles: functional, minimal, honest, and long-lasting.

## Design Philosophy

**"Less, but better."** - Dieter Rams

Every design decision should follow these principles:
1. Good design is innovative
2. Good design makes a product useful
3. Good design is aesthetic
4. Good design makes a product understandable
5. Good design is unobtrusive
6. Good design is honest
7. Good design is long-lasting
8. Good design is thorough down to the last detail
9. Good design is environmentally friendly
10. Good design is as little design as possible

## Typography

### Font Families

| Font | Usage | CSS Variable | Tailwind Class |
|------|-------|--------------|----------------|
| **Inter** | Headings, titles, UI text | `font-family: 'Inter', sans-serif` | `font-sans` |
| **SF Mono / JetBrains Mono** | Timer display, stats, durations | `font-family: 'JetBrains Mono', monospace` | `font-mono` |

### Font Import (Required)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
```

### Heading Hierarchy

| Element | Style | Example Usage |
|---------|-------|---------------|
| `h1` (Title) | Inter, `text-2xl font-bold tracking-tight` | App title, mode names |
| `h2` (Section) | Inter, `text-xl font-semibold` | Section headings |
| Timer Display | JetBrains Mono, `font-mono text-6xl font-bold` | Timer countdown |
| Labels | Inter, `text-xs uppercase tracking-widest` | Mode labels, stats |

## Color Palette

### Core Colors (Braun-Inspired)

| Name | Hex | Usage | CSS Variable |
|------|-----|-------|--------------|
| **Warm White** | `#F4F4F0` | Light mode background | `--bg-primary` |
| **Dark** | `#1A1A1A` | Dark mode background | `--bg-primary` |
| **Surface Light** | `#FFFFFF` | Cards (light) | `--bg-secondary` |
| **Surface Dark** | `#2A2A2A` | Cards (dark) | `--bg-secondary` |
| **Text Light** | `#1A1A1A` | Primary text (light) | `--text-primary` |
| **Text Dark** | `#F4F4F0` | Primary text (dark) | `--text-primary` |
| **Muted Light** | `#6B6B6B` | Secondary text (light) | `--text-secondary` |
| **Muted Dark** | `#9A9A9A` | Secondary text (dark) | `--text-secondary` |

### Accent Color (Braun Orange)

| Shade | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| **Braun Orange** | `#EA5B0C` | `--accent` | Primary accent, CTAs, active states |
| Orange Hover | `#D94E00` | - | Hover states |
| Orange Light | `#EA5B0C/10` | - | Subtle backgrounds |

### CSS Variables (Theme Support)

```css
:root {
  --bg-primary: #F4F4F0;
  --bg-secondary: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #6B6B6B;
  --accent: #EA5B0C;
  --accent-hover: #D94E00;
  --border: #DCDCDC;
  --chrome: #A1A1AA;
}

.dark {
  --bg-primary: #1A1A1A;
  --bg-secondary: #2A2A2A;
  --text-primary: #F4F4F0;
  --text-secondary: #9A9A9A;
  --accent: #EA5B0C;
  --accent-hover: #FF6B1A;
  --border: #3A3A3A;
  --chrome: #71717A;
}
```

### Tailwind Config

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'accent': 'var(--accent)',
        'border-color': 'var(--border)',
      }
    }
  }
}
```

## Button System

### Mechanical Button Classes (Preferred)

The app uses a consistent "mechanical" button style inspired by Braun hardware. These classes are defined globally in `index.html`:

```css
/* Base mechanical button - neutral state */
.btn-mechanical {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  transition: all 0.15s ease;
}
.btn-mechanical:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.btn-mechanical:active {
  transform: scale(0.98);
}

/* Active/selected state - orange accent */
.btn-mechanical-active {
  background-color: var(--accent);
  color: white;
  border: 1px solid var(--accent);
}
.btn-mechanical-active:hover {
  background-color: var(--accent-hover);
  border-color: var(--accent-hover);
}
```

### Usage Examples

**Icon Button (toolbar, controls):**
```tsx
<button className="btn-mechanical p-2 rounded-lg text-[var(--text-primary)] hover:opacity-80">
  <Settings className="w-5 h-5" />
</button>
```

**Toggle Button (active/inactive states):**
```tsx
<button className={`btn-mechanical flex items-center gap-1.5 px-3 py-2 rounded-lg ${
  isActive ? 'btn-mechanical-active' : 'text-[var(--text-primary)] hover:opacity-80'
}`}>
  <Heart size={16} className={isActive ? 'fill-current' : ''} />
  <span className="text-xs font-medium">{isActive ? 'Saved' : 'Save'}</span>
</button>
```

**Play Button (circular, prominent):**
```tsx
<button className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
  isPlaying ? 'btn-mechanical-active' : 'btn-mechanical text-[var(--text-primary)]'
}`}>
  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
</button>
```

### Primary CTA Button

```tsx
<button
  className="bg-[var(--accent)] text-white font-medium px-6 py-3 rounded-lg
             hover:bg-[var(--accent-hover)] active:scale-95
             transition-all duration-200 shadow-sm hover:shadow-md"
>
  Start Focus
</button>
```

### Secondary Button

```tsx
<button
  className="bg-[var(--bg-secondary)] border border-[var(--border)]
             text-[var(--text-primary)] font-medium px-6 py-3 rounded-lg
             shadow-sm hover:shadow-md active:scale-95 transition-all"
>
  Settings
</button>
```

### Mode Selection Button

```tsx
<button
  className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all
              ${isSelected
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
>
  <Icon size={24} className="mx-auto mb-2" />
  <span className="text-sm">Mode Name</span>
</button>
```

## Component Patterns

### Timer Display

```tsx
<div className="text-center py-12">
  <div className="font-mono text-7xl sm:text-8xl font-bold text-[var(--text-primary)] tracking-tight">
    25:00
  </div>
  <div className="text-lg text-[var(--text-secondary)] mt-2">
    Focus Session
  </div>
</div>
```

### Progress Ring

```tsx
<svg className="w-64 h-64 transform -rotate-90">
  {/* Background ring */}
  <circle
    cx="128"
    cy="128"
    r="120"
    stroke="var(--border)"
    strokeWidth="8"
    fill="none"
  />
  {/* Progress ring */}
  <circle
    cx="128"
    cy="128"
    r="120"
    stroke="var(--accent)"
    strokeWidth="8"
    fill="none"
    strokeLinecap="round"
    strokeDasharray={circumference}
    strokeDashoffset={progress}
    className="transition-all duration-1000"
  />
</svg>
```

### Mode Card

```tsx
<div className="bg-[var(--bg-secondary)] border border-[var(--border)]
                rounded-xl p-6 hover:shadow-md transition-all cursor-pointer
                hover:border-[var(--accent)]/30">
  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10
                  flex items-center justify-center mb-4">
    <Icon size={24} className="text-[var(--accent)]" />
  </div>
  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Focus Mode</h3>
  <p className="text-sm text-[var(--text-secondary)]">25 min sessions</p>
</div>
```

### Ambient Sound Control

```tsx
<div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)]
                border border-[var(--border)] rounded-lg">
  <button className="p-2 rounded-lg hover:bg-[var(--accent)]/10 transition-colors">
    <Volume2 size={20} className="text-[var(--text-secondary)]" />
  </button>
  <div className="flex-1">
    <div className="text-sm font-medium text-[var(--text-primary)]">Rain Sounds</div>
    <input
      type="range"
      className="w-full h-1 bg-[var(--border)] rounded-full appearance-none
                 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]"
    />
  </div>
</div>
```

### Stats Display

```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
    <div className="font-mono text-2xl font-bold text-[var(--accent)]">12</div>
    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Sessions</div>
  </div>
  <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
    <div className="font-mono text-2xl font-bold text-[var(--text-primary)]">5h</div>
    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Focus Time</div>
  </div>
  <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
    <div className="font-mono text-2xl font-bold text-[var(--text-primary)]">3</div>
    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Streak</div>
  </div>
</div>
```

## Layout

### Max Width Containers

| Context | Max Width |
|---------|-----------|
| App container | `max-w-md` (448px) |
| Wide content | `max-w-lg` (512px) |

### Spacing Standards

| Element | Spacing |
|---------|---------|
| Page padding | `p-4` to `p-6` |
| Section gaps | `space-y-6` to `space-y-8` |
| Card padding | `p-4` to `p-6` |
| Timer section | `py-12` |

## Footer Pattern (Required)

```tsx
<footer className="py-8 text-center">
  <a
    href="https://ential.com"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-xs font-medium
               text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
  >
    <span>Made with Love + Code by Ential</span>
  </a>
</footer>
```

## Best Practices

1. **Focus-First Design** - Timer is the hero, minimize distractions
2. **Calming Interface** - Use soft transitions and muted colors
3. **Clear Modes** - Different focus modes should be visually distinct
4. **Monospace Timers** - All time displays use monospace
5. **Theme Support** - Full light and dark mode support
6. **Orange for Accent** - Use Braun Orange (`#EA5B0C`) for:
   - Active/selected button states (`btn-mechanical-active`)
   - Hover border effects on cards and buttons
   - Primary CTAs and important actions
   - Icons in active/highlighted states
   - The app logo and branding
   - Link hover states
   - Slider thumbs and progress indicators
7. **Consistent Footer** - Use the Ential footer pattern with orange hover

## Quick Reference

```tsx
<div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]
                font-sans transition-colors">

  {/* Header */}
  <header className="px-6 py-6 flex items-center justify-between max-w-md mx-auto">
    <h1 className="text-xl font-bold tracking-tight">FocusMode</h1>
    <ThemeToggle />
  </header>

  {/* Timer */}
  <main className="max-w-md mx-auto px-4">
    <div className="text-center py-12">
      <div className="font-mono text-7xl font-bold">25:00</div>
    </div>

    {/* Controls */}
    <div className="space-y-4">
      <button className="w-full bg-[var(--accent)] text-white py-4 rounded-lg font-medium">
        Start Focus
      </button>
    </div>
  </main>

  {/* Footer */}
  <footer className="py-8 text-center">
    <a href="https://ential.com" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]">
      Made with Love + Code by Ential
    </a>
  </footer>
</div>
```
