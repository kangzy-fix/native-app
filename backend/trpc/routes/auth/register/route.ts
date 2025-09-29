import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { User } from '../../../../../types';

export const registerProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const existingUser = ctx.db.getUserByEmail(input.email);
    
    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already registered',
      });
    }

    const newUser: User & { password: string } = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: input.email,
      password: input.password,
      name: input.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${input.email}`,
      bio: '',
      role: 'user',
      favoriteBrands: [],
      carCollection: [],
      posts: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const user = ctx.db.createUser(newUser);
    const token = ctx.db.createSession(user.id);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      token,
    };
  });
