import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Turf } from '../types/turf.types'

const FALLBACK_IMAGE = require('../../assets/images/icon.png')

interface TurfCardProps {
  turf: Turf
  onPress?: () => void
}

export default function TurfCard({ turf, onPress }: TurfCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {turf.is_featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>
      )}
      <Image
        source={turf.image_url ? { uri: turf.image_url } : FALLBACK_IMAGE}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{turf.rating ?? 4.5}</Text>
          {turf.category ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{turf.category}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {turf.name}
        </Text>
        {turf.location ? (
          <Text style={styles.location} numberOfLines={1}>
            📍 {turf.location}
          </Text>
        ) : null}
        <Text style={styles.price}>₹{turf.price_per_hour}/hr</Text>
        {turf.amenities && turf.amenities.length > 0 && (
          <View style={styles.amenitiesRow}>
            {turf.amenities.slice(0, 3).map((a, i) => (
              <View key={i} style={styles.amenityChip}>
                <Text style={styles.amenityChipText}>{a}</Text>
              </View>
            ))}
            {turf.amenities.length > 3 && (
              <Text style={styles.moreAmenities}>+{turf.amenities.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  info: {
    padding: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  star: {
    fontSize: 14,
    color: '#FFB800',
    marginRight: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E86DE',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  location: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E86DE',
    marginBottom: 6,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  amenityChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  amenityChipText: {
    fontSize: 10,
    color: '#555',
  },
  moreAmenities: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'center',
  },
})