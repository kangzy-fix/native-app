import { protectedProcedure } from '../../../create-context';

export const meProcedure = protectedProcedure.query(async ({ ctx }) => {
  return ctx.user;
});
