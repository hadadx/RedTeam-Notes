# GrayHat Notes - Codex Project Context

This file is the handoff document for any Codex instance working on this project.
Before changing code, read this file and follow the standards below.

## Project Identity

GrayHat Notes is a Chrome browser extension for red team / OSCP-style notes, payloads, and command references.

The app is a local extension, not a website landing page. The first screen should remain the actual tool interface.

Primary project path on the main machine:

```text
C:\Users\hadadx\Desktop\GrayHat Notes
```

Workspace mirror used by Codex on this machine:

```text
C:\Users\hadadx\Documents\Codex\2026-07-03\new-chat\outputs\blank-browser-extension-svelte-vite-tailwind
```

## Stack

- Svelte
- Vite
- Tailwind CSS
- DaisyUI
- Chrome Extension manifest

Important package scripts:

```text
pnpm run build
pnpm run dev
pnpm run preview
```

On this machine, if normal `pnpm` is not available, build with the bundled runtime:

```powershell
$env:Path = "C:\Users\hadadx\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;" + $env:Path
& "C:\Users\hadadx\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" run build
```

Chrome loads the built extension from `dist`, so after code/content changes, run build and reload the extension in Chrome.

## Important Files

```text
src/App.svelte
```

Controls the app shell, sidebar navigation, tab trees, page metadata, copy buttons, image lightbox, reverse shell state, and localStorage navigation state.

```text
src/legacy.css
```

Contains most of the visual style for pages, sidebar sub-tabs, command rows, resources, images, notes, and legacy UI.

```text
public/pages/*.html
```

Every topic page is an HTML fragment loaded into the app.

```text
public/icons/*
public/images/*
```

Icons and content images.

```text
manifest.json
```

Chrome extension manifest.

## Current Navigation Model

Main left sidebar uses icon-only primary navigation.

Primary content groups live in `src/App.svelte` inside:

```js
const groups = [...]
```

Standalone top-level tabs live in:

```js
const singleTabs = [...]
```

Every page should have metadata in:

```js
const pageMeta = {...}
```

Metadata drives the top header. If a page is missing from `pageMeta`, the header may show generic or stale information.

### Current Main Groups

- Reconnaissance
- Web Testing
- Linux Commands
- Windows
- Active Directory

Standalone tabs:

- Reverse Shell
- Notes

### Active Directory Structure

Active Directory currently contains:

- Information Resource
  - Authentication Method
    - NTLM
    - Kerberos
- Enumeration
- Authentication Attacks
  - Password Spraying
    - Using Spray-Passwords.ps1
    - Using NetExec
    - Using Kerbrute
  - AS-REP Roasting
    - Using impacket-GetNPUsers
    - Using Rubeus
  - Kerberoasting
    - Using Rubeus
    - Using impacket-GetUserSPNs
  - Silver Tickets
    - Flow Use Mimikatz
  - DCSync
    - Using Mimikatz
    - Using impacket-secretsdump
- Lateral Movement
  - WMI
    - wmic.exe
    - CIM
  - WinRM
    - winrs.exe
    - PSSession
  - PsExec
  - PtH
    - impacket-wmiexec

## Navigation Rules

To add a new tab:

1. Create a new HTML page in `public/pages`.
2. Add the tab to the correct `children` array in `src/App.svelte`.
3. Add a `pageMeta` entry for the new page.
4. Run `pnpm run build`.
5. Reload the Chrome extension.

Use `children` when a tab opens sub-tabs.

Example:

```js
{
  label: "Parent",
  page: "pages/example-parent.html",
  children: [
    { label: "Child", page: "pages/example-child.html" }
  ]
}
```

Deep nested tabs are supported. Navigation identity is handled by:

```js
function getNavId(item) {
  return item.id ?? item.page ?? item.label;
}
```

This prevents bugs where two nested tabs without `id` open together. Still, if adding complex navigation, prefer stable labels and unique pages.

## Page HTML Standard

All normal topic pages should use this wrapper:

```html
<section class="page active prose-page">
  <h1>Page Title</h1>

  <p class="intro">
    Main intro paragraph.
  </p>
</section>
```

Do not use plain `<article class="content-page">` for these pages. It will not match the existing design.

## Section Header Standard

Main section:

```html
<div class="section-title">
  <span></span>
  <h2>Section Title</h2>
  <span></span>
</div>
```

Subsection:

```html
<div class="section-title section-title-sub">
  <span></span>
  <h2>Subsection Title</h2>
  <span></span>
</div>
```

This creates the visual style:

```text
----- Section Title -----
```

Keep this style everywhere.

## Lists

Use this for bullet lists:

```html
<ul class="content-list">
  <li>Item one.</li>
  <li>Item two.</li>
</ul>
```

Use this for ordered flows:

```html
<ol class="content-list">
  <li>Step one.</li>
  <li>Step two.</li>
</ol>
```

## Paragraphs

Use `intro` for the first descriptive paragraph.

Use `content-text` for short body paragraphs under sections:

```html
<p class="content-text">
  Text here.
</p>
```

For `Advantages` and `Disadvantages`, the current standard is often paragraph text instead of bullets, to save space:

```html
<p class="content-text">
  Fast, simple, and useful during lateral movement.
</p>
```

## Command Standard

Every command should be in its own `command-row`.

```html
<div class="command-row">
  <code class="copy-text">command here</code>
  <button class="copy-button" type="button" aria-label="Copy command">Copy</button>
</div>
```

