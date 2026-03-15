import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { createTurf } from '../../../api/owner.api'

const AMENITIES = [
  'Floodlights',
  'Parking',
  'Washrooms',
  'Changing Room',
  'Canteen',
  'First Aid',
  'WiFi',
  'AC',
]

const SPORTS_CATEGORIES = ['Cricket', 'Football', 'Volleyball', 'Badminton']

export default function AddTurfScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: 'Cricket',
    pricePerHour: '',
    openingTime: '06:00',
    closingTime: '22:00',
    phoneNumber: '',
    amenities: [] as string[],
  })

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      })

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri)
        setImages([...images, ...newImages])
      }
    } catch (error) {
      console.error('[AddTurfScreen] Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Turf name is required'
    if (!formData.description.trim()) return 'Description is required'
    if (!formData.location.trim()) return 'Location is required'
    if (!formData.pricePerHour) return 'Price per hour is required'
    if (!formData.phoneNumber.trim()) return 'Phone number is required'
    if (images.length === 0) return 'At least one image is required'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      Alert.alert('Validation Error', validationError)
      return
    }

    try {
      setLoading(true)
      const payload = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour),
        images,
      }

      await createTurf(payload)
      Alert.alert('Success', 'Turf created successfully!')
      navigation.goBack()
    } catch (error: any) {
      console.error('[AddTurfScreen] Error:', error)
      Alert.alert('Error', error.response?.data?.message || 'Failed to create turf')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Turf Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Green Field Cricket"
              placeholderTextColor="#666"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your turf facilities..."
              placeholderTextColor="#666"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full address"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your contact number"
              placeholderTextColor="#666"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {SPORTS_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    formData.category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat })}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Pricing & Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Hours</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Price Per Hour (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 500"
              placeholderTextColor="#666"
              value={formData.pricePerHour}
              onChangeText={(text) =>
                setFormData({ ...formData, pricePerHour: text })
              }
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.timeRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Opening Time</Text>
              <TextInput
                style={styles.input}
                placeholder="06:00"
                placeholderTextColor="#666"
                value={formData.openingTime}
                onChangeText={(text) =>
                  setFormData({ ...formData, openingTime: text })
                }
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Closing Time</Text>
              <TextInput
                style={styles.input}
                placeholder="22:00"
                placeholderTextColor="#666"
                value={formData.closingTime}
                onChangeText={(text) =>
                  setFormData({ ...formData, closingTime: text })
                }
              />
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityButton,
                  formData.amenities.includes(amenity) &&
                    styles.amenityButtonActive,
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <Text
                  style={[
                    styles.amenityText,
                    formData.amenities.includes(amenity) &&
                      styles.amenityTextActive,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <View style={styles.imagesHeader}>
            <Text style={styles.sectionTitle}>Images *</Text>
            {images.length > 0 && <Text style={styles.imageCount}>{images.length}</Text>}
          </View>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickImage}
          >
            <Ionicons name="cloud-upload-outline" size={32} color="#2E86DE" />
            <Text style={styles.uploadText}>Add Images</Text>
            <Text style={styles.uploadSubtext}>Choose multiple photos</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <FlatList
              data={images}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 8 }}
              renderItem={({ item, index }) => (
                <View style={styles.imageContainer}>
                  <View style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Create Turf</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40, // Extra space to scroll past buttons
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  imagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageCount: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#2E86DE',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  formGroup: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#2C2C3E',
    borderWidth: 1,
    borderColor: '#3A3A4E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#2C2C3E',
    borderWidth: 1,
    borderColor: '#3A3A4E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(46, 134, 222, 0.2)',
    borderColor: '#2E86DE',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  categoryTextActive: {
    color: '#2E86DE',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#2C2C3E',
    borderWidth: 1,
    borderColor: '#3A3A4E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  amenityButtonActive: {
    backgroundColor: 'rgba(46, 134, 222, 0.2)',
    borderColor: '#2E86DE',
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  amenityTextActive: {
    color: '#2E86DE',
  },
  uploadButton: {
    backgroundColor: '#2C2C3E',
    borderWidth: 2,
    borderColor: '#2E86DE',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E86DE',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2C2C3E',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3A3A4E',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#3A3A4E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})