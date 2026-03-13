import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { getTurfById } from '../../../api/turfs'
import { createBooking } from '../../../api/bookings'

export default function SlotScreen({ route, navigation }: any) {
  const { turfId } = route.params
  const [turf, setTurf] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    fetchTurf()
  }, [])

  const fetchTurf = async () => {
    try {
      const res = await getTurfById(turfId)
      setTurf(res.data.data)
    } catch (error) {
      Alert.alert('Error', 'Failed to load turf details')
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    try {
      setBooking(true)
      const endTime = new Date(`2024-01-01 ${selectedTime}`)
      endTime.setHours(endTime.getHours() + 1)

      await createBooking({
        turfId: turf.id,
        bookingDate: selectedDate,
        startTime: selectedTime,
        endTime: endTime.toTimeString().split(' ')[0],
        totalPrice: turf.price_per_hour,
      })

      Alert.alert('Success', 'Booking confirmed!', [
        {
          text: 'View Booking',
          onPress: () => navigation.navigate('Bookings'),
        },
        {
          text: 'Continue Shopping',
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    )
  }

  if (!turf) {
    return (
      <View style={styles.center}>
        <Text>Turf not found</Text>
      </View>
    )
  }

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i
    return `${hour.toString().padStart(2, '0')}:00`
  })

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: turf.image_url }} style={styles.mainImage} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.category}>{turf.category}</Text>
            <Text style={styles.name}>{turf.name}</Text>
            <Text style={styles.location}>📍 {turf.location}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>{turf.rating || 4.6}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>${turf.price_per_hour}</Text>
          <Text style={styles.perHour}>/hour</Text>
        </View>

        <Text style={styles.description}>{turf.description}</Text>

        {turf.amenities && turf.amenities.length > 0 && (
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              {turf.amenities.map((amenity: string, idx: number) => (
                <Text key={idx} style={styles.amenity}>
                  ✓ {amenity}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Select Date & Time</Text>

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.input}>
            <Text>{selectedDate}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Available Time Slots</Text>
          <FlatList
            data={timeSlots}
            scrollEnabled={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  selectedTime === item && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(item)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === item && styles.timeSlotTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={4}
            columnWrapperStyle={styles.timeSlotGrid}
          />

          <TouchableOpacity
            style={[styles.bookButton, booking && styles.bookButtonDisabled]}
            onPress={handleBooking}
            disabled={booking}
          >
            {booking ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.bookButtonText}>Book Now - ${turf.price_per_hour}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#999',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  star: {
    fontSize: 16,
    color: '#FFB800',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  perHour: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  amenitiesList: {
    marginTop: 12,
  },
  amenity: {
    fontSize: 13,
    marginBottom: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  bookingSection: {
    marginTop: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeSlotGrid: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeSlot: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotTextSelected: {
    color: 'white',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
})