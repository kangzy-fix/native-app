import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const updateBlogProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      images: z.array(z.string()).optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      isPublished: z.boolean().optional(),
    })
  )
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
        message: 'Cannot update other users blogs',
      });
    }

    const { id, ...updates } = input;
    const updatedBlog = ctx.db.updateBlog(id, updates);
    
    return updatedBlog;
  });
