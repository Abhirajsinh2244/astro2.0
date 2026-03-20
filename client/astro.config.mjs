// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },
  server: {
    port: 5173,
    
  }
});