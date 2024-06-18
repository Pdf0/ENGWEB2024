import { postsRouter } from "~/server/api/routers/posts";
import { userRouter } from "~/server/api/routers/user";
import { ruasRouter } from "~/server/api/routers/ruas";
import { freguesiasRouter } from "~/server/api/routers/freguesias";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  user: userRouter,
  ruas: ruasRouter,
  freguesias: freguesiasRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);