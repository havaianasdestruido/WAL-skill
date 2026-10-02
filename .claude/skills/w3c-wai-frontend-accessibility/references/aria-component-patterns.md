# WAI-ARIA and accessible component patterns

Use the WAI-ARIA Authoring Practices Guide as the source of truth for custom widget behavior: <https://www.w3.org/WAI/ARIA/apg/>

Rule of thumb: if a native HTML element provides the semantics and behavior, use it. Only build ARIA widgets when native controls cannot meet product requirements.

## Global ARIA rules

- A role is a promise. If you add a role, implement the expected keyboard interaction and state changes.
- Do not change native semantics unless necessary.
- Do not put `aria-hidden="true"` on focusable elements or ancestors of focusable elements.
- Do not use ARIA to hide visible content from assistive technology unless it is truly duplicate/decorative.
- Prefer `disabled` for native controls; use `aria-disabled="true"` only when the element must remain focusable/discoverable.
- Keep `aria-expanded`, `aria-selected`, `aria-checked`, `aria-current`, `aria-invalid`, and `aria-busy` synchronized with visual state.
- Accessible names should usually come from visible text. When using `aria-label`, ensure it includes the visible label text when there is one.

## Buttons

Use native `<button type="button">` for actions.

Requirements:

- Activates with Enter and Space automatically.
- Has visible or programmatic name.
- Uses `aria-pressed` only for toggle buttons.
- Uses `aria-expanded` when it controls expandable content.
- Sets `type="button"` inside forms unless it submits.

Avoid:

- `<div role="button">` unless native button is impossible.
- Icon-only button without `aria-label` or visible text.
- Button that navigates; use a link for navigation.

## Links

Use `<a href="...">` for navigation or downloads.

Requirements:

- Link text identifies purpose in context.
- External/download behavior is communicated when unexpected.
- Current page/step can use `aria-current="page"`, `aria-current="step"`, etc.

Avoid:

- `<a>` without `href` as a button.
- `href="#"` with click handlers.

## Disclosures and accordions

Use native `<details><summary>` when it meets styling/behavior requirements. Otherwise:

- Trigger is a button.
- Button has `aria-expanded="true|false"`.
- Button has `aria-controls="panel-id"` when the relationship is useful.
- Panel has an ID matching `aria-controls`.
- Focus remains on the button after expand/collapse unless user action requires otherwise.

Accordion extras:

- Each header has a real heading element at the appropriate level.
- Heading contains the button.
- Arrow key navigation is optional; Tab navigation must work.

## Modal dialogs

Prefer native `<dialog>` if browser support and project constraints allow robust behavior. For custom modals:

Requirements:

- Container has `role="dialog"` or `role="alertdialog"`.
- Container has `aria-modal="true"`.
- Dialog is labelled by visible title using `aria-labelledby`, or `aria-label` if no title exists.
- Initial focus moves into the dialog to the most appropriate element.
- Tab and Shift+Tab cycle within the dialog while open.
- Escape closes the dialog unless a critical flow requires another explicit close path.
- Focus returns to the invoking control when closed.
- Background content is inert or otherwise unavailable to keyboard and assistive technology.
- Page behind the dialog does not scroll unexpectedly.

Avoid:

- Opening a modal without moving focus.
- Using a dialog for non-blocking content that should be inline or a popover.
- Hiding the close control from keyboard users.

## Alert dialogs

Use for urgent decisions or destructive confirmations.

Requirements:

- `role="alertdialog"`.
- Clear title and description.
- Focus starts on the safest meaningful action, often Cancel for destructive actions.
- Buttons are real buttons.

## Menus versus navigation

ARIA `menu`, `menubar`, and `menuitem` are for application-style command menus, not ordinary site navigation.

For site nav:

- Use `<nav>` with links and buttons for expandable sections.
- Do not use `role="menu"` for normal navigation.

For true command menus:

- Trigger has `aria-haspopup="menu"` and `aria-expanded`.
- Menu container has `role="menu"`.
- Items use `role="menuitem"`, `menuitemcheckbox`, or `menuitemradio`.
- Arrow keys move through items.
- Enter/Space activates.
- Escape closes and returns focus to trigger.
- Typeahead should work when feasible.

## Tabs

Use tabs only when panels are alternate views of the same context.

