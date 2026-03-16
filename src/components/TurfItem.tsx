import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface TurfItemProps {
  turf: {
    id: string
    name: string
    location?: string
    price_per_hour?: number
    pricePerHour?: number
  }
  onEdit?: (turfId: string) => void
  onDelete?: (turfId: string) => void
}

export default function TurfItem({ turf, onEdit, onDelete }: TurfItemProps) {
  const price = turf.price_per_hour ?? turf.pricePerHour

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="image-outline" size={40} color="#2E86DE" />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{turf.name}</Text>
        {price !== undefined && (
          <Text style={styles.price}>₹{price}/hr</Text>
        )}
        {turf.location ? (
          <Text style={styles.location}>📍 {turf.location}</Text>
        ) : null}

        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(turf.id)}
            >
              <Ionicons name="pencil" size={16} color="#2E86DE" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(turf.id)}
            >
              <Ionicons name="trash" size={16} color="#FF6B6B" />
              <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  iconContainer: {
    width: 80,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E86DE',
  },
})
