---
name: new-page
description: Use this skill when creating new pages or views in Ential apps. Handles view creation, SEO metadata, routing, and ensures consistent structure with proper meta tags, descriptions, h1 tags, canonical URLs, and keywords.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# New Page Creator

This skill provides a complete checklist for creating new pages/views in Ential React applications with proper SEO implementation.

## SEO Requirements Checklist

Every new page MUST include:

| Element | Purpose | Location |
|---------|---------|----------|
| `<title>` tag | Browser tab, search results | `index.html` or dynamic |
| Meta description | Search result snippet | `<meta name="description">` |
| Meta keywords | SEO targeting | `<meta name="keywords">` |
| Canonical URL | Prevent duplicate content | `<link rel="canonical">` |
| OG tags | Social sharing | `<meta property="og:*">` |
| H1 tag | Page main heading | One per page |
| Structured data | Rich snippets | `<script type="application/ld+json">` |

## index.html SEO Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <title>App Name - Primary Keyword | Ential</title>
    <meta name="title" content="App Name - Primary Keyword | Ential" />
    <meta name="description" content="Compelling 150-160 character description that includes primary keyword and value proposition." />
    <meta name="keywords" content="keyword1, keyword2, keyword3, keyword4, keyword5" />
    <meta name="author" content="Ential" />
    <meta name="robots" content="index, follow" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://appname.ential.com/" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://appname.ential.com/" />
    <meta property="og:title" content="App Name - Primary Keyword | Ential" />
    <meta property="og:description" content="Compelling description for social sharing." />
    <meta property="og:image" content="https://appname.ential.com/og-image.png" />
    <meta property="og:site_name" content="Ential" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://appname.ential.com/" />
    <meta name="twitter:title" content="App Name - Primary Keyword | Ential" />
    <meta name="twitter:description" content="Compelling description for Twitter." />
    <meta name="twitter:image" content="https://appname.ential.com/og-image.png" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Theme Color -->
    <meta name="theme-color" content="#f97316" />

    <!-- Tailwind + Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
      body { font-family: 'Inter', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
  </head>
  <body class="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "App Name",
      "description": "App description",
      "url": "https://appname.ential.com",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "Ential",
        "url": "https://ential.com"
      }
    }
    </script>
  </body>
</html>
```

## App-Specific SEO Metadata

### Conversio (Currency Converter)
```html
<title>Conversio - Free Currency Converter | Ential</title>
<meta name="description" content="Convert currencies instantly with real-time exchange rates. Free currency converter for USD, EUR, GBP, crypto and 150+ currencies. No signup required." />
<meta name="keywords" content="currency converter, exchange rate, USD to EUR, crypto converter, forex, money converter, free currency calculator" />
```

### Don't Be Late (World Clock)
```html
<title>Don't Be Late - World Time Zone Converter | Ential</title>
<meta name="description" content="Compare time zones instantly across cities worldwide. Perfect for scheduling international meetings. Free world clock and time zone converter." />
<meta name="keywords" content="world clock, time zone converter, meeting scheduler, international time, timezone comparison, global time" />
```

### Invoicible (Invoice Generator)
```html
<title>Invoicible - Free Invoice Generator | Ential</title>
<meta name="description" content="Create professional invoices in seconds. Free invoice generator with PDF export, customizable templates, and no signup required. Perfect for freelancers." />
<meta name="keywords" content="invoice generator, free invoice maker, invoice template, PDF invoice, freelance invoice, billing software" />
```

### Read Fast (Speed Reader)
```html
<title>Read Fast - RSVP Speed Reader | Ential</title>
<meta name="description" content="Read faster with RSVP technology. Speed reading app that displays words rapidly to improve reading speed. Read articles and books 3x faster." />
<meta name="keywords" content="speed reading, RSVP reader, fast reading app, reading trainer, rapid serial visual presentation" />
```

### FocusMode (Focus Music)
```html
<title>FocusMode - Music for Productivity | Ential</title>
<meta name="description" content="Curated music for focus, meditation, and productivity. Ambient sounds and lo-fi beats to help you concentrate. Free focus music player." />
<meta name="keywords" content="focus music, productivity music, concentration music, ambient sounds, lo-fi beats, study music, work music" />
```

## Page Component Structure

### Required H1 Tag

Every page MUST have exactly ONE `<h1>` tag. In Ential apps, this is the branded header:

```tsx
// The app name in the header IS the H1
<h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
  APP <span className="text-orange-500">NAME</span>
