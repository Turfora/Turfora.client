import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getBookingDetails, updateBookingStatus } from '../../../api/owner.api'

export default function BookingDetailsScreen({ navigation, route }: any) {
  const { bookingId } = route.params

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    loadBookingDetails()
  }, [bookingId])

  const loadBookingDetails = async () => {
    try {
      setLoading(true)
      const res = await getBookingDetails(bookingId)
      const data = res.data?.data

      if (!data) {
        Alert.alert('Error', 'Booking not found')
        navigation.goBack()
        return
      }

      setBooking(data)
      setSelectedStatus(data.status)
    } catch (error) {
      console.error('[BookingDetailsScreen] Error:', error)
      Alert.alert('Error', 'Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === booking.status) return

    Alert.alert(
      'Update Status',
      `Are you sure you want to change status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setUpdating(true)
              await updateBookingStatus(bookingId, newStatus)
              setBooking({ ...booking, status: newStatus })
              setSelectedStatus(newStatus)
              Alert.alert('Success', 'Booking status updated successfully')
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to update status'
              )
            } finally {
              setUpdating(false)
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E86DE" />
      </View>
    )
  }

  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50'
      case 'confirmed':
        return '#2E86DE'
      case 'pending':
        return '#FF9800'
      case 'cancelled':
        return '#FF6B6B'
      default:
        return '#999'
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#2E86DE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Status Card */}
      <View style={styles.section}>
        <View
          style={[
            styles.statusCard,
            { borderLeftColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusLabel}>Current Status</Text>
          <View style={styles.statusRow}>
            <Text
              style={[
                styles.statusValue,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {booking.status.toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(booking.status) },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Turf Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Turf Information</Text>
        <View style={styles.infoCard}>
          {booking.turf?.images?.[0] && (
            <Image
              source={{ uri: booking.turf.images[0] }}
              style={styles.turfImage}
            />
          )}
          <View style={styles.turfInfo}>
            <Text style={styles.turfName}>{booking.turf?.name}</Text>
            <Text style={styles.turfCategory}>{booking.turf?.category}</Text>
            <View style={styles.amenitiesContainer}>
              {booking.turf?.amenities?.slice(0, 3).map((amenity: string) => (
                <View key={amenity} style={styles.amenityBadge}>
                  <Text style={styles.amenityBadgeText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Booking Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={20} color="#2E86DE" />
              <Text style={styles.detailLabel}>Date</Text>
            </View>
            <Text style={styles.detailValue}>{booking.bookingDate}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="time-outline" size={20} color="#2E86DE" />
              <Text style={styles.detailLabel}>Time</Text>
            </View>
            <Text style={styles.detailValue}>
              {booking.startTime} - {booking.endTime}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="cash-outline" size={20} color="#4CAF50" />
              <Text style={styles.detailLabel}>Amount</Text>
            </View>
            <Text style={styles.detailValueAmount}>₹{booking.amount}</Text>
          </View>
        </View>
      </View>

      {/* User Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={50} color="#2E86DE" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{booking.user?.fullName}</Text>
            <Text style={styles.userEmail}>{booking.user?.email}</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={16} color="#2E86DE" />
              <Text style={styles.userPhone}>{booking.user?.phoneNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.statusGrid}>
          {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.statusButtonActive,
                { borderColor: getStatusColor(status) },
              ]}
              onPress={() => handleStatusChange(status)}
              disabled={updating}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  selectedStatus === status && styles.statusButtonTextActive,
                  { color: getStatusColor(status) },
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      {booking.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        </View>
      )}

      {/* Timestamps */}
      <View style={styles.section}>
        <View style={styles.timestampRow}>
          <Text style={styles.timestampLabel}>Created:</Text>
          <Text style={styles.timestampValue}>
            {new Date(booking.createdAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.timestampRow}>
          <Text style={styles.timestampLabel}>Updated:</Text>
          <Text style={styles.timestampValue}>
            {new Date(booking.updatedAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 30,
    backgroundColor: '#2C2C3E',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A4E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  turfImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#3A3A4E',
  },
  turfInfo: {
    padding: 12,
  },
  turfName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  turfCategory: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  amenityBadge: {
    backgroundColor: 'rgba(46, 134, 222, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E86DE',
  },
  detailsCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ccc',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  detailValueAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#3A3A4E',
  },
  userCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userPhone: {
    fontSize: 12,
    color: '#2E86DE',
    fontWeight: '600',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusButton: {
    flex: 1,
    minWidth: '48%',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2C2C3E',
  },
  statusButtonActive: {
    backgroundColor: 'rgba(46, 134, 222, 0.15)',
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusButtonTextActive: {
    fontWeight: '700',
  },
  notesCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  notesText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20,
  },
  timestampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timestampLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  timestampValue: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
})