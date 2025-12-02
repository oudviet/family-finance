import { useTransactions } from './hooks/useTransactions'
import ExpenseForm from './components/ExpenseForm'
import { useMemo } from 'react'

function App() {
  const { transactions, addTransaction } = useTransactions()

  // Calculate today's total
  const todayTotal = useMemo(() => {
    const today = new Date().toDateString()
    return transactions
      .filter(transaction => {
        return new Date(transaction.date).toDateString() === today
      })
      .reduce((total, transaction) => total + transaction.amount, 0)
  }, [transactions])

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Family Finance
          </h1>
          <p className="text-gray-600 text-sm">Quản lý chi tiêu gia đình</p>
        </div>

        {/* Today's Total Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-4">
            <p className="text-white text-sm font-medium">Tổng chi hôm nay</p>
            <p className="text-white text-3xl font-bold mt-1">
              {formatCurrency(todayTotal)}
            </p>
          </div>
          <div className="px-6 py-3 bg-orange-50">
            <p className="text-xs text-orange-600">
              {transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).length} giao dịch hôm nay
            </p>
          </div>
        </div>

        {/* Expense Form */}
        <ExpenseForm onAdd={addTransaction} />

        {/* Footer Stats */}
        {transactions.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Tổng {transactions.length} giao dịch đã ghi nhận
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App