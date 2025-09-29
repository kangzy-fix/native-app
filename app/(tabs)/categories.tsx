import { useApp } from '../../contexts/AppContext';
import Colors from '../../constants/Colors';
import { CarCategory } from '../../types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const categories: CarCategory[] = ['Supercars', 'Classics', 'JDM', 'EVs', 'Off-road', 'Luxury'];

export default function CategoriesScreen() {
  const { cars } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = cars.filter((car: { category: any; name: string; brand: string; model: string; }) => {
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search color={Colors.dark.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cars, brands, models..."
          placeholderTextColor={Colors.dark.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === 'All' && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory('All')}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === 'All' && styles.categoryChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.carsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.carsContent}
      >
        <Text style={styles.resultsText}>
          {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
        </Text>
        {filteredCars.map((car: { id: React.Key | null | undefined; image: any; brand: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; model: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; category: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; specs: { horsepower: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; acceleration: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; topSpeed: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; }) => (
          <TouchableOpacity
            key={car.id}
            style={styles.carCard}
            activeOpacity={0.9}
          >
            <Image source={{ uri: car.image }} style={styles.carImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.carGradient}
            >
              <View style={styles.carInfo}>
                <View style={styles.carHeader}>
                  <View style={styles.carTitleContainer}>
                    <Text style={styles.carBrand}>{car.brand}</Text>
                    <Text style={styles.carModel}>{car.model}</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{car.category}</Text>
                  </View>
                </View>
                <View style={styles.carSpecs}>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Power</Text>
                    <Text style={styles.specValue}>{car.specs.horsepower} HP</Text>
                  </View>
                  <View style={styles.specDivider} />
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>0-100</Text>
                    <Text style={styles.specValue}>{car.specs.acceleration}</Text>
                  </View>
                  <View style={styles.specDivider} />
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Top Speed</Text>
                    <Text style={styles.specValue}>{car.specs.topSpeed}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.dark.text,
  },
  carsContainer: {
    flex: 1,
  },
  carsContent: {
    paddingHorizontal: 20,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  carCard: {
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSecondary,
    marginBottom: 16,
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
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carTitleContainer: {
    flex: 1,
  },
  carBrand: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  carModel: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  carSpecs: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 12,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  specDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.dark.border,
  },
  bottomPadding: {
    height: 20,
  },
});
