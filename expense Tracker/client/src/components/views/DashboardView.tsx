import React, { useEffect, useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import CategoryReport from '../reports/CategoryReport';

export default function DashboardView(): React.JSX.Element {
  const { data: transactions, isLoading, error, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') inc += tx.amount;
      if (tx.type === 'expense') exp += tx.amount;
    });
    return { totalIncome: inc, totalExpenses: exp, balance: inc - exp };
  }, [transactions]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase animate-pulse">
          Syncing Ledger...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
        <p className="text-sm font-bold text-destructive uppercase tracking-wide">System Error</p>
        <p className="text-sm text-destructive/80 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Financial Overview</h1>
        <p className="text-base text-muted-foreground mt-1">Your high-level financial summary at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-center">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Net Balance</p>
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{formatCurrency(balance)}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-center border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Income</p>
          <h3 className="text-3xl font-black text-emerald-600 tracking-tighter">{formatCurrency(totalIncome)}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-center border-l-4 border-l-destructive">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Expenses</p>
          <h3 className="text-3xl font-black text-destructive tracking-tighter">{formatCurrency(totalExpenses)}</h3>
        </div>
      </div>

      <CategoryReport transactions={transactions} />
    </div>
  );
}