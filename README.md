# CIVICSETU

CIVICSETU is a multi-role civic issue reporting and resolution platform built with Vite and React. It is designed as a rich frontend demo for citizens, authorities, contractors, and NGOs to collaborate around public infrastructure problems such as road damage, water leaks, sanitation issues, and electricity complaints.

The project focuses on a realistic civic-tech workflow: citizens raise issues, authorities manage escalation, contractors bid and upload completion proof, NGOs support unresolved cases, and the platform tracks trust, ratings, duplicates, and state-wise quality performance.

## What This Project Does

- Lets citizens report civic issues with image upload, browser geolocation, and map preview.
- Supports voice-assisted complaint drafting through the browser Web Speech API.
- Prevents duplicate issue spam by merging similar reports from the same location and increasing the raised count.
- Detects suspicious review spikes and freezes the public rating until authority review.
- Keeps an issue open until authority proof is uploaded and the reporting citizen verifies the resolution.
- Tracks state-wise quality scores based on historical issue outcomes.
- Offers a multilingual experience across English, Hindi, Tamil, Marathi, and Kannada.
- Simulates role-based workflows for citizens, authorities, contractors, and NGOs using in-memory demo data.

## User Roles

### Citizen

- Report a new issue
- Use auto-location and OpenStreetMap preview
- Upload issue images
- Use voice-to-text for complaint descriptions
- Vote on issues
- Track resolution progress
- Review before/after proof
- Verify whether an issue is actually solved
- Rate contractor performance on resolved work

### Authority

- View operational dashboards
- Filter and manage issues
- Review contractor bids
- Approve or reject NGO requests
- Upload resolution proof
- Trigger the citizen-verification stage before closure
- Review suspicious rating spikes
- Monitor state quality rankings

### Contractor

- Browse open bidding opportunities
- Submit bids for civic work
- Track assigned projects
- Upload completion images
- Monitor project status through verification

### NGO

- Explore unresolved issues
- Raise support requests
- View analytics dashboards
- Track donation history
- Compare state quality performance

## Core Platform Workflows

### 1. Duplicate Issue Detection

When a citizen submits a complaint, the app compares it against unresolved issues using:

- category match
- same city and state
- similar address or nearby coordinates
- content similarity threshold

If a match is found, the platform does not create a new issue. Instead, it increments the raised count on the existing issue.

### 2. Community Rating Fraud Guard

If an issue normally receives low review volume but suddenly gets a large number of votes in a short window, the system:

- freezes the visible rating
- flags the suspicious review batch
- keeps the issue available for manual authority review

### 3. Proof + Citizen Verification Before Closure

Issues move through a staged lifecycle:

`open_for_bidding -> in_progress -> awaiting_citizen_verification -> resolved`

An issue cannot be fully resolved until:

- the authority uploads proof
- the citizen who reported the issue confirms that the work is actually complete

### 4. State Quality Scoring

The platform ranks states using historical issue performance, including:

- resolution rate
- citizen or contractor ratings
- suspicious issue ratio
- pending verification load

This creates a quality benchmark for comparing public service delivery across regions.

### 5. Multilingual Reporting

The UI supports:

- English
- Hindi
- Tamil
- Marathi
- Kannada

Core interface text is managed through the language context, while seeded issue copy and place names are localized through a dedicated utility.

## Tech Stack

### Frontend

- React 18
- Vite 6
- TypeScript
- React Router

### UI and Styling

- Tailwind CSS
- Radix UI primitives
- shadcn-style component structure in `src/app/components/ui`
- Lucide icons

### Maps and Charts

- Leaflet
- OpenStreetMap tiles
- Nominatim reverse geocoding
- Recharts

### Browser APIs

- Geolocation API
- Web Speech API

## Project Structure

