"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Target,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Gamepad2,
  Heart,
  Shirt,
  Zap,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react"

interface Transaction {
  id: number
  amount: number
  date: string
  description: string
  category: string
}

interface Budget {
  id: number
  category: string
  amount: number
  month: string
}

// Predefined categories with icons
const categories = [
  { name: "Groceries", icon: ShoppingCart, color: "#ef4444" },
  { name: "Rent", icon: Home, color: "#dc2626" },
  { name: "Transportation", icon: Car, color: "#b91c1c" },
  { name: "Dining", icon: Utensils, color: "#991b1b" },
  { name: "Entertainment", icon: Gamepad2, color: "#7f1d1d" },
  { name: "Healthcare", icon: Heart, color: "#fbbf24" },
  { name: "Shopping", icon: Shirt, color: "#f59e0b" },
  { name: "Utilities", icon: Zap, color: "#d97706" },
  { name: "Other", icon: MoreHorizontal, color: "#a3a3a3" },
]

// Mock initial data
const initialTransactions: Transaction[] = [
  { id: 1, amount: 1200, date: "2024-01-01", description: "Monthly rent payment", category: "Rent" },
  { id: 2, amount: 300, date: "2024-01-05", description: "Grocery shopping", category: "Groceries" },
  { id: 3, amount: 150, date: "2024-01-10", description: "Electricity bill", category: "Utilities" },
  { id: 4, amount: 80, date: "2024-01-15", description: "Gas station", category: "Transportation" },
  { id: 5, amount: 200, date: "2024-01-20", description: "Restaurant dinner", category: "Dining" },
  { id: 6, amount: 120, date: "2024-01-22", description: "Movie tickets", category: "Entertainment" },
  { id: 7, amount: 75, date: "2024-01-25", description: "Pharmacy", category: "Healthcare" },
  { id: 8, amount: 250, date: "2024-02-01", description: "New clothes", category: "Shopping" },
  { id: 9, amount: 180, date: "2024-02-05", description: "Weekly groceries", category: "Groceries" },
  { id: 10, amount: 90, date: "2024-02-08", description: "Internet bill", category: "Utilities" },
]

const initialBudgets: Budget[] = [
  { id: 1, category: "Groceries", amount: 400, month: "2024-02" },
  { id: 2, category: "Rent", amount: 1200, month: "2024-02" },
  { id: 3, category: "Transportation", amount: 200, month: "2024-02" },
  { id: 4, category: "Dining", amount: 300, month: "2024-02" },
  { id: 5, category: "Entertainment", amount: 150, month: "2024-02" },
  { id: 6, category: "Utilities", amount: 200, month: "2024-02" },
]

