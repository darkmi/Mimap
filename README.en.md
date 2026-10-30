Mimap
==========

[简体中文](README.md)

## Introduction

**Mimap is an AI-native mind map tool — generate a mind map from a single sentence.** Type one sentence, and the AI builds a complete mind map for you. You can then refine and extend it further with the built-in editor.

The editor UI is built with Vue 3 and Vite, and is covered by Vitest unit tests and Playwright E2E tests.

## Features

- AI generation: describe your need in one sentence and get a complete mind map
- Basic operations: text editing, node folding, insert, delete, sort, merge, copy, cut, paste, etc.
- Style control: font, bold, italic, color, style copy/paste, etc.
- Icons: priority, progress, etc.
- History: undo / redo
- Tags: multiple labels per node
- Notes: Markdown-formatted notes
- Images: insert from local, web, or search
- Hyperlinks: HTTP/HTTPS/MAIL/FTP link insertion
- Layouts: multiple layout switching
- Themes: multiple theme switching
- Data import/export: import from and export to multiple formats (including images)
- Navigator: thumbnail view and navigation

## Quick Start

The development entry is `index.html` in the project root (powered by Vite).

1. Install [Node.js](http://nodejs.org) (LTS version recommended)
2. Initialize: run `npm install` in the project root
3. Run `npm run dev` to start the dev server (default http://localhost:5173)
4. Develop with `index.html` and the `vueui/` directory. Enjoy it!

## Project Structure

```
index.html          dev entry page
vue-main.js         app entry: load global libs + mount the Vue app
vue-app.js          Vue app assembly (createApp(KmEditor))
editor-entry.js     editor runtime entry (src/ module tree)
src/                ESM editor runtimes (fsm/receiver/hotbox/input/clipboard/drag/history, etc.)
vueui/              Vue 3 UI layer (KmEditor.vue + components/)
less/               Less styles (aligned with component DOM class names)
vendor/hotbox/      hotbox (legacy Bower package, maintained in-repo)
public/             static assets (sprite images, etc.)
types/              TypeScript declarations for the underlying graphics/kernel libs
e2e/                Playwright E2E specs
tests/              Vitest unit tests
docs/               upgrade & testing plan docs
server/             sample image upload server (PHP)
```

Project notes:

- npm is used for package management; non-npm packages such as hotbox live in `vendor/`
- The underlying graphics/kernel libraries are non-strict-mode; they are loaded in order as classic `<script>` tags at the entry (imported via `?url`, identical in dev and build)
- Build target is `es2022` (the entry uses top-level `await` to load global libs in order)

## Build

```bash
npm run build
```

The output in `dist` is ready to deploy; use `npm run preview` to preview it locally.

## Test

```bash
# Unit tests (Vitest)
npm test

# E2E tests (Playwright; install the browser once first)
npx playwright install chromium
npm run test:e2e
```

## Data Import & Export

After creating an editor instance, four APIs are available for data import and export:

* `editor.minder.exportJson()` - export mind map data as a JSON object
* `editor.minder.importJson(json)` - import a JSON object as the current mind map data
* `editor.minder.exportData(protocol, option)` - export data in the given format, returns a Promise resolving to the result
* `editor.minder.importData(protocol, data, option)` - import data in the given format, returns a Promise resolving to the converted mind map JSON

Currently supported data formats:

* `json` - JSON string, import and export
* `text` - plain text, import and export
* `markdown` - Markdown, import and export
* `svg` - SVG vector format, export only
* `png` - PNG bitmap format, export only

## Contact

For questions and suggestions, please open [GitHub Issues](https://github.com/darkmi/Mimap/issues).

## License

Apache-2.0.
