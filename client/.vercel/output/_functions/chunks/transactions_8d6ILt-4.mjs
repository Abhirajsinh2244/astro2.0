import { c as createComponent } from './astro-component_CMjIrOEP.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_DQLFTjVw.mjs';
import { u as useTransactions, $ as $$Layout } from './useTransactions_DXdqhot5.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';

const CATEGORY_MAP = {
  "Food & Drink": "Food & Drink",
  "Groceries": "Groceries",
  "Transport": "Transport",
  "Entertainment": "Entertainment",
  "Utilities": "Utilities"
};

const ACCOUNTS = ["Checking", "Credit Card", "Savings"];
function TransactionsView() {
  const { data: transactions, isLoading, error, fetchTransactions, addTransaction, deleteTransaction } = useTransactions();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAccount, setFilterAccount] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    merchant: "",
    category: "Food & Drink",
    description: "",
    amount: "",
    account: "Checking",
    status: "Cleared"
  });
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await addTransaction({ ...formData, amount: parseFloat(formData.amount), type: transactionType });
    if (success) {
      setIsModalOpen(false);
      setFormData((prev) => ({ ...prev, merchant: "", description: "", amount: "" }));
    }
    setIsSubmitting(false);
  };
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchCat = filterCategory === "All" || t.category === filterCategory;
      const matchAcc = filterAccount === "All" || t.account === filterAccount;
      let matchDate = true;
      if (startDate && endDate) matchDate = t.date >= startDate && t.date <= endDate;
      return matchCat && matchAcc && matchDate;
    });
  }, [transactions, filterCategory, filterAccount, startDate, endDate]);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const formatCurrency = (amount, type) => {
    const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
    return type === "expense" ? `-${formatted}` : `+${formatted}`;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 tracking-tight", children: "Transactions Ledger" }),
        /* @__PURE__ */ jsx("p", { className: "text-base text-gray-500 mt-1", children: "Manage and filter your secure transaction history." })
      ] }),
      error && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded", children: [
        "Error: ",
        error
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-6 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-\\[250px\\]", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Date Range" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-300 pb-1 focus-within:border-gray-900 transition-colors", children: [
          /* @__PURE__ */ jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "outline-none text-sm w-full bg-transparent font-medium" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-300 font-bold px-2", children: "TO" }),
          /* @__PURE__ */ jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "outline-none text-sm w-full bg-transparent font-medium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-\\[200px]", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Category" }),
        /* @__PURE__ */ jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), className: "w-full border-b border-gray-300 pb-1 text-sm bg-transparent outline-none focus:border-gray-900 font-medium cursor-pointer appearance-none transition-colors", children: [
          /* @__PURE__ */ jsx("option", { value: "All", children: "All Categories" }),
          Object.keys(CATEGORY_MAP).map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-\\[200px\\]", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Account Filter" }),
        /* @__PURE__ */ jsxs("select", { value: filterAccount, onChange: (e) => setFilterAccount(e.target.value), className: "w-full border-b border-gray-300 pb-1 text-sm bg-transparent outline-none focus:border-gray-900 font-medium cursor-pointer appearance-none transition-colors", children: [
          /* @__PURE__ */ jsx("option", { value: "All", children: "All Accounts" }),
          ACCOUNTS.map((acc) => /* @__PURE__ */ jsx("option", { value: acc, children: acc }, acc))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-100 flex justify-between items-center bg-white", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900 tracking-tight", children: "Recent Records" }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setTransactionType("expense");
            setIsModalOpen(true);
          }, className: "bg-gray-900 hover:bg-black text-white px-5 py-2 rounded text-sm font-bold tracking-wide transition-all shadow-sm", children: "+ RECORD EXPENSE" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setTransactionType("income");
            setIsModalOpen(true);
          }, className: "bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 px-5 py-2 rounded text-sm font-bold tracking-wide transition-all shadow-sm", children: "+ RECORD INCOME" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto min-h-\\[400px\\]", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50/50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Merchant" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Description" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Account" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-6 py-20 text-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold tracking-widest text-gray-400 uppercase animate-pulse", children: "Syncing..." }) }) }) : currentTransactions.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-6 py-20 text-center text-gray-400 font-medium", children: "No records match current parameters." }) }) : currentTransactions.map((tx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors group", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-semibold text-gray-900", children: formatDate(tx.date) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-700 font-medium", children: tx.merchant }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-600", children: tx.category }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-400 truncate max-w-\\[200px\\]", title: tx.description, children: tx.description || "—" }),
          /* @__PURE__ */ jsx("td", { className: `px-6 py-4 font-black tracking-tight ${tx.type === "expense" ? "text-red-500" : "text-emerald-500"}`, children: formatCurrency(tx.amount, tx.type) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-500 font-medium", children: tx.account }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${tx.status === "Cleared" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`, children: tx.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("button", { onClick: () => deleteTransaction(tx.id), className: "text-xs font-bold tracking-widest text-red-400 hover:text-red-600 uppercase opacity-0 group-hover:opacity-100 transition-all", children: "Remove" }) })
        ] }, tx.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 border-t border-gray-100 flex items-center justify-between bg-white text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-gray-400 font-medium", children: [
          "Page ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-bold", children: currentPage }),
          " of ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-bold", children: totalPages })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 font-bold text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "text-gray-900 disabled:text-gray-300 hover:underline", children: "Previous" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "text-gray-900 disabled:text-gray-300 hover:underline", children: "Next" })
        ] })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-black text-gray-900 tracking-tight mb-6 uppercase", children: [
        "Record ",
        transactionType
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Date" }),
            /* @__PURE__ */ jsx("input", { required: true, type: "date", name: "date", value: formData.date, onChange: handleInputChange, className: "w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Amount" }),
            /* @__PURE__ */ jsx("input", { required: true, type: "number", step: "0.01", min: "0.01", name: "amount", value: formData.amount, onChange: handleInputChange, className: "w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium placeholder-gray-300", placeholder: "0.00" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: transactionType === "expense" ? "Merchant" : "Source" }),
          /* @__PURE__ */ jsx("input", { required: true, type: "text", name: "merchant", value: formData.merchant, onChange: handleInputChange, className: "w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium", placeholder: "E.g. Target, Payroll" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: [
            "Description ",
            /* @__PURE__ */ jsx("span", { className: "text-gray-300 font-medium lowercase tracking-normal" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "description",
              value: formData.description,
              onChange: handleInputChange,
              className: "w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium placeholder-gray-300",
              placeholder: "Additional context or notes..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Category" }),
            /* @__PURE__ */ jsx("select", { name: "category", value: formData.category, onChange: handleInputChange, className: "w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium cursor-pointer", children: Object.keys(CATEGORY_MAP).map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Account" }),
            /* @__PURE__ */ jsx("select", { name: "account", value: formData.account, onChange: handleInputChange, className: "w-full border-b border-gray-300 pb-1 text-sm outline-none focus:border-gray-900 font-medium cursor-pointer", children: ACCOUNTS.map((acc) => /* @__PURE__ */ jsx("option", { value: acc, children: acc }, acc)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-4 pt-4", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsModalOpen(false), disabled: isSubmitting, className: "text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "bg-gray-900 text-white px-6 py-3 rounded text-sm font-bold tracking-wide hover:bg-black transition-colors disabled:opacity-50", children: isSubmitting ? "COMMITTING..." : "COMMIT RECORD" })
        ] })
      ] })
    ] }) })
  ] });
}

const $$Transactions = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Transactions" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TransactionsView", TransactionsView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/astro2.0/client/src/components/views/TransactionsView", "client:component-export": "default" })} ` })}`;
}, "C:/astro2.0/client/src/pages/transactions.astro", void 0);

const $$file = "C:/astro2.0/client/src/pages/transactions.astro";
const $$url = "/transactions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Transactions,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
