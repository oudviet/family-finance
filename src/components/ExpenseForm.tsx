import React, { useState } from 'react'

interface ExpenseData {
  amount: string
  category: string
}

const ExpenseForm = () => {
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    amount: '',
    category: ''
  })

  const categories = [
    { value: 'food', label: 'Thực phẩm' },
    { value: 'transport', label: 'Di chuyển' },
    { value: 'utilities', label: 'Hóa đơn' },
    { value: 'entertainment', label: 'Giải trí' },
    { value: 'healthcare', label: 'Chăm sóc sức khỏe' },
    { value: 'shopping', label: 'Mua sắm' },
    { value: 'education', label: 'Giáo dục' },
    { value: 'other', label: 'Khác' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expenseData.amount || !expenseData.category) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    console.log('Expense submitted:', expenseData)

    // Here you would typically send the data to an API or parent component
    alert(`Đã thêm chi tiêu: ${expenseData.amount} VNĐ - ${categories.find(cat => cat.value === expenseData.category)?.label}`)

    // Reset form
    setExpenseData({
      amount: '',
      category: ''
    })
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
              placeholder="0"
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500">₫</span>
          </div>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-colors font-medium"
        >
          Thêm Chi Tiêu
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm