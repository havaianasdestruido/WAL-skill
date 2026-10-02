# WCAG 2.2 AA front-end implementation checklist

Default target: WCAG 2.2 Level AA. This checklist focuses on what a front-end engineer can implement or verify in code. It is not a legal certification checklist.

Legend:

- **A**: Level A success criterion.
- **AA**: Level AA success criterion.
- **Manual**: Cannot be fully verified by static code or automated tests.

## Principle 1: Perceivable

### 1.1 Text alternatives

#### 1.1.1 Non-text Content — A

Implement:

- Informative images have meaningful `alt` text or an accessible name.
- Decorative images use `alt=""` and are not focusable.
- Icon-only buttons/links expose the action, not the icon name.
- SVGs have appropriate naming or are hidden from assistive technology when decorative.
- Complex charts/maps/diagrams have adjacent summaries and data tables when needed.
- CAPTCHA, biometric, or sensory tests have accessible alternatives.

Check:

- No placeholder alt like `image`, `photo`, `icon`, filename, or repeated adjacent text.
- CSS background images conveying information have a text equivalent.

### 1.2 Time-based media

#### 1.2.1 Audio-only and Video-only (Prerecorded) — A

Implement:

- Audio-only media has a transcript.
- Silent video has a text or audio alternative describing important visual information.

#### 1.2.2 Captions (Prerecorded) — A

Implement:

- Prerecorded synchronized media has captions for speech and meaningful sounds.
- HTML media uses `<track kind="captions" src="..." srclang="..." label="...">` when possible.

#### 1.2.3 Audio Description or Media Alternative (Prerecorded) — A

Implement:

- Provide audio description or a media alternative when visual information is needed to understand the video.

#### 1.2.4 Captions (Live) — AA

Implement:

- Live synchronized media has live captions.

#### 1.2.5 Audio Description (Prerecorded) — AA

Implement:

- Prerecorded video has audio description where visual information is not available in the main audio.

### 1.3 Adaptable

#### 1.3.1 Info and Relationships — A

Implement:

- Use semantic headings in logical order.
- Use lists for lists, tables for tabular data, fieldsets/legends for related form controls.
- Pair labels with controls using `for`/`id`, nesting, or framework equivalent.
- Use landmarks for page regions.
- Preserve semantic relationships when styling custom components.
- Mark required fields programmatically and visibly.
- Ensure visual grouping/order is represented in DOM semantics.

#### 1.3.2 Meaningful Sequence — A

Implement:

- DOM order matches reading and interaction order.
- CSS grid/flex visual reordering does not create a confusing reading order.
- Modals, drawers, and overlays appear in a logical focus/read order.

#### 1.3.3 Sensory Characteristics — A

Implement:

- Instructions do not rely only on shape, color, size, visual location, sound, or orientation.
- Pair cues like “press the green button” with text labels.

#### 1.3.4 Orientation — AA

Implement:

- Content works in portrait and landscape unless a specific orientation is essential.
- Avoid CSS/JS that locks orientation for nonessential reasons.

#### 1.3.5 Identify Input Purpose — AA

Implement:

- Use `autocomplete` tokens for common personal-data fields: `name`, `email`, `tel`, `street-address`, `postal-code`, `username`, `current-password`, `new-password`, etc.
- Do not disable autofill without a valid reason.

### 1.4 Distinguishable

#### 1.4.1 Use of Color — A

Implement:

- Do not communicate state only through color.
- Add text, icon shape, border style, pattern, aria state, or instruction.
- Error fields need text/icons in addition to red coloring.

#### 1.4.2 Audio Control — A

Implement:

- Audio that starts automatically and lasts more than 3 seconds can be paused/stopped or controlled independently.
- Prefer no autoplay audio.

#### 1.4.3 Contrast (Minimum) — AA

Implement:

- Normal text contrast ratio is at least 4.5:1.
- Large text contrast ratio is at least 3:1.
- Check text over gradients/images and disabled-looking but still interactive states.

#### 1.4.4 Resize Text — AA

Implement:

- Text can resize to 200% without loss of content/functionality.
- Avoid fixed-height containers that clip text.
- Prefer relative units (`rem`, `em`, `%`) where appropriate.

