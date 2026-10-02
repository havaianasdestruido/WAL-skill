# W3C WAI Frontend Accessibility Claude Code Skill

This repository contains a project-level Claude Code skill for auditing, implementing, and reviewing front-end accessibility using W3C WAI standards and guidelines.

The skill is installed in:

```text
.claude/skills/w3c-wai-frontend-accessibility/SKILL.md
```

It defaults to **WCAG 2.2 Level AA alignment** and includes support material for WAI-ARIA component patterns, mobile accessibility, cognitive accessibility, ATAG-aware authoring flows, media alternatives, and accessibility testing.

> Note: The W3C initiative is **WAI** — Web Accessibility Initiative. This repo name/request used “WAL”, but the skill itself targets W3C WAI guidance.

## What the skill does

Use it in Claude Code when you want to:

- Audit an existing front-end codebase for accessibility issues.
- Implement WCAG 2.2 AA improvements in shared components, layouts, routes, and forms.
- Fix keyboard, focus, screen-reader, color contrast, responsive reflow, target-size, media, and ARIA issues.
- Review a pull request for W3C WAI accessibility risk.
- Add accessibility regression tests using the project’s existing test stack.
- Produce a remediation plan or implementation report.

Example prompts:

```text
Use the W3C WAI frontend accessibility skill to audit this app and create a remediation plan.
```

```text
Use /w3c-wai-frontend-accessibility to fix keyboard and screen reader issues in the checkout flow.
```

```text
Review these changed React components against WCAG 2.2 AA and WAI-ARIA patterns.
```

## Included files

```text
.claude/skills/w3c-wai-frontend-accessibility/
├── SKILL.md
├── references/
│   ├── aria-component-patterns.md
│   ├── framework-guidance.md
│   ├── frontend-implementation-recipes.md
│   ├── testing-guide.md
│   ├── wcag-2.2-aa-frontend-checklist.md
│   └── w3c-wai-standards-map.md
├── scripts/
│   └── frontend-a11y-static-audit.mjs
└── templates/
    ├── accessibility-implementation-report.md
    ├── accessibility-pr-checklist.md
    └── accessibility-remediation-plan.md
```

## Static audit helper

The skill includes a dependency-free Node.js static audit helper for common front-end accessibility smells.

Run it from this repository:

```bash
node .claude/skills/w3c-wai-frontend-accessibility/scripts/frontend-a11y-static-audit.mjs .
```

Run it against another front-end project:

```bash
node /path/to/WAL-skill/.claude/skills/w3c-wai-frontend-accessibility/scripts/frontend-a11y-static-audit.mjs /path/to/app
```

Useful options:

```bash
node frontend-a11y-static-audit.mjs . --format markdown
node frontend-a11y-static-audit.mjs . --format json
node frontend-a11y-static-audit.mjs . --fail-on high
node frontend-a11y-static-audit.mjs . --max-files 5000
```

The script checks for issues such as missing image alt text, unlabeled controls, clickable non-interactive elements, positive tabindex, missing document language, disabled zoom, incomplete ARIA references, missing media captions, and focus-outline removal.

Static results are leads, not proof. Always follow up with keyboard, screen-reader, contrast, reflow, reduced-motion, mobile/touch, and content-quality checks.

## Installing as a personal skill

To use this skill across projects, copy the skill folder into your personal Claude Code skills directory:

```bash
mkdir -p ~/.claude/skills
cp -R .claude/skills/w3c-wai-frontend-accessibility ~/.claude/skills/
```

Then restart Claude Code so it discovers the skill.

## W3C WAI references

Primary WAI standards overview:

- <https://www.w3.org/WAI/standards-guidelines/>

Key references used by the skill:

- WCAG overview: <https://www.w3.org/WAI/standards-guidelines/wcag/>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- WCAG 2.2 quick reference: <https://www.w3.org/WAI/WCAG22/quickref/>
- WAI-ARIA overview: <https://www.w3.org/WAI/standards-guidelines/aria/>
- ARIA Authoring Practices Guide: <https://www.w3.org/WAI/ARIA/apg/>
- ATAG overview: <https://www.w3.org/WAI/standards-guidelines/atag/>
- UAAG overview: <https://www.w3.org/WAI/standards-guidelines/uaag/>
- Evaluating Web Accessibility: <https://www.w3.org/WAI/test-evaluate/>
- Mobile Accessibility at W3C: <https://www.w3.org/WAI/standards-guidelines/mobile/>
- Cognitive Accessibility at W3C: <https://www.w3.org/WAI/cognitive/>

## Important limitation

This skill helps implement and evaluate accessibility, but it does not certify legal compliance. WCAG conformance claims require complete evaluation of the delivered product, including manual assistive-technology testing and content review.
