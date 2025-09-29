import { publicProcedure } from '../../../create-context';

export const listBlogsProcedure = publicProcedure.query(async ({ ctx }) => {
  if (ctx.user?.role === 'admin') {
    return ctx.db.getAllBlogs();
  }
  return ctx.db.getPublishedBlogs();
});
