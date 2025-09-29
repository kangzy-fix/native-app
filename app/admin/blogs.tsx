import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, Heart, MessageCircle, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';

export default function AdminBlogs() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: blogs, isLoading } = trpc.blogs.list.useQuery();
  
  const deleteMutation = trpc.blogs.delete.useMutation({
    onSuccess: () => {
      utils.blogs.list.invalidate();
      Alert.alert('Success', 'Blog deleted successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorized}>
          <Text style={styles.unauthorizedText}>Unauthorized Access</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = (blogId: string, title: string) => {
    Alert.alert(
      'Delete Blog',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate({ id: blogId });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Blogs</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
          </View>
        ) : blogs && blogs.length > 0 ? (
          <View style={styles.blogsList}>
            {blogs.map((blog) => (
              <View key={blog.id} style={styles.blogCard}>
                <Image source={{ uri: blog.coverImage }} style={styles.coverImage} />
                <View style={styles.blogContent}>
                  <View style={styles.blogHeader}>
                    <View style={styles.blogInfo}>
                      <Text style={styles.blogTitle} numberOfLines={2}>
                        {blog.title}
                      </Text>
                      <Text style={styles.blogAuthor}>by {blog.authorName}</Text>
                      <View style={styles.blogStats}>
                        <View style={styles.statItem}>
                          <Eye size={14} color={Colors.dark.textSecondary} />
                          <Text style={styles.statText}>{blog.views}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Heart size={14} color={Colors.dark.textSecondary} />
                          <Text style={styles.statText}>{blog.likes}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <MessageCircle size={14} color={Colors.dark.textSecondary} />
                          <Text style={styles.statText}>{blog.comments.length}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(blog.id, blog.title)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={20} color={Colors.dark.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.blogFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        blog.isPublished ? styles.statusPublished : styles.statusDraft,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </Text>
                    </View>
                    <Text style={styles.blogDate}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No blogs found</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  blogsList: {
    padding: 20,
  },
  blogCard: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  blogContent: {
    padding: 16,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  blogInfo: {
    flex: 1,
    marginRight: 12,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  blogAuthor: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  blogStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPublished: {
    backgroundColor: Colors.dark.primary,
  },
  statusDraft: {
    backgroundColor: Colors.dark.background,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  blogDate: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
  },
  unauthorized: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unauthorizedText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});
