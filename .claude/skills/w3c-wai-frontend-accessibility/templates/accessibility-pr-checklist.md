# Accessibility pull request checklist

Use for front-end PRs that add or change user interface.

## Semantics and structure

- [ ] Page/route has a descriptive title.
- [ ] Page language and language changes are set.
- [ ] Main content has a `<main>` landmark and pages have sensible landmarks.
- [ ] Heading order reflects content structure.
- [ ] Lists, tables, fieldsets, and labels use semantic markup.

## Keyboard and focus

- [ ] All functionality works by keyboard alone.
- [ ] Focus order is logical.
- [ ] Focus indicator is visible and high contrast.
- [ ] No positive `tabindex`.
- [ ] Dialogs/popovers/menus manage focus and close correctly.
- [ ] Focus is not hidden behind sticky UI.

## Names, roles, values

- [ ] Buttons, links, inputs, and custom widgets have accessible names.
- [ ] Visible label text is included in accessible names.
- [ ] ARIA roles/states/properties are valid and synchronized.
- [ ] Decorative content is hidden correctly; informative content has alternatives.

## Forms and errors

- [ ] Inputs have visible labels.
- [ ] Help/error text is associated with fields.
- [ ] Required fields and formats are communicated.
- [ ] Errors are identified with text and suggestions.
- [ ] Validation failure preserves input and focuses summary/first error as appropriate.
- [ ] Autocomplete is used for personal-data fields.

## Visual and responsive

- [ ] Text contrast meets 4.5:1 normal / 3:1 large.
- [ ] Non-text contrast meets 3:1 for meaningful UI and graphics.
- [ ] Layout works at 200% zoom and narrow widths.
- [ ] Text spacing does not clip or overlap.
- [ ] Target size is at least 24 by 24 CSS px or exception applies.
- [ ] Reduced motion and forced-colors modes are considered.

## Media and dynamic content

- [ ] Captions/transcripts/audio descriptions are provided where needed.
- [ ] Autoplay/moving/updating content can be paused/stopped/hidden.
- [ ] Important async status updates are announced.
- [ ] Loading and busy states are exposed accessibly.

## Testing

- [ ] Automated tests/lint/build passed.
- [ ] Role/name based tests added or updated for changed components.
- [ ] Keyboard smoke test completed.
- [ ] Screen reader smoke test completed or documented as follow-up.
- [ ] Remaining manual checks/known limitations documented.
