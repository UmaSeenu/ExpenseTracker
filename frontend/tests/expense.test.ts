import { describe, expect, it } from 'vitest'
import { addExpenseToList, Expense } from '../src/App'

const existingExpense: Expense = {
  id: 1,
  merchant: 'Existing expense',
  category: 'Groceries',
  date: 'Aug 22, 2026',
  amount: 20,
  color: 'green',
}

describe('addExpenseToList', () => {
  it('adds a valid expense to the beginning of the list', () => {
    const expenses = addExpenseToList([existingExpense], 'Corner Cafe', '125.50', 'Dining')

    expect(expenses).toHaveLength(2)
    expect(expenses[0]).toMatchObject({ merchant: 'Corner Cafe', amount: 125.5, category: 'Dining', color: 'coral' })
  })

  it('rejects an empty merchant or non-positive amount', () => {
    expect(addExpenseToList([existingExpense], '', '50', 'Dining')).toEqual([existingExpense])
    expect(addExpenseToList([existingExpense], 'Corner Cafe', '0', 'Dining')).toEqual([existingExpense])
  })
})