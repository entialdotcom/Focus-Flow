---
name: frontend-design
description: Create consistent, production-grade frontend pages for Ential apps. Use this skill when building new pages, components, or sections to ensure design consistency with the unified Zinc + Orange design system.
allowed-tools: Read, Edit, Write, Glob, Grep
---

# Frontend Design for Ential Apps

This skill guides the creation of new pages and components that maintain visual consistency across all Ential apps using the unified Zinc + Orange design system.

## Design System Overview

All Ential apps use:
- **Tailwind CSS** with `darkMode: 'class'`
- **Zinc color palette** for neutrals
- **Orange-500** (#f97316) as the accent color
- **Inter** font for UI, **JetBrains Mono** for data
- **Light + Dark mode** support

## Required Elements

### 1. App Logo (REQUIRED)

Every app header MUST include this logo pattern:

```tsx
<div className="flex items-center gap-3">
  {/* Icon in orange rounded square */}
  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
    <IconName className="w-5 h-5 text-white" />
  </div>
  {/* App name with orange accent */}
  <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
    FIRST <span className="text-orange-500">WORD</span>
  </h1>
</div>
```

**Icon assignments:**
| App | Icon | Description |
|-----|------|-------------|
| Conversio | `ArrowLeftRight` | Currency exchange |
| Invoicible | `FileText` | Document |
| Read-Fast | `Zap` | Speed |
| FocusMode | `Headphones` | Music |
| Don't Be Late | `AlarmClock` | Time |

### 2. Footer (REQUIRED)

**CRITICAL:** All apps MUST include this exact footer:

```tsx
<footer className="py-8 text-center">
  <a
    href="https://ential.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
  >
    Made with Love + Code by Ential
  </a>
</footer>
```

### 3. Theme Toggle (REQUIRED)

All apps must support light/dark mode with this pattern:

```tsx
import { Sun, Moon } from 'lucide-react';

// State management
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as 'light' | 'dark';
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
});

useEffect(() => {
  const root = window.document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}, [theme]);

const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

// Toggle button
<button
  onClick={toggleTheme}
  className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
>
  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
</button>
```

## Color Classes Reference

### Light Mode
```
bg-zinc-100      // Page background
bg-white         // Cards, surfaces
text-zinc-900    // Primary text
text-zinc-400    // Secondary text
text-zinc-500    // Muted text
border-zinc-200  // Borders
```

### Dark Mode
```
dark:bg-zinc-950  // Page background
dark:bg-zinc-900  // Cards, surfaces
dark:text-zinc-100 // Primary text
dark:text-zinc-500 // Secondary text
dark:border-zinc-800 // Borders
```

### Accent (Same both modes)
```
bg-orange-500         // Primary accent
hover:bg-orange-600   // Hover state
text-orange-500       // Accent text
shadow-orange-500/20  // Glow effect
```

## Component Patterns

### Standard Header

```tsx
<header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors">
  <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
    {/* Logo + Title (see above) */}
    <div className="flex items-center gap-3">...</div>

    {/* Actions */}
    <div className="flex items-center gap-2">
      {/* Theme toggle */}
      {/* Other action buttons */}
    </div>
  </div>
</header>
```

### Primary Button (Orange CTA)

```tsx
<button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg shadow-md shadow-orange-500/20 active:scale-95 transition-all">
  Download PDF
</button>
```

### Secondary Button

```tsx
<button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all">
  Cancel
</button>
```

### Ghost/Add Button

```tsx
<button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-6 py-3 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 w-full transition-colors">
  <Plus size={18} />
  <span className="text-sm font-medium">Add Item</span>
</button>
```

### Card

```tsx
<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
  {/* Card content */}
</div>
```

### Input Field

```tsx
<input
  type="text"
  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
  placeholder="Enter value..."
/>
```

### Select/Dropdown

```tsx
<select className="w-full appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700">
  <option>Option 1</option>
</select>
```

### Modal

```tsx
<div className="fixed inset-0 bg-zinc-900/50 dark:bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
      Modal Title
    </h2>
    {/* Content */}
  </div>
</div>
```

### Status Indicator

```tsx
// Live
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-emerald-500" />
  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500">Live</span>
</div>

// Updating
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500">Updating</span>
</div>
```

## Page Layout Template

```tsx
const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // ... theme logic

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-800 dark:text-zinc-100 transition-colors">

      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              APP <span className="text-orange-500">NAME</span>
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 sm:px-6 py-8">
        {/* Your content here */}
      </main>

      {/* Footer - REQUIRED */}
      <footer className="py-8 text-center">
        <a
          href="https://ential.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          Made with Love + Code by Ential
        </a>
      </footer>
    </div>
  );
};
```

## Required index.html Setup

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App Name</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            }
          }
        }
      }
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
      body { font-family: 'Inter', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
  </head>
  <body class="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-orange-200 selection:text-orange-900">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

## Checklist for New Pages

- [ ] Logo with orange icon + branded text in header
- [ ] Theme toggle button (Sun/Moon icons)
- [ ] Light + Dark mode classes on ALL elements
- [ ] Orange-500 for primary CTAs and accent
- [ ] Zinc palette for all neutrals
- [ ] Required footer with Ential link
- [ ] `transition-colors` on theme-aware containers
- [ ] Lucide icons for all iconography
