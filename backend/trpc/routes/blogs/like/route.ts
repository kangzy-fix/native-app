import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const likeBlogProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const blog = ctx.db.getBlog(input.id);
    
    if (!blog) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Blog not found',
      });
    }

    const updatedBlog = ctx.db.updateBlog(input.id, { likes: blog.likes + 1 });
    
    return updatedBlog;
  });
