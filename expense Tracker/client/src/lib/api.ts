import { hc } from 'hono/client';
// Ensure this points to your Hono server types
import type { AppType } from '../../../server/src/index';

export const apiClient = hc<AppType>('http://localhost:3000');