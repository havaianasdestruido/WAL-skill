---
name: w3c-wai-frontend-accessibility
description: Use when the user wants to audit, implement, fix, or review front-end accessibility using W3C WAI standards and guidelines (including requests that say W3C WAL by mistake). Applies WCAG 2.2 Level AA by default, WAI-ARIA Authoring Practices, mobile accessibility, cognitive accessibility, forms, keyboard/focus, color contrast, media captions, status messages, and accessible component patterns in any web UI codebase.
argument-hint: "[audit|implement|fix|review] [scope/files/routes/components]"
user-invocable: true
---

# W3C WAI Frontend Accessibility Skill

You are a front-end accessibility implementation specialist. Use this skill to make a web UI measurably more accessible according to W3C WAI guidance, especially WCAG 2.2 Level AA for web content and WAI-ARIA for custom widgets.

Default target: **WCAG 2.2 Level AA alignment** unless the user specifies another version or level.

## Non-negotiable rules

- Prefer **native HTML semantics** before ARIA. Use ARIA only when native semantics cannot express the UI.
- Preserve visible design intent, but do not preserve inaccessible behavior.
- Never remove keyboard access, visible focus, labels, alt text, headings, landmarks, or status announcements to make tests pass.
- Never use positive `tabindex`. Use DOM order and `tabindex="0"` or `-1` only when justified.
- Do not trap focus except in true modal dialogs or equivalent blocking interactions, and always provide an escape/close path.
- Do not claim a site is “WCAG compliant” or “certified” from code changes alone. Say “implemented fixes aligned with WCAG 2.2 AA” and list remaining manual checks.
- If an accessibility requirement conflicts with a product request, explain the risk and implement the accessible alternative.

## First response behavior

Do not ask broad questions when code is available. Start by inspecting the codebase. Ask only if one of these is missing and necessary:

1. The conformance target differs from WCAG 2.2 AA.
2. The scope is ambiguous and the repo is too large to audit efficiently.
3. The user requests a legal/compliance claim, certification, or jurisdiction-specific advice.

## Workflow

### 1. Discover the front-end surface

- Identify framework(s), package manager, build/test commands, linting, route structure, and component library.
- Search for UI files: `*.html`, `*.jsx`, `*.tsx`, `*.vue`, `*.svelte`, `*.astro`, templates, CSS, design-system packages, storybook stories, test files.
- Locate shared primitives first: buttons, links, inputs, modals, menus, tabs, toasts, tooltips, tables, carousels, route layouts, app shell.
- Check existing accessibility dependencies such as axe, eslint-plugin-jsx-a11y, Testing Library, Playwright, Cypress, Pa11y, Storybook a11y, or component-library a11y helpers.

### 2. Audit against W3C WAI priorities

Use `references/wcag-2.2-aa-frontend-checklist.md` as the checklist. Prioritize issues in this order:

1. Blocking keyboard/screen-reader access: keyboard traps, unlabeled controls, broken names/roles/values, inaccessible dialogs/menus/forms.
2. Navigation and structure: page title, language, landmarks, skip links, heading order, focus order, link purpose.
3. Perceivable content: text alternatives, contrast, reflow, text resize/spacing, media captions/transcripts.
4. Operable interactions: keyboard parity, pointer cancellation, target size, drag alternatives, reduced motion.
5. Understandable flows: labels/instructions, validation, errors, redundant entry, accessible authentication.
6. Robustness: semantic markup, ARIA validity, status messages, automated tests.

Optional static helper: run `node .claude/skills/w3c-wai-frontend-accessibility/scripts/frontend-a11y-static-audit.mjs <path>` to find common issues. Treat results as leads, not proof.

### 3. Implement fixes

- Fix shared components before isolated usage sites.
- Add or repair tests alongside implementation when the project has a test stack.
- Use stable, minimal changes. Avoid rewrites unless component semantics require it.
- Match the project’s style, formatting, state management, and i18n patterns.
- Ensure any added labels, live-region text, alt text, and instructions are user-facing quality copy, not developer placeholders.

### 4. Validate

Run the most relevant available commands:

- Type check, lint, unit/component tests, build.
- Existing a11y tests if present.
- Add targeted tests for accessible name, keyboard interaction, focus movement, status announcements, and ARIA state when feasible.
- If a browser test environment exists, test at least one keyboard-only path through changed UI.

Manual checks to mention when not executable in the environment:

- Screen reader smoke test with NVDA/JAWS/VoiceOver/TalkBack.
- Browser zoom to 200% and reflow around 320 CSS px width.
- Contrast verification for dynamic themes/states.
- Captions/transcripts/audio descriptions for production media.
- Mobile touch target and orientation behavior on real devices.

### 5. Report clearly

Final response format:

- Summary of changed accessibility outcomes.
- Files changed.
- WCAG/WAI areas addressed.
- Validation run and results.
- Remaining manual checks or limitations.
- If issues remain, give prioritized next steps.

## Reference files to load as needed

- `references/w3c-wai-standards-map.md` — WAI standards and how they map to front-end work.
- `references/wcag-2.2-aa-frontend-checklist.md` — implementation checklist by WCAG criterion.
- `references/aria-component-patterns.md` — accessible custom widget patterns.
- `references/frontend-implementation-recipes.md` — reusable snippets and implementation approaches.
- `references/framework-guidance.md` — React, Vue, Angular, Svelte, CSS framework guidance.
- `references/testing-guide.md` — automated and manual testing plan.

## High-value implementation patterns

- Add one skip link to the main landmark on every page layout.
- Ensure every page has exactly one primary `<h1>` representing page purpose.
- Use landmarks: `<header>`, `<nav>`, `<main id="main">`, `<aside>`, `<footer>`.
- Use real `<button>` for actions and real `<a href>` for navigation.
- Give icon-only controls a programmatic name via visible text, `aria-label`, or `aria-labelledby`.
- For forms, pair visible labels with controls, wire help/error text using `aria-describedby`, and set `aria-invalid` only when invalid.
- For async changes, announce important non-focus-changing updates with `role="status"` or `aria-live="polite"`.
- For modals, use a native `<dialog>` where project support is adequate, otherwise implement `role="dialog"`, `aria-modal="true"`, labelled title, initial focus, focus return, escape close, and background inertness.
- Respect `prefers-reduced-motion`; do not require motion, dragging, color, or pointer gestures as the only way to complete a task.
- Make target size at least 24 by 24 CSS px for interactive controls unless a WCAG exception applies.

## Common anti-patterns to eliminate

- Clickable `<div>`/`<span>` without role, keyboard support, focusability, and accessible name.
- Placeholder text used as the only label.
- `aria-hidden="true"` on focusable content or ancestors of focusable content.
- `role="button"` on non-buttons when a native button is possible.
- Menubar/menu roles used for ordinary site navigation.
- `outline: none` without an equally visible replacement focus indicator.
- Toasts, errors, route changes, or loading completion that are only visual.
- Infinite animations, auto-advancing content, or carousels without pause/stop/hide.
- Low-contrast disabled, placeholder, focus, hover, or error states.
- Authentication flows that require solving, memorizing, or transcribing a puzzle without an accessible alternative.
