import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const updatePostProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      content: z.string().optional(),
      images: z.array(z.string()).optional(),
      carBrand: z.string().optional(),
      carModel: z.string().optional(),
    })
  )
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
        message: 'Cannot update other users posts',
      });
    }

    const { id, ...updates } = input;
    const updatedPost = ctx.db.updatePost(id, updates);
    
    return updatedPost;
  });
