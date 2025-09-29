import { adminProcedure } from '../../../create-context';
import { Analytics } from '../../../../../types';

export const getAnalyticsProcedure = adminProcedure.query(async ({ ctx }) => {
  const users = ctx.db.getAllUsers();
  const blogs = ctx.db.getAllBlogs();
  const posts = ctx.db.getAllPosts();

  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  const totalComments = blogs.reduce((sum, blog) => sum + blog.comments.length, 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const analytics: Analytics = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter(b => b.isPublished).length,
    totalViews,
    totalLikes,
    totalComments,
    userGrowth: last7Days.map(date => ({
      date,
      count: users.filter(u => u.createdAt.startsWith(date)).length,
    })),
    blogViews: last7Days.map(date => ({
      date,
      count: blogs.filter(b => b.createdAt.startsWith(date)).reduce((sum, b) => sum + b.views, 0),
    })),
    topBlogs: blogs
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(b => ({ id: b.id, title: b.title, views: b.views })),
  };

  return analytics;
});