export default function FinanceTrackerWithBudgets() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false)
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editingBudget, setBudget] = useState<Budget | null>(null)
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
  })
  const [budgetForm, setBudgetForm] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Get current month for budget analysis
  const currentMonth = new Date().toISOString().slice(0, 7)

  // Calculate metrics
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalBudget = budgets.filter((b) => b.month === currentMonth).reduce((sum, b) => sum + b.amount, 0)

  // Get category breakdown for current month
  const getCurrentMonthTransactions = () => {
    return transactions.filter((t) => t.date.slice(0, 7) === currentMonth)
  }

  const getCategoryBreakdown = () => {
    const currentMonthTransactions = getCurrentMonthTransactions()
    const categoryTotals: Record<string, number> = {}

    currentMonthTransactions.forEach((transaction) => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0
      }
      categoryTotals[transaction.category] += transaction.amount
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => {
        const category = categories.find((c) => c.name === name)
        return {
          name,
          value,
          color: category?.color || "#a3a3a3",
        }
      })
      .sort((a, b) => b.value - a.value)
  }

  // Get budget vs actual data
  const getBudgetVsActual = () => {
    const currentMonthTransactions = getCurrentMonthTransactions()
    const currentMonthBudgets = budgets.filter((b) => b.month === currentMonth)

    const actualSpending: Record<string, number> = {}
    currentMonthTransactions.forEach((t) => {
      actualSpending[t.category] = (actualSpending[t.category] || 0) + t.amount
    })

    return currentMonthBudgets.map((budget) => ({
      category: budget.category,
      budget: budget.amount,
      actual: actualSpending[budget.category] || 0,
      remaining: Math.max(0, budget.amount - (actualSpending[budget.category] || 0)),
      overBudget: (actualSpending[budget.category] || 0) > budget.amount,
    }))
  }

  // Calculate monthly expenses for chart
  const getMonthlyExpenses = () => {
    const monthlyData: Record<string, number> = {}

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0
      }
      monthlyData[monthName] += transaction.amount
    })

    return Object.entries(monthlyData).map(([month, expenses]) => ({
      month,
      expenses,
    }))
  }

  // Get spending insights
  const getSpendingInsights = () => {
    const budgetVsActual = getBudgetVsActual()
    const overBudgetCategories = budgetVsActual.filter((item) => item.overBudget)
    const underBudgetCategories = budgetVsActual.filter((item) => !item.overBudget && item.actual > 0)
    const unusedBudgets = budgetVsActual.filter((item) => item.actual === 0)

    const totalActualSpending = budgetVsActual.reduce((sum, item) => sum + item.actual, 0)
    const totalBudgetAmount = budgetVsActual.reduce((sum, item) => sum + item.budget, 0)
    const budgetUtilization = totalBudgetAmount > 0 ? (totalActualSpending / totalBudgetAmount) * 100 : 0

    return {
      overBudgetCategories,
      underBudgetCategories,
      unusedBudgets,
      budgetUtilization,
      totalSavings: Math.max(0, totalBudgetAmount - totalActualSpending),
    }
  }

  const validateTransactionForm = () => {
    const newErrors: Record<string, string> = {}

    if (!transactionForm.amount || Number.parseFloat(transactionForm.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    if (!transactionForm.date) {
      newErrors.date = "Date is required"
    }

    if (!transactionForm.description.trim()) {
      newErrors.description = "Description is required"
    } else if (transactionForm.description.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters"
    }

    if (!transactionForm.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateBudgetForm = () => {
    const newErrors: Record<string, string> = {}

    if (!budgetForm.category) {
      newErrors.category = "Category is required"
    }

    if (!budgetForm.amount || Number.parseFloat(budgetForm.amount) <= 0) {
      newErrors.amount = "Budget amount must be greater than 0"
    }

    if (!budgetForm.month) {
      newErrors.month = "Month is required"
    }

    // Check if budget already exists for this category and month
    const existingBudget = budgets.find(
      (b) =>
        b.category === budgetForm.category &&
        b.month === budgetForm.month &&
        (!editingBudget || b.id !== editingBudget.id),
    )
    if (existingBudget) {
      newErrors.category = "Budget already exists for this category and month"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateTransactionForm()) {
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTransaction: Transaction = {
        id: Date.now(),
        amount: Number.parseFloat(transactionForm.amount),
        date: transactionForm.date,
        description: transactionForm.description.trim(),
        category: transactionForm.category,
      }

      setTransactions((prev) => [newTransaction, ...prev])
      setTransactionForm({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "",
      })
      setErrors({})
      setIsAddTransactionOpen(false)
    } catch (error) {
      setErrors({ submit: "Failed to add transaction. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateBudgetForm()) {
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newBudget: Budget = {
        id: Date.now(),
        category: budgetForm.category,
        amount: Number.parseFloat(budgetForm.amount),
        month: budgetForm.month,
      }

      setBudgets((prev) => [newBudget, ...prev])
      setBudgetForm({
        category: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
      })
      setErrors({})
      setIsAddBudgetOpen(false)
    } catch (error) {
      setErrors({ submit: "Failed to add budget. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setTransactionForm({
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
    })
    setErrors({})
    setIsEditTransactionOpen(true)
  }

  const handleEditBudget = (budget: Budget) => {
    setBudget(budget)
    setBudgetForm({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
    })
    setErrors({})
    setIsEditBudgetOpen(true)
  }

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateTransactionForm() || !editingTransaction) {
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedTransaction: Transaction = {
        ...editingTransaction,
        amount: Number.parseFloat(transactionForm.amount),
        date: transactionForm.date,
        description: transactionForm.description.trim(),
        category: transactionForm.category,
      }

      setTransactions((prev) => prev.map((t) => (t.id === editingTransaction.id ? updatedTransaction : t)))

      setTransactionForm({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "",
      })
      setErrors({})
      setEditingTransaction(null)
      setIsEditTransactionOpen(false)
    } catch (error) {
      setErrors({ submit: "Failed to update transaction. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateBudgetForm() || !editingBudget) {
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedBudget: Budget = {
        ...editingBudget,
        category: budgetForm.category,
        amount: Number.parseFloat(budgetForm.amount),
        month: budgetForm.month,
      }

      setBudgets((prev) => prev.map((b) => (b.id === editingBudget.id ? updatedBudget : b)))

      setBudgetForm({
        category: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
      })
      setErrors({})
      setBudget(null)
      setIsEditBudgetOpen(false)
    } catch (error) {
      setErrors({ submit: "Failed to update budget. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      alert("Failed to delete transaction. Please try again.")
    }
  }

  const handleDeleteBudget = async (id: number) => {
    if (!confirm("Are you sure you want to delete this budget?")) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setBudgets((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      alert("Failed to delete budget. Please try again.")
    }
  }

  const categoryBreakdown = getCategoryBreakdown()
  const monthlyExpenses = getMonthlyExpenses()
  const budgetVsActual = getBudgetVsActual()
  const spendingInsights = getSpendingInsights()
  const recentTransactions = transactions.slice(0, 5)

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    const IconComponent = category?.icon || MoreHorizontal
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
            <p className="text-muted-foreground">Track expenses and manage budgets by category</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Set Monthly Budget</DialogTitle>
                  <DialogDescription>Set a spending limit for a category this month.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddBudget} className="space-y-4">
                  {errors.submit && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="budget-category">Category</Label>
                    <Select
                      value={budgetForm.category}
                      onValueChange={(value) => setBudgetForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget-amount">Budget Amount ($)</Label>
                    <Input
                      id="budget-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm((prev) => ({ ...prev, amount: e.target.value }))}
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget-month">Month</Label>
                    <Input
                      id="budget-month"
                      type="month"
                      value={budgetForm.month}
                      onChange={(e) => setBudgetForm((prev) => ({ ...prev, month: e.target.value }))}
                      className={errors.month ? "border-red-500" : ""}
                    />
                    {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Setting..." : "Set Budget"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddBudgetOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>Enter the details for your new expense transaction.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  {errors.submit && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={transactionForm.category}
                      onValueChange={(value) => setTransactionForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={transactionForm.date}
                      onChange={(e) => setTransactionForm((prev) => ({ ...prev, date: e.target.value }))}
                      className={errors.date ? "border-red-500" : ""}
                    />
                    {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter transaction description..."
                      value={transactionForm.description}
                      onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                      className={errors.description ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Adding..." : "Add Transaction"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddTransactionOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    $
                    {getCurrentMonthTransactions()
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {spendingInsights.budgetUtilization.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Of total budget</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${spendingInsights.totalSavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Left to spend</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget vs Actual Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Actual</CardTitle>
                  <CardDescription>Compare your spending to budgets this month</CardDescription>
                </CardHeader>
                <CardContent>
                  {budgetVsActual.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={budgetVsActual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            `$${Number(value).toLocaleString()}`,
                            name === "budget" ? "Budget" : "Actual",
                          ]}
                        />
                        <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                        <Bar dataKey="actual" fill="#ef4444" name="Actual" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      <div className="text-center">
                        <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No budgets set</p>
                        <p className="text-sm">Set your first budget to see comparisons</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>This month's spending breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryBreakdown.length > 0 ? (
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                      <div className="text-center">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No expenses this month</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No transactions yet</p>
                      <p className="text-sm">Add your first transaction to get started</p>
                    </div>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-red-100 text-red-600">
                            {getCategoryIcon(transaction.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.category} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="font-semibold text-red-600">${transaction.amount.toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Manage your monthly category budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetVsActual.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No budgets set for this month</p>
                      <p className="text-sm">Set your first budget to start tracking</p>
                    </div>
                  ) : (
                    budgetVsActual.map((item) => (
                      <div key={item.category} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(item.category)}
                            <span className="font-medium">{item.category}</span>
                            {item.overBudget && (
                              <Badge variant="destructive" className="text-xs">
                                Over Budget
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const budget = budgets.find(
                                  (b) => b.category === item.category && b.month === currentMonth,
                                )
                                if (budget) handleEditBudget(budget)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const budget = budgets.find(
                                  (b) => b.category === item.category && b.month === currentMonth,
                                )
                                if (budget) handleDeleteBudget(budget.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Spent: ${item.actual.toLocaleString()}</span>
                            <span>Budget: ${item.budget.toLocaleString()}</span>
                          </div>
                          <Progress
                            value={Math.min((item.actual / item.budget) * 100, 100)}
                            className={`h-2 ${item.overBudget ? "bg-red-100" : "bg-green-100"}`}
                          />
                          <div className="text-xs text-muted-foreground">
                            {item.overBudget
                              ? `$${(item.actual - item.budget).toLocaleString()} over budget`
                              : `$${item.remaining.toLocaleString()} remaining`}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spending Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending Status</CardTitle>
                  <CardDescription>How you're doing with your budgets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {spendingInsights.overBudgetCategories.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Over Budget</span>
                      </div>
                      {spendingInsights.overBudgetCategories.map((category) => (
                        <div key={category.category} className="flex justify-between text-sm">
                          <span>{category.category}</span>
                          <span className="text-red-600">+${(category.actual - category.budget).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {spendingInsights.underBudgetCategories.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">On Track</span>
                      </div>
                      {spendingInsights.underBudgetCategories.map((category) => (
                        <div key={category.category} className="flex justify-between text-sm">
                          <span>{category.category}</span>
                          <span className="text-green-600">${category.remaining.toLocaleString()} left</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {spendingInsights.unusedBudgets.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Settings className="w-4 h-4" />
                        <span className="font-medium">Unused Budgets</span>
                      </div>
                      {spendingInsights.unusedBudgets.map((category) => (
                        <div key={category.category} className="flex justify-between text-sm">
                          <span>{category.category}</span>
                          <span className="text-blue-600">${category.budget.toLocaleString()} available</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending Trend</CardTitle>
                  <CardDescription>Your spending over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyExpenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyExpenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Expenses"]}
                          labelStyle={{ color: "#000" }}
                        />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                      <div className="text-center">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No spending data</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Simple Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
                <CardDescription>Simple recommendations based on your spending patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {spendingInsights.budgetUtilization > 90 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You've used {spendingInsights.budgetUtilization.toFixed(1)}% of your total budget this month.
                        Consider reviewing your spending.
                      </AlertDescription>
                    </Alert>
                  )}

                  {spendingInsights.overBudgetCategories.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You're over budget in {spendingInsights.overBudgetCategories.length} categor
                        {spendingInsights.overBudgetCategories.length === 1 ? "y" : "ies"}. Consider adjusting your
                        spending or increasing these budgets.
                      </AlertDescription>
                    </Alert>
                  )}

                  {spendingInsights.totalSavings > 0 && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Great job! You have ${spendingInsights.totalSavings.toLocaleString()} left in your budget this
                        month.
                      </AlertDescription>
                    </Alert>
                  )}

                  {spendingInsights.unusedBudgets.length > 0 && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        You have {spendingInsights.unusedBudgets.length} unused budget
                        {spendingInsights.unusedBudgets.length === 1 ? "" : "s"}. Consider reallocating funds or
                        adjusting your budgets.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No transactions yet</p>
                      <p className="text-sm">Add your first transaction to get started</p>
                    </div>
                  ) : (
                    transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-red-100 text-red-600">
                            {getCategoryIcon(transaction.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.category} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="font-semibold text-red-600">${transaction.amount.toLocaleString()}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleEditTransaction(transaction)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteTransaction(transaction.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Transaction Dialog */}
        <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>Update the details for this transaction.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateTransaction} className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount ($)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={transactionForm.category}
                  onValueChange={(value) => setTransactionForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, date: e.target.value }))}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter transaction description..."
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Transaction"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditTransactionOpen(false)
                    setEditingTransaction(null)
                    setTransactionForm({
                      amount: "",
                      date: new Date().toISOString().split("T")[0],
                      description: "",
                      category: "",
                    })
                    setErrors({})
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Budget Dialog */}
        <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
              <DialogDescription>Update the budget for this category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateBudget} className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-budget-category">Category</Label>
                <Select
                  value={budgetForm.category}
                  onValueChange={(value) => setBudgetForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-budget-amount">Budget Amount ($)</Label>
                <Input
                  id="edit-budget-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-budget-month">Month</Label>
                <Input
                  id="edit-budget-month"
                  type="month"
                  value={budgetForm.month}
                  onChange={(e) => setBudgetForm((prev) => ({ ...prev, month: e.target.value }))}
                  className={errors.month ? "border-red-500" : ""}
                />
                {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Budget"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditBudgetOpen(false)
                    setBudget(null)
                    setBudgetForm({
                      category: "",
                      amount: "",
                      month: new Date().toISOString().slice(0, 7),
                    })
                    setErrors({})
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
