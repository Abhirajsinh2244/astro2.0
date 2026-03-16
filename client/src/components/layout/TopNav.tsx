import React, { useEffect, useState } from 'react';

export default function TopNav(): React.JSX.Element {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navLinkClass = (path: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold tracking-wide transition-colors ${
      currentPath.includes(path)
        ? 'border-emerald-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-3 mr-10">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white font-black text-lg shadow-sm">
                L
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tighter">LedgerPro</span>
            </div>
            
            <div className="hidden sm:flex sm:space-x-8">
              <a href="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</a>
              <a href="/transactions" className={navLinkClass('/transactions')}>Transactions</a>
              <a href="/budgets" className={navLinkClass('/budgets')}>Budgets</a>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors relative">
              Alerts
              <span className="absolute -top-1 -right-2 block h-2 w-2 rounded-full bg-emerald-500" />
            </button>
            <div className="h-4 w-px bg-gray-200" aria-hidden="true" />
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Profile</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Settings</button>
          </div>
        </div>
      </div>
    </nav>
  );
}