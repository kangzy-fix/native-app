import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { Car, NewsArticle } from '@/types';
import { useRouter } from 'expo-router';
import { Flame, TrendingUp, MapPin, Sparkles } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { cars, news } = useApp();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const trendingCars = cars.filter(car => car.trending);
  const kenyaNews = news.filter(article => article.category === 'kenya');
  const globalNews = news.filter(article => article.category === 'global');

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const renderCarCard = (car: Car) => (
    <TouchableOpacity
      key={car.id}
      style={styles.carCard}
      onPress={() => router.push(`/car/${car.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: car.image }} style={styles.carImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.carGradient}
      >
        <View style={styles.carInfo}>
          <Text style={styles.carCategory}>{car.category}</Text>
          <Text style={styles.carName}>{car.name}</Text>
          <Text style={styles.carSpecs}>
            {car.specs.horsepower} HP • {car.specs.acceleration}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderNewsCard = (article: NewsArticle, isLarge: boolean = false) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.newsCard, isLarge && styles.newsCardLarge]}
      activeOpacity={0.9}
    >
      <Image source={{ uri: article.image }} style={styles.newsImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.95)']}
        style={styles.newsGradient}
      >
        <View style={styles.newsInfo}>
          <Text style={styles.newsSource}>{article.source}</Text>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.newsDescription} numberOfLines={2}>
            {article.description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <LinearGradient
          colors={[Colors.dark.backgroundSecondary, Colors.dark.background]}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Car Enthusiasts</Text>
                <Text style={styles.headerSubtitle}>Kenya</Text>
              </View>
              <View style={styles.headerBadge}>
                <Sparkles size={16} color={Colors.dark.primary} />
                <Text style={styles.headerBadgeText}>Premium</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Flame color={Colors.dark.primary} size={24} />
          <Text style={styles.sectionTitle}>Trending Now</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {trendingCars.map(renderCarCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp color={Colors.dark.accent} size={24} />
          <Text style={styles.sectionTitle}>Global News</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {globalNews.map(article => renderNewsCard(article, false))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin color={Colors.dark.primary} size={24} />
          <Text style={styles.sectionTitle}>Kenya Spotlight</Text>
        </View>
        <View style={styles.kenyaSection}>
          {kenyaNews.map(article => renderNewsCard(article, true))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Cars</Text>
        <View style={styles.allCarsGrid}>
          {cars.slice(0, 4).map(car => (
            <TouchableOpacity
              key={car.id}
              style={styles.gridCard}
              onPress={() => router.push(`/car/${car.id}`)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: car.image }} style={styles.gridImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.gridGradient}
              >
                <Text style={styles.gridCarName} numberOfLines={1}>
                  {car.brand}
                </Text>
                <Text style={styles.gridCarModel} numberOfLines={1}>
                  {car.model}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
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
  headerContainer: {
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.dark.primary,
    letterSpacing: -1,
    marginTop: -4,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  carCard: {
    width: width * 0.75,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSecondary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  carGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  carInfo: {
    padding: 16,
  },
  carCategory: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  carName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  carSpecs: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  newsCard: {
    width: width * 0.7,
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSecondary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  newsCardLarge: {
    width: width - 40,
    height: 220,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  newsInfo: {
    padding: 16,
  },
  newsSource: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.dark.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  kenyaSection: {
    paddingHorizontal: 0,
  },
  allCarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  gridCard: {
    width: (width - 52) / 2,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSecondary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  gridCarName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  gridCarModel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});
