import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { CommunityPost } from '../../../../../types';

export const createPostProcedure = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1),
      images: z.array(z.string()),
      carBrand: z.string().optional(),
      carModel: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const post: CommunityPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: ctx.user!.id,
      userName: ctx.user!.name,
      userAvatar: ctx.user!.avatar,
      content: input.content,
      images: input.images,
      carBrand: input.carBrand,
      carModel: input.carModel,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    };

    return ctx.db.createPost(post);
  });
