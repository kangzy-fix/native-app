import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const deletePostProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const post = ctx.db.getPost(input.id);
    
    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
      });
    }

    if (ctx.user!.role !== 'admin' && ctx.user!.id !== post.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Cannot delete other users posts',
      });
    }

    const success = ctx.db.deletePost(input.id);
    
    return { success };
  });
