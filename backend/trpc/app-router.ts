import { createTRPCRouter } from "./create-context";
import { loginProcedure } from "./routes/auth/login/route";
import { registerProcedure } from "./routes/auth/register/route";
import { logoutProcedure } from "./routes/auth/logout/route";
import { meProcedure } from "./routes/auth/me/route";
import { listUsersProcedure } from "./routes/users/list/route";
import { updateUserProcedure } from "./routes/users/update/route";
import { deleteUserProcedure } from "./routes/users/delete/route";
import { toggleUserActiveProcedure } from "./routes/users/toggle-active/route";
import { listBlogsProcedure } from "./routes/blogs/list/route";
import { getBlogProcedure } from "./routes/blogs/get/route";
import { createBlogProcedure } from "./routes/blogs/create/route";
import { updateBlogProcedure } from "./routes/blogs/update/route";
import { deleteBlogProcedure } from "./routes/blogs/delete/route";
import { likeBlogProcedure } from "./routes/blogs/like/route";
import { commentBlogProcedure } from "./routes/blogs/comment/route";
import { listPostsProcedure } from "./routes/posts/list/route";
import { createPostProcedure } from "./routes/posts/create/route";
import { updatePostProcedure } from "./routes/posts/update/route";
import { deletePostProcedure } from "./routes/posts/delete/route";
import { likePostProcedure } from "./routes/posts/like/route";
import { getAnalyticsProcedure } from "./routes/analytics/get/route";

export const appRouter = createTRPCRouter({
  auth: createTRPCRouter({
    login: loginProcedure,
    register: registerProcedure,
    logout: logoutProcedure,
    me: meProcedure,
  }),
  users: createTRPCRouter({
    list: listUsersProcedure,
    update: updateUserProcedure,
    delete: deleteUserProcedure,
    toggleActive: toggleUserActiveProcedure,
  }),
  blogs: createTRPCRouter({
    list: listBlogsProcedure,
    get: getBlogProcedure,
    create: createBlogProcedure,
    update: updateBlogProcedure,
    delete: deleteBlogProcedure,
    like: likeBlogProcedure,
    comment: commentBlogProcedure,
  }),
  posts: createTRPCRouter({
    list: listPostsProcedure,
    create: createPostProcedure,
    update: updatePostProcedure,
    delete: deletePostProcedure,
    like: likePostProcedure,
  }),
  analytics: createTRPCRouter({
    get: getAnalyticsProcedure,
  }),
});

export type AppRouter = typeof appRouter;
