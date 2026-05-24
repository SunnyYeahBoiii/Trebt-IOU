# Design Spec: In-Depth Codebase Review & UI Surface Improvements

> Date: 2026-05-24

## Problem Statement

Trebt-IOU ("Sổ Thơ Nụ") is a roommate expense/debt tracking app with a monorepo structure (NestJS backend + React frontend). Current codebase has:

- **UI quality issues**: No reusable components, inline Tailwind everywhere, zero accessibility, PNG spinner, `alert()` for all feedback, dialogs without focus trap or aria attributes
- **Code quality issues**: Hardcoded user mapping in 6+ files, duplicated form markup, state mutation bugs, unhandled promises, direct DOM manipulation bypassing React
- **Security gaps**: Token service in-memory only, guard bypass when API_KEY unset, no CSRF, hardcoded ngrok URL, zero tests

## Design Decisions

### UI: Internal Design System (Option 2)

- Build internal component library from scratch, no external dependencies
- Token system: CSS custom properties + TypeScript exports for colors, spacing, typography, radius, shadows
- Component hierarchy: primitives → layouts → forms → page compositions
- All components use CSS variables, theme switching via variable swap
- Dialog: self-implemented focus trap + aria-modal + Escape-close
- CSS spinner replaces PNG asset

### Migration Strategy

- Bottom-up: tokens → primitives → layouts → forms → refactor page components
- Each page component refactored independently, no breaking changes between steps
- Code quality fixes paired with migration (fix state mutation when touching Statistic, etc.)

### Security & API Fixes

- Token persistence with expiry (database or in-memory with file backup)
- Fail-closed API key guard
- CSRF protection via SameSite cookies
- TypeScript strictness enforcement
- Basic unit tests for handlers and services

## Scope

### In Scope
- Frontend design system (tokens + 15+ components)
- Refactor all 4 page components to use new UI library
- Fix all identified code quality issues in frontend
- Fix security issues in backend
- Add basic test coverage for backend handlers

### Out of Scope
- Complete CQRS refactor (CQRS overhead is noted but not addressed)
- Migration away from CQRS
- CI/CD pipeline setup
- Docker containerization
- Complete test suite (only critical handlers tested)

## Architecture

```
web/src/
├── tokens/              # Design tokens (colors, spacing, typography, radius, shadows)
├── ui/
│   ├── primitives/      # Atomic components (Button, Input, Checkbox, Badge, Avatar, Spinner, Icon, Toast)
│   ├── layouts/         # Layout components (Card, Stack, Dialog, Table)
│   └── forms/           # Form components (FormField, FormGroup)
├── config/
│   └── users.ts         # Centralized user mapping
├── components/          # Refactored page components (existing files updated)
└── helper/              # Existing helpers (updated to use centralized config)

api/src/
├── services/            # Token service (updated with persistence + expiry)
├── guards/              # API key guard (fail-closed)
└── **/*.spec.ts         # New test files
```
