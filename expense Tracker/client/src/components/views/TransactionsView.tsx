import React, { useState, useEffect, useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { type TransactionType, CATEGORY_MAP } from '../../lib/types';

const ACCOUNTS = ['Checking', 'Credit Card', 'Savings'];
const STATUSES = ['Cleared', 'Pending'];

export default function TransactionsView(): React.JSX.Element {
  const { data: transactions, isLoading, error, fetchTransactions, addTransaction, deleteTransaction } = useTransactions();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Food & Drink',
    description: '',
    amount: '',
    account: 'Checking',
    status: 'Cleared'
  });

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await addTransaction({ ...formData, amount: parseFloat(formData.amount), type: transactionType });
    if (success) {
      setIsModalOpen(false);
      // Reset form, including the description field
      setFormData(prev => ({ ...prev, merchant: '', description: '', amount: '' }));
    }
    setIsSubmitting(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchCat = filterCategory === 'All' || t.category === filterCategory;
      const matchAcc = filterAccount === 'All' || t.account === filterAccount;
      let matchDate = true;
      if (startDate && endDate) matchDate = t.date >= startDate && t.date <= endDate;
      return matchCat && matchAcc && matchDate;
    });
  }, [transactions, filterCategory, filterAccount, startDate, endDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCurrency = (amount: number, type: TransactionType) => {
    const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Transactions Ledger</h1>
          <p className="text-base text-gray-500 mt-1">Manage and filter your secure transaction history.</p>
        </div>
        {error && <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded">Error: {error}</span>}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-\[250px\]">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
          <div className="flex items-center space-x-2 border-b border-gray-300 pb-1 focus-within:border-gray-900 transition-colors">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="outline-none text-sm w-full bg-transparent font-medium"/>
            <span className="text-gray-300 font-bold px-2">TO</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="outline-none text-sm w-full bg-transparent font-medium"/>
          </div>
        </div>
        <div className="flex-1 min-w-\[200px]">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full border-b border-gray-300 pb-1 text-sm bg-transparent outline-none focus:border-gray-900 font-medium cursor-pointer appearance-none transition-colors">
            <option value="All">All Categories</option>
            {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-\[200px\]">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Filter</label>
          <select value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)} className="w-full border-b border-gray-300 pb-1 text-sm bg-transparent outline-none focus:border-gray-900 font-medium cursor-pointer appearance-none transition-colors">
            <option value="All">All Accounts</option>
            {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Records</h2>
          <div className="flex space-x-4">
            <button onClick={() => { setTransactionType('expense'); setIsModalOpen(true); }} className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded text-sm font-bold tracking-wide transition-all shadow-sm">
              + RECORD EXPENSE
            </button>
            <button onClick={() => { setTransactionType('income'); setIsModalOpen(true); }} className="bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 px-5 py-2 rounded text-sm font-bold tracking-wide transition-all shadow-sm">
              + RECORD INCOME
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-\[400px\]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Merchant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Account</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <span className="text-sm font-bold tracking-widest text-gray-400 uppercase animate-pulse">Syncing...</span>
                  </td>
                </tr>
              ) : currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-gray-400 font-medium">No records match current parameters.</td>
                </tr>
              ) : (
                currentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{tx.merchant}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">{tx.category}</td>
                    <td className="px-6 py-4 text-gray-400 truncate max-w-\[200px\]" title={tx.description}>{tx.description || '—'}</td>
                    <td className={`px-6 py-4 font-black tracking-tight ${tx.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {formatCurrency(tx.amount, tx.type)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{tx.account}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${tx.status === 'Cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteTransaction(tx.id)} className="text-xs font-bold tracking-widest text-red-400 hover:text-red-600 uppercase opacity-0 group-hover:opacity-100 transition-all">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-white text-sm">
          <div className="text-gray-400 font-medium">
            Page <span className="text-gray-900 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
          </div>
          <div className="flex space-x-4 font-bold text-xs uppercase tracking-widest">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-gray-900 disabled:text-gray-300 hover:underline">
              Previous
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="text-gray-900 disabled:text-gray-300 hover:underline">
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-6 uppercase">
              Record {transactionType}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount</label>
                  <input required type="number" step="0.01" min="0.01" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium placeholder-gray-300" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{transactionType === 'expense' ? 'Merchant' : 'Source'}</label>
                <input required type="text" name="merchant" value={formData.merchant} onChange={handleInputChange} className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium" placeholder="E.g. Target, Payroll" />
              </div>
              
              {/* NEW DESCRIPTION FIELD */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description <span className="text-gray-300 font-medium lowercase tracking-normal"></span></label>
                <input 
                  type="text" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium placeholder-gray-300" 
                  placeholder="Additional context or notes..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium cursor-pointer">
                    {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account</label>
                  <select name="account" value={formData.account} onChange={handleInputChange} className="w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium cursor-pointer">
                    {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-gray-900 text-white px-6 py-3 rounded text-sm font-bold tracking-wide hover:bg-black transition-colors disabled:opacity-50">
                  {isSubmitting ? 'COMMITTING...' : 'COMMIT RECORD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}