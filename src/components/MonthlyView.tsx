import React, { useState, useMemo } from 'react'
import { Transaction } from '../hooks/useTransactions'
import { playChing } from '../hooks/useSounds'

type PageType = 'today' | 'yesterday' | 'week' | 'month'

interface MonthlyViewProps {
  transactions: Transaction[]
}

const categoryConfig = {
  'an-uong': { icon: '🍲', label: 'Ăn uống' },
  'hoc-phi': { icon: '📚', label: 'Học phí' },
  'thuoc-men': { icon: '💊', label: 'Thuốc men' },
  'tien-cho': { icon: '🛒', label: 'Tiền chợ' },
  'nha-cua': { icon: '🏠', label: 'Nhà cửa' },
  'khac': { icon: '📌', label: 'Khác' }
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('today')

  // Calculate data for different time periods
  const todayTransactions = useMemo(() => {
    const today = new Date().toDateString()
    return transactions.filter(t => new Date(t.date).toDateString() === today)
  }, [transactions])

  const yesterdayTransactions = useMemo(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return transactions.filter(t => new Date(t.date).toDateString() === yesterday.toDateString())
  }, [transactions])

  const weekTransactions = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return transactions.filter(t => new Date(t.date) >= weekAgo)
  }, [transactions])

  const monthTransactions = useMemo(() => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return transactions.filter(t => new Date(t.date) >= monthAgo)
  }, [transactions])

  const getCurrentTransactions = () => {
    switch (currentPage) {
      case 'today': return todayTransactions
      case 'yesterday': return yesterdayTransactions
      case 'week': return weekTransactions
      case 'month': return monthTransactions
      default: return todayTransactions
    }
  }

  const calculateTotal = (trans: Transaction[]) => {
    return trans.reduce((sum, t) => sum + t.amount, 0)
  }

  const getCategoryTotals = (trans: Transaction[]) => {
    const totals: Record<string, number> = {}
    trans.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
    return totals
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} phút trước`
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return `${hours} tiếng${mins > 0 ? ` ${mins} phút` : ''} trước`
    } else {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handlePageChange = (page: PageType) => {
    if (page === currentPage) return

    playChing()
    setCurrentPage(page)
  }

  const currentTransactions = getCurrentTransactions()
  const currentTotal = calculateTotal(currentTransactions)
  const categoryTotals = getCategoryTotals(currentTransactions)

  const pages = [
    { id: 'today', label: 'Hôm nay', icon: '📅', count: todayTransactions.length },
    { id: 'yesterday', label: 'Hôm qua', icon: '📆', count: yesterdayTransactions.length },
    { id: 'week', label: 'Tuần này', icon: '📅', count: weekTransactions.length },
    { id: 'month', label: 'Tháng này', icon: '📆', count: monthTransactions.length }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden animate-page-flip">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📖</span>
          Sổ chi tiêu gia đình
        </h3>
      </div>

      {/* Page Navigation */}
      <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page.id as PageType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page.id
                    ? 'bg-white text-orange-600 shadow-md border border-orange-200'
                    : 'text-gray-600 hover:bg-orange-100 border border-transparent'
                }`}
              >
                <span className="mr-2">{page.icon}</span>
                {page.label}
                {page.count > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-200 text-orange-700 rounded-full">
                    {page.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            <span className="px-2 py-1 bg-white rounded border border-gray-200">
              {currentPage === 'today' ? formatDate(new Date().toISOString()) :
               currentPage === 'yesterday' ? formatDate(yesterdayTransactions[0]?.date || new Date().toISOString()) :
               weekTransactions[0]?.date || new Date().toISOString()}
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="px-6 py-4">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6 page-curl">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {currentPage === 'today' ? 'Tổng chi hôm nay' :
                 currentPage === 'yesterday' ? 'Tổng chi hôm qua' :
                 currentPage === 'week' ? 'Tổng chi tuần này' : 'Tổng chi tháng này'}
            </p>
            <p className="text-3xl font-bold text-gray-900 ink-effect">
              {formatCurrency(currentTotal)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {currentTransactions.length} giao dịch
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(categoryTotals).map(([category, amount]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.khac
            const percentage = currentTotal > 0 ? ((amount / currentTotal) * 100).toFixed(1) : '0'

            return (
              <div key={category} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="font-medium text-sm text-gray-700">{config.label}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
                  <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {currentTransactions.map((transaction) => {
            const config = categoryConfig[transaction.category as keyof typeof categoryConfig] || categoryConfig.khac

            return (
              <div
                key={transaction.id}
                className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 paper-texture"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white shadow-sm border border-orange-200">
                  {config.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{config.label}</span>
                    <span className="text-xs text-gray-400">{formatTime(transaction.date)}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MonthlyView