Requirements:

- Tablist has `role="tablist"`.
- Each tab has `role="tab"`.
- Active tab has `aria-selected="true"`; inactive tabs have `false`.
- Each tab controls a panel with `aria-controls`.
- Each panel has `role="tabpanel"` and `aria-labelledby` pointing to its tab.
- Arrow keys move focus among tabs.
- Home/End move to first/last tab when implemented.
- Tab key moves from active tab into panel content.
- Activation can be automatic only if panel display is instant and not disruptive; otherwise use manual activation with Enter/Space.

Avoid:

- Tabs for primary navigation across unrelated pages unless semantics are truly tabbed content.

## Radio groups

Prefer native radio inputs.

Requirements:

- Use `<fieldset>` and `<legend>` for grouped question text when native.
- For custom radios: group has `role="radiogroup"`; options have `role="radio"` and `aria-checked`.
- Arrow keys move/select within the group.
- Only one radio is selected unless none is allowed initially.

## Checkboxes and switches

Prefer native checkbox inputs.

Checkbox:

- Native checkbox can expose checked/unchecked/mixed states.
- Use `aria-checked="mixed"` for custom tri-state controls.

Switch:

- Use a checkbox styled as a switch when possible.
- If custom, use `role="switch"` and `aria-checked`.
- Name should not change with state; state is exposed separately.

## Listboxes and comboboxes

Prefer native `<select>` unless custom behavior is necessary.

Listbox requirements:

- Container has `role="listbox"`.
- Options have `role="option"`.
- Selected option has `aria-selected`.
- Keyboard support includes arrows, Home/End, typeahead when feasible, and selection behavior.

Combobox requirements:

- Input or button has `role="combobox"` and accurate `aria-expanded`.
- Relationship to popup is exposed with `aria-controls` or equivalent.
- Use `aria-activedescendant` when DOM focus remains on the input while visual focus moves in popup.
- Escape closes popup.
- Enter accepts selected option when appropriate.
- Loading/no results are announced.

Avoid:

- Replacing simple select boxes with incomplete custom comboboxes.

## Tooltips

Use sparingly. Critical information should not be tooltip-only.

Requirements:

- Trigger is keyboard focusable if tooltip appears on hover.
- Tooltip also appears on focus.
- Tooltip content remains visible when hovered.
- Escape dismisses it.
- Tooltip text is associated with trigger via `aria-describedby` if it supplements the name.

Avoid:

- Interactive content inside `role="tooltip"`. Use a popover/dialog instead.
- Tooltips as the only label for a control.

## Popovers and non-modal overlays

Requirements:

- Trigger is a button with `aria-expanded`.
- Focus management matches behavior: either focus stays on trigger for simple content or moves into popup for interactive content.
- Escape closes.
- Outside click closes only if keyboard users have equivalent close path.
- Overlay does not obscure focused content.

## Toasts and status messages

Requirements:

- Non-urgent updates use `role="status"` or `aria-live="polite"`.
- Urgent errors can use `role="alert"`, but do not overuse.
- Toasts do not steal focus unless user action is required.
- Toast content remains long enough to perceive, or is available elsewhere.
- Controls inside toasts are keyboard accessible.

## Carousels

Requirements:

- Do not auto-advance by default, or provide a clear pause/stop button.
- Auto-advance stops on focus and hover.
- Slide controls are buttons with clear names.
- Current slide/state is exposed.
- Slide changes are not overly verbose to screen readers.
- Content remains reachable without swipe/drag.

## Data tables

Requirements:

- Use `<table>` only for tabular data.
- Use `<th scope="col|row">` for simple headers.
- Use `headers`/`id` associations for complex tables.
- Provide caption or adjacent summary when helpful.
- Sorting controls are buttons inside headers; expose sort state with `aria-sort`.

Avoid:

- Tables for layout.
- Div-only data grids unless a full grid pattern is implemented.

## Tree/grid/application widgets

These are advanced patterns. Only implement when product requirements justify them.

Before using `role="grid"`, `tree`, or `application`:

- Confirm native table/list/form controls cannot meet the need.
- Implement complete keyboard model from APG.
- Test with at least one screen reader/browser combination.
- Provide simpler alternative when possible.

Avoid `role="application"` unless you fully manage assistive-technology interaction expectations.
