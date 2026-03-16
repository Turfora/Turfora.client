import { useFocusEffect } from '@react-navigation/native'
import React, { useState, useCallback } from 'react'

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { getUserBookings } from '../../../api/bookings'
import { Booking, BookingStatus, GetBookingsParams } from '../../../types/booking.types'
import { logoutAsync } from '../../../redux/slices/authSlice'

type StatusFilter = 'all' | BookingStatus

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function BookingsScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')

  const fetchBookings = useCallback(async (filter: StatusFilter = activeFilter) => {
    try {
      setLoading(true)
      setError(null)
      const token = await AsyncStorage.getItem('authToken')
      
      if (!token) {
        console.log('[BookingsScreen] No auth token found')
        setError('No auth token found. Please login again.')
        setLoading(false)
        await dispatch(logoutAsync())
        return
      }

      const params: GetBookingsParams = {}
      if (filter !== 'all') {
        params.status = filter
      }

      console.log('[BookingsScreen] Fetching bookings with token...')
      const res = await getUserBookings(params)
      setBookings(res.data.data || [])
      setLoading(false)
    } catch (error: any) {
      console.error('[BookingsScreen] Error fetching bookings:', error)

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.log('[BookingsScreen] Token expired or invalid, logging out...')
        setError('Session expired. Please login again.')
        await dispatch(logoutAsync())
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch bookings'
        setError(errorMsg)
      }
      
      setLoading(false)
    }
  }, [dispatch])

  // Re-fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings(activeFilter)
    }, [activeFilter, fetchBookings])
  )

  const handleFilterChange = (filter: StatusFilter) => {
    setActiveFilter(filter)
    fetchBookings(filter)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchBookings(activeFilter)
    setRefreshing(false)
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchBookings()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Status Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {STATUS_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterChip,
              activeFilter === filter.value && styles.filterChipActive,
            ]}
            onPress={() => handleFilterChange(filter.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter.value && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>
            {activeFilter === 'all'
              ? 'Start booking your favorite turfs!'
              : `No ${activeFilter} bookings found.`}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={() => fetchBookings()}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.bookingId}>Booking #{item.id.slice(0, 8)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === 'confirmed' ? '#4CAF50' :
                        item.status === 'pending' ? '#FFC107' :
                        item.status === 'cancelled' ? '#f44336' :
                        item.status === 'completed' ? '#2196F3' :
                        '#999',
                    },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              {item.turf && (
                <Text style={styles.turfName}>{item.turf.name}</Text>
              )}

              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{item.booking_date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Time</Text>
                  <Text style={styles.value}>
                    {item.start_time} - {item.end_time}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Total Price</Text>
                  <Text style={styles.price}>₹{item.total_price}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  filterBar: {
    marginBottom: 16,
  },
  filterBarContent: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  turfName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 400,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  viewButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
})