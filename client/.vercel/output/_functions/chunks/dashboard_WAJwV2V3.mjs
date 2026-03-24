import { c as createComponent } from './astro-component_CMjIrOEP.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_DQLFTjVw.mjs';
import { u as useTransactions, $ as $$Layout } from './useTransactions_DXdqhot5.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useEffect, useMemo } from 'react';
import { C as CategoryReport } from './CategoryReport_DlYp0Dgj.mjs';

function DashboardView() {
  const { data: transactions, isLoading, error, fetchTransactions } = useTransactions();
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach((tx) => {
      if (tx.type === "income") inc += tx.amount;
      if (tx.type === "expense") exp += tx.amount;
    });
    return { totalIncome: inc, totalExpenses: exp, balance: inc - exp };
  }, [transactions]);
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "INR" }).format(amount);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold tracking-widest text-emerald-600 uppercase animate-pulse", children: "Syncing Ledger..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-destructive/10 p-4 rounded-xl border border-destructive/20", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-destructive uppercase tracking-wide", children: "System Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive/80 mt-1", children: error })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Financial Overview" }),
      /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground mt-1", children: "Your high-level financial summary at a glance." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Net Balance" }),
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black text-foreground tracking-tighter", children: formatCurrency(balance) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-center border-l-4 border-l-emerald-500", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Total Income" }),
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black text-emerald-600 tracking-tighter", children: formatCurrency(totalIncome) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-center border-l-4 border-l-destructive", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Total Expenses" }),
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black text-destructive tracking-tighter", children: formatCurrency(totalExpenses) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CategoryReport, { transactions })
  ] });
}

const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardView", DashboardView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/astro2.0/client/src/components/views/DashboardView", "client:component-export": "default" })} ` })}`;
}, "C:/astro2.0/client/src/pages/dashboard.astro", void 0);

const $$file = "C:/astro2.0/client/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
