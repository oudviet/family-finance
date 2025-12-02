import { useState, useEffect } from 'react'

// Transaction interface
export interface Transaction {
  id: string
  amount: number
  category: string
  date: string // ISO string
  note?: string
}

// Hook return type
export interface UseTransactionsReturn {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void
  deleteTransaction: (id: string) => void
  clearTransactions: () => void
}

// Storage key for localStorage
const STORAGE_KEY = 'transactions_v1'

// Helper function to generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Helper function to load transactions from localStorage
const loadTransactions = (): Transaction[] => {
  try {
    if (typeof window === 'undefined') {
      return []
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored) as Transaction[]

    // Validate and filter invalid transactions
    return parsed.filter((transaction): transaction is Transaction => {
      return (
        transaction &&
        typeof transaction.id === 'string' &&
        typeof transaction.amount === 'number' &&
        typeof transaction.category === 'string' &&
        typeof transaction.date === 'string' &&
        (transaction.note === undefined || typeof transaction.note === 'string')
      )
    })
  } catch (error) {
    console.error('Error loading transactions from localStorage:', error)
    return []
  }
}

// Helper function to save transactions to localStorage
const saveTransactions = (transactions: Transaction[]): void => {
  try {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error)
  }
}

// Main hook
export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage on component mount
  useEffect(() => {
    const initialTransactions = loadTransactions()
    setTransactions(initialTransactions)
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever transactions change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveTransactions(transactions)
    }
  }, [transactions, isInitialized])

  // Add a new transaction
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>): void => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      date: new Date().toISOString()
    }

    setTransactions(prev => [...prev, newTransaction])
  }

  // Delete a specific transaction
  const deleteTransaction = (id: string): void => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  // Clear all transactions
  const clearTransactions = (): void => {
    try {
      if (typeof window === 'undefined') {
        return
      }

      localStorage.removeItem(STORAGE_KEY)
      setTransactions([])
    } catch (error) {
      console.error('Error clearing transactions from localStorage:', error)
    }
  }

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    clearTransactions
  }
}