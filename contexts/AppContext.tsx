import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Car, CommunityPost, NewsArticle, User } from '../types';
import { mockCars, mockNews } from '../mocks/cars';
import { mockCommunityPosts, mockUser } from '../mocks/community';

export const [AppContext, useApp] = createContextHook(() => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [user, setUser] = useState<User>(mockUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem('communityPosts');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedPosts) {
        setCommunityPosts(JSON.parse(storedPosts));
      } else {
        setCommunityPosts(mockCommunityPosts);
      }
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setCommunityPosts(mockCommunityPosts);
    } finally {
      setIsLoading(false);
    }
  };

  const savePostsToStorage = async (posts: CommunityPost[]) => {
    try {
      await AsyncStorage.setItem('communityPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const addPost = (post: Omit<CommunityPost, 'id' | 'createdAt'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedPosts = [newPost, ...communityPosts];
    setCommunityPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  const updatePost = (postId: string, updates: Partial<CommunityPost>) => {
    const updatedPosts = communityPosts.map(post =>
      post.id === postId ? { ...post, ...updates } : post
    );
    setCommunityPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  const deletePost = (postId: string) => {
    const updatedPosts = communityPosts.filter(post => post.id !== postId);
    setCommunityPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  const toggleLike = (postId: string) => {
    const updatedPosts = communityPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    setCommunityPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  const updateUser = (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };

  const addToFavorites = (brand: string) => {
    if (!user.favoriteBrands.includes(brand)) {
      updateUser({
        favoriteBrands: [...user.favoriteBrands, brand],
      });
    }
  };

  const removeFromFavorites = (brand: string) => {
    updateUser({
      favoriteBrands: user.favoriteBrands.filter(b => b !== brand),
    });
  };

  return {
    cars,
    news,
    communityPosts,
    user,
    isLoading,
    addPost,
    updatePost,
    deletePost,
    toggleLike,
    updateUser,
    addToFavorites,
    removeFromFavorites,
  };
});
