---
name: pre-push
description: Pre-push validation that runs security audit, SEO checks, and unit tests. Blocks push if any checks fail. Run before deploying to GitHub.
allowed-tools: Read, Glob, Grep, Bash, Task
proactive: false
---

# Pre-Push Validation Skill

This skill runs a comprehensive validation suite before pushing to GitHub. It checks:
1. **Security** - OWASP vulnerabilities, XSS, injection risks
2. **SEO** - Meta tags, structured data, accessibility
3. **Unit Tests** - All tests must pass

## Usage

Run this skill before pushing:
```
/pre-push
```

Or it will run automatically via the git pre-push hook.

## Validation Phases

### Phase 1: Unit Tests

Run all unit tests first - fastest feedback loop:

```bash
npm test -- --run --reporter=verbose
```

**Pass Criteria:**
- All tests must pass
- No skipped tests (unless explicitly marked)

**Failure Action:** BLOCK PUSH - Fix failing tests before pushing.

---

### Phase 2: Security Audit

Perform security checks for common vulnerabilities:

#### 2.1 Check for Dangerous Patterns

```bash
# Check for eval/Function constructor (code injection)
grep -rn "eval(" --include="*.ts" --include="*.tsx" src/ || true
grep -rn "new Function(" --include="*.ts" --include="*.tsx" src/ || true

# Check for dangerouslySetInnerHTML (XSS)
grep -rn "dangerouslySetInnerHTML" --include="*.tsx" src/ || true

# Check for hardcoded secrets
grep -rn "apikey\|api_key\|secret\|password" --include="*.ts" --include="*.tsx" -i src/ || true
grep -rn "sk-\|pk_\|Bearer " --include="*.ts" --include="*.tsx" src/ || true

# Check for localStorage without validation
grep -rn "JSON.parse(localStorage" --include="*.ts" --include="*.tsx" src/ || true
```

#### 2.2 Check for Input Validation

```bash
# Find parseFloat/parseInt without validation
grep -rn "parseFloat\|parseInt" --include="*.ts" --include="*.tsx" src/
```

Verify each usage has:
- `isNaN()` check
- `isFinite()` check
- Bounds validation where appropriate

#### 2.3 Security Checklist

| Check | Status | Notes |
|-------|--------|-------|
| No `eval()` or `new Function()` | Required | Code injection risk |
| No `dangerouslySetInnerHTML` with user input | Required | XSS risk |
| No hardcoded API keys | Required | Credential exposure |
| Input validation on all user inputs | Required | Injection prevention |
| HTTPS for all external requests | Required | Data interception |
| Division by zero protection | Required | Runtime errors |

**Pass Criteria:**
- No critical security issues found
- All dangerous patterns reviewed and justified

**Failure Action:** BLOCK PUSH - Security vulnerabilities must be fixed.

---

### Phase 3: SEO Audit

Check that all SEO requirements are met:

#### 3.1 index.html Checks

```bash
# Check for required meta tags
grep -q '<title>' index.html && echo "✓ Title tag found" || echo "✗ MISSING: Title tag"
grep -q 'meta name="description"' index.html && echo "✓ Meta description found" || echo "✗ MISSING: Meta description"
grep -q 'meta name="keywords"' index.html && echo "✓ Meta keywords found" || echo "✗ MISSING: Meta keywords"
grep -q 'rel="canonical"' index.html && echo "✓ Canonical URL found" || echo "✗ MISSING: Canonical URL"
grep -q 'property="og:' index.html && echo "✓ Open Graph tags found" || echo "✗ MISSING: Open Graph tags"
grep -q 'application/ld+json' index.html && echo "✓ Structured data found" || echo "✗ MISSING: Structured data"
grep -q 'lang="en"' index.html && echo "✓ Language attribute found" || echo "✗ MISSING: Language attribute"
```

#### 3.2 Component Structure Checks

```bash
# Check for H1 tag in app
grep -rn "<h1" --include="*.tsx" src/ components/

# Check for proper semantic HTML
grep -rn "<header\|<main\|<footer\|<section\|<nav" --include="*.tsx" src/ components/

# Check for alt text on images
grep -rn "<img" --include="*.tsx" src/ components/ | grep -v "alt="
```

#### 3.3 SEO Checklist

| Element | Required | Notes |
|---------|----------|-------|
| `<title>` tag | Yes | 50-60 characters |
| `<meta name="description">` | Yes | 150-160 characters |
| `<meta name="keywords">` | Yes | 5-10 relevant keywords |
| `<link rel="canonical">` | Yes | Prevent duplicate content |
| Open Graph tags | Yes | Social sharing |
| Twitter card tags | Recommended | Twitter sharing |
| Structured data (JSON-LD) | Yes | Rich snippets |
| `lang` attribute on `<html>` | Yes | Accessibility |
| One `<h1>` tag | Yes | Page structure |
| Alt text on images | Yes | Accessibility |
| aria-labels on icon buttons | Yes | Screen readers |

**Pass Criteria:**
- All required SEO elements present
- Meta description between 150-160 characters
- Title tag between 50-60 characters

**Failure Action:** BLOCK PUSH - SEO issues must be fixed.

---

### Phase 4: Build Verification

Ensure the app builds without errors:

```bash
npm run build
```

**Pass Criteria:**
- Build completes successfully
- No TypeScript errors
- No build warnings (or warnings are acceptable)

**Failure Action:** BLOCK PUSH - Build must succeed.

---

## Validation Report Format

After running all checks, output a report:

```markdown
# Pre-Push Validation Report

## Summary
| Check | Status | Details |
|-------|--------|---------|
| Unit Tests | ✓ PASS / ✗ FAIL | X tests passed, Y failed |
| Security | ✓ PASS / ✗ FAIL | X issues found |
| SEO | ✓ PASS / ✗ FAIL | X missing elements |
| Build | ✓ PASS / ✗ FAIL | Build time: Xs |

## Overall: ✓ READY TO PUSH / ✗ PUSH BLOCKED

### Issues Found (if any)
1. [SECURITY] Issue description - file:line
2. [SEO] Missing element - location
3. [TEST] Failing test name
```

---

## Quick Commands

Run individual checks:

```bash
# Tests only
npm test -- --run

# Build only
npm run build

# Full validation (this skill)
/pre-push
```

---

## Automated Git Hook

This skill can be run automatically via a pre-push git hook. The hook is installed at `.git/hooks/pre-push`.

To bypass in emergencies (NOT RECOMMENDED):
```bash
git push --no-verify
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed - safe to push |
| 1 | Tests failed |
| 2 | Security issues found |
| 3 | SEO issues found |
| 4 | Build failed |

---

## Execution Order

1. **Unit Tests** (fastest feedback)
2. **Security Audit** (critical checks)
3. **SEO Audit** (compliance checks)
4. **Build Verification** (final validation)

If any phase fails, subsequent phases are skipped and push is blocked.
