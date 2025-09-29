import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const likePostProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const post = ctx.db.getPost(input.id);
    
    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
      });
    }

    const updatedPost = ctx.db.updatePost(input.id, {
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      isLiked: !post.isLiked,
    });
    
    return updatedPost;
  });
