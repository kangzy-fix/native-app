import { publicProcedure } from '../../../create-context';

export const listPostsProcedure = publicProcedure.query(async ({ ctx }) => {
  return ctx.db.getAllPosts();
});
