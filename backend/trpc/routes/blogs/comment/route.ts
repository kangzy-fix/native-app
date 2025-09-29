import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Comment } from '../../../../../types';

export const commentBlogProcedure = protectedProcedure
  .input(
    z.object({
      blogId: z.string(),
      content: z.string().min(1),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const blog = ctx.db.getBlog(input.blogId);
    
    if (!blog) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Blog not found',
      });
    }

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blogId: input.blogId,
      userId: ctx.user!.id,
      userName: ctx.user!.name,
      userAvatar: ctx.user!.avatar,
      content: input.content,
      createdAt: new Date().toISOString(),
    };

    const updatedBlog = ctx.db.updateBlog(input.blogId, {
      comments: [...blog.comments, comment],
    });
    
    return updatedBlog;
  });
