import { FormEvent, useMemo, useState } from 'react'

export type Expense = {
  id: number
  merchant: string
  category: string
  date: string
  amount: number
  color: string
}

const initialExpenses: Expense[] = [
  { id: 1, merchant: 'Whole Foods Market', category: 'Groceries', date: 'Aug 22, 2026', amount: 86.42, color: 'green' },
  { id: 2, merchant: 'Metro Transit', category: 'Transport', date: 'Aug 21, 2026', amount: 32.00, color: 'blue' },
  { id: 3, merchant: 'Tide & Table', category: 'Dining', date: 'Aug 20, 2026', amount: 54.80, color: 'coral' },
  { id: 4, merchant: 'Figma', category: 'Subscriptions', date: 'Aug 18, 2026', amount: 15.00, color: 'violet' },
  { id: 5, merchant: 'Greenleaf Pharmacy', category: 'Health', date: 'Aug 16, 2026', amount: 28.35, color: 'yellow' },
]

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)

export function addExpenseToList(expenses: Expense[], merchant: string, amount: string, category: string, date = 'Aug 24, 2026') {
  if (!merchant.trim() || !amount || Number(amount) <= 0) return expenses
  return [{ id: Date.now(), merchant: merchant.trim(), category, date, amount: Number(amount), color: categoryColor(category) }, ...expenses]
}

