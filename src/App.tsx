import { useTransactions } from './hooks/useTransactions'
import ExpenseForm from './components/ExpenseForm'
import TransactionList from './components/TransactionList'
import MonthlySummarySimple from './components/MonthlySummarySimple'
import { useState, useMemo } from 'react'

function App() {
  const { transactions, addTransaction, deleteTransaction, clearTransactions } = useTransactions()
  const [showMonthlyView, setShowMonthlyView] = useState(false)

  // Export to CSV function
  const exportToCSV = () => {
    console.log('Export button clicked, transactions:', transactions.length)

    if (transactions.length === 0) {
      alert('Chưa có giao dịch nào để xuất!')
      return
    }

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Create CSV content
    const headers = ['Ngày', 'Số tiền', 'Danh mục', 'Ghi chú']
    const rows = sortedTransactions.map(t => {
      const date = new Date(t.date)
      const dateStr = date.toLocaleDateString('vi-VN')
      const amount = t.amount.toLocaleString('vi-VN')
      const categoryMap: Record<string, string> = {
        'an-uong': 'Ăn uống',
        'hoc-phi': 'Học phí',
        'thuoc-men': 'Thuốc men',
        'tien-cho': 'Tiền chợ',
        'nha-cua': 'Nhà cửa',
        'khac': 'Khác'
      }
      const category = categoryMap[t.category] || t.category

      return [dateStr, amount, category, t.note || ''].join(',')
    })

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')

    // Create file with current date
    const today = new Date()
    const dateStr = today.toLocaleDateString('vi-VN').replace(/\//g, '_')
    const filename = `chi_tieu_thang_${dateStr}.csv`

    // Create and download file
    console.log('Creating CSV with filename:', filename)
    console.log('CSV content preview:', csvContent.substring(0, 100) + '...')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    console.log('Triggering download...')
    link.click()

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      console.log('Download completed and cleaned up')
    }, 100)
  }

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
      <div className="max-w-lg mx-auto px-4">
        {showMonthlyView ? (
          <MonthlySummarySimple transactions={transactions} />
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  Family Finance
                </h1>
                <p className="text-gray-600 text-sm">Quản lý chi tiêu gia đình</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  console.log('Button clicked via event handler')
                  exportToCSV()
                }}
                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium border border-amber-200 flex items-center gap-2"
                title="Xuất dữ liệu ra file CSV"
                type="button"
              >
                📥 Xuất ra file
              </button>
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

            {/* Transaction List */}
            <div className="mt-6">
              <TransactionList
                transactions={transactions.filter(t =>
                  new Date(t.date).toDateString() === new Date().toDateString()
                )}
                onDelete={deleteTransaction}
              />
            </div>
          </>
        )}

        {/* Footer Stats */}
        <div className="flex gap-2 justify-center mt-6">
          <button
            onClick={() => setShowMonthlyView(!showMonthlyView)}
            className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium border border-amber-200"
          >
            {showMonthlyView ? '📝 Ghi chép' : '📊 Báo cáo'}
          </button>
          <button
            onClick={() => setShowMonthlyView(true)}
            className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium border border-amber-200"
          >
            {showMonthlyView ? '📖 Xem lại' : '📝 Ghi chép'}
          </button>
        </div>
        {transactions.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Tổng {transactions.length} giao dịch đã ghi nhận
            </p>
          </div>
        )}

        {/* Security & Privacy Info */}
        <div className="mt-8 bg-amber-50 rounded-lg p-4 text-center">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">🔒 Bảo Mật & An Toàn</h4>
          <div className="text-xs text-amber-700 space-y-1">
            <p>• <strong>Offline-only:</strong> Dữ liệu chỉ trong điện thoại của bạn</p>
            <p>• <strong>Không lên server:</strong> Không ai xem được kể cả khi mất mạng</p>
            <p>• <strong>Xóa = Mất vĩnh viễn:</strong> Như đốt cuốn sổ</p>
            <p>• <strong>An toàn:</strong> Hãy xuất CSV để sao lưu dữ liệu</p>
            <button
              onClick={clearTransactions}
              className="mt-3 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium transition-colors"
            >
              🗑️ Xóa toàn bộ dữ liệu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App