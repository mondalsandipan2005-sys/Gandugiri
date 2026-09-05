# IPsec Shield AI — React + TypeScript

A faithful conversion of the original static `index.html` / `app.js` / `style.css`
dashboard into a typed, componentized React application (Vite + React 18 + TypeScript).

## Getting started

```bash
npm install
npm run dev       # starts Vite dev server
npm run build      # type-checks (tsc -b) and builds for production
npm run preview    # preview the production build
```

## What changed vs. the original

The original app was a single 1,100+ line `app.js` IIFE that queried the DOM by ID and
mutated `innerHTML`/`className` directly, with a global mutable `AppState` object. This
rewrite keeps the same visual design and CSS classes (`style.css` is copied over
unchanged) but replaces the imperative DOM logic with React state and components:

| Original (`app.js`)                          | React equivalent                                  |
|-----------------------------------------------|-----------------------------------------------------|
| `AppState` global object                      | `AppContext.tsx` (`useState` + `useContext`)         |
| `navigateToRoute()` / `#hash` routing          | `navigateTo()` in `AppContext`, synced to `location.hash` |
| `document.getElementById(...).textContent = …` | JSX expressions bound to state                      |
| `renderDonutChart()` (manual SVG DOM nodes)    | `components/DonutChart.tsx`                          |
| `setupModals()` / `openModal()` / `closeModal()` | `activeModal` state + 4 modal components           |
| `triggerScanSimulation()` (setInterval + DOM writes) | `triggerScanSimulation()` in `AppContext`, driving `scanProgress` state |
| `showToast()` (creates/removes DOM nodes)      | `toasts` array in state + `ToastContainer.tsx`       |
| `Presets` / `AppState.securityIssues` / etc.   | `src/data.ts` (typed with `src/types.ts`)            |
| `window.App = {...}` global API                | Regular function props from `useApp()`               |

## Project structure

```
src/
  types.ts                 Domain types (Severity, SecurityIssue, Anomaly, Packet, Preset...)
  data.ts                  Static mock data ported from app.js (issues, anomalies, packets, presets)
  AppContext.tsx           Central state/actions (routing, theme, modals, toasts, scan sim)
  App.tsx                  Top-level layout + view router
  main.tsx                 React entry point
  components/
    Sidebar.tsx             Nav + security score gauge + active scan card
    Header.tsx              Top bar: upload button, theme toggle, notifications, user chip
    SidebarGauge.tsx         Radial security score gauge (SVG)
    DonutChart.tsx           Findings-by-severity donut chart (SVG, hoverable/clickable)
    ToastContainer.tsx       Toast notifications
    views/                  One component per nav route (Dashboard, Traffic, Security,
                             Anomalies, Topology, Reports, Alerts, History, Settings)
    modals/                 Upload/Scan, Issue Detail, Anomaly Detail, Report Preview
  styles/index.css          Original style.css, unchanged (same class names)
```

## Notes

- All interactivity from the original is preserved: sidebar nav + hash routing, theme
  toggle, notification dropdown with "mark all read", clickable donut slices, issue/anomaly
  detail modals with CLI vendor tabs and copy-to-clipboard, drag-and-drop PCAP upload with
  a simulated multi-step analysis progress bar, preset scenario buttons, severity filter
  pills on the Security view, and a live traffic packet filter.
- Font Awesome and the Google Fonts (Plus Jakarta Sans / JetBrains Mono) are loaded via
  CDN `<link>` tags in `index.html`, exactly as in the original.
- This sandbox had no network access, so `npm install` / `tsc` type-checking could not be
  run here. Every `.ts`/`.tsx` file was verified to parse cleanly with esbuild, and the
  code was manually reviewed for type consistency — but please run `npm run build` once
  after installing dependencies to catch anything a full type-check would find.