function App() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [activeFilter, setActiveFilter] = useState('All expenses')
  const [activePage, setActivePage] = useState('Overview')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Groceries')

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'All expenses') return expenses
    return expenses.filter((expense) => expense.category === activeFilter)
  }, [activeFilter, expenses])

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budget = 2400
  const budgetRemaining = Math.max(budget - total, 0)
  const dailyAverage = total / 24

  const addExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextExpenses = addExpenseToList(expenses, merchant, amount, category)
    if (nextExpenses.length === expenses.length) return
    setExpenses(nextExpenses)
    setMerchant('')
    setAmount('')
    setIsModalOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><span>smart<span className="brand-accent">spend</span></span></div>
        <div className="workspace-label">PERSONAL WORKSPACE</div>
        <nav className="main-nav">
          <button className={activePage === 'Overview' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('Overview')}><span className="nav-icon">◈</span> Overview</button>
          <button className={activePage === 'Expenses' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('Expenses')}><span className="nav-icon">≡</span> Expenses <span className="nav-count">{expenses.length}</span></button>
          <button className={activePage === 'Insights' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('Insights')}><span className="nav-icon">◒</span> Insights</button>
        </nav>
        <div className="workspace-label second-label">MANAGE</div>
        <nav className="main-nav">
          <button className={activePage === 'Categories' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('Categories')}><span className="nav-icon">◎</span> Categories</button>
          <button className={activePage === 'Settings' ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage('Settings')}><span className="nav-icon">⚙</span> Settings</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card"><span className="tip-spark">✦</span><strong>Small steps add up.</strong><p>You are 18% under your monthly dining budget.</p><button onClick={() => setActivePage('Insights')}>View insights <span>→</span></button></div>
          <div className="user-row"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Personal account</span></div><span className="more">•••</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><button className="help-button">?</button><button className="add-button" onClick={() => setIsModalOpen(true)}><span>+</span> Add expense</button></div></header>
        <div className={`content-wrap ${activePage !== 'Overview' ? 'page-mode' : ''}`}>
          {activePage !== 'Overview' && <section className="tab-page"><p className="eyebrow">SMARTSPEND / {activePage.toUpperCase()}</p><h1>{activePage}</h1><p className="subhead">{activePage === 'Expenses' ? 'Review and manage every transaction in one place.' : activePage === 'Insights' ? 'Understand your habits and make your next month lighter.' : activePage === 'Categories' ? 'Organize your spending with clear, personal categories.' : 'Manage your account preferences and workspace.'}</p><div className="tab-page-grid"><article className="panel"><p className="eyebrow">COMING NEXT</p><h2>{activePage === 'Expenses' ? 'Expense management' : activePage === 'Insights' ? 'Your spending patterns' : activePage === 'Categories' ? 'Your categories' : 'Account preferences'}</h2><p className="tab-copy">This view is connected to the navigation and ready for the next API-backed workflow.</p><button className="add-button" onClick={() => setActivePage('Overview')}>Back to overview <span>→</span></button></article><article className="stat-card primary-stat"><div className="stat-heading"><span>Tracked this month</span><span className="stat-icon">↗</span></div><strong>{formatCurrency(total)}</strong><div className="stat-foot"><span>{expenses.length} expenses</span><span>{activePage}</span></div></article></div></section>}
          <section className="welcome-row"><div><p className="eyebrow">SUNDAY, AUGUST 24, 2026</p><h1>Good morning, Alex <span>✦</span></h1><p className="subhead">Here is your spending pulse for this month.</p></div><button className="period-button">August 2026 <span>⌄</span></button></section>

          <section className="stats-grid">
            <article className="stat-card primary-stat"><div className="stat-heading"><span>Total spent</span><span className="stat-icon">↗</span></div><strong>{formatCurrency(total)}</strong><div className="stat-foot"><span className="positive">↓ 8.4%</span><span>vs. last month</span></div><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="stat-card"><div className="stat-heading"><span>Monthly budget</span><span className="stat-icon">◌</span></div><strong>{formatCurrency(budget)}</strong><div className="budget-bar"><span style={{ width: `${Math.min((total / budget) * 100, 100)}%` }} /></div><div className="stat-foot"><span>{Math.round((total / budget) * 100)}% used</span><span>{formatCurrency(budgetRemaining)} left</span></div></article>
            <article className="stat-card"><div className="stat-heading"><span>Daily average</span><span className="stat-icon">↗</span></div><strong>{formatCurrency(dailyAverage)}</strong><div className="stat-foot"><span className="positive">↓ 12.1%</span><span>vs. last month</span></div><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
          </section>

          <section className="content-grid"><article className="panel spending-panel"><div className="panel-header"><div><p className="eyebrow">THIS MONTH</p><h2>Spending overview</h2></div><button className="text-button">View report <span>→</span></button></div><div className="chart-area"><div className="chart-labels"><span>₹800</span><span>₹600</span><span>₹400</span><span>₹200</span><span>₹0</span></div><div className="chart"><div className="chart-grid"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 700 190" preserveAspectRatio="none" aria-label="Spending trend"><path d="M0 154 C45 145, 62 125, 105 136 S158 132, 196 145 S250 112, 288 120 S340 92, 378 115 S430 90, 470 102 S525 60, 564 82 S620 25, 700 52" /><path className="chart-fill" d="M0 154 C45 145, 62 125, 105 136 S158 132, 196 145 S250 112, 288 120 S340 92, 378 115 S430 90, 470 102 S525 60, 564 82 S620 25, 700 52 L700 190 L0 190 Z" /></svg><div className="chart-x"><span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Today</span></div></div></div></article><article className="panel categories-panel"><div className="panel-header"><div><p className="eyebrow">BREAKDOWN</p><h2>By category</h2></div><button className="kebab">•••</button></div><div className="donut-wrap"><div className="donut"><div><strong>₹1,142</strong><span>total</span></div></div><div className="legend"><Legend color="green" label="Groceries" amount="₹386" percent="34%" /><Legend color="coral" label="Dining" amount="₹284" percent="25%" /><Legend color="blue" label="Transport" amount="₹216" percent="19%" /><Legend color="violet" label="Subscriptions" amount="₹142" percent="12%" /><Legend color="yellow" label="Other" amount="₹114" percent="10%" /></div></div></article></section>

          <section className="panel expenses-panel"><div className="panel-header expenses-header"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Recent expenses</h2></div><button className="text-button">See all expenses <span>→</span></button></div><div className="filter-row"><div className="filters">{['All expenses', 'Groceries', 'Dining', 'Transport'].map((filter) => <button key={filter} className={activeFilter === filter ? 'filter active-filter' : 'filter'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><button className="filter-date">Last 30 days <span>⌄</span></button></div><div className="expense-table"><div className="table-row table-head"><span>MERCHANT</span><span>CATEGORY</span><span>DATE</span><span>AMOUNT</span><span /></div>{filteredExpenses.map((expense) => <div className="table-row" key={expense.id}><span className="merchant"><span className={`merchant-dot ${expense.color}`}>{expense.merchant.charAt(0)}</span><strong>{expense.merchant}</strong></span><span><span className={`category-dot ${expense.color}`} />{expense.category}</span><span className="muted">{expense.date}</span><strong className="amount">{formatCurrency(expense.amount)}</strong><button className="row-more">•••</button></div>)}</div></section>
        </div>
      </main>

      {isModalOpen && <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}><form className="modal" onSubmit={addExpense} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">NEW RECORD</p><h2>Add expense</h2></div><button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>×</button></div><label>Merchant<input autoFocus value={merchant} onChange={(event) => setMerchant(event.target.value)} placeholder="e.g. Corner Cafe" /></label><label>Amount<input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Groceries</option><option>Dining</option><option>Transport</option><option>Subscriptions</option><option>Health</option></select></label><button className="submit-button" type="submit">Save expense <span>→</span></button></form></div>}
    </div>
  )
}

function Legend({ color, label, amount, percent }: { color: string; label: string; amount: string; percent: string }) {
  return <div className="legend-row"><span><i className={`category-dot ${color}`} />{label}</span><strong>{amount} <small>{percent}</small></strong></div>
}

function categoryColor(category: string) {
  return ({ Groceries: 'green', Dining: 'coral', Transport: 'blue', Subscriptions: 'violet', Health: 'yellow' } as Record<string, string>)[category] ?? 'green'
}

export default App