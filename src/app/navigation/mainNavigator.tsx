import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

// Auth Screens
import LoginScreen from '../../features/auth/screens/loginScreen'
import SignupScreen from '../../features/auth/screens/signupScreen'

// User Screens
import HomeScreen from '../../features/user/screens/homeScreen'
import SlotScreen from '../../features/user/screens/slotScreen'
import BookingsScreen from '../../features/user/screens/BookingsScreen'
import ProfileScreen from '../../features/user/screens/profileScreen'
import AllTurfsScreen from '../../features/user/screens/AllTurfsScreen'

// Owner Screens
import OwnerDashboard from '../../features/owner/screens/ownerDashboard'
import AddTurfScreen from '../../features/owner/screens/addTurfScreen'
import EditTurfScreen from '../../features/owner/screens/EditTurfScreen'
import BookingDetailsScreen from '../../features/owner/screens/BookingDetailsScreen'

// Admin Screens
import AdminDashboard from '../../features/admin/screens/adminDashboard'

// Redux
import { RootState } from '../../redux/store'
import { setCredentials, setLoading } from '../../redux/slices/authSlice'

// Stack Navigators
const AuthStack = createNativeStackNavigator()
const UserTab = createBottomTabNavigator()
const UserStack = createNativeStackNavigator()
const OwnerStack = createNativeStackNavigator()
const AdminStack = createNativeStackNavigator()

// ============ AUTH NAVIGATOR ============
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  )
}

// ============ USER NAVIGATORS ============
function UserTabNavigator() {
  return (
    <UserTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E86DE',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#2C2C3E',
          borderTopColor: '#3A3A4E',
        },
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline'
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <UserTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <UserTab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{ title: 'My Bookings' }}
      />
      <UserTab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </UserTab.Navigator>
  )
}

function UserNavigator() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen name="UserHome" component={UserTabNavigator} />
      <UserStack.Screen
        name="TurfDetail"
        component={SlotScreen}
        options={{
          headerShown: true,
          title: 'Book a Slot',
          headerStyle: { backgroundColor: '#2E86DE' },
          headerTintColor: '#fff',
        }}
      />
      <UserStack.Screen
        name="AllTurfs"
        component={AllTurfsScreen}
        options={{
          headerShown: true,
          title: 'All Turfs',
          headerStyle: { backgroundColor: '#2E86DE' },
          headerTintColor: '#fff',
        }}
      />
    </UserStack.Navigator>
  )
}

// ============ OWNER NAVIGATOR ============
function OwnerNavigator() {
  return (
    <OwnerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Dashboard */}
      <OwnerStack.Screen
        name="OwnerDashboard"
        component={OwnerDashboard}
        options={{
          headerShown: false,
        }}
      />

      {/* Add Turf Screen */}
      <OwnerStack.Screen
        name="AddTurf"
        component={AddTurfScreen}
        options={{
          headerShown: true,
          title: 'Add New Turf',
          headerStyle: {
            backgroundColor: '#2E86DE',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            color: '#fff',
            fontSize: 18,
          },
          headerBackVisible: false,
        }}
      />

      {/* Edit Turf Screen */}
      <OwnerStack.Screen
        name="EditTurf"
        component={EditTurfScreen}
        options={{
          headerShown: true,
          title: 'Edit Turf',
          headerStyle: {
            backgroundColor: '#2E86DE',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            color: '#fff',
            fontSize: 18,
          },
          headerBackVisible: false,
        }}
      />

      {/* Booking Details Screen */}
      <OwnerStack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </OwnerStack.Navigator>
  )
}

// ============ ADMIN NAVIGATOR ============
function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} />
    </AdminStack.Navigator>
  )
}

// ============ MAIN NAVIGATOR ============
export default function MainNavigator() {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        console.log('[MainNavigator] Loading auth state...')
        const token = await AsyncStorage.getItem('authToken')
        const userStr = await AsyncStorage.getItem('authUser')

        console.log('[MainNavigator] Token found:', !!token)
        console.log('[MainNavigator] User found:', !!userStr)

        if (token && userStr) {
          try {
            const savedUser = JSON.parse(userStr)
            console.log('[MainNavigator] User role:', savedUser.role)
            dispatch(setCredentials({ user: savedUser, token }))
          } catch (parseError) {
            console.error('[MainNavigator] Error parsing saved user data, clearing storage:', parseError)
            await AsyncStorage.removeItem('authToken')
            await AsyncStorage.removeItem('authUser')
          }
        }
      } catch (error) {
        console.error('[MainNavigator] Error loading auth state:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }
    loadAuthState()
  }, [dispatch])

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#1A1A2E'
      }}>
        <ActivityIndicator size="large" color="#2E86DE" />
      </View>
    )
  }

  console.log('[MainNavigator] Rendering navigator for user role:', user?.role)

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'ADMIN' ? (
        <AdminNavigator />
      ) : user.role === 'OWNER' ? (
        <OwnerNavigator />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  )
}