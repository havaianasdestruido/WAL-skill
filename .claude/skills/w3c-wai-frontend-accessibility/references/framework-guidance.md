# Framework-specific accessibility guidance

Use the project’s framework conventions. Keep fixes idiomatic.

## React and Next.js

Audit targets:

- `app/`, `pages/`, `components/`, `layouts/`, `src/`, shared UI packages.
- Routing and title metadata (`metadata`, `Head`, document layout).
- Custom components wrapping native controls.

Implementation notes:

- Use `useId()` for stable label/help/error IDs. Do not generate random IDs during render.
- Use `htmlFor` in labels.
- Use `className`, not `class`.
- Unknown ARIA attributes are usually passed through; validate spelling carefully.
- In Next.js, ensure root layout sets `<html lang="...">`.
- Use `next/link` for navigation but ensure rendered anchor has meaningful text.
- Use `next/image` with accurate `alt`; use `alt=""` for decorative images.
- Manage focus after client-side route changes if framework/app shell does not.
- For portals/modals, ensure focus trap and inert/aria-hidden behavior do not hide the modal itself.

Testing:

- `@testing-library/react` with `getByRole`, accessible names, `user-event` keyboard tests.
- `jest-axe`/`vitest-axe` if already present or approved.
- Playwright accessibility tree/keyboard flows for end-to-end paths.

## Vue and Nuxt

Audit targets:

- `components/`, `pages/`, `layouts/`, `app.vue`, templates, composables.
- Head management via Nuxt metadata or `useHead`.

Implementation notes:

- Use `:id` and matching `:for` for labels.
- Use `@keydown` handlers only when native behavior is insufficient.
- Avoid click-only custom controls; use buttons/links.
- Use `v-show`/`v-if` thoughtfully: hidden content should not remain focusable or announced unless intended.
- In Nuxt, set `htmlAttrs.lang` or equivalent.
- For transitions, respect `prefers-reduced-motion`.

Testing:

- Vue Testing Library role/name queries.
- Cypress/Playwright keyboard tests.
- axe integration if available.

## Angular

Audit targets:

- Templates (`*.component.html`), components, CDK overlays, forms, router outlet layouts.
- Angular Material/CDK components and custom wrappers.

Implementation notes:

- Prefer Angular CDK a11y utilities for focus management, focus traps, live announcer, and high-contrast support.
- Use native form controls with `<label for>` and reactive/template-driven validation messaging.
- Ensure validation errors are associated with controls via `aria-describedby`.
- For route changes, update `Title` and manage focus to page heading/main.
- Avoid `(click)` on non-interactive elements; use buttons/links.

Testing:

- Angular Testing Library role/name queries.
- Component harnesses for Material components.
- Cypress/Playwright keyboard flows.

## Svelte and SvelteKit

Audit targets:

- `src/routes`, `src/lib`, layouts, form actions, stores used by UI state.

Implementation notes:

- Svelte has useful a11y compiler warnings; do not silence them without reason.
- Use native controls and `on:click` on interactive elements.
- Ensure reactive `aria-*` attributes stay synchronized with state.
- In SvelteKit, set document title and language in layouts/app template.
- Use actions for reusable focus management carefully; clean up event listeners.

Testing:

- Testing Library for Svelte role/name queries.
- Playwright route and keyboard tests.

## Astro and static site generators

Audit targets:

- Layouts, partials, markdown/MDX components, generated headings, image components.

Implementation notes:

- Set `<html lang>` in base layout.
- Ensure content collections enforce alt text and heading structure.
- Hydrated islands must remain keyboard and screen-reader accessible before/after hydration.
- Do not rely on client JS for core content availability unless required.

Testing:

- Static HTML scans.
- Playwright/axe against built output when possible.

## Plain HTML, server templates, and CMS themes

Audit targets:

- Shared layouts, partials, macros, components, content templates.
- Generated menus, forms, pagination, search, media embeds.

Implementation notes:

- Fix accessibility at the template/macro layer to reach all pages.
- Add content-author guardrails for alt text, headings, link text, captions, and table headers.
- Validate built HTML, not only source templates.

## Tailwind CSS

Implementation notes:

- Use `sr-only`/`not-sr-only` correctly.
- Preserve `focus-visible` utilities and avoid global outline removal.
- Use color pairs known to pass contrast; do not assume a Tailwind shade pair passes.
- Use responsive utilities to avoid overflow at 320 CSS px.
- Use `motion-reduce:` variants for animations/transitions.

Example:

```html
<button class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none">
  Save
</button>
```

## CSS-in-JS and design systems

Implementation notes:

- Put accessibility requirements into primitives: Button, Link, Field, Modal, Tooltip, Tabs.
- Tokenize foreground/background/focus pairs.
- Include high-contrast/forced-colors styles.
- Build story/test coverage for keyboard and screen-reader behavior.

## Component libraries

Do not assume a library component is accessible after customization.

Check:

- Accessible name survives wrappers/icons/slots.
- ARIA attributes are not overwritten by props.
- Disabled/loading states remain understandable.
- Focus indicators are not removed by theme overrides.
- Popper/portal overlays preserve focus order and labelling.
- Docs examples are adapted correctly.

## Internationalization

Implementation notes:

- Localize labels, alt text, instructions, error messages, and aria-live content.
- Set page and part languages correctly.
- Avoid concatenating translated strings in ways that break accessible names.
- Ensure RTL layouts preserve focus order and visual reading order.

## Design handoff questions

Ask design/product for clarification only when implementation cannot infer:

- Meaningful alt text for business-specific images.
- Whether an image/chart is decorative or informative.
- Required transcript/caption/audio-description source.
- Error-recovery copy for domain-specific validation.
- Whether time limits are essential and what extension behavior is allowed.
