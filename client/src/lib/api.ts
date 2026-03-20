import { hc } from 'hono/client';
import type { AppType } from '../../../server/src/index';

// Dynamically resolve URL based on the execution environment
const getBaseUrl = () => {
  // 1. Browser environment (React components interacting with the API)
  if (typeof window !== 'undefined') return window.location.origin;
  
  // 2. Vercel SSR environment
  if (import.meta.env.VERCEL_URL) return `https://${import.meta.env.VERCEL_URL}`;
  
  // 3. Local Development (Astro's default dev port)
  return 'http://localhost:4321'; 
};

export const apiClient = hc<AppType>(getBaseUrl());