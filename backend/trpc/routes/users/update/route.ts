import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const updateUserProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      bio: z.string().optional(),
      avatar: z.string().optional(),
      favoriteBrands: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Authorization: allow admin or the same user
    if (ctx.user!.role !== 'admin' && ctx.user!.id !== input.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Cannot update other users',
      });
    }

    const { id, ...updates } = input;
    const user = ctx.db.updateUser(id, updates);

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  });
