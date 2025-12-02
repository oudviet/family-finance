import React, { useState } from 'react'
import { Transaction } from '../hooks/useTransactions'
import { playShing } from '../hooks/useSounds'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
}

const categoryConfig = {
  'an-uong': {
    icon: '🍲',
    color: 'bg-orange-100 text-orange-700',
    label: 'Ăn uống'
  },
  'hoc-phi': {
    icon: '📚',
    color: 'bg-blue-100 text-blue-700',
    label: 'Học phí'
  },
  'thuoc-men': {
    icon: '💊',
    color: 'bg-green-100 text-green-700',
    label: 'Thuốc men'
  },
  'tien-cho': {
    icon: '🛒',
    color: 'bg-yellow-100 text-yellow-700',
    label: 'Tiền chợ'
  },
  'nha-cua': {
    icon: '🏠',
    color: 'bg-purple-100 text-purple-700',
    label: 'Nhà cửa'
  },
  'khac': {
    icon: '📌',
    color: 'bg-gray-100 text-gray-700',
    label: 'Khác'
  }
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`

  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60

  if (hours < 24) {
    return hours === 1 ? '1 tiếng trước' : `${hours} tiếng${mins > 0 ? ` ${mins} phút` : ''} trước`
  }

  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Sort transactions by time (newest first)
  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sortedTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 text-center">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-gray-500 text-sm mb-1">Chưa có giao dịch hôm nay</p>
        <p className="text-gray-400 text-xs">Ghi chép khoản chi tiêu đầu tiên nào</p>
      </div>
    )
  }

  const handleDelete = (id: string) => {
    // Play delete sound
    playShing()

    if (onDelete) {
      onDelete(id)
      setShowDeleteConfirm(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Chi tiêu hôm nay
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {sortedTransactions.map((transaction) => {
          const config = categoryConfig[transaction.category as keyof typeof categoryConfig] || categoryConfig.khac

          return (
            <div
              key={transaction.id}
              className="px-6 py-4 hover:bg-amber-50 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${config.color} flex-shrink-0`}>
                    {config.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(transaction.date)}
                      </span>
                    </div>

                    {transaction.note && (
                      <p className="text-xs text-gray-500 mb-1 italic">
                        "{transaction.note}"
                      </p>
                    )}

                    <p className="font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>

                {onDelete && (
                  <div className="flex items-center gap-2">
                    {showDeleteConfirm === transaction.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded"
                        >
                          Xóa
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(transaction.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xs px-2 py-1"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline dot */}
              <div className="absolute left-4 top-8 w-0.5 h-4 bg-amber-200"></div>
            </div>
          )
        })}
      </div>

      {/* Total summary */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Tổng cộng ({sortedTransactions.length} khoản)
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(
              sortedTransactions.reduce((sum, t) => sum + t.amount, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TransactionList