#### 1.4.5 Images of Text — AA

Implement:

- Use real text instead of text embedded in images unless essential.
- Logos and essential visual presentations are exceptions, but still need alternatives.

#### 1.4.10 Reflow — AA

Implement:

- At 320 CSS px width and 400% zoom equivalent, content reflows without two-dimensional scrolling, except valid exceptions such as data tables, maps, diagrams, and toolbars.
- Avoid fixed-width layout containers that force horizontal page scroll.

#### 1.4.11 Non-text Contrast — AA

Implement:

- UI component boundaries, focus indicators, form controls, check states, graph parts, and meaningful icons have at least 3:1 contrast against adjacent colors.

#### 1.4.12 Text Spacing — AA

Implement:

- Layout remains usable when users apply increased line height, paragraph spacing, letter spacing, and word spacing.
- Avoid clipped text and absolute positioning that overlaps when spacing changes.

#### 1.4.13 Content on Hover or Focus — AA

Implement:

- Hover/focus content is dismissible, hoverable, and persistent unless exceptions apply.
- Tooltips and popovers do not disappear when pointer moves over them.
- Escape closes nonessential hover/focus content.

## Principle 2: Operable

### 2.1 Keyboard accessible

#### 2.1.1 Keyboard — A

Implement:

- All functionality works with keyboard alone.
- Custom widgets implement expected key bindings.
- Hover interactions have focus/keyboard equivalents.

#### 2.1.2 No Keyboard Trap — A

Implement:

- Users can move focus into and out of every component using keyboard.
- Modal focus traps include close/escape behavior and focus return.

#### 2.1.4 Character Key Shortcuts — A

Implement:

- Single-character shortcuts can be turned off, remapped, or active only while a related control has focus.

### 2.2 Enough time

#### 2.2.1 Timing Adjustable — A

Implement:

- Time limits can be turned off, adjusted, or extended unless an exception applies.
- Warn users before session timeout and preserve data when possible.

#### 2.2.2 Pause, Stop, Hide — A

Implement:

- Moving, blinking, scrolling, or auto-updating content lasting more than 5 seconds can be paused, stopped, or hidden.
- Auto-advancing carousels have pause controls and do not auto-advance while focused/hovered.

### 2.3 Seizures and physical reactions

#### 2.3.1 Three Flashes or Below Threshold — A

Implement:

- Avoid flashing more than three times per second or verify it is below threshold.

### 2.4 Navigable

#### 2.4.1 Bypass Blocks — A

Implement:

- Provide a skip link to the main content.
- Use landmarks to enable region navigation.

#### 2.4.2 Page Titled — A

Implement:

- Every route/page sets a unique, descriptive document title.

#### 2.4.3 Focus Order — A

Implement:

- Focus order preserves meaning and operability.
- Newly opened modal/drawer/popover focus starts at an appropriate element.
- Route changes and step transitions manage focus intentionally.

#### 2.4.4 Link Purpose (In Context) — A

Implement:

- Link text or context describes destination/purpose.
- Avoid ambiguous repeated links like “click here”, “read more” without context.

#### 2.4.5 Multiple Ways — AA

Implement:

- Provide multiple ways to locate pages in multi-page sites, such as navigation, search, sitemap, related links, or breadcrumbs, unless the page is a process step.

#### 2.4.6 Headings and Labels — AA

Implement:

- Headings and labels describe topic or purpose.
- Avoid vague labels like “Submit” when multiple forms/actions exist.

#### 2.4.7 Focus Visible — AA

Implement:

- Keyboard focus indicator is visible for all focusable controls.
- Do not remove outlines without a replacement.

#### 2.4.11 Focus Not Obscured (Minimum) — AA

Implement:

- Sticky headers, cookie banners, chat widgets, and overlays do not fully obscure focused controls.
- Use `scroll-margin`, focus positioning, or layout offsets where needed.

### 2.5 Input modalities

#### 2.5.1 Pointer Gestures — A

Implement:

- Multipoint/path-based gestures have single-pointer alternatives unless essential.

#### 2.5.2 Pointer Cancellation — A

Implement:

- Do not trigger destructive actions on pointer down alone.
- Let users cancel before pointer up or provide undo/reversal.

