# Dependency and build changes

The audit baseline was captured before edits in `dependency-audit-baseline.json`: 18 affected package entries (12 high, six moderate). Compatible patches first reduced this to nine. The remaining Tailwind 3 glob/parser chain required a separately validated major migration. After that migration, compatible Browserslist and baseline-browser-mapping updates removed the last two entries. `dependency-audit-final.json` records the measured final tree; at remediation time it contains zero advisories.

## Changes and exposure

- Vite 6.4.3 → 6.4.4: patched Windows development-tool command handling. The application remains a static SPA; the development server is bound to loopback.
- React Router DOM 7.18.1 → 7.18.4, with its matching React Router dependency: the reported RSC server advisory was not an identified execution path in this BrowserRouter application. All catalog and alias routes are checked in Chromium.
- React Syntax Highlighter 15.6.6 → 16.1.2: removes the vulnerable nested Prism copy. The viewer uses the light build with only C++ and JavaScript registered and a contrast-adjusted light/dark palette. Node anchor tests and browser source rendering checks cover API compatibility.
- PostCSS upgraded within version 8; Tailwind 3.4.19 → 4.3.3 with `@tailwindcss/postcss`: migrated `@tailwind` directives to `@import`, explicitly retained the JS token configuration using `@config`, retained class-based dark mode, removed Autoprefixer, and verified the production build plus responsive/keyboard/browser checks. Tailwind's modern browser baseline is Chrome 111+, Safari 16.4+, and Firefox 128+; only Chromium was exercised locally.
- Build/test tooling is in devDependencies. Vercel explicitly installs development tools and builds from source, serving the generated `dist` directory. Committed artifacts are unnecessary under that configuration. No deployment was performed.
- ESLint 10 is supported on the documented Node 22.13+/24 runtime. Tests use native Node type stripping to exercise the same strict TypeScript playback reducer used by Vite.

## Policy

`npm run audit:check` queries the complete tree, fails on any advisory or registry failure, and writes the raw measured result. There are no ignored advisory IDs or production-only filters. A future advisory exception requires explicit review, dependency ancestry, exploitability context, and a dated remediation plan. CI does not silently turn registry failures into successful audits.

Dependency ancestry and absence of vulnerable nested copies can be inspected with:

```sh
npm ls vite react-router react-router-dom react-syntax-highlighter refractor prismjs postcss tailwindcss browserslist baseline-browser-mapping
npm run audit:check
```

Primary migration references: [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide), [light syntax-highlighter builds](https://github.com/react-syntax-highlighter/react-syntax-highlighter#light-build), [Vite Windows advisory](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).
