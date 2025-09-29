import { Hono } from "hono";
import { trpcServer } from "@trpc/server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import type { TRPCError } from "@trpc/server";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    responseMeta() {
      return {
        headers: {
          "Content-Type": "application/json",
        },
      };
    },
    onError({ error, path }: { error: TRPCError; path: string | undefined }) {
      console.error(`[tRPC Error] ${path}:`, error);
    },
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;
