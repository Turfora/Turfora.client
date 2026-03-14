import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { getTurfs } from '../../../api/turfs'
import { Turf } from '../../../types/turf.types'

const CATEGORIES = [
  { name: 'All', icon: '⊞' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Football', icon: '⚽' },
  { name: 'Volleyball', icon: '🏐' },
  { name: 'Badminton', icon: '🏸' },
  { name: 'Other', icon: '⊞' },
]

export default function HomeScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTurfs()
  }, [selectedCategory])

  const fetchTurfs = async () => {
    try {
      setLoading(true)
      const res = await getTurfs({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      })
      setTurfs(res.data.data || [])
    } catch (error) {
      console.error('Error fetching turfs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop',
          }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>50% Off</Text>
          <Text style={styles.bannerSubtitle}>On every booking</Text>
          <TouchableOpacity style={styles.getButton}>
            <Text style={styles.getButtonText}>Get Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.name && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === item.name && styles.categoryNameActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Popular Turfs */}
      <View style={styles.popularContainer}>
        <Text style={styles.sectionTitle}>Popular Turf</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllTurfs')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <View style={styles.turfGrid}>
          {turfs.slice(0, 4).map((turf) => (
            <TouchableOpacity
              key={turf.id}
              style={styles.turfCard}
              onPress={() => navigation.navigate('TurfDetail', { turfId: turf.id })}
            >
              {turf.is_featured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>FEATURED</Text>
                </View>
              )}
              <Image
                source={{ uri: turf.image_url }}
                style={styles.turfImage}
              />
              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => console.log('Add to favorites:', turf.id)}
              >
                <Text style={styles.heart}>♥</Text>
              </TouchableOpacity>

              <View style={styles.turfInfo}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.rating}>{turf.rating || 4.6}</Text>
                </View>
                <Text style={styles.turfName}>{turf.name}</Text>
                <Text style={styles.price}>${turf.price_per_hour}/hr</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Revolution Section */}
      <View style={styles.revolutionContainer}>
        <Text style={styles.revolutionTitle}>Join the Revolution</Text>
        <Text style={styles.revolutionSubtitle}>
          Follow to our Insta Page and get 10% off on{'\n'}your first purchase.
        </Text>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 110,
  },
  contentContainer: {
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  centerContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 80,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 10
  },
  bannerContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#90EE90',
    marginTop: 4,
  },
  getButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  getButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryButtonActive: {
    opacity: 1,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#999',
  },
  categoryNameActive: {
    color: '#000',
    fontWeight: '600',
  },
  popularContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 12,
    color: '#999',
  },
  turfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 12,
    justifyContent: 'space-between',
  },
  turfCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  turfImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heart: {
    fontSize: 18,
    color: '#999',
  },
  turfInfo: {
    padding: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 14,
    color: '#FFB800',
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
  },
  turfName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  revolutionContainer: {
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  revolutionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  revolutionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: '#000',
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 24,
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})