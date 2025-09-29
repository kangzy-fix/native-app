import { protectedProcedure } from '../../../create-context';

export const logoutProcedure = protectedProcedure.mutation(async ({ ctx }) => {
  const authHeader = ctx.req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (token) {
    ctx.db.deleteSession(token);
  }
  
  return { success: true };
});