</h1>
```

### Semantic HTML Structure

```tsx
<div className="min-h-screen flex flex-col">
  {/* Header contains the H1 */}
  <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          APP <span className="text-orange-500">NAME</span>
        </h1>
      </div>
    </div>
  </header>

  {/* Main content */}
  <main className="flex-1">
    <section aria-label="Primary content">
      {/* Content */}
    </section>
  </main>

  {/* Footer */}
  <footer className="py-8 text-center">
    <a href="https://ential.com" className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
      Made with Love + Code by Ential
    </a>
  </footer>
</div>
```

## Multi-View Apps

For apps with multiple views/pages:

### 1. Define View Types

```tsx
// types.ts
export type PageView = 'home' | 'settings' | 'about';
```

### 2. Create View Component

```tsx
// views/Settings.tsx
import React from 'react';
import { PageView } from '../types';

interface SettingsProps {
  setPage: (page: PageView) => void;
}

const Settings: React.FC<SettingsProps> = ({ setPage }) => {
  return (
    <section aria-label="Settings">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h2>
      {/* Note: h2 not h1, since h1 is in the header */}
    </section>
  );
};

export default Settings;
```

### 3. Lazy Loading

```tsx
// App.tsx
const Settings = lazy(() => import('./views/Settings'));

const renderContent = () => {
  switch (currentPage) {
    case 'home': return <Home />;
    case 'settings': return <Settings setPage={setPage} />;
    default: return <Home />;
  }
};
```

### 4. Dynamic SEO Hook

```tsx
// hooks/useSEO.ts
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
}

export const useSEO = ({ title, description, keywords }: SEOProps) => {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    if (keywords) {
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);
};
```

## SEO Best Practices

### Title Tag (50-60 characters)
```
Format: App Name - Primary Keyword | Ential
Example: Conversio - Free Currency Converter | Ential
```

### Meta Description (150-160 characters)
- Include primary keyword naturally
- State the value proposition clearly
- Include implicit call-to-action
- Sound human, not robotic

### Keywords (5-10 terms)
- Primary keyword first
- Include variations and synonyms
- Add long-tail keywords
- Lowercase, comma-separated

### URL Structure
- Lowercase with hyphens
- Short and descriptive
- Include primary keyword

## Accessibility Requirements

```tsx
// Images need alt text
<img src="/logo.png" alt="Ential logo" />

// Icon buttons need aria-label
<button aria-label="Toggle dark mode" title="Toggle dark mode">
  <Moon className="w-4 h-4" />
</button>

// Links should be descriptive
<a href="https://ential.com">Visit Ential</a>

// Form inputs need labels
<label htmlFor="amount" className="sr-only">Amount</label>
<input id="amount" type="number" />
```

## Publishing Checklist

### index.html SEO
- [ ] `<title>` tag (50-60 chars)
- [ ] `<meta name="description">` (150-160 chars)
- [ ] `<meta name="keywords">` (5-10 keywords)
- [ ] `<link rel="canonical">`
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter card tags
- [ ] `<meta name="robots" content="index, follow">`
- [ ] Structured data (JSON-LD)
- [ ] `lang="en"` on `<html>`
- [ ] `<meta name="theme-color" content="#f97316">`

### Page Structure
- [ ] ONE `<h1>` tag (app name in header)
- [ ] Semantic HTML (`<header>`, `<main>`, `<footer>`)
- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] Alt text on images
- [ ] aria-labels on icon buttons

### Brand Consistency
- [ ] Logo: orange icon + branded text
- [ ] Header: `max-w-5xl` centered
- [ ] Footer: "Made with Love + Code by Ential"
- [ ] Colors: Zinc + Orange-500 scheme
- [ ] Fonts: Inter + JetBrains Mono
- [ ] Theme: Light/dark mode support
