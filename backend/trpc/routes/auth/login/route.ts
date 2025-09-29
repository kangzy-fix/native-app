import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const user = ctx.db.getUserByEmail(input.email);
    
    if (!user || user.password !== input.password) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Account is deactivated',
      });
    }

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
