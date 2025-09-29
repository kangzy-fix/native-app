import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const deleteBlogProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const blog = ctx.db.getBlog(input.id);
    
    if (!blog) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Blog not found',
      });
    }

    if (ctx.user!.role !== 'admin' && ctx.user!.id !== blog.authorId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Cannot delete other users blogs',
      });
    }

    const success = ctx.db.deleteBlog(input.id);
    
    return { success };
  });
