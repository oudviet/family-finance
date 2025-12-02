import React, { useState } from 'react'
import { playTin } from '../hooks/useSounds'

interface ExpenseData {
  amount: string
  category: string
}

interface Expense {
  id?: string
  amount: number
  category: string
  timestamp?: Date
}

interface ExpenseFormProps {
  onAdd?: (expense: Omit<Expense, 'id' | 'timestamp'>) => void
}

const ExpenseForm = ({ onAdd }: ExpenseFormProps) => {
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    amount: '',
    category: ''
  })
  const [errors, setErrors] = useState<Partial<ExpenseData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'an-uong', label: 'Ăn uống' },
    { value: 'hoc-phi', label: 'Học phí' },
    { value: 'thuoc-men', label: 'Thuốc men' },
    { value: 'tien-cho', label: 'Tiền chợ' },
    { value: 'nha-cua', label: 'Nhà cửa' },
    { value: 'khac', label: 'Khác' }
  ]

  // Custom form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseData> = {}

    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền lớn hơn 0'
    }

    if (!expenseData.category) {
      newErrors.category = 'Vui lòng chọn danh mục'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof ExpenseData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newExpense: Omit<Expense, 'id' | 'timestamp'> = {
        amount: parseFloat(expenseData.amount),
        category: expenseData.category
      }

      // Call parent callback if provided
      if (onAdd) {
        await onAdd(newExpense)
      } else {
        // Fallback behavior for standalone usage
        const categoryName = categories.find(cat => cat.value === expenseData.category)?.label
        console.log('Expense submitted:', { ...newExpense, categoryName })
        alert(`Đã thêm chi tiêu: ${newExpense.amount.toLocaleString('vi-VN')} VNĐ - ${categoryName}`)
      }

      // Play success sound
      playTin()

      // Reset form
      setExpenseData({
        amount: '',
        category: ''
      })
      setErrors({})

    } catch (error) {
      console.error('Error adding expense:', error)
      alert('Có lỗi xảy ra khi thêm chi tiêu. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Enter key submission on amount field
  const handleAmountKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && expenseData.amount && expenseData.category) {
      handleSubmit(e as any)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Thêm Chi Tiêu Mới</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Money Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Số tiền (VNĐ)
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              value={expenseData.amount}
              onChange={handleInputChange}
              onKeyPress={handleAmountKeyPress}
              placeholder="0"
              min="0"
              step="1000"
              className={`w-full px-4 py-2 border rounded-md outline-none transition-colors pr-8 ${
                errors.amount
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
              disabled={isSubmitting}
            />
            <span className="absolute right-3 top-2.5 text-gray-500">₫</span>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            id="category"
            name="category"
            value={expenseData.category}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
              errors.category
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
            disabled={isSubmitting}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang thêm...' : 'Thêm Chi Tiêu'}
        </button>
      </form>

      {/* Help text */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Nhập số tiền và nhấn Enter để nhanh chóng thêm chi tiêu</p>
      </div>
    </div>
  )
}

export default ExpenseForm