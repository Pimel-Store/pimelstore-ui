# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:4200
ng build         # Production build → dist/pimelstore-ui
ng test          # Unit tests via Karma/Jasmine
ng lint          # Lint
```

## Architecture

Angular 19 standalone application (no NgModules). Uses `bootstrapApplication()` and lazy-loaded feature routes.

### Structure

```
src/app/
├── core/               # Auth, guards, layout, theme service
├── features/           # Lazy-loaded pages: home, sales, expenses, login
├── lib/                # Reusable components, directives, validators
└── app.routes.ts       # Root routing config
```

### Routing

- `/login` → public, uses `LayoutNoAuthComponent`
- `/` → protected via `AuthGuard`, uses `LayoutComponent` (header + sidebar)
  - `/home` → dashboard (gross/net toggle over sales minus expenses)
  - `/sales` → sales management
  - `/expenses` → expenses management

### State Management

Signal-based only — no NgRx. Key services:
- `SystemAlertService` — `alert = signal<Alert | null>(null)`
- `SystemLoadService` — `load = signal<boolean>(false)`
- `ThemeService` — toggles `data-theme` attribute on `<html>`, persists to localStorage
- `CategoriesService` (`core/services/categories`) — CRUD for expense categories (`title` + hex `color`), backed by `/categories`

### Settings

`HeaderComponent` has a "Configurações" button (between the theme toggle and Sair) that opens `SettingsComponent` (`core/layout/components/settings`) as a modal. It currently manages expense categories only. `Expense.category_id` references a `Category._id`; `ExpensesComponent` loads categories itself to populate the category `<select>` and render a colored label (`category.color` as background) in the list.

### Dashboard

`HomeComponent.viewMode` (`'gross' | 'net'`) toggles every KPI card, the monthly bar chart, its tooltip/legend, and the daily table between raw sales figures (`totalValue`) and sales minus expenses (`netValue`) — both come pre-computed from `GET /dashboard` per month/day/year, no separate request needed. `valueFor(entry)` picks the right field based on `viewMode()`; use it instead of reading `totalValue`/`netValue` directly when adding new dashboard figures.

### Auth Flow

1. `POST /login` via `AuthService` → stores user + JWT in localStorage
2. `AuthInterceptor` automatically injects `Bearer {token}` on all requests
3. `AuthGuard` validates token via `GET /token` before activating protected routes

### API

Backend base URL is set in `src/environments/environment.ts` (`apiUrl: 'https://pimelstore-api-core.vercel.app'`).

Response shape:
```typescript
interface ApiResponse<T> { message: string; pagination?: string; data: T; }
```

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. SCSS for component styles. Theme switching uses CSS custom properties under `[data-theme="dark"]`. Color palette defined in `src/themes/custom-pallete.css`.

### Patterns

- Use `inject()` for DI (not constructor injection)
- `providedIn: 'root'` for singleton services
- `ControlValueAccessor` for custom form components (`InputTextComponent`)
- TypeScript strict mode is enabled — all compiler strict checks apply
- Custom validator: `passwordValidator()` in `src/app/lib/validators/`
- `FloatingTooltipDirective` for tooltips (supports top/bottom/left/right positioning)
