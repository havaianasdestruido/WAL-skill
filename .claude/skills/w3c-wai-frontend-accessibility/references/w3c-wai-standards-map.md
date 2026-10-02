# W3C WAI standards map for front-end implementation

Source entry point: <https://www.w3.org/WAI/standards-guidelines/>

W3C WAI covers multiple standards and notes. For front-end engineering, use them this way.

## Primary implementation target: WCAG 2

**Web Content Accessibility Guidelines (WCAG) 2** apply to web pages, web applications, dynamic content, multimedia, mobile web, and AI web interfaces.

Recommended default for modern front-end work:

- Version: **WCAG 2.2**.
- Level: **AA**.
- Reason: Level AA is the common target in accessibility policies and includes newer requirements for focus obstruction, dragging, target size, redundant entry, and accessible authentication.

Front-end responsibilities:

- Text alternatives for images and non-text content.
- Captions, transcripts, and audio descriptions for media.
- Semantic structure, headings, lists, tables, form labels, landmarks.
- Keyboard access and focus management.
- Contrast, reflow, text resizing, text spacing, reduced motion.
- Consistent navigation/identification/help.
- Error identification, suggestions, prevention, and redundant-entry avoidance.
- Name/role/value and status messages for assistive technology.

Reference URLs:

- WCAG overview: <https://www.w3.org/WAI/standards-guidelines/wcag/>
- WCAG 2.2 standard: <https://www.w3.org/TR/WCAG22/>
- Quick reference: <https://www.w3.org/WAI/WCAG22/quickref/>

## Component behavior: WAI-ARIA

**WAI-ARIA** provides roles, states, and properties for custom UI when native HTML cannot communicate semantics or state.

Use ARIA to supplement custom widgets, not to replace correct HTML:

- Prefer native controls: `button`, `a`, `input`, `select`, `textarea`, `details`, `summary`, `dialog` where support is acceptable.
- Add ARIA only when there is a real semantic gap.
- Every ARIA widget must implement expected keyboard interaction and state updates.
- Validate names, roles, properties, relationships, and focus behavior.

Reference URLs:

- WAI-ARIA overview: <https://www.w3.org/WAI/standards-guidelines/aria/>
- ARIA Authoring Practices Guide: <https://www.w3.org/WAI/ARIA/apg/>
- WAI-ARIA 1.2: <https://www.w3.org/TR/wai-aria-1.2/>

## Authoring tools: ATAG

**Authoring Tool Accessibility Guidelines (ATAG)** apply when the front-end lets users create or edit content, such as CMS interfaces, page builders, profile editors, markdown editors, upload flows, admin dashboards, social posting tools, and design tools.

Front-end responsibilities:

- Make the authoring UI itself accessible.
- Help authors create accessible output: alt-text prompts, heading guidance, caption/transcript fields, table header tooling, accessible color warnings, link text warnings.
- Preserve accessibility metadata through editing, previews, imports, exports, and publishing.

Reference URL: <https://www.w3.org/WAI/standards-guidelines/atag/>

## User agents and embedded viewers: UAAG awareness

**User Agent Accessibility Guidelines (UAAG)** target browsers, media players, readers, and other applications that render content. Most websites do not implement UAAG directly, but front-end apps should avoid blocking user-agent accessibility features.

Front-end responsibilities:

- Do not prevent zoom, text resizing, user stylesheets, browser find, native scrolling, or keyboard shortcuts without strong justification.
- Use standard media controls or provide equivalent accessible controls.
- Avoid custom viewers that remove semantics from documents, tables, forms, or media.

Reference URL: <https://www.w3.org/WAI/standards-guidelines/uaag/>

## Evaluation: ACT, WCAG-EM, EARL

Evaluation resources help structure audits and reports.

- **ACT Rules**: repeatable accessibility test rules used by tools.
- **WCAG-EM**: methodology for evaluating whole websites.
- **EARL**: machine-readable test-result vocabulary.

Front-end use:

- Use automated tools for deterministic checks, then manual review for interaction, content, and assistive-technology behavior.
- Report results by page/template/component, criterion, impact, evidence, fix, and retest status.

Reference URLs:

- ACT overview: <https://www.w3.org/WAI/standards-guidelines/act/>
- WCAG-EM: <https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/>
- Evaluating Web Accessibility: <https://www.w3.org/WAI/test-evaluate/>

## Audio and video: WebVTT and TTML

For front-end media:

- Use WebVTT text tracks for captions, subtitles, chapters, and descriptions when using HTML media.
- Provide transcripts for audio and video when appropriate.
- Provide audio descriptions or media alternatives when important visual information is not available in the audio track.

Reference URLs:

- WebVTT: <https://www.w3.org/TR/webvtt/>
- TTML: <https://www.w3.org/TR/ttml/>

## Mobile accessibility

Mobile accessibility is covered by WCAG and WAI mobile guidance.

Front-end responsibilities:

- Support portrait and landscape unless essential.
- Avoid horizontal scrolling at typical mobile widths.
- Provide touch target size and spacing.
- Ensure gestures have single-pointer alternatives.
- Support screen readers, switch control, voice control, magnification, and reduced motion.
- Avoid hover-only content on touch devices.

Reference URL: <https://www.w3.org/WAI/standards-guidelines/mobile/>

## Cognitive accessibility

WAI cognitive accessibility work informs understandable flows and inclusive content.

Front-end responsibilities:

- Clear page purpose, headings, labels, help, and instructions.
- Consistent navigation and component behavior.
- Predictable changes of context.
- Error prevention, recovery, and redundant-entry avoidance.
- Avoid unnecessary time pressure, memory burden, and complex authentication.

Reference URL: <https://www.w3.org/WAI/cognitive/>

## WAI-Adapt and personalization

WAI-Adapt supports personalization of content and controls.

Front-end responsibilities:

- Build adaptable layouts and robust semantics first.
- Do not hard-code presentation in ways that block user preferences.
- When personalization metadata is used, keep it synchronized with visible UI and localization.

Reference URL: <https://www.w3.org/WAI/adapt/>

## WCAG 3 note

WCAG 3 is a working draft intended to become a future standard. Do not use it as the conformance target unless explicitly requested. It can still inspire broader testing across web content, apps, tools, publishing, and emerging technologies.

Reference URL: <https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/>
