# SmartSpend – Expense Tracker

## Application Name
SmartSpend – Expense Tracker

## Problem Statement
Users need a simple way to record daily expenses and quickly understand their monthly spending.

## Target Users
- Individuals
- Working professionals
- Students

## Main Features
- Add expense
- View expenses
- Edit/Delete expense
- Categorize expenses
- View total monthly expenses
- Filter expenses by category/date

## Pages / Screens Required
1. **Login/Register** – User authentication
2. **Dashboard** – Monthly expense summary
3. **Expenses** – Add, view, edit and delete expenses
4. **Profile/Settings** – Basic user information and logout

## Technology Stack
- Frontend: React + TypeScript
- Backend: .NET 10 Web API
- Database: PostgreSQL
- Authentication: JWT
- Testing: Playwright + Vitest + xUnit
- CI/CD: GitHub Actions
- Deployment: Vercel (frontend) + Azure App Service (API) + managed PostgreSQL

## Project Folder Structure

```text
smartspend/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── models/
│   └── tests/
│
├── backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   ├── DTOs/
│   └── Tests/
│
├── database/
│   └── migrations/
│
├── e2e-tests/
│   └── playwright/
│
└── .github/
    └── workflows/
```

## Data That Needs to Be Stored

### User
- UserId: UUID, primary key
- Name: string, required, maximum 100 characters
- Email: string, required, normalized, unique
- PasswordHash: string, required; never returned by the API
- TimeZoneId: IANA time-zone identifier, required, default `UTC`
- CreatedAt: UTC timestamp
- UpdatedAt: UTC timestamp

### Expense
- ExpenseId: UUID, primary key
- UserId: UUID, required foreign key to User
- Amount: numeric(12,2), required, greater than 0
- CategoryId: UUID, required foreign key to Category
- Date: date, required; interpreted in the user's selected time zone
- Description: string, optional, maximum 500 characters
- CreatedAt: UTC timestamp
- UpdatedAt: UTC timestamp

### Category
- CategoryId: UUID, primary key
- UserId: UUID, required foreign key to User
- Name: string, required, maximum 50 characters
- Unique constraint on `(UserId, normalized Name)`

Categories are owned by a user. Deleting a category is rejected while expenses still
reference it. Expense deletion is a hard delete for the first release.

### RefreshToken
- RefreshTokenId: UUID, primary key
- UserId: UUID, required foreign key to User
- TokenHash: string, required, unique; the raw token is never stored
- ExpiresAt: UTC timestamp
- RevokedAt: UTC timestamp, optional
- CreatedAt: UTC timestamp
- ReplacedByTokenId: UUID, optional, for token-rotation tracking

### Database Rules
- Use UUID keys and PostgreSQL foreign keys for all relationships.
- Store monetary values as `numeric(12,2)`, never floating point values.
- Store timestamps in UTC and convert them only for display and monthly reporting.
- Add indexes on `(UserId, Date)` and `(UserId, CategoryId)` for expense queries.
- Apply database migrations through a controlled CI/CD migration job before the API deploy.

## Deployment Architecture

```text
Browser
   |
   v
Vercel: React frontend
   |
   | HTTPS REST API
   v
Azure App Service: .NET 10 API
   |
   v
Managed PostgreSQL database
```

- The frontend receives the API base URL through a Vercel environment variable.
- Vercel is connected directly to the GitHub repository. Pushes to the production branch deploy the frontend, and pull requests receive preview deployments.
- The API accepts requests only over HTTPS and allows the configured frontend origin through CORS.
- Database credentials, JWT signing keys, and refresh-token settings are stored as platform secrets.
- GitHub Actions runs build, unit, integration, and end-to-end tests on pushes and pull requests.
- A separate migration job applies EF Core migrations before the API deployment receives traffic.
- GitHub Actions publishes the compiled .NET application directly to Azure App Service; Docker is not required.
- Production, staging, and local development use separate databases and credentials.

## Authentication Contract

- `POST /api/v1/auth/register` creates a user and returns `201 Created`.
- `POST /api/v1/auth/login` returns a 15-minute JWT access token and sets a secure, HttpOnly refresh-token cookie.
- `POST /api/v1/auth/refresh` rotates the refresh token and returns a new access token.
- `POST /api/v1/auth/logout` revokes the current refresh token and returns `204 No Content`.
- Refresh tokens are opaque, stored hashed in the database, rotated on use, and expire after 30 days.
- The JWT `sub` claim contains the user UUID. Every protected resource is filtered by that UUID.
- Passwords are hashed with the ASP.NET Core password hashing implementation and are never logged or returned.
- Registration rejects duplicate normalized email addresses. Login returns the same generic error for an unknown email or incorrect password.
- The client keeps the access token in memory. Refresh cookies use `Secure`, `HttpOnly`, and an appropriate `SameSite` policy.

## API Contract

All endpoints use JSON and the `/api/v1` prefix. Protected endpoints require
`Authorization: Bearer <access-token>`.

### Expenses
- `GET /api/v1/expenses?from=&to=&categoryId=&page=1&pageSize=25&sort=date_desc`
  returns a paginated list belonging to the authenticated user.
- `POST /api/v1/expenses` creates an expense and returns `201 Created` with the created resource.
- `GET /api/v1/expenses/{expenseId}` returns one user-owned expense or `404 Not Found`.
- `PUT /api/v1/expenses/{expenseId}` replaces an expense and returns `200 OK`.
- `DELETE /api/v1/expenses/{expenseId}` deletes an expense and returns `204 No Content`.

### Categories and Dashboard
- `GET /api/v1/categories` lists the authenticated user's categories.
- `POST /api/v1/categories` creates a category and returns `201 Created`.
- `PUT /api/v1/categories/{categoryId}` renames a category and returns `200 OK`.
- `DELETE /api/v1/categories/{categoryId}` returns `409 Conflict` if expenses reference it.
- `GET /api/v1/dashboard/monthly-summary?year=2026&month=8` returns total spending,
  expense count, and totals grouped by category for the authenticated user.

### Request and Error Rules
- Create and update requests require `amount`, `categoryId`, and `date`; `description` is optional.
- Dates use `YYYY-MM-DD`; monetary amounts are returned as decimal JSON values.
- Invalid input returns `400 Bad Request` using RFC 9457 Problem Details.
- Unauthenticated requests return `401 Unauthorized`; authenticated users cannot access another user's resources and receive `404 Not Found`.
- Unexpected server errors return `500 Internal Server Error` without stack traces or database details.

## Development Steps
1. Create React frontend.
2. Create .NET Web API.
3. Configure PostgreSQL.
4. Create database tables.
5. Implement authentication.
6. Implement expense CRUD APIs.
7. Build Dashboard.
8. Build Expenses screen.
9. Add filtering and monthly totals.
10. Add API and Playwright tests.
11. Configure GitHub Actions.
12. Deploy the application.

## Deployment Approach

```text
GitHub
   ├──> Vercel: preview and production frontend deployments
   │
   └──> GitHub Actions
           ↓
       Build + Tests
           ↓
       Run database migrations
           ↓
       Publish API to Azure App Service
```

The frontend and API are deployed independently. The API is the only service that
connects directly to PostgreSQL. Vercel does not host the traditional .NET API in
this architecture.