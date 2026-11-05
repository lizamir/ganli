# Changelog

All notable changes to this project are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com), and versions follow [SemVer](https://semver.org).

## [1.1.0] - 2026-11-05

### Changed

- Reorganized the code by responsibility: routes, content, UI components, data layer, API calls and business rules are now separate.
- Split large files into small components and functions, each with a short comment.
- Split the stylesheet into ordered files. No visual change.

### Added

- Unit tests (Vitest) for the business rules and the database mappers.
- Browser tests (Playwright) for the main demo flows.
- Prettier, commit message checks, CI and Dependabot.

## [1.0.0] - 2026-10-20

### Added

- Marketing site with the 3D block castle, enrollment form and meeting booking.
- Personal area for parents, staff and the director, with a demo mode and Supabase.
