import { adminProcedure } from '../../../create-context';

export const listUsersProcedure = adminProcedure.query(async ({ ctx }) => {
  return ctx.db.getAllUsers();
});
