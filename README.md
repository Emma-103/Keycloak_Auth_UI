# Keycloak Backoffice UI

React + Vite backoffice portal that uses a BFF-based authentication flow (Keycloak/IAM) and session-backed API access.

## What This App Does

- Enforces sign-in for all admin routes using a protected routing layer.
- Starts IAM login through the BFF and returns users to their original URL.
- Loads current session profile from `GET /api/bff/me`.
- Supports sign-out via `POST /api/bff/logout` and redirects to IdP logout URL when provided.
- Exposes four admin screens:
  - Dashboard
  - Transactions (read-only table)
  - Customers (read-only table)
  - User Management (read-only table)
- Fetches data through BFF proxy endpoints and falls back to local mock data if API calls fail.

## Tech Stack

- React 18
- React Router DOM 6
- Vite 5
- `@vitejs/plugin-basic-ssl` (local HTTPS dev server)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env file:
   ```bash
   copy .env.example .env
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. Open:
   - `https://localhost:5173`

## NPM Scripts

- `npm run dev`: start HTTPS dev server on `localhost:5173`
- `npm run build`: production build into `dist/`
- `npm run preview`: preview production build

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_BFF_BASE_URL` | `https://localhost:7296/api/bff` | Auth/session endpoint root (`/login`, `/me`, `/logout`) |
| `VITE_API_BASE_URL` | `https://localhost:7296/api/bff/proxy` | Proxied business API root (`/transactions`, `/customers`, `/users`) |

Example `.env`:

```env
VITE_BFF_BASE_URL=https://localhost:7296/api/bff
VITE_API_BASE_URL=https://localhost:7296/api/bff/proxy
```

## Application Architecture

### Route Map

- `/login`
  - Login bootstrap route that triggers redirect to IAM login via BFF.
- `/`
  - Protected parent route wrapped by `ProtectedRoute`.
  - Nested pages:
    - `/` -> Dashboard
    - `/transactions` -> Transactions table
    - `/customers` -> Customers table
    - `/users` -> User Management table
- `*`
  - Catch-all route redirects back to `/`.

### Core Modules

- `src/context/AuthContext.jsx`
  - Owns session state (`user`, `isLoading`, `isAuthenticated`).
  - Exposes `beginLogin`, `logout`, and `reloadSession`.
- `src/components/ProtectedRoute.jsx`
  - Blocks protected content until session check is done.
  - Redirects unauthenticated users into login flow.
- `src/services/authApi.js`
  - Implements auth/session HTTP operations against BFF.
- `src/services/apiClient.js`
  - Implements authenticated API calls for app data.
  - Falls back to mock datasets on request failures.
- `src/layouts/AdminLayout.jsx`
  - Shared shell (sidebar navigation + logout + content outlet).

## Authentication and Session Flow

1. App boots and `AuthProvider` calls `fetchCurrentUser()` (`GET /me`).
2. If a session exists, user profile is stored and protected routes render.
3. If no session (`401`) or user is null:
   - `ProtectedRoute` calls `beginLogin()`.
   - Browser is redirected to:
     - `GET {VITE_BFF_BASE_URL}/login?returnUrl=<current-page>`
4. After authentication, BFF returns user to `returnUrl`.
5. Logout:
   - App calls `POST {VITE_BFF_BASE_URL}/logout`.
   - If response includes `url`, browser is redirected to that URL (IdP/global logout).
   - Otherwise the app clears session state and navigates to `/login`.

Code sample (login URL builder):

```js
export function buildLoginUrl(returnUrl) {
  const encoded = encodeURIComponent(returnUrl || window.location.origin);
  return `${BFF_BASE_URL}/login?returnUrl=${encoded}`;
}
```

Code sample (session check and protected access):

```jsx
if (isLoading) return <p>Checking session...</p>;
if (!isAuthenticated) {
  beginLogin();
  return <p>Redirecting to Sign In...</p>;
}
return children;
```

## Functional Pages

### Dashboard (`/`)

- Shows three operational cards:
  - Transactions monitoring
  - Customer oversight
  - User access management
- Displays live session profile from `/me`:
  - Username (`preferredUsername` or `name`)
  - Email
  - Roles list

### Transactions (`/transactions`)

- Calls `getTransactions()` on mount.
- Renders a read-only table with:
  - `id`, `customer`, `amount`, `status`, `timestamp`
- `timestamp` is formatted with `toLocaleString()`.

### Customers (`/customers`)

- Calls `getCustomers()` on mount.
- Renders a read-only table with:
  - `id`, `name`, `tier`, `country`, `email`

### User Management (`/users`)

- Calls `getUsers()` on mount.
- Renders a read-only table with:
  - `id`, `name`, `email`, `role`, `status`

## Data Access Behavior

All data requests include browser session cookies:

```js
fetch(`${API_BASE_URL}${path}`, {
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});
```

If API calls fail, each resource method returns mock data from `src/data/mockData.js`. This keeps screens usable in local/offline/demo scenarios.

## API Contracts Expected by the UI

### `GET /api/bff/me`

Expected JSON shape (example):

```json
{
  "preferredUsername": "admin.user",
  "name": "Admin User",
  "email": "admin@example.com",
  "roles": ["Admin", "Auditor"]
}
```

### `POST /api/bff/logout`

Expected JSON shape:

```json
{
  "url": "https://keycloak.example.com/realms/<realm>/protocol/openid-connect/logout?..."
}
```

### Proxied business endpoints

- `GET /api/bff/proxy/transactions`
- `GET /api/bff/proxy/customers`
- `GET /api/bff/proxy/users`

## Local HTTPS and Keycloak Configuration Notes

- Vite dev server is configured with HTTPS at `https://localhost:5173`.
- Ensure BFF and IdP client settings allow this frontend origin/return URL pattern.
- Typical callback handled by BFF:
  - `https://localhost:7296/api/bff/callback`
- Keep frontend talking only to BFF/proxy endpoints; do not expose IdP tokens directly in the browser.

## Project Structure

```text
src/
  components/
    ProtectedRoute.jsx
  context/
    AuthContext.jsx
  data/
    mockData.js
  layouts/
    AdminLayout.jsx
  pages/
    DashboardPage.jsx
    TransactionsPage.jsx
    CustomersPage.jsx
    UserManagementPage.jsx
    LoginRedirectPage.jsx
  services/
    authApi.js
    apiClient.js
  App.jsx
  main.jsx
```

## Troubleshooting

- Page keeps bouncing to login:
  - Check `VITE_BFF_BASE_URL`.
  - Verify BFF session cookie is set and allowed for `https://localhost:5173`.
- API tables always show fallback data:
  - Check `VITE_API_BASE_URL`.
  - Confirm proxy routes exist and return `200` + JSON.
- TLS/certificate warnings in browser:
  - Trust local dev certificate or continue after local warning, depending on your environment policy.
