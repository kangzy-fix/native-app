import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { Blog } from '../../../../../types';

export const createBlogProcedure = protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      excerpt: z.string(),
      coverImage: z.string(),
      images: z.array(z.string()),
      category: z.string(),
      tags: z.array(z.string()),
      isPublished: z.boolean(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const blog: Blog = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      authorId: ctx.user!.id,
      authorName: ctx.user!.name,
      authorAvatar: ctx.user!.avatar,
      likes: 0,
      views: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return ctx.db.createBlog(blog);
  });
