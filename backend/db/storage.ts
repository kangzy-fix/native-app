import { User, Blog, CommunityPost, Comment, Notification, Car, NewsArticle } from '../../types';

export class InMemoryDB {
  private users: Map<string, User & { password: string }> = new Map();
  private blogs: Map<string, Blog> = new Map();
  private posts: Map<string, CommunityPost> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: number }> = new Map();
  private cars: Car[] = [];
  private news: NewsArticle[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const adminUser: User & { password: string } = {
      id: 'admin-1',
      email: 'iankangacha@gmail.com',
      password: 'admin123',
      name: 'Ian Kangacha',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      bio: 'Platform Administrator',
      role: 'admin',
      favoriteBrands: ['Ferrari', 'Lamborghini', 'Porsche'],
      carCollection: [],
      posts: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const regularUser: User & { password: string } = {
      id: 'user-1',
      email: 'user@carkenya.com',
      password: 'user123',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      bio: 'Car enthusiast from Nairobi',
      role: 'user',
      favoriteBrands: ['Toyota', 'Nissan'],
      carCollection: [],
      posts: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(regularUser.id, regularUser);
  }

  getUser(id: string): (User & { password: string }) | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): (User & { password: string }) | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).map(({ password, ...user }) => user);
  }

  createUser(user: User & { password: string }): User {
    this.users.set(user.id, user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  getBlog(id: string): Blog | undefined {
    return this.blogs.get(id);
  }

  getAllBlogs(): Blog[] {
    return Array.from(this.blogs.values());
  }

  getPublishedBlogs(): Blog[] {
    return Array.from(this.blogs.values()).filter(b => b.isPublished);
  }

  createBlog(blog: Blog): Blog {
    this.blogs.set(blog.id, blog);
    return blog;
  }

  updateBlog(id: string, updates: Partial<Blog>): Blog | null {
    const blog = this.blogs.get(id);
    if (!blog) return null;
    const updated = { ...blog, ...updates, updatedAt: new Date().toISOString() };
    this.blogs.set(id, updated);
    return updated;
  }

  deleteBlog(id: string): boolean {
    return this.blogs.delete(id);
  }

  getPost(id: string): CommunityPost | undefined {
    return this.posts.get(id);
  }

  getAllPosts(): CommunityPost[] {
    return Array.from(this.posts.values());
  }

  createPost(post: CommunityPost): CommunityPost {
    this.posts.set(post.id, post);
    return post;
  }

  updatePost(id: string, updates: Partial<CommunityPost>): CommunityPost | null {
    const post = this.posts.get(id);
    if (!post) return null;
    const updated = { ...post, ...updates };
    this.posts.set(id, updated);
    return updated;
  }

  deletePost(id: string): boolean {
    return this.posts.delete(id);
  }

  getNotifications(userId: string): Notification[] {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  createNotification(notification: Notification): Notification {
    this.notifications.set(notification.id, notification);
    return notification;
  }

  markNotificationAsRead(id: string): boolean {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    notification.isRead = true;
    return true;
  }

  createSession(userId: string): string {
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.sessions.set(token, { userId, expiresAt });
    return token;
  }

  getSession(token: string): { userId: string; expiresAt: number } | undefined {
    const session = this.sessions.get(token);
    if (!session) return undefined;
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(token);
      return undefined;
    }
    return session;
  }

  deleteSession(token: string): boolean {
    return this.sessions.delete(token);
  }

  setCars(cars: Car[]) {
    this.cars = cars;
  }

  getCars(): Car[] {
    return this.cars;
  }

  setNews(news: NewsArticle[]) {
    this.news = news;
  }

  getNews(): NewsArticle[] {
    return this.news;
  }
}

export const db = new InMemoryDB();
