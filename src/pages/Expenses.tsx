import React, { useState, FormEvent } from "react";
import { TrendingDown, TrendingUp, DollarSign, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";

const initialExpenses: any[] = [];

export default function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showAdd, setShowAdd] = useState(false);
  const [newExpense, setNewExpense] = useState({ date: "", category: "Utilities", amount: "", description: "" });

  // Mock total income from fees
  const totalIncome = 45000; 
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newExpense.date || !newExpense.amount) return;

    setExpenses([...expenses, {
      id: Date.now(),
      date: newExpense.date,
      category: newExpense.category,
      amount: parseInt(newExpense.amount),
      description: newExpense.description
    }]);
    
    setNewExpense({ date: "", category: "Utilities", amount: "", description: "" });
    setShowAdd(false);
    toast.success("Expense recorded successfully!");
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success("Expense deleted successfully");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(7, 24, 40, 0.06)' }}>
      <PageHero 
        title="Expense Management"
        subtitle="Track your daily expenses and view profit/loss"
        icon={TrendingDown}
        darkColor="#071828"
        badge="Expenses"
        pattern={
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="coins" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="6" fill="none" stroke="#1e40af" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#coins)" />
          </svg>
        }
      />
      <div className="max-w-6xl mx-auto pb-8 pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income (Fees)</p>
              <h3 className="text-2xl font-bold text-gray-900">৳{totalIncome.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900">৳{totalExpense.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Net Profit/Loss</p>
              <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ৳{netProfit.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAdd && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Record New Expense</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option>Rent</option>
                  <option>Utilities</option>
                  <option>Salary</option>
                  <option>Marketing</option>
                  <option>Office Supplies</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input type="number" required value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Brief details" />
              </div>
              <div className="md:col-span-4 flex justify-end mt-2">
                <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expense List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No expenses recorded yet.</td>
                  </tr>
                ) : (
                  expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                      <td className="px-6 py-4 text-sm font-medium text-rose-600">৳{expense.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-rose-600 transition-colors p-2">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
