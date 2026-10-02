# Front-end accessibility implementation recipes

Adapt these patterns to the codebase’s framework and style system.

## Skip link and landmarks

HTML:

```html
<a class="skip-link" href="#main">Skip to main content</a>
<header>...</header>
<nav aria-label="Primary">...</nav>
<main id="main" tabindex="-1">...</main>
<footer>...</footer>
```

CSS:

```css
.skip-link {
  position: absolute;
  left: 1rem;
  top: 0;
  transform: translateY(-120%);
  z-index: 1000;
  padding: 0.5rem 0.75rem;
  background: Canvas;
  color: CanvasText;
  border: 2px solid currentColor;
}

.skip-link:focus,
.skip-link:focus-visible {
  transform: translateY(0.5rem);
}
```

Notes:

- `tabindex="-1"` on `<main>` allows programmatic focus after skip-link activation in some browsers/frameworks.
- Do not make `<main>` part of normal tab order.

## Focus indicators

```css
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: 3px solid var(--focus-ring, #0b5fff);
  outline-offset: 3px;
}

@media (forced-colors: active) {
  :where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
    outline: 2px solid Highlight;
  }
}
```

Guidelines:

- Keep focus ring visible against all themes and component states.
- Avoid relying on box-shadow only; it may be suppressed in high-contrast/forced-colors modes.
- Use `scroll-margin-top` on focusable anchors if sticky headers obscure focus.

## Visually hidden text

```css
.visually-hidden:not(:focus):not(:active) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

Use for supplemental names or context. Do not hide content that sighted keyboard users need.

## Icon-only button

```html
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">...</svg>
</button>
```

React:

```tsx
type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: React.ReactNode;
};

export function IconButton({ label, children, type = 'button', ...props }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} {...props}>
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
```

## Form field with help and error text

HTML:

```html
<div class="field">
  <label for="email">Email address</label>
  <p id="email-help">Use the email address where we can contact you.</p>
  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
    aria-describedby="email-help email-error"
    aria-invalid="true"
  />
  <p id="email-error">Enter an email address in the format name@example.com.</p>
</div>
```

React helper:

```tsx
function describedBy(...ids: Array<string | undefined | false>) {
  return ids.filter(Boolean).join(' ') || undefined;
}

<input
  id={id}
  aria-invalid={error ? true : undefined}
  aria-describedby={describedBy(helpId, error ? errorId : undefined)}
/>
```

Validation summary:

```html
<div role="alert" tabindex="-1" id="error-summary">
  <h2>There is a problem</h2>
  <ul>
    <li><a href="#email">Enter an email address.</a></li>
  </ul>
</div>
```

Move focus to the summary when validation blocks submission.

## Live regions

```html
<p role="status" aria-live="polite" aria-atomic="true" id="save-status"></p>
```

Use for non-urgent updates like “Settings saved” or “12 results loaded”.

```html
<div role="alert">Payment failed. Check your card details.</div>
```

Use `role="alert"` for urgent errors that need immediate announcement. Do not wrap large changing regions in assertive live regions.

## Loading states

```html
<section aria-labelledby="results-heading" aria-busy="true">
  <h2 id="results-heading">Search results</h2>
  <p role="status">Loading results...</p>
</section>
```

When loading finishes:

- Set `aria-busy="false"` or remove it.
- Announce result count in a polite live region.
- Do not move focus unless user task requires it.

## Route-change focus in SPAs

On client-side navigation:

1. Update document title.
2. Move focus to the main heading or main landmark with `tabindex="-1"`.
3. Avoid dumping focus at the top of the document without context.

Pseudo-code:

```ts
function announceRouteChange(title: string) {
  document.title = title;
  requestAnimationFrame(() => {
    const target = document.querySelector('main h1, main, [data-route-focus]') as HTMLElement | null;
    target?.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: false });
  });
}
```

## Reduced motion

CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Prefer targeted alternatives for important animations:

```css
@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: opacity 80ms linear;
    transform: none;
  }
}
```

## Accessible disclosure component

```tsx
function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <section>
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(value => !value)}
        >
          {title}
        </button>
      </h2>
      <div id={panelId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
```

## Dialog checklist implementation

Minimum behavior:

```tsx
function openDialog(invoker: HTMLElement, dialog: HTMLElement) {
  dialog.removeAttribute('hidden');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  const focusTarget = dialog.querySelector<HTMLElement>('[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusTarget?.focus();
  dialog.dataset.invoker = invoker.id;
}

function closeDialog(dialog: HTMLElement) {
  dialog.setAttribute('hidden', '');
  const invoker = dialog.dataset.invoker ? document.getElementById(dialog.dataset.invoker) : null;
  invoker?.focus();
}
```

Production dialogs also need focus trapping, escape handling, inert background, labelled title, scroll locking, and robust cleanup.

## Responsive reflow guardrails

CSS:

```css
img,
svg,
video,
canvas {
  max-inline-size: 100%;
  block-size: auto;
}

.container {
  inline-size: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

.table-wrapper {
  overflow-x: auto;
}
```

Do not put the entire page in a horizontal scroller. Constrain exceptions to data tables or diagrams.

## Target size

```css
.button,
.icon-button,
input[type='checkbox'],
input[type='radio'] {
  min-inline-size: 24px;
  min-block-size: 24px;
}

.touch-target {
  min-inline-size: 44px;
  min-block-size: 44px;
}
```

WCAG 2.2 AA minimum is 24 by 24 CSS px with exceptions. Larger targets are better for touch.

## Color contrast and themes

Implementation tips:

- Store foreground/background pairs in tokens, not isolated colors.
- Include focus, hover, active, selected, error, warning, success, disabled-looking, and placeholder states in contrast checks.
- In forced-colors mode, avoid hard-coded backgrounds that hide text.

```css
@media (forced-colors: active) {
  .card,
  .button {
    border: 1px solid CanvasText;
  }
}
```

## Media captions

```html
<video controls width="640">
  <source src="demo.mp4" type="video/mp4" />
  <track kind="captions" src="demo.en.vtt" srclang="en" label="English" default />
  <p><a href="demo-transcript.html">Read the transcript</a></p>
</video>
```

Ensure caption files are accurate, synchronized, and include meaningful non-speech sounds.
