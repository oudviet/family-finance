import ExpenseForm from './components/ExpenseForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Family Finance
        </h1>
        <ExpenseForm />
      </div>
    </div>
  )
}

export default App