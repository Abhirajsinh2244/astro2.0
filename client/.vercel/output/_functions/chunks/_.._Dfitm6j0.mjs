import * as dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("CRITICAL: Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

const transactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  merchant: z.string().min(1, "Merchant is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  account: z.string().min(1, "Account is required"),
  status: z.enum(["Cleared", "Pending"]),
  type: z.enum(["expense", "income"])
});
const transactionsRouter = new Hono().get("/", async (c) => {
  const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false }).order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase GET Error:", error);
    return c.json({ success: false, error: "Failed to fetch database records" }, 500);
  }
  return c.json({
    success: true,
    data,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}).post(
  "/",
  zValidator("json", transactionSchema, (result, c) => {
    if (!result.success) {
      return c.json({ success: false, error: "Validation failed", details: result.error.issues }, 400);
    }
  }),
  async (c) => {
    const payload = await c.req.valid("json");
    const newRecord = {
      id: randomUUID(),
      ...payload
    };
    const { data, error } = await supabase.from("transactions").insert([newRecord]).select().single();
    if (error) {
      console.error("Supabase POST Error:", error);
      return c.json({ success: false, error: "Failed to persist record" }, 500);
    }
    return c.json({
      success: true,
      data
    }, 201);
  }
).put(
  "/:id",
  zValidator("json", transactionSchema, (result, c) => {
    if (!result.success) {
      return c.json({ success: false, error: "Validation failed", details: result.error.issues }, 400);
    }
  }),
  async (c) => {
    const id = c.req.param("id");
    const payload = await c.req.valid("json");
    const { data, error } = await supabase.from("transactions").update(payload).eq("id", id).select().single();
    if (error) {
      console.error("Supabase PUT Error:", error);
      return c.json({ success: false, error: "Failed to update record" }, 500);
    }
    if (!data) {
      return c.json({ success: false, error: "Record not found" }, 404);
    }
    return c.json({
      success: true,
      data
    }, 200);
  }
).delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabase.from("transactions").delete().eq("id", id).select();
  if (error) {
    console.error("Supabase DELETE Error:", error);
    return c.json({ success: false, error: "Failed to delete record" }, 500);
  }
  if (!data || data.length === 0) {
    return c.json({ success: false, error: "Record not found" }, 404);
  }
  return c.json({ success: true, deletedId: id });
});

dotenv.config();
const app = new Hono();
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", cors({
  origin: (origin) => {
    if (!origin || origin.startsWith("http://localhost") || origin.includes("vercel.app")) {
      return origin;
    }
    return origin;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.route("/api/transactions", transactionsRouter);
app.onError((err, c) => {
  console.error(`[Server Error] ${err.message}`);
  return c.json({ success: false, error: "Internal Server Error" }, 500);
});

const ALL = ({ request }) => {
  return app.fetch(request);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
