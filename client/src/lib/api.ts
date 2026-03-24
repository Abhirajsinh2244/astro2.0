import { hc } from 'hono/client';
import type { AppType } from '@server/index';

/**
 * Dynamically resolves the API base URL depending on the execution context (Isomorphic).
 * Ensures safe execution across Client (Browser), Serverless (Vercel), and Local Dev environments.
 */
const getBaseUrl = () => {
  // 1. Browser Environment (Client-Side Rendering)
  // Safely captures the origin for React components hydrating in the browser.
  if (typeof window !== 'undefined') return window.location.origin;
  
  // 2. Vercel SSR Environment (Node.js Serverless Runtime)
  // Vite statically analyzes import.meta.env at build time, but Vercel provisions VERCEL_URL at runtime.
  // process.env is utilized as a fallback to capture the live system variable during SSR execution.
  const vercelUrl = import.meta.env.VERCEL_URL || (typeof process !== 'undefined' && process.env.VERCEL_URL);
  
  if (vercelUrl) {
    // Vercel omits the protocol in its system variable, so it must be explicitly appended.
    return `https://${vercelUrl}`;
  }
  
  // 3. Local Development Fallback
  return 'http://localhost:4321'; 
};

export const apiClient = hc<AppType>(getBaseUrl());