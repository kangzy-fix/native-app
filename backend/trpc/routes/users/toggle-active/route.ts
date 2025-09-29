import { adminProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const toggleUserActiveProcedure = adminProcedure
  .input(z.object({ id: z.string(), isActive: z.boolean() }))
  .mutation(async ({ input, ctx }) => {
    const user = ctx.db.updateUser(input.id, { isActive: input.isActive });
    
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    
    return user;
  });
