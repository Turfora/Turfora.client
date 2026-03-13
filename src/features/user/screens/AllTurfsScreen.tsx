import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { getTurfs } from '../../../api/turfs'
import { Turf } from '../../../types/turf.types'

export default function AllTurfsScreen({ navigation }: any) {
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    try {
      const res = await getTurfs()
      setTurfs(res.data.data || [])
    } catch (error) {
      console.error('Error fetching turfs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E86DE" />
      </View>
    )
  }

  if (turfs.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No turfs available</Text>
      </View>
    )
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={turfs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('TurfDetail', { turfId: item.id })}
        >
          {item.is_featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>FEATURED</Text>
            </View>
          )}
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View style={styles.info}>
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{item.rating || 4.6}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price_per_hour}/hr</Text>
          </View>
        </TouchableOpacity>
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#e0e0e0',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  star: {
    fontSize: 13,
    color: '#FFB800',
    marginRight: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E86DE',
  },
})
