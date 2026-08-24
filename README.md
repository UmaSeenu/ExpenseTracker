# SmartSpend Expense Tracker

## Project Name

SmartSpend Expense Tracker

## Project Description

SmartSpend is a personal expense-tracking application that helps users record
daily spending, monitor their monthly budget, and understand spending by category.
The current release contains a React dashboard and a .NET API vertical slice for
creating validated expenses.

## Features

- View monthly spending, budget usage, and daily average.
- Review spending trends and category breakdowns.
- Navigate between Overview, Expenses, Insights, Categories, and Settings views.
- Filter recent expenses by category.
- Add expenses with merchant, amount, and category details.
- Validate expense amounts, dates, descriptions, and categories in the API.
- Use Indian rupee (`INR`) currency formatting throughout the dashboard.

## Technology Used

- Frontend: React, TypeScript, Vite, and CSS.
- Backend: .NET 10 Web API with controllers, services, and repository layers.
- Database target: PostgreSQL. Local development currently uses an in-memory repository.
- Testing: Vitest for frontend tests; xUnit is planned for backend tests.
- Deployment target: Vercel for the frontend and Azure App Service for the API.

## How to Install

Prerequisites:

- Node.js and npm.
- .NET 10 SDK.

Install frontend dependencies:

```bash
cd frontend
npm install --cache .npm-cache
```

Restore backend dependencies:

```bash
export DOTNET_CLI_HOME="$PWD/.dotnet"
cd backend
dotnet restore
```

## How to Run Locally

Start the frontend in one terminal:

```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5174
```

Open the frontend at http://127.0.0.1:5174/.

Start the API in a second terminal:

```bash
export DOTNET_CLI_HOME="$PWD/.dotnet"
cd backend
dotnet run --no-launch-profile --urls http://127.0.0.1:5067
```

The expense creation endpoint is:

```text
POST http://127.0.0.1:5067/api/v1/expenses
```

The API expects `amount`, `categoryId`, and `date`, with an optional `description`.
The local repository uses these sample category IDs:

```text
11111111-1111-1111-1111-111111111111
22222222-2222-2222-2222-222222222222
33333333-3333-3333-3333-333333333333
```

Run frontend tests and build:

```bash
cd frontend
npm test
npm run build
```

Build the backend:

```bash
export DOTNET_CLI_HOME="$PWD/.dotnet"
cd backend
dotnet build
```

## GitHub Repository

https://github.com/UmaSeenu/ExpenseTracker

## Live Application URL

Not deployed yet. Use the local frontend URL during development:

http://127.0.0.1:5174/

Deployment is planned through Vercel for the React frontend and Azure App Service
for the .NET API.