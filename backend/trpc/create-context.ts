import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "../db/storage";
import { User } from "../../types";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  let user: User | null = null;

  if (token) {
    const session = db.getSession(token);
    if (session) {
      const userData = db.getUser(session.userId);
      if (userData) {
        const { password, ...userWithoutPassword } = userData;
        user = userWithoutPassword as User;
      }
    }
  }

  return {
    req: opts.req,
    user,
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  ({ ctx, next }: { ctx: Context; next: any }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  }
);

export const adminProcedure = t.procedure.use(
  ({ ctx, next }: { ctx: Context; next: any }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  }
);
