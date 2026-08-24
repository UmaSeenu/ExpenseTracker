# SmartSpend

SmartSpend is an expense-tracking application built from the product specification
in [SmartSpend_Expense_Tracker.md](SmartSpend_Expense_Tracker.md).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173/ in a browser.

The first frontend slice includes the overview dashboard, spending breakdown,
expense filters, and an add-expense modal. The backend currently uses an in-memory
repository for local development.

## Run the API locally

```bash
export DOTNET_CLI_HOME="$PWD/.dotnet"
cd backend
dotnet run --no-launch-profile --urls http://127.0.0.1:5067
```

The expense creation endpoint is `POST http://127.0.0.1:5067/api/v1/expenses`.
It validates the amount, date, description length, and category ownership before
returning the created expense. PostgreSQL persistence and authentication will
replace the local in-memory repository in the next integration step.