#### 2.5.3 Label in Name — A

Implement:

- Accessible name contains the visible label text for controls and links.
- This supports speech input users.

#### 2.5.4 Motion Actuation — A

Implement:

- Functionality triggered by device/user motion has a non-motion alternative and can be disabled unless essential.

#### 2.5.7 Dragging Movements — AA

Implement:

- Drag-and-drop functionality has a non-drag alternative, such as buttons, menus, or keyboard controls.

#### 2.5.8 Target Size (Minimum) — AA

Implement:

- Pointer targets are at least 24 by 24 CSS px, or spacing/exception criteria are satisfied.
- Pay attention to icon buttons, inline links, pagination, chips, close buttons, and map controls.

## Principle 3: Understandable

### 3.1 Readable

#### 3.1.1 Language of Page — A

Implement:

- Set `<html lang="...">` to the page language.

#### 3.1.2 Language of Parts — AA

Implement:

- Mark passages in a different language with `lang`.

### 3.2 Predictable

#### 3.2.1 On Focus — A

Implement:

- Receiving focus does not unexpectedly change context, submit forms, navigate, or open large UI without user intent.

#### 3.2.2 On Input — A

Implement:

- Changing a control value does not unexpectedly change context unless users are warned.

#### 3.2.3 Consistent Navigation — AA

Implement:

- Repeated navigation appears in consistent relative order across pages unless changed by user action.

#### 3.2.4 Consistent Identification — AA

Implement:

- Components with the same function are identified consistently.
- Icons, labels, and accessible names are consistent across the app.

#### 3.2.6 Consistent Help — A

Implement:

- If help mechanisms exist on multiple pages, keep them in the same relative order. Examples: contact link, support chat, help center link, self-help options.

### 3.3 Input assistance

#### 3.3.1 Error Identification — A

Implement:

- Identify fields in error with text.
- Programmatically associate error text with controls.
- Move focus or summarize errors when validation blocks progress.

#### 3.3.2 Labels or Instructions — A

Implement:

- Provide labels/instructions when user input is required.
- Indicate required fields and expected formats.
- Do not use placeholder as the only label.

#### 3.3.3 Error Suggestion — AA

Implement:

- Provide suggestions for fixing errors when known and secure to do so.

#### 3.3.4 Error Prevention (Legal, Financial, Data) — AA

Implement:

- For submissions with legal/financial/data consequences, provide review, confirmation, reversal, or error checking.

#### 3.3.7 Redundant Entry — A

Implement:

- Do not make users re-enter information they already provided in the same process unless an exception applies.
- Support autocomplete, persisted step state, and “same as” options.

#### 3.3.8 Accessible Authentication (Minimum) — AA

Implement:

- Authentication does not require a cognitive function test unless an accessible alternative or mechanism assistance is available.
- Allow password managers and paste.
- Avoid forced memorization/transcription puzzles without alternatives.

## Principle 4: Robust

### 4.1 Compatible

#### 4.1.1 Parsing — obsolete in WCAG 2.2

Still implement valid, well-formed markup because broken DOM can harm assistive technology.

#### 4.1.2 Name, Role, Value — A

Implement:

- Every UI component exposes correct name, role, state, and value.
- Custom widgets update ARIA states when UI state changes.
- Native controls are not repurposed with conflicting roles.
- `aria-controls`, `aria-labelledby`, `aria-describedby`, and IDs point to existing elements.

#### 4.1.3 Status Messages — AA

Implement:

- Important status messages are announced without moving focus using `role="status"`, `role="alert"`, or appropriate `aria-live`.
- Examples: save success/failure, loading completion, cart updates, search result count, validation summary.

## Cross-cutting manual verification matrix

For each changed page or component, verify:

- Keyboard only: tab/shift+tab, enter, space, arrows where expected, escape, home/end where expected.
- Screen reader: names, roles, states, headings, landmarks, form errors, status updates.
- Zoom/reflow: 200% text zoom and 320 CSS px responsive layout.
- Color and contrast: text, icons, focus, states, charts, disabled-looking interactive elements.
- Motion: reduced-motion preference and pause/stop/hide controls.
- Touch/mobile: target size, orientation, gestures, virtual keyboard, screen reader on touch device.
