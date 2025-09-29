import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const getBlogProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const blog = ctx.db.getBlog(input.id);
    
    if (!blog) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Blog not found',
      });
    }

    if (!blog.isPublished && ctx.user?.role !== 'admin' && ctx.user?.id !== blog.authorId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Cannot view unpublished blog',
      });
    }

    ctx.db.updateBlog(blog.id, { views: blog.views + 1 });
    
    return { ...blog, views: blog.views + 1 };
  });