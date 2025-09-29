import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Gauge, Zap, TrendingUp, Calendar } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cars } = useApp();
  const router = useRouter();

  const car = cars.find(c => c.id === id);

  if (!car) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Car not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: car.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.9)']}
            style={styles.imageGradient}
          />
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft color={Colors.dark.text} size={24} />
          </TouchableOpacity>
          <View style={styles.heroInfo}>
            <Text style={styles.carCategory}>{car.category}</Text>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carBrandModel}>
              {car.brand} • {car.model} • {car.year}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {car.trending && (
            <View style={styles.trendingBadge}>
              <TrendingUp color={Colors.dark.primary} size={16} />
              <Text style={styles.trendingText}>Trending Now</Text>
            </View>
          )}

          <View style={styles.specsContainer}>
            <View style={styles.specCard}>
              <View style={styles.specIcon}>
                <Gauge color={Colors.dark.primary} size={24} />
              </View>
              <Text style={styles.specValue}>{car.specs.horsepower}</Text>
              <Text style={styles.specLabel}>Horsepower</Text>
            </View>

            <View style={styles.specCard}>
              <View style={styles.specIcon}>
                <Zap color={Colors.dark.accent} size={24} />
              </View>
              <Text style={styles.specValue}>{car.specs.acceleration}</Text>
              <Text style={styles.specLabel}>0-100 km/h</Text>
            </View>

            <View style={styles.specCard}>
              <View style={styles.specIcon}>
                <TrendingUp color={Colors.dark.primary} size={24} />
              </View>
              <Text style={styles.specValue}>{car.specs.topSpeed}</Text>
              <Text style={styles.specLabel}>Top Speed</Text>
            </View>

            <View style={styles.specCard}>
              <View style={styles.specIcon}>
                <Calendar color={Colors.dark.accent} size={24} />
              </View>
              <Text style={styles.specValue}>{car.year}</Text>
              <Text style={styles.specLabel}>Year</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Engine</Text>
            <Text style={styles.sectionContent}>{car.specs.engine}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>{car.description}</Text>
          </View>

          {car.price && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Starting Price</Text>
              <Text style={styles.priceValue}>{car.price}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  imageContainer: {
    width: width,
    height: height * 0.5,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backIconButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInfo: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  carCategory: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  carName: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  carBrandModel: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  content: {
    padding: 20,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  specCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  specIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  specValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  specLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  priceContainer: {
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  bottomPadding: {
    height: 40,
  },
});
