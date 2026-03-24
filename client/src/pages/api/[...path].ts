import type { APIRoute } from 'astro';
import app from '@server/index'; // Adjust the path as necessary to import your Hono app

// This catch-all route forwards all HTTP methods to your Hono backend
export const ALL: APIRoute = ({ request }) => {
  return app.fetch(request);
};