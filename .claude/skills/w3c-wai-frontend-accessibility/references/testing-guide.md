# Accessibility testing guide

Accessibility testing is a combination of automated checks, code review, keyboard testing, visual checks, and assistive-technology testing. Automated tests are valuable but cannot prove WCAG conformance by themselves.

## Test stack discovery

Look for:

- Package scripts: `lint`, `test`, `typecheck`, `build`, `e2e`, `storybook`.
- ESLint accessibility plugins: `eslint-plugin-jsx-a11y`, framework a11y rules.
- Unit/component test tools: Jest, Vitest, Testing Library, Cypress Component Testing.
- E2E tools: Playwright, Cypress, WebdriverIO.
- Accessibility tools: axe-core, jest-axe, vitest-axe, cypress-axe, @axe-core/playwright, pa11y, Lighthouse CI, Storybook addon-a11y.

Prefer existing tools. Ask before adding new dependencies unless the repo conventions allow it.

## Static scan bundled with this skill

Run from a target project root:

```bash
node .claude/skills/w3c-wai-frontend-accessibility/scripts/frontend-a11y-static-audit.mjs .
```

If the skill folder is not inside the target project, pass the script path from wherever it is installed:

```bash
node ~/.claude/skills/w3c-wai-frontend-accessibility/scripts/frontend-a11y-static-audit.mjs /path/to/app
```

Options:

```bash
node frontend-a11y-static-audit.mjs . --format markdown
node frontend-a11y-static-audit.mjs . --format json
node frontend-a11y-static-audit.mjs . --fail-on high
node frontend-a11y-static-audit.mjs . --max-files 5000
```

Use findings as leads. Static regex checks can miss issues and produce false positives.

## Automated checks to add when appropriate

### ESLint JSX accessibility

Use when React/JSX is present.

Checks examples:

- Missing alt text.
- Invalid ARIA attributes.
- Click handlers on non-interactive elements.
- Positive tabindex.
- Labels associated with controls.

Do not blindly auto-fix semantic issues. Review behavior.

### Testing Library

Prefer role and accessible-name queries:

```ts
expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled();
await user.tab();
expect(screen.getByRole('button', { name: /save changes/i })).toHaveFocus();
```

Good tests:

- Control has expected role/name/state.
- Error text is associated with field.
- Keyboard activates controls.
- Modal receives focus and returns it on close.
- Tabs/menus/listboxes implement expected keys.

Bad tests:

- Only query by class names or test IDs when role/name is available.
- Snapshot-only accessibility.

### axe in unit/component tests

Example with jest-axe/vitest-axe:

```ts
const { container } = render(<MyComponent />);
expect(await axe(container)).toHaveNoViolations();
```

Use axe to catch regressions, not as sole proof.

### Playwright with axe

Example pattern:

```ts
import AxeBuilder from '@axe-core/playwright';

test('home page has no detectable a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

Also add keyboard tests:

```ts
await page.keyboard.press('Tab');
await expect(page.getByRole('link', { name: /skip to main content/i })).toBeFocused();
await page.keyboard.press('Enter');
await expect(page.locator('main')).toBeFocused();
```

## Manual keyboard checklist

For each changed page/component:

- Can you reach every interactive element with Tab/Shift+Tab?
- Is focus visible at every step?
- Does focus order match visual/logical order?
- Can you activate controls with Enter/Space as expected?
- Do arrow keys work for tabs, menus, radios, sliders, listboxes, grids where applicable?
- Does Escape close dialogs/popovers/menus where expected?
- Can you complete the task without a mouse or touch gesture?
- Is focus returned after closing dialogs/popovers?
- Are there no traps or unexpected page jumps?

## Manual screen-reader smoke checklist

Use available combinations such as NVDA + Firefox/Chrome, JAWS + Chrome/Edge, VoiceOver + Safari, TalkBack + Chrome.

Check:

- Page title and language are announced correctly.
- Landmarks and headings provide meaningful navigation.
- Controls expose correct names, roles, states, and values.
- Form instructions, required state, and errors are announced.
- Dynamic updates are announced when needed.
- Modals announce title/context and keep virtual cursor/focus inside.
- Links make sense out of context when possible.
- Images/charts/media have meaningful alternatives.

## Visual and responsive checks

- Text contrast: 4.5:1 normal, 3:1 large.
- Non-text contrast: 3:1 for meaningful graphics, control boundaries, focus indicators.
- Browser zoom/text resize to 200%.
- Reflow at 320 CSS px width without horizontal page scrolling except valid exceptions.
- Increased text spacing does not clip/overlap content.
- Focus is not hidden by sticky headers/footers/overlays.
- Forced-colors/high-contrast mode preserves meaning and focus.
- Reduced motion preference disables nonessential motion.

## Forms and errors checklist

- Every input has a visible label.
- Help text and error text are programmatically associated.
- Required fields are indicated visually and programmatically.
- Validation errors identify the field and provide suggestions.
- Error summary appears before the form or at a logical location and receives focus when blocking submission.
- Previously entered values are preserved after validation failures.
- Autocomplete attributes are used for personal data.
- Password managers and paste are allowed.

## Media checklist

- Audio-only: transcript.
- Prerecorded video with audio: captions and audio description/media alternative where needed.
- Live video: captions.
- Player controls are keyboard accessible and labelled.
- Autoplay audio is avoided or controllable.
- Auto-updating media can be paused/stopped/hidden.

## Reporting format

Use this structure in final reports:

```md
## Accessibility implementation report

Target: WCAG 2.2 AA alignment
Scope: [routes/components/files]

### Fixed
- [Issue] → [Change] → [WCAG area]

### Validation run
- `npm test` — passed/failed
- `npm run build` — passed/failed
- Keyboard smoke test — result

### Remaining manual checks
- Screen reader smoke test with [recommended combo]
- Contrast verification for [theme/states]
- Media captions/transcripts for [assets]

### Known limitations / next steps
- [Prioritized item]
```

## Severity guidance

High:

- Blocks task completion for keyboard or screen-reader users.
- Missing labels/names on core controls.
- Keyboard traps.
- Inaccessible authentication, checkout, signup, or legal/financial submission.
- Severe contrast/readability issue on core content.

Medium:

- Missing skip link/landmark issues.
- Noncritical ambiguous links/headings.
- Incomplete status announcements.
- Target size, reflow, focus obstruction, or text spacing issues that affect some flows.

Low:

- Minor semantics, redundant ARIA, or enhancement opportunities that do not block core tasks.

Always consider user impact and product criticality over tool severity alone.
