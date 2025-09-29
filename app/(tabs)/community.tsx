import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Heart, MessageCircle, Plus, X, Trash2, Edit2 } from 'lucide-react-native';

export default function CommunityScreen() {
  const { communityPosts, user, addPost, deletePost, updatePost, toggleLike } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Please enter post content');
      return;
    }

    if (editingPostId) {
      updatePost(editingPostId, {
        content: postContent,
        carBrand: carBrand || undefined,
        carModel: carModel || undefined,
      });
    } else {
      addPost({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: postContent,
        images: [],
        carBrand: carBrand || undefined,
        carModel: carModel || undefined,
        likes: 0,
        comments: 0,
        isLiked: false,
      });
    }

    setPostContent('');
    setCarBrand('');
    setCarModel('');
    setEditingPostId(null);
    setShowCreateModal(false);
  };

  const handleEditPost = (postId: string) => {
    const post = communityPosts.find(p => p.id === postId);
    if (post) {
      setPostContent(post.content);
      setCarBrand(post.carBrand || '');
      setCarModel(post.carModel || '');
      setEditingPostId(postId);
      setShowCreateModal(true);
    }
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePost(postId),
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {communityPosts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
              <View style={styles.postHeaderInfo}>
                <Text style={styles.userName}>{post.userName}</Text>
                <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
              </View>
              {post.userId === user.id && (
                <View style={styles.postActions}>
                  <TouchableOpacity
                    onPress={() => handleEditPost(post.id)}
                    style={styles.actionButton}
                  >
                    <Edit2 color={Colors.dark.textSecondary} size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeletePost(post.id)}
                    style={styles.actionButton}
                  >
                    <Trash2 color={Colors.dark.error} size={18} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {(post.carBrand || post.carModel) && (
              <View style={styles.carTag}>
                <Text style={styles.carTagText}>
                  {post.carBrand} {post.carModel}
                </Text>
              </View>
            )}

            {post.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScroll}
              >
                {post.images.map((image: any, index: React.Key | null | undefined) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.postImage}
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.postFooter}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => toggleLike(post.id)}
              >
                <Heart
                  color={post.isLiked ? Colors.dark.primary : Colors.dark.textSecondary}
                  size={20}
                  fill={post.isLiked ? Colors.dark.primary : 'transparent'}
                />
                <Text
                  style={[
                    styles.footerButtonText,
                    post.isLiked && styles.footerButtonTextActive,
                  ]}
                >
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton}>
                <MessageCircle color={Colors.dark.textSecondary} size={20} />
                <Text style={styles.footerButtonText}>{post.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.9}
      >
        <Plus color={Colors.dark.text} size={28} />
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCreateModal(false);
          setEditingPostId(null);
          setPostContent('');
          setCarBrand('');
          setCarModel('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPostId ? 'Edit Post' : 'Create Post'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setEditingPostId(null);
                  setPostContent('');
                  setCarBrand('');
                  setCarModel('');
                }}
              >
                <X color={Colors.dark.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>What's on your mind?</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Share your thoughts, builds, or car stories..."
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={postContent}
                    onChangeText={setPostContent}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Car Details (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Brand (e.g., Toyota)"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={carBrand}
                    onChangeText={setCarBrand}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Model (e.g., Supra MK4)"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={carModel}
                    onChangeText={setCarModel}
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitButton} onPress={handleCreatePost}>
              <Text style={styles.submitButtonText}>
                {editingPostId ? 'Update Post' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  postCard: {
    backgroundColor: Colors.dark.backgroundSecondary,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  postTime: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  carTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  carTagText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  imagesScroll: {
    marginBottom: 12,
  },
  postImage: {
    width: 280,
    height: 200,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  footerButtonTextActive: {
    color: Colors.dark.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.dark.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.dark.primary,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  bottomPadding: {
    height: 100,
  },
});
