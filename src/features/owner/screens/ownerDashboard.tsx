import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../redux/store'
import { logout } from '../../../redux/slices/authSlice'
import { getOwnerRevenue, getTodayBookings, getTurfsByOwner } from '../../../api/owner.api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')

interface RevenueStats {
  totalRevenue: number
  todayRevenue: number
  todayRevenuePercentage: number
}

interface Booking {
  id: string
  turfName: string
  userName: string
  startTime: string
  endTime: string
  amount: number
  status: string
}

interface Turf {
  id: string
  name: string
  pricePerHour: number
  location: string
  imageUrl?: string
}

export default function OwnerDashboard({ navigation }: any) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'turfs' | 'settings'>('dashboard')
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    todayRevenue: 0,
    todayRevenuePercentage: 0,
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [revenueRes, bookingsRes, turfsRes] = await Promise.all([
        getOwnerRevenue(),
        getTodayBookings(),
        getTurfsByOwner(),
      ])

      setRevenueStats({
        totalRevenue: revenueRes.data?.data?.totalRevenue || 0,
        todayRevenue: revenueRes.data?.data?.todayRevenue || 0,
        todayRevenuePercentage: revenueRes.data?.data?.todayRevenuePercentage || 0,
      })
      setBookings(bookingsRes.data?.data?.bookings || [])
      setTurfs(turfsRes.data?.data || [])
    } catch (error) {
      console.error('[OwnerDashboard] Error:', error)
      Alert.alert('Error', 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  /**
   * Handle Logout
   */
  /**
   * Handle Logout
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[OwnerDashboard] Logging out...')

              // Clear Redux state
              dispatch(logout())  // CHANGED THIS LINE

              // Clear AsyncStorage
              await AsyncStorage.multiRemove(['authToken', 'authUser'])

              console.log('[OwnerDashboard] Logout successful')

              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            } catch (error) {
              console.error('[OwnerDashboard] Logout error:', error)
              Alert.alert('Error', 'Failed to logout')
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerName}>{user?.fullname || 'Owner'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {Math.min(bookings.length, 9)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 'dashboard' ? (
        // Dashboard Tab
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Revenue Cards */}
          <View style={styles.revenueSection}>
            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <Text style={styles.revenueLabel}>OVERALL REVENUE</Text>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.revenueAmount}>
                ₹{revenueStats.totalRevenue.toFixed(2)}
              </Text>
              <Text style={styles.revenueSubtext}>
                {turfs.length} turfs • All time
              </Text>
            </View>

            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <Text style={styles.revenueLabel}>TODAY'S REVENUE</Text>
                <View
                  style={[
                    styles.percentageBadge,
                    revenueStats.todayRevenuePercentage >= 0
                      ? styles.percentageBadgePositive
                      : styles.percentageBadgeNegative,
                  ]}
                >
                  <Text style={styles.percentageText}>
                    {revenueStats.todayRevenuePercentage >= 0 ? '+' : ''}
                    {revenueStats.todayRevenuePercentage}%
                  </Text>
                </View>
              </View>
              <Text style={styles.revenueAmount}>
                ₹{revenueStats.todayRevenue.toFixed(2)}
              </Text>
              <Text style={styles.revenueSubtext}>vs yesterday</Text>
            </View>
          </View>

          {/* Today's Bookings */}
          <View style={styles.bookingsSection}>
            <View style={styles.bookingsHeader}>
              <Text style={styles.bookingsTitle}>
                TODAY'S BOOKINGS • {bookings.length}
              </Text>
              <TouchableOpacity style={styles.scrollAllButton}>
                <Text style={styles.scrollAllText}>SCROLL</Text>
                <Ionicons name="chevron-forward" size={16} color="#2E86DE" />
              </TouchableOpacity>
            </View>

            {bookings.length === 0 ? (
              <View style={styles.noBookingsContainer}>
                <Ionicons name="calendar-outline" size={48} color="#666" />
                <Text style={styles.noBookingsText}>No bookings today</Text>
              </View>
            ) : (
              <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <View style={styles.bookingCard}>
                    <View style={styles.bookingCardHeader}>
                      <View>
                        <Text style={styles.bookingTurfName}>{item.turfName}</Text>
                        <Text style={styles.bookingUserName}>{item.userName}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          item.status === 'completed'
                            ? styles.statusBadgeCompleted
                            : item.status === 'confirmed'
                            ? styles.statusBadgeConfirmed
                            : styles.statusBadgePending,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {item.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bookingCardBody}>
                      <View style={styles.bookingTime}>
                        <Ionicons name="time-outline" size={16} color="#999" />
                        <Text style={styles.bookingTimeText}>
                          {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                      <Text style={styles.bookingAmount}>₹{item.amount}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AddTurf')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.actionTitle}>Add Turf</Text>
              <Text style={styles.actionSubtitle}>Create new listing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setActiveTab('turfs')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="basketball" size={32} color="#2E86DE" />
              </View>
              <Text style={styles.actionTitle}>My Turfs</Text>
              <Text style={styles.actionSubtitle}>{turfs.length} listings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="bar-chart" size={32} color="#FF9800" />
              </View>
              <Text style={styles.actionTitle}>Analytics</Text>
              <Text style={styles.actionSubtitle}>View stats</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : activeTab === 'turfs' ? (
        // Turfs Tab
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.turfsSection}>
            <View style={styles.turfsHeader}>
              <Text style={styles.turfsSectionTitle}>My Turfs</Text>
              <TouchableOpacity
                style={styles.addTurfButton}
                onPress={() => navigation.navigate('AddTurf')}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {turfs.length === 0 ? (
              <View style={styles.emptyTurfsContainer}>
                <Ionicons name="basketball-outline" size={48} color="#666" />
                <Text style={styles.emptyText}>No turfs yet</Text>
                <TouchableOpacity
                  style={styles.createFirstButton}
                  onPress={() => navigation.navigate('AddTurf')}
                >
                  <Text style={styles.createFirstButtonText}>Create Your First Turf</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={turfs}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.turfListCard}>
                    <View style={styles.turfImage}>
                      <Ionicons name="image-outline" size={40} color="#2E86DE" />
                    </View>

                    <View style={styles.turfCardContent}>
                      <Text style={styles.turfCardName}>{item.name}</Text>
                      <Text style={styles.turfCardPrice}>₹{item.pricePerHour}/hr</Text>
                      <Text style={styles.turfCardLocation}>📍 {item.location}</Text>

                      <View style={styles.turfCardActions}>
                        <TouchableOpacity
                          style={styles.turfActionButton}
                          onPress={() =>
                            navigation.navigate('EditTurf', { turfId: item.id })
                          }
                        >
                          <Ionicons name="pencil" size={16} color="#2E86DE" />
                          <Text style={styles.turfActionText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.turfActionButton}>
                          <Ionicons name="stats-chart" size={16} color="#4CAF50" />
                          <Text style={styles.turfActionText}>Stats</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.turfActionButton}>
                          <Ionicons name="trash" size={16} color="#FF6B6B" />
                          <Text style={styles.turfActionText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        // Settings Tab
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Settings</Text>

            <View style={styles.settingsGroup}>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="person-outline" size={20} color="#2E86DE" />
                <Text style={styles.settingItemText}>Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="lock-closed-outline" size={20} color="#2E86DE" />
                <Text style={styles.settingItemText}>Change Password</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="notifications-outline" size={20} color="#2E86DE" />
                <Text style={styles.settingItemText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingsGroup}>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="help-circle-outline" size={20} color="#2E86DE" />
                <Text style={styles.settingItemText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="information-circle-outline" size={20} color="#2E86DE" />
                <Text style={styles.settingItemText}>About</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Logout Button - NOW WORKING */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'dashboard' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons
            name={activeTab === 'dashboard' ? 'bar-chart' : 'bar-chart-outline'}
            size={24}
            color={activeTab === 'dashboard' ? '#2E86DE' : '#999'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'turfs' && styles.tabButtonActive]}
          onPress={() => setActiveTab('turfs')}
        >
          <Ionicons
            name={activeTab === 'turfs' ? 'basketball' : 'basketball-outline'}
            size={24}
            color={activeTab === 'turfs' ? '#2E86DE' : '#999'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'settings' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={24}
            color={activeTab === 'settings' ? '#2E86DE' : '#999'}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: '#2E86DE',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
  },
  headerGreeting: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  revenueSection: {
    marginBottom: 24,
    gap: 12,
  },
  revenueCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  revenueLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  revenueSubtext: {
    fontSize: 12,
    color: '#666',
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  percentageBadgePositive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  percentageBadgeNegative: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  bookingsSection: {
    marginBottom: 24,
  },
  bookingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scrollAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E86DE',
  },
  noBookingsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noBookingsText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  bookingCard: {
    width: width - 48,
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingTurfName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  bookingUserName: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  statusBadgeConfirmed: {
    backgroundColor: 'rgba(46, 134, 222, 0.2)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E86DE',
  },
  bookingCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingTimeText: {
    fontSize: 12,
    color: '#999',
  },
  bookingAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  quickActionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  actionIconContainer: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#999',
  },
  turfsSection: {
    paddingBottom: 20,
  },
  turfsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  turfsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  addTurfButton: {
    backgroundColor: '#2E86DE',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTurfsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    fontWeight: '600',
  },
  createFirstButton: {
    backgroundColor: '#2E86DE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  turfListCard: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  turfImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turfCardContent: {
    flex: 1,
  },
  turfCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  turfCardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  turfCardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  turfCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  turfActionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3A3A4E',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  turfActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E86DE',
  },
  settingsSection: {
    paddingBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  settingsGroup: {
    backgroundColor: '#2C2C3E',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A4E',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A4E',
    gap: 12,
  },
  settingItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#2C2C3E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3A3A4E',
    paddingBottom: 16,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(46, 134, 222, 0.1)',
    borderRadius: 8,
  },
})