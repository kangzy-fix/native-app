import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, FileText, Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { data: analytics, isLoading } = trpc.analytics.get.useQuery();

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorized}>
          <Text style={styles.unauthorizedText}>Unauthorized Access</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
          </View>
        ) : analytics ? (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Users size={24} color={Colors.dark.primary} />
                </View>
                <Text style={styles.statValue}>{analytics.totalUsers}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
                <Text style={styles.statSubtext}>
                  {analytics.activeUsers} active
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <FileText size={24} color={Colors.dark.primary} />
                </View>
                <Text style={styles.statValue}>{analytics.totalBlogs}</Text>
                <Text style={styles.statLabel}>Total Blogs</Text>
                <Text style={styles.statSubtext}>
                  {analytics.publishedBlogs} published
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Eye size={24} color={Colors.dark.primary} />
                </View>
                <Text style={styles.statValue}>{analytics.totalViews}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Heart size={24} color={Colors.dark.primary} />
                </View>
                <Text style={styles.statValue}>{analytics.totalLikes}</Text>
                <Text style={styles.statLabel}>Total Likes</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <MessageCircle size={24} color={Colors.dark.primary} />
                </View>
                <Text style={styles.statValue}>{analytics.totalComments}</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Blogs</Text>
              {analytics.topBlogs.map((blog, index) => (
                <View key={blog.id} style={styles.topBlogItem}>
                  <View style={styles.topBlogRank}>
                    <Text style={styles.topBlogRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topBlogInfo}>
                    <Text style={styles.topBlogTitle} numberOfLines={1}>
                      {blog.title}
                    </Text>
                    <View style={styles.topBlogStats}>
                      <Eye size={14} color={Colors.dark.textSecondary} />
                      <Text style={styles.topBlogViews}>{blog.views} views</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/admin/users')}
              >
                <Users size={20} color={Colors.dark.text} />
                <Text style={styles.actionButtonText}>Manage Users</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/admin/blogs')}
              >
                <FileText size={20} color={Colors.dark.text} />
                <Text style={styles.actionButtonText}>Manage Blogs</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  topBlogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  topBlogRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topBlogRankText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  topBlogInfo: {
    flex: 1,
  },
  topBlogTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  topBlogStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBlogViews: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
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
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  bottomPadding: {
    height: 40,
  },
});