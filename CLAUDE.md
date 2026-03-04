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
├── features/           # Lazy-loaded pages: home, sales, login
├── lib/                # Reusable components, directives, validators
└── app.routes.ts       # Root routing config
```

### Routing

- `/login` → public, uses `LayoutNoAuthComponent`
- `/` → protected via `AuthGuard`, uses `LayoutComponent` (header + sidebar)
  - `/home` → dashboard
  - `/sales` → sales management

### State Management

Signal-based only — no NgRx. Key services:
- `SystemAlertService` — `alert = signal<Alert | null>(null)`
- `SystemLoadService` — `load = signal<boolean>(false)`
- `ThemeService` — toggles `data-theme` attribute on `<html>`, persists to localStorage

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
