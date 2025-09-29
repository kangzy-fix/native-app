import { adminProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const deleteUserProcedure = adminProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const success = ctx.db.deleteUser(input.id);
    
    if (!success) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    
    return { success };
  });
