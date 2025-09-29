export type CarCategory = 'Supercars' | 'Classics' | 'JDM' | 'EVs' | 'Off-road' | 'Luxury';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  image: string;
  specs: {
    engine: string;
    horsepower: number;
    topSpeed: string;
    acceleration: string;
  };
  price?: string;
  description: string;
  trending: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  publishedAt: string;
  url?: string;
  category: 'global' | 'kenya';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images: string[];
  carBrand?: string;
  carModel?: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  role: UserRole;
  favoriteBrands: string[];
  carCollection: Car[];
  posts: CommunityPost[];
  createdAt: string;
  isActive: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  token: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  images: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  comments: Comment[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  blogId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'blog' | 'comment' | 'like' | 'admin';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  userGrowth: { date: string; count: number }[];
  blogViews: { date: string; count: number }[];
  topBlogs: { id: string; title: string; views: number }[];
}
