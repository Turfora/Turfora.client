import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface BookingItemProps {
  booking: {
    id: string
    turfName?: string
    userName?: string
    startTime?: string
    endTime?: string
    amount?: number
    status: string
  }
  onPress?: (bookingId: string) => void
}

function getStatusColor(status: string) {
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

export default function BookingItem({ booking, onPress }: BookingItemProps) {
  const statusColor = getStatusColor(booking.status)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(booking.id)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {booking.turfName ? (
              <Text style={styles.turfName}>{booking.turfName}</Text>
            ) : null}
            {booking.userName ? (
              <Text style={styles.userName}>{booking.userName}</Text>
            ) : null}
          </View>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          {booking.startTime && booking.endTime ? (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#999" />
              <Text style={styles.detailText}>
                {booking.startTime} - {booking.endTime}
              </Text>
            </View>
          ) : null}
          {booking.amount !== undefined ? (
            <Text style={styles.amount}>₹{booking.amount}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  statusBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  turfName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  userName: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#999',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
})
