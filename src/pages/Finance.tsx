import { Wallet, CreditCard, Receipt, ScanLine } from "lucide-react";

export default function Finance() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl text-white shadow-sm">
          <p className="text-emerald-100 text-sm font-medium mb-1">Total Collection (This Month)</p>
          <h3 className="text-3xl font-bold">৳ 0</h3>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-xl text-white shadow-sm">
          <p className="text-rose-100 text-sm font-medium mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold">৳ 0</h3>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-sm">
          <p className="text-indigo-100 text-sm font-medium mb-1">Net Balance</p>
          <h3 className="text-3xl font-bold">৳ 0</h3>
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
              <tbody>
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No recent transactions recorded.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
