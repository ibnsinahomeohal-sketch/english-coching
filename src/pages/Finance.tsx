import React, { useState, useEffect } from "react";
import { Wallet, CreditCard, Receipt, ScanLine, Loader2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function Finance() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setIsLoading(true);
    try {
      // Fetch Income from Students
      const { data: studentsData } = await supabase.from('students').select('paid_amount, name');
      const income = (studentsData || []).reduce((acc, curr) => acc + (curr.paid_amount || 0), 0);
      setTotalIncome(income);

      // Fetch Expenses
      const { data: expensesData } = await supabase.from('expenses').select('*').order('date', { ascending: false });
      const expense = (expensesData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
      setTotalExpense(expense);

      // Combine for recent transactions
      const incomeTransactions = (studentsData || []).map(s => ({
        date: "N/A", // Date not available without created_at column
        description: `Fee from ${s.name}`,
        type: 'income',
        amount: s.paid_amount || 0
      }));

      const expenseTransactions = (expensesData || []).map(e => ({
        date: e.date,
        description: e.description || e.category,
        type: 'expense',
        amount: e.amount
      }));

      const allTransactions = [...incomeTransactions, ...expenseTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
      setRecentTransactions(allTransactions);

    } catch (error: any) {
      console.error("Error fetching financial data:", error);
      toast.error("Failed to load financial data");
    } finally {
      setIsLoading(false);
    }
  };

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-emerald-100 text-sm font-medium">Total Collection</p>
            <TrendingUp className="h-5 w-5 text-emerald-200" />
          </div>
          <h3 className="text-3xl font-bold">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `৳ ${totalIncome.toLocaleString()}`}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-rose-100 text-sm font-medium">Total Expenses</p>
            <TrendingDown className="h-5 w-5 text-rose-200" />
          </div>
          <h3 className="text-3xl font-bold">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `৳ ${totalExpense.toLocaleString()}`}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo-100 text-sm font-medium">Net Balance</p>
            <DollarSign className="h-5 w-5 text-indigo-200" />
          </div>
          <h3 className="text-3xl font-bold">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `৳ ${netBalance.toLocaleString()}`}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Online Payment Gateway */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payment Gateway</h2>
              <p className="text-sm text-gray-500">bKash & Nagad Integration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-xs">bKash</div>
                <div>
                  <h4 className="font-medium text-gray-900">bKash Merchant</h4>
                  <p className="text-sm text-gray-500">Active • Auto-receipt enabled</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Connected</span>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">Nagad</div>
                <div>
                  <h4 className="font-medium text-gray-900">Nagad Merchant</h4>
                  <p className="text-sm text-gray-500">Active • Auto-receipt enabled</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Connected</span>
            </div>
          </div>
        </div>

        {/* OMR Scanner */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ScanLine className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">OMR Scanner</h2>
              <p className="text-sm text-gray-500">Auto mark entry via camera</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ScanLine className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-medium text-gray-900">Scan OMR Sheet</h4>
            <p className="text-sm text-gray-500 mt-1">Hold the sheet in front of the camera</p>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Open Camera
            </button>
          </div>
        </div>

        {/* Cashbook */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Perfect Cashbook</h2>
                <p className="text-sm text-gray-500">Recent transactions</p>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Download Report</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                    </td>
                  </tr>
                ) : recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No recent transactions recorded.</td>
                  </tr>
                ) : (
                  recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600 font-medium">{tx.date}</td>
                      <td className="px-4 py-3 text-gray-900">{tx.description}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'} ৳{tx.amount.toLocaleString()}
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
