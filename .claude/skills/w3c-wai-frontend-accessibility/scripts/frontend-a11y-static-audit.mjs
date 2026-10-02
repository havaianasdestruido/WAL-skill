#!/usr/bin/env node

/**
 * Lightweight front-end accessibility static audit helper.
 *
 * This script intentionally uses no external dependencies so it can run in most
 * repositories. It finds common accessibility smells in markup/template/CSS
 * files. Results are leads for human review, not proof of WCAG conformance.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const SEVERITY_SCORE = { low: 1, medium: 2, high: 3 };
const FRONTEND_EXTENSIONS = new Set([
  '.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte', '.astro', '.mdx',
  '.css', '.scss', '.sass', '.less',
]);
const MARKUP_EXTENSIONS = new Set(['.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte', '.astro', '.mdx']);
const CSS_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less']);
const EXCLUDED_DIRS = new Set([
  '.git', '.hg', '.svn', 'node_modules', 'dist', 'build', 'coverage', '.next', '.nuxt', '.svelte-kit',
  '.astro', '.vite', '.turbo', '.cache', '.parcel-cache', 'out', 'target', 'vendor', '.venv', 'venv',
]);
const MAX_FILE_BYTES = 1_500_000;

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    target: '.',
    format: 'markdown',
    failOn: null,
    maxFiles: 3000,
  };

  if (args[0] && !args[0].startsWith('-')) {
    options.target = args.shift();
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--format') {
      options.format = args[++index] || options.format;
    } else if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    } else if (arg === '--fail-on') {
      options.failOn = args[++index] || null;
    } else if (arg.startsWith('--fail-on=')) {
      options.failOn = arg.split('=')[1];
    } else if (arg === '--max-files') {
      options.maxFiles = Number(args[++index] || options.maxFiles);
    } else if (arg.startsWith('--max-files=')) {
      options.maxFiles = Number(arg.split('=')[1]);
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(2);
    }
  }

  if (!['markdown', 'json'].includes(options.format)) {
    console.error('--format must be markdown or json');
    process.exit(2);
  }

  if (options.failOn && !Object.hasOwn(SEVERITY_SCORE, options.failOn)) {
    console.error('--fail-on must be low, medium, or high');
    process.exit(2);
  }

  return options;
}

function printHelp() {
  console.log(`Front-end accessibility static audit helper\n\nUsage:\n  node frontend-a11y-static-audit.mjs [target] [options]\n\nOptions:\n  --format markdown|json   Output format. Default: markdown\n  --fail-on low|medium|high Exit non-zero when findings at or above severity exist\n  --max-files <n>          Maximum files to scan. Default: 3000\n  -h, --help               Show help\n\nExamples:\n  node frontend-a11y-static-audit.mjs .\n  node frontend-a11y-static-audit.mjs ./src --format json\n  node frontend-a11y-static-audit.mjs . --fail-on high\n`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = path.resolve(process.cwd(), options.target);
  const files = await collectFiles(root, options.maxFiles);
  const findings = [];
  const scanState = {
    cssHasMotion: false,
    cssHasReducedMotion: false,
  };

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    let content;
    try {
      const stat = await fs.stat(file);
      if (stat.size > MAX_FILE_BYTES) continue;
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }

    const relativeFile = path.relative(root, file) || path.basename(file);
    if (MARKUP_EXTENSIONS.has(ext)) {
      auditMarkup({ content, file: relativeFile, findings });
    }
    if (CSS_EXTENSIONS.has(ext)) {
      auditCss({ content, file: relativeFile, findings, scanState });
    }
  }

  if (scanState.cssHasMotion && !scanState.cssHasReducedMotion) {
    findings.push({
      severity: 'medium',
      ruleId: 'motion-reduced-preference',
      title: 'Motion styles found without prefers-reduced-motion handling',
      file: '(project CSS)',
      line: null,
      snippet: null,
      wcag: ['2.2.2', '2.3.1'],
      recommendation: 'Add reduced-motion alternatives for nonessential animation, transitions, smooth scrolling, and auto-updating motion.',
    });
  }

  const result = {
    target: root,
    scannedFiles: files.length,
    generatedAt: new Date().toISOString(),
    summary: summarize(findings),
    findings: findings.sort(compareFindings),
  };

  if (options.format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatMarkdown(result));
  }

  if (options.failOn) {
    const threshold = SEVERITY_SCORE[options.failOn];
    const shouldFail = findings.some(finding => SEVERITY_SCORE[finding.severity] >= threshold);
    if (shouldFail) process.exit(1);
  }
}

async function collectFiles(root, maxFiles) {
  const files = [];

  async function walk(current) {
    if (files.length >= maxFiles) return;
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (files.length >= maxFiles) return;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (FRONTEND_EXTENSIONS.has(ext)) files.push(fullPath);
      }
    }
  }

  await walk(root);
  return files;
}

function auditMarkup({ content, file, findings }) {
  const ids = collectIds(content);

  checkHtmlLanguage(content, file, findings);
  checkDocumentTitle(content, file, findings);
  checkViewportZoom(content, file, findings);
  checkImages(content, file, findings);
  checkButtons(content, file, findings);
  checkLinks(content, file, findings);
  checkFormControls(content, file, findings);
  checkClickableNonInteractive(content, file, findings);
  checkPositiveTabindex(content, file, findings);
  checkAutofocus(content, file, findings);
  checkAriaHiddenFocusable(content, file, findings);
  checkAriaReferences(content, file, findings, ids);
  checkRoleButton(content, file, findings);
  checkMedia(content, file, findings);
}

function auditCss({ content, file, findings, scanState }) {
  if (/(?:animation|transition|scroll-behavior)\s*:/i.test(content)) {
    scanState.cssHasMotion = true;
  }
  if (/prefers-reduced-motion/i.test(content)) {
    scanState.cssHasReducedMotion = true;
  }

  findAll(/outline\s*:\s*(?:0|none)\b/gi, content, match => {
    const hasReplacementNearby = /focus-visible|focus\s*\{|box-shadow\s*:|border\s*:/i.test(surrounding(content, match.index, 500));
    findings.push({
      severity: hasReplacementNearby ? 'low' : 'medium',
      ruleId: 'focus-outline-removed',
      title: 'CSS removes focus outline',
      file,
      line: lineNumber(content, match.index),
      snippet: cleanSnippet(match[0]),
      wcag: ['2.4.7', '1.4.11'],
      recommendation: 'Do not remove focus outlines unless an equally visible focus indicator is provided for all affected controls and states.',
    });
  });

  findAll(/([^{}]+)\{[^{}]*:hover[^{}]*\}/gi, content, match => {
    const selector = match[1] || '';
    const block = match[0] || '';
    if (!/:focus|:focus-visible|:focus-within/i.test(selector + block)) {
      findings.push({
        severity: 'low',
        ruleId: 'hover-without-focus-style',
        title: 'Hover styling may not have a focus equivalent',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(selector.trim()),
        wcag: ['2.1.1', '1.4.13'],
        recommendation: 'Ensure hover-only visual changes or revealed content also work on keyboard focus.',
      });
    }
  });
}

function checkHtmlLanguage(content, file, findings) {
  findAll(/<html\b([^>]*)>/gi, content, match => {
    if (!hasAttribute(match[1], 'lang')) {
      findings.push({
        severity: 'high',
        ruleId: 'html-lang-missing',
        title: 'Document language is missing',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['3.1.1'],
        recommendation: 'Set the page language, for example <html lang="en">, using the project’s locale where applicable.',
      });
    }
  });
}

function checkDocumentTitle(content, file, findings) {
  if (!/<head\b/i.test(content)) return;
  const title = content.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!title || stripTags(title[1]).trim().length === 0) {
    findings.push({
      severity: 'medium',
      ruleId: 'document-title-missing',
      title: 'Document title is missing or empty',
      file,
      line: title ? lineNumber(content, title.index || 0) : lineNumber(content, content.search(/<head\b/i)),
      snippet: title ? cleanSnippet(title[0]) : '<head>',
      wcag: ['2.4.2'],
      recommendation: 'Provide a unique, descriptive document title for each page or route.',
    });
  }
}

function checkViewportZoom(content, file, findings) {
  findAll(/<meta\b[^>]*name\s*=\s*["']viewport["'][^>]*>/gi, content, match => {
    if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\.0+)?/i.test(match[0])) {
      findings.push({
        severity: 'high',
        ruleId: 'viewport-zoom-disabled',
        title: 'Viewport disables or restricts zoom',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['1.4.4', '1.4.10'],
        recommendation: 'Remove user-scalable=no and restrictive maximum-scale values so users can zoom text/content.',
      });
    }
  });
}

function checkImages(content, file, findings) {
  findAll(/<img\b([^>]*)>/gi, content, match => {
    const attrs = match[1];
    if (!hasAttribute(attrs, 'alt') && !hasAttributeValue(attrs, 'role', ['presentation', 'none'])) {
      findings.push({
        severity: 'high',
        ruleId: 'img-alt-missing',
        title: 'Image is missing alt text',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['1.1.1'],
        recommendation: 'Add meaningful alt text for informative images or alt="" for decorative images.',
      });
      return;
    }

    const alt = getAttributeValue(attrs, 'alt');
    if (alt && /^(image|photo|picture|graphic|icon|logo|avatar|placeholder|spacer|img)$/i.test(alt.trim())) {
      findings.push({
        severity: 'medium',
        ruleId: 'img-alt-placeholder',
        title: 'Image alt text appears generic',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['1.1.1'],
        recommendation: 'Replace generic alt text with the image purpose/content, or use alt="" if decorative.',
      });
    }
  });

  findAll(/<Image\b([^>]*)>/g, content, match => {
    if (!hasAttribute(match[1], 'alt')) {
      findings.push({
        severity: 'medium',
        ruleId: 'image-component-alt-missing',
        title: 'Image component may be missing alt text',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['1.1.1'],
        recommendation: 'Ensure image components expose meaningful alt text or an empty alt value for decorative images.',
      });
    }
  });
}

function checkButtons(content, file, findings) {
  findAll(/<button\b([^>]*)\/>/gi, content, match => {
    if (!hasAnyNameAttribute(match[1])) {
      findings.push({
        severity: 'high',
        ruleId: 'button-name-missing',
        title: 'Self-closing button has no accessible name',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['4.1.2', '2.5.3'],
        recommendation: 'Buttons need visible text or a programmatic name such as aria-label/aria-labelledby.',
      });
    }
  });

  findAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi, content, match => {
    const attrs = match[1];
    const inner = match[2];
    const text = stripTags(inner).replace(/\{[^}]*\}/g, '').trim();
    const hasMeaningfulChildExpression = /\{\s*[A-Za-z_$][\w$.[\]?]*\s*\}/.test(inner);
    if (!hasAnyNameAttribute(attrs) && !text && !hasMeaningfulChildExpression) {
      findings.push({
        severity: 'high',
        ruleId: 'button-name-missing',
        title: 'Button may not have an accessible name',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['4.1.2', '2.5.3'],
        recommendation: 'Add visible button text or an accessible name. Hide decorative icons with aria-hidden="true".',
      });
    }

    if (!hasAttribute(attrs, 'type') && /\.jsx$|\.tsx$|\.vue$|\.svelte$|\.astro$|\.html?$|\.mdx$/i.test(file)) {
      findings.push({
        severity: 'low',
        ruleId: 'button-type-missing',
        title: 'Button type is implicit',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0].slice(0, 160)),
        wcag: ['3.2.2'],
        recommendation: 'Set type="button" for non-submit buttons to avoid accidental form submission.',
      });
    }
  });
}

function checkLinks(content, file, findings) {
  findAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, content, match => {
    const attrs = match[1];
    const href = getAttributeValue(attrs, 'href');
    if (!hasAttribute(attrs, 'href')) {
      findings.push({
        severity: 'medium',
        ruleId: 'anchor-href-missing',
        title: 'Anchor is missing href',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0].slice(0, 180)),
        wcag: ['2.1.1', '4.1.2'],
        recommendation: 'Use <a href> for navigation. Use <button> for actions.',
      });
    } else if (href && (/^#$/.test(href.trim()) || /^javascript:/i.test(href.trim()))) {
      findings.push({
        severity: 'medium',
        ruleId: 'anchor-invalid-href',
        title: 'Anchor href is not a real destination',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0].slice(0, 180)),
        wcag: ['2.4.4', '4.1.2'],
        recommendation: 'Use a real URL for links. Use a button for actions that do not navigate.',
      });
    }

    const text = stripTags(match[2]).replace(/\{[^}]*\}/g, '').trim();
    if (!hasAnyNameAttribute(attrs) && !text && !/\{\s*[A-Za-z_$][\w$.[\]?]*\s*\}/.test(match[2])) {
      findings.push({
        severity: 'high',
        ruleId: 'link-name-missing',
        title: 'Link may not have an accessible name',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0].slice(0, 180)),
        wcag: ['2.4.4', '4.1.2'],
        recommendation: 'Add meaningful link text or a programmatic name that describes the destination.',
      });
    }
  });
}

function checkFormControls(content, file, findings) {
  const controlPattern = /<(input|select|textarea)\b([^>]*)>/gi;
  findAll(controlPattern, content, match => {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const type = (getAttributeValue(attrs, 'type') || '').toLowerCase();
    if (tag === 'input' && ['hidden', 'button', 'submit', 'reset', 'image'].includes(type)) return;

    const id = getAttributeValue(attrs, 'id');
    const hasProgrammaticLabel = hasAttribute(attrs, 'aria-label') || hasAttribute(attrs, 'aria-labelledby') || hasAttribute(attrs, 'title');
    const hasAssociatedLabel = Boolean(id && hasLabelForId(content, id));
    const hasWrappingLabel = isProbablyWrappedByLabel(content, match.index);

    if (!hasProgrammaticLabel && !hasAssociatedLabel && !hasWrappingLabel) {
      findings.push({
        severity: 'high',
        ruleId: 'form-control-label-missing',
        title: `${tag} may be missing an accessible label`,
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['1.3.1', '3.3.2', '4.1.2'],
        recommendation: 'Provide a visible label associated with the control. Placeholder text is not a sufficient label.',
      });
    }

    if (hasAttribute(attrs, 'placeholder') && !hasAssociatedLabel && !hasWrappingLabel && !hasAttribute(attrs, 'aria-labelledby')) {
      findings.push({
        severity: 'medium',
        ruleId: 'placeholder-used-as-label',
        title: 'Placeholder may be used as the only visible label',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['3.3.2'],
        recommendation: 'Use a persistent visible label. Placeholder can supplement but should not replace the label.',
      });
    }

    if (isPersonalDataField(attrs) && !hasAttribute(attrs, 'autocomplete')) {
      findings.push({
        severity: 'low',
        ruleId: 'autocomplete-missing',
        title: 'Personal-data input may be missing autocomplete',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['1.3.5', '3.3.7'],
        recommendation: 'Add an appropriate autocomplete token for common personal-data fields.',
      });
    }
  });
}

function checkClickableNonInteractive(content, file, findings) {
  findAll(/<(div|span|li|p|section|article|img)\b([^>]*)>/gi, content, match => {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const hasClick = /(?:onClick|@click|v-on:click|\(click\)=|onclick\s*=)/.test(attrs);
    if (!hasClick) return;

    const hasRole = hasAttribute(attrs, 'role');
    const hasTabIndex = hasAttribute(attrs, 'tabindex') || hasAttribute(attrs, 'tabIndex');
    const hasKeyboardHandler = /(?:onKeyDown|onKeyUp|onKeyPress|@keydown|@keyup|v-on:keydown|v-on:keyup|\(keydown\)=|\(keyup\)=|onkeydown\s*=|onkeyup\s*=)/.test(attrs);

    if (!hasRole || !hasTabIndex || !hasKeyboardHandler) {
      findings.push({
        severity: 'high',
        ruleId: 'clickable-noninteractive',
        title: `Clickable <${tag}> may not be keyboard accessible`,
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['2.1.1', '4.1.2'],
        recommendation: 'Use a native <button> or <a href>. If impossible, add role, tabindex="0", keyboard handlers, and an accessible name.',
      });
    }
  });
}

function checkPositiveTabindex(content, file, findings) {
  findAll(/tab(?:i|I)ndex\s*=\s*(?:["']|\{)?([1-9]\d*)/g, content, match => {
    findings.push({
      severity: 'high',
      ruleId: 'positive-tabindex',
      title: 'Positive tabindex disrupts focus order',
      file,
      line: lineNumber(content, match.index),
      snippet: cleanSnippet(match[0]),
      wcag: ['2.4.3'],
      recommendation: 'Remove positive tabindex. Use DOM order and tabindex="0" or "-1" only when appropriate.',
    });
  });
}

function checkAutofocus(content, file, findings) {
  findAll(/\bauto[Ff]ocus\b/g, content, match => {
    findings.push({
      severity: 'medium',
      ruleId: 'autofocus-used',
      title: 'Autofocus can move focus unexpectedly',
      file,
      line: lineNumber(content, match.index),
      snippet: cleanSnippet(match[0]),
      wcag: ['2.4.3', '3.2.1'],
      recommendation: 'Avoid autofocus unless it is essential and does not disorient keyboard or screen-reader users.',
    });
  });
}

function checkAriaHiddenFocusable(content, file, findings) {
  findAll(/<([a-zA-Z][\w:-]*)\b([^>]*)>/g, content, match => {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    if (!hasAttributeValue(attrs, 'aria-hidden', ['true'])) return;

    const focusable = tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea' ||
      (tag === 'a' && hasAttribute(attrs, 'href')) || hasAttribute(attrs, 'tabindex') || hasAttribute(attrs, 'tabIndex');

    if (focusable) {
      findings.push({
        severity: 'high',
        ruleId: 'aria-hidden-focusable',
        title: 'Focusable element is hidden from assistive technology',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['4.1.2', '2.1.1'],
        recommendation: 'Do not apply aria-hidden="true" to focusable elements. Remove focusability or remove aria-hidden.',
      });
    }
  });
}

function checkAriaReferences(content, file, findings, ids) {
  findAll(/\b(aria-labelledby|aria-describedby|aria-controls|aria-owns|aria-activedescendant)\s*=\s*(["'])(.*?)\2/gi, content, match => {
    const attr = match[1];
    const value = match[3].trim();
    if (!value || /[{}]/.test(value)) return;
    for (const token of value.split(/\s+/)) {
      if (!ids.has(token)) {
        findings.push({
          severity: 'medium',
          ruleId: 'aria-reference-missing',
          title: `${attr} references a missing id`,
          file,
          line: lineNumber(content, match.index),
          snippet: cleanSnippet(match[0]),
          wcag: ['1.3.1', '4.1.2'],
          recommendation: `Ensure id="${token}" exists in the rendered DOM, or remove/update the ${attr} reference.`,
        });
      }
    }
  });
}

function checkRoleButton(content, file, findings) {
  findAll(/<(?!button\b)([a-zA-Z][\w:-]*)\b([^>]*)\brole\s*=\s*(["'])button\3([^>]*)>/gi, content, match => {
    const attrs = `${match[2]} ${match[4]}`;
    const hasTabIndex = hasAttribute(attrs, 'tabindex') || hasAttribute(attrs, 'tabIndex');
    const hasKeyboardHandler = /(?:onKeyDown|onKeyUp|onKeyPress|@keydown|@keyup|v-on:keydown|v-on:keyup|\(keydown\)=|\(keyup\)=|onkeydown\s*=|onkeyup\s*=)/.test(attrs);
    if (!hasTabIndex || !hasKeyboardHandler) {
      findings.push({
        severity: 'medium',
        ruleId: 'role-button-incomplete',
        title: 'Custom role="button" may not implement native button behavior',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0]),
        wcag: ['2.1.1', '4.1.2'],
        recommendation: 'Prefer a native <button>. Otherwise support focus, Enter, Space, disabled state, and accessible name.',
      });
    }
  });
}

function checkMedia(content, file, findings) {
  findAll(/<video\b[\s\S]*?(?:<\/video>|>)/gi, content, match => {
    if (!/<track\b[^>]*kind\s*=\s*["']captions["']/i.test(match[0]) && !/aria-hidden\s*=\s*["']true["']/i.test(match[0])) {
      findings.push({
        severity: 'medium',
        ruleId: 'video-captions-missing',
        title: 'Video may be missing captions',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0].slice(0, 200)),
        wcag: ['1.2.2', '1.2.5'],
        recommendation: 'Provide captions for prerecorded video with audio and audio description/media alternative when needed.',
      });
    }
  });

  findAll(/<audio\b[\s\S]*?(?:<\/audio>|>)/gi, content, match => {
    const nearby = surrounding(content, match.index, 500);
    if (!/transcript/i.test(nearby)) {
      findings.push({
        severity: 'low',
        ruleId: 'audio-transcript-missing',
        title: 'Audio may be missing a transcript',
        file,
        line: lineNumber(content, match.index),
        snippet: cleanSnippet(match[0].slice(0, 200)),
        wcag: ['1.2.1'],
        recommendation: 'Provide a transcript for audio-only content.',
      });
    }
  });
}

function collectIds(content) {
  const ids = new Set();
  findAll(/\bid\s*=\s*(["'])(.*?)\1/g, content, match => {
    if (match[2] && !/[{}\s]/.test(match[2])) ids.add(match[2]);
  });
  return ids;
}

function hasLabelForId(content, id) {
  const escaped = escapeRegex(id);
  return new RegExp(`<label\\b[^>]*(?:for|htmlFor)\\s*=\\s*(["'])${escaped}\\1`, 'i').test(content) ||
    new RegExp(`<label\\b[^>]*(?:for|htmlFor)\\s*=\\s*\\{["']${escaped}["']\\}`, 'i').test(content);
}

function isProbablyWrappedByLabel(content, index) {
  const before = content.slice(Math.max(0, index - 600), index);
  const lastOpen = before.lastIndexOf('<label');
  const lastClose = before.lastIndexOf('</label>');
  return lastOpen !== -1 && lastOpen > lastClose;
}

function isPersonalDataField(attrs) {
  const haystack = `${getAttributeValue(attrs, 'name') || ''} ${getAttributeValue(attrs, 'id') || ''} ${getAttributeValue(attrs, 'type') || ''}`.toLowerCase();
  return /\b(email|e-mail|phone|tel|name|given-name|family-name|address|street|city|state|province|postal|zip|country|username|password|new-password|current-password|organization|company)\b/.test(haystack);
}

function hasAnyNameAttribute(attrs) {
  return hasAttribute(attrs, 'aria-label') || hasAttribute(attrs, 'aria-labelledby') || hasAttribute(attrs, 'title');
}

function hasAttribute(attrs, name) {
  return new RegExp(`(?:^|\\s|:)${escapeRegex(name)}(?:\\s*=|\\s|$)`, 'i').test(attrs);
}

function hasAttributeValue(attrs, name, values) {
  const value = getAttributeValue(attrs, name);
  return value !== null && values.map(v => v.toLowerCase()).includes(value.trim().toLowerCase());
}

function getAttributeValue(attrs, name) {
  const quoted = new RegExp(`(?:^|\\s|:)${escapeRegex(name)}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(attrs);
  if (quoted) return quoted[2];
  const braced = new RegExp(`(?:^|\\s|:)${escapeRegex(name)}\\s*=\\s*\\{["'](.*?)["']\\}`, 'i').exec(attrs);
  if (braced) return braced[1];
  const unquoted = new RegExp(`(?:^|\\s|:)${escapeRegex(name)}\\s*=\\s*([^\\s>]+)`, 'i').exec(attrs);
  if (unquoted) return unquoted[1].replace(/[{}]/g, '');
  return null;
}

function findAll(regex, text, callback) {
  regex.lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    callback(match);
    if (match[0].length === 0) regex.lastIndex += 1;
  }
}

function stripTags(value) {
  return value
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

function lineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function surrounding(content, index, radius) {
  return content.slice(Math.max(0, index - radius), Math.min(content.length, index + radius));
}

function cleanSnippet(snippet) {
  return snippet.replace(/\s+/g, ' ').trim().slice(0, 220);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function summarize(findings) {
  return findings.reduce((summary, finding) => {
    summary.total += 1;
    summary[finding.severity] += 1;
    return summary;
  }, { total: 0, high: 0, medium: 0, low: 0 });
}

function compareFindings(a, b) {
  return SEVERITY_SCORE[b.severity] - SEVERITY_SCORE[a.severity] ||
    String(a.file).localeCompare(String(b.file)) ||
    (a.line || 0) - (b.line || 0) ||
    a.ruleId.localeCompare(b.ruleId);
}

function formatMarkdown(result) {
  const lines = [];
  lines.push('# Front-end accessibility static audit');
  lines.push('');
  lines.push(`Target: ${result.target}`);
  lines.push(`Scanned files: ${result.scannedFiles}`);
  lines.push(`Generated: ${result.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total findings: ${result.summary.total}`);
  lines.push(`- High: ${result.summary.high}`);
  lines.push(`- Medium: ${result.summary.medium}`);
  lines.push(`- Low: ${result.summary.low}`);
  lines.push('');

  if (result.findings.length === 0) {
    lines.push('No findings from static heuristics. Continue with manual keyboard, screen-reader, contrast, reflow, and content checks.');
    lines.push('');
    return lines.join('\n');
  }

  for (const severity of ['high', 'medium', 'low']) {
    const group = result.findings.filter(finding => finding.severity === severity);
    if (group.length === 0) continue;
    lines.push(`## ${capitalize(severity)} findings`);
    lines.push('');
    for (const finding of group) {
      lines.push(`### ${finding.title}`);
      lines.push('');
      lines.push(`- Rule: \`${finding.ruleId}\``);
      lines.push(`- Location: ${finding.file}${finding.line ? `:${finding.line}` : ''}`);
      if (finding.wcag?.length) lines.push(`- WCAG: ${finding.wcag.join(', ')}`);
      if (finding.snippet) lines.push(`- Snippet: \`${finding.snippet.replace(/`/g, '\\`')}\``);
      lines.push(`- Recommendation: ${finding.recommendation}`);
      lines.push('');
    }
  }

  lines.push('## Reminder');
  lines.push('');
  lines.push('Static results are incomplete. Validate keyboard behavior, screen-reader output, contrast, reflow, reduced motion, mobile/touch behavior, and content quality manually.');
  lines.push('');
  return lines.join('\n');
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

main().catch(error => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(2);
});