Long commands must stay in a single row and scroll horizontally inside the command box. Do not wrap long commands into the app layout.

When a multi-line procedure is requested, do not put all lines inside one `command-row` unless explicitly asked. Prefer one `command-row` per command, with subsection titles between logical steps.

Example:

```html
<div class="section-title section-title-sub">
  <span></span>
  <h2>Define User Credentials</h2>
  <span></span>
</div>

<div class="command-row">
  <code class="copy-text">$username = 'jen';</code>
  <button class="copy-button" type="button" aria-label="Copy command">Copy</button>
</div>
```

## Resources Standard

Resources should be shown as aliases, not raw full URLs.

```html
<div class="section-title section-title-sub">
  <span></span>
  <h2>Resources</h2>
  <span></span>
</div>

<div class="resource-links">
  <a href="https://attack.mitre.org/techniques/T1550/002/" target="_blank" rel="noreferrer">MITRE ATT&amp;CK T1550.002</a>
</div>
```

Use readable aliases such as:

- MITRE ATT&CK T1047
- MITRE ATT&CK T1021.006
- PTES
- NetExec Docs
- ropnop/kerbrute

## Image Standard

Images belong in `public/images`.

Use this HTML:

```html
<div class="content-image">
  <img src="images/example.png" alt="Useful description">
</div>
```

Existing JavaScript makes images clickable and opens them larger in a lightbox. Every new content image should follow this structure.

## Visual Design Standard

The app style is red team focused:

- Dark gray and black base
- Red accent
- White strong headings
- Rounded but compact UI
- Dense and quick to scan
- No landing page style
- No marketing hero sections
- No large decorative cards
- No oversized explanatory UI text

Content pages should stay practical, readable, and compact.

## Sidebar Standard

Main sidebar should remain icon-only for primary groups.

Sub-tabs are text-based and compact.

Grandchild tabs are visually nested with a subtle red left border and small `>` marker.

Do not make the sidebar wider by adding visible text labels to primary icons.

Hover tooltip standard:

- Dark tooltip
- White text
- Rounded corners
- Red border
- Must not show the browser default tooltip at the same time

## Notes Standard

The Notes tab should fit the extension viewport without unnecessary page scrolling. It autosaves locally by default until the user clears it.

## Reverse Shell Standard

Reverse Shell is a special page, not regular static content.

It has:

- Shared IP input
- Shared Port input
- Shell type dropdown
- Payload generation
- Encoding dropdown with `None`, `URL`, and `BASE64`

If one shell payload changes IP or port, all reverse shell payload state should follow the shared value.

## Build And Sync Workflow On This Machine

When working from the Codex workspace mirror, edit files here:

```text
C:\Users\hadadx\Documents\Codex\2026-07-03\new-chat\outputs\blank-browser-extension-svelte-vite-tailwind
```

Then copy changed files to the real Desktop project:

```text
C:\Users\hadadx\Desktop\GrayHat Notes
```

Then run build in the Desktop project:

```powershell
$env:Path = "C:\Users\hadadx\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;" + $env:Path
& "C:\Users\hadadx\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" run build
```

After build, tell the user to reload the Chrome extension.

On another machine, if the project is copied normally, run:

```powershell
pnpm install
pnpm run build
```

If `pnpm` is missing, install/use Node package tooling first.

## Copy Button Behavior

Copy buttons are handled globally by app JavaScript. To get copy behavior, use:

```html
<code class="copy-text">...</code>
<button class="copy-button" type="button" aria-label="Copy command">Copy</button>
```

Do not write custom copy JavaScript in individual pages.

## Local State

The app saves the current open tab/page in localStorage. If the user closes and reopens the extension, it should reopen on the last page.

Relevant state variables in `App.svelte`:

- `openGroup`
- `openNested`
- `openDeepNested`
- `activePage`

## Security Content Style

This project is a note/reference tool. When adding offensive security content, keep it organized as educational notes and command references.

Use the user's requested wording where possible, but keep structure consistent:

- Title
- Intro paragraph
- Requirements
- How It Works
- Advantages
- Disadvantages
- Important Notes
- Commands
- Resources

Not every page needs every section.

## Important Current File Examples

Good examples to copy style from:

```text
public/pages/ad-dcsync.html
public/pages/ad-lateral-movement-wmi.html
public/pages/ad-lateral-movement-cim-ps.html
public/pages/ad-lateral-movement-pth.html
public/pages/ad-kerberoasting-rubeus.html
```

## Common Mistakes To Avoid

- Do not create pages with `<article class="content-page">`.
- Do not forget `pageMeta`.
- Do not add primary sidebar text labels; keep primary sidebar icon-based.
- Do not put many commands into one `command-row` when the user expects separate rows.
- Do not show raw resource URLs when an alias is better.
- Do not make long commands wrap and break the layout.
- Do not create duplicate tab ids.
- Do not forget to run build after changes.

## Minimal Checklist For Adding A New Content Page

1. Add `public/pages/new-page.html`.
2. Use `<section class="page active prose-page">`.
3. Add the tab to `groups` or `singleTabs` in `src/App.svelte`.
4. Add page metadata to `pageMeta`.
5. Use standard section titles, lists, commands, resources, and images.
6. Copy changed files to the real project if working from a mirror.
7. Run `pnpm run build`.
8. Tell the user to reload the Chrome extension.