```text
HACK_RUST/
|-- index.html
|-- package.json
|-- package-lock.json
|-- postcss.config.mjs
|-- vite.config.ts
|-- src/
|   |-- main.tsx
|   |-- app/
|   |   |-- App.tsx
|   |   |-- routes.tsx
|   |   |-- context/
|   |   |   |-- AppContext.tsx
|   |   |   `-- LanguageContext.tsx
|   |   |-- pages/
|   |   |   |-- Landing.tsx
|   |   |   |-- CitizenPortal.tsx
|   |   |   |-- AuthorityPortal.tsx
|   |   |   |-- ContractorPortal.tsx
|   |   |   `-- NGOPortal.tsx
|   |   |-- components/
|   |   |   |-- shared/
|   |   |   |-- ui/
|   |   |   `-- CivicSetu/
|   |   `-- utils/
|   |       |-- issueLocalization.ts
|   |       `-- stateQuality.ts
|   `-- styles/
|       |-- index.css
|       |-- theme.css
|       |-- tailwind.css
|       `-- fonts.css
`-- dist/
```

## Important Files

- `src/main.tsx`
  Bootstraps React, imports global styles, and loads Leaflet CSS.

- `src/app/App.tsx`
  Mounts the router provider for the application.

- `src/app/routes.tsx`
  Defines the route tree and wraps all routes with language and app state providers.

- `src/app/context/AppContext.tsx`
  Acts as the in-memory data layer for users, issues, bids, NGO requests, donations, comments, voting, duplicate detection, suspicious-review logic, and issue status transitions.

- `src/app/context/LanguageContext.tsx`
  Central translation and language-switching layer.

- `src/app/pages/CitizenPortal.tsx`
  Citizen reporting flow, voice mode, location detection, map preview, issue list, verification, and rating actions.

- `src/app/pages/AuthorityPortal.tsx`
  Authority dashboard, issue management, proof upload, NGO request review, suspicious rating review, and state quality ranking.

- `src/app/pages/ContractorPortal.tsx`
  Contractor bidding flow, project tracking, and completion proof upload.

- `src/app/pages/NGOPortal.tsx`
  NGO issue discovery, request management, analytics, and donation history.

- `src/app/utils/issueLocalization.ts`
  Localized issue titles, descriptions, and place names.

- `src/app/utils/stateQuality.ts`
  Computes state-wise quality scores and performance bands.

## Routes

- `/` - landing page
- `/citizen` - citizen portal
- `/authority` - authority portal
- `/contractor` - contractor portal
- `/ngo` - NGO portal

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run the app

```bash
npm run dev
```

Vite will start a local development server. Open the URL shown in the terminal, usually `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

## Demo Usage

This project currently behaves like a rich frontend prototype:

- login is simulated from the landing page
- role access is demo-driven
- mock users are preconfigured in the app context
- most business data lives in memory

You can enter the app by choosing any role card on the landing screen. The form is pre-filled with demo user details for each role.

## Architecture Notes

### State Management

The app uses React Context rather than Redux or a backend API layer. `AppContext.tsx` is the central source of truth for:

- users
- issues
- bids
- NGO requests
- donations
- comments
- voting and rating behavior

### Localization

Language switching is handled through `LanguageContext.tsx`, while seeded issue content is localized using `issueLocalization.ts`. This split keeps UI labels and seeded content manageable.

### UI System

Reusable UI primitives live under `src/app/components/ui`. The structure follows a shadcn-style pattern built on top of Radix UI and utility-class styling.

## Current Limitations

- This is a frontend-first demo, not a production backend-integrated system.
- Most runtime data is stored in memory, so issue changes reset on refresh.
- Geolocation depends on browser permissions.
- Voice input depends on browser support for the Web Speech API.
- OpenStreetMap and reverse geocoding features depend on network access.
- The package name in `package.json` still reflects a template value: `@figma/my-make-file`.

## Suggested Next Improvements

- Connect issue, bid, donation, and comment flows to a real backend
- Add authentication and role-based route protection
- Persist user actions in a database
- Add test coverage for duplicate detection and review-spike detection
- Move large page files into smaller feature modules
- Add file or cloud storage for uploaded evidence

## Why This README Matters

This project already contains several advanced civic-platform concepts beyond a basic CRUD demo: multilingual access, trust signals, fraud protection, duplicate suppression, citizen verification, and state-level quality scoring. This README is intended to make those ideas easy to understand for reviewers, teammates, hackathon judges, and future contributors.

## License

No license file is currently included in the repository. Add one if you plan to distribute or open-source the project formally.
