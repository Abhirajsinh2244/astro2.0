import { c as createComponent } from './astro-component_CMjIrOEP.mjs';
import 'piccolore';
import { n as renderHead, l as renderComponent, o as renderSlot, r as renderTemplate } from './entrypoint_DQLFTjVw.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { hc } from 'hono/client';

function TopNav() {
  const [currentPath, setCurrentPath] = useState("/");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  const navLinkClass = (path) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold tracking-wide transition-colors ${currentPath.includes(path) ? "border-emerald-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"}`;
  return /* @__PURE__ */ jsx("nav", { className: "bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "flex justify-between h-16", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 flex items-center gap-3 mr-10", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white font-black text-lg shadow-sm", children: "L" }),
      /* @__PURE__ */ jsx("span", { className: "text-xl font-extrabold text-gray-900 tracking-tighter", children: "LedgerPro" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex sm:space-x-8", children: [
      /* @__PURE__ */ jsx("a", { href: "/dashboard", className: navLinkClass("/dashboard"), children: "Dashboard" }),
      /* @__PURE__ */ jsx("a", { href: "/transactions", className: navLinkClass("/transactions"), children: "Transactions" }),
      /* @__PURE__ */ jsx("a", { href: "/budgets", className: navLinkClass("/budgets"), children: "Budgets" })
    ] })
  ] }) }) }) });
}

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | LedgerPro</title>${renderHead()}</head> <body class="min-h-screen bg-gray-50/50 font-sans text-gray-800 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900"> ${renderComponent($$result, "TopNav", TopNav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/astro2.0/client/src/components/layout/TopNav", "client:component-export": "default" })} <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/astro2.0/client/src/layouts/Layout.astro", void 0);

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:4321";
};
const apiClient = hc(getBaseUrl());

function useTransactions() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.api.transactions.$get();
      if (!response.ok) {
        throw new Error(`Server connection failed: ${response.status}`);
      }
      const result = await response.json();
      if (result.success === true && "data" in result) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to retrieve records");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      console.error("[useTransactions fetch error]:", message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const addTransaction = async (payload) => {
    try {
      const response = await apiClient.api.transactions.$post({
        json: payload
      });
      const result = await response.json();
      if (result.success === true) {
        setData((prev) => [result.data, ...prev]);
        return true;
      } else {
        console.error("Server Validation Details:", result.details);
        throw new Error(result.error || "Validation failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add transaction";
      setError(message);
      return false;
    }
  };
  const editTransaction = async (id, payload) => {
    try {
      const response = await apiClient.api.transactions[":id"].$put({
        param: { id },
        json: payload
      });
      const result = await response.json();
      if (result.success === true) {
        setData((prev) => prev.map((t) => t.id === id ? result.data : t));
        return true;
      } else {
        console.error("Server Validation Details:", result.details);
        throw new Error(result.error || "Update failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update transaction";
      setError(message);
      return false;
    }
  };
  const deleteTransaction = async (id) => {
    try {
      const response = await apiClient.api.transactions[":id"].$delete({
        param: { id }
      });
      const result = await response.json();
      if (result.success === true) {
        setData((prev) => prev.filter((t) => t.id !== id));
        return true;
      } else {
        throw new Error(result.error || "Failed to delete record");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete operation failed";
      setError(message);
      return false;
    }
  };
  return {
    data,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction
  };
}

export { $$Layout as $, useTransactions as u };
