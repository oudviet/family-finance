import React, { useMemo } from 'react'
import { Transaction } from '../hooks/useTransactions'

interface MonthlySummaryProps {
  transactions: Transaction[]
  budgetLimits?: Record<string, number>
}

const categoryConfig = {
  'an-uong': { icon: '🍲', label: 'Ăn uống', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'hoc-phi': { icon: '📚', label: 'Học phí', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'thuoc-men': { icon: '💊', label: 'Thuốc men', color: 'bg-green-100 text-green-700 border-green-200' },
  'tien-cho': { icon: '🛒', label: 'Tiền chợ', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'nha-cua': { icon: '🏠', label: 'Nhà cửa', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'khac': { icon: '📌', label: 'Khác', color: 'bg-gray-100 text-gray-700 border-gray-200' }
}

const MonthlySummarySimple: React.FC<MonthlySummaryProps> = ({ transactions, budgetLimits = {} }) => {
  const currentMonth = useMemo(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      name: now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
    }
  }, [])

  const monthTransactions = useMemo(() => {
    const startOfMonth = new Date(currentMonth.year, currentMonth.month, 1)
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return (
        transactionDate.getFullYear() === currentMonth.year &&
        transactionDate.getMonth() === currentMonth.month
      )
    })
  }, [transactions, currentMonth])

  const monthTotal = useMemo(() => {
    return monthTransactions.reduce((sum, t) => sum + t.amount, 0)
  }, [monthTransactions])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const dailyAverage = monthTotal / 30
  const projectedMonthly = dailyAverage * 31

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Báo cáo tháng {currentMonth.name}
        </h3>
      </div>

      {/* Monthly Total */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Tổng chi tiêu</p>
          <p className="text-4xl font-bold text-gray-900 ink-effect">
            {formatCurrency(monthTotal)}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <p>Trung bình: {formatCurrency(dailyAverage)}/ngày</p>
            <p>Dự kiến tháng tới: {formatCurrency(projectedMonthly)}</p>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="px-6 py-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🏆</span>
          Top 5 chi tiêu nhiều nhất
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(
            monthTransactions.reduce((acc, t) => {
              acc[t.category] = (acc[t.category] || 0) + t.amount
              return acc
            }, {} as Record<string, number>)
          ).sort(([, a], [, b]) => b.amount - a.amount)
          .slice(0, 5)
          .map(([category, amount], index) => {
            const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.khac
            const categoryName = config.label

            return (
              <div
                key={category}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-gray-600">{config.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {categoryName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(amount)} ({((amount / monthTotal) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Dựa trên {monthTransactions.length} giao dịch trong tháng {currentMonth.name}
        </p>
      </div>
    </div>
  )
}

export default MonthlySummarySimple