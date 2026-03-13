import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

import LoginScreen from '../../features/auth/screens/loginScreen'
import SignupScreen from '../../features/auth/screens/signupScreen'
import HomeScreen from '../../features/user/screens/homeScreen'
import SlotScreen from '../../features/user/screens/slotScreen'
import BookingsScreen from '../../features/user/screens/BookingsScreen'
import ProfileScreen from '../../features/user/screens/profileScreen'
import AllTurfsScreen from '../../features/user/screens/AllTurfsScreen'
import AdminDashboard from '../../features/admin/screens/adminDashboard'
import OwnerDashboard from '../../features/owner/screens/ownerDashboard'

import { RootState } from '../../redux/store'
import { setCredentials, setLoading } from '../../redux/slices/authSlice'

const AuthStack = createNativeStackNavigator()
const UserTab = createBottomTabNavigator()
const UserStack = createNativeStackNavigator()
const AdminStack = createNativeStackNavigator()
const OwnerStack = createNativeStackNavigator()

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  )
}

function UserTabNavigator() {
  return (
    <UserTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E86DE',
        tabBarInactiveTintColor: '#999',
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
      <UserTab.Screen name="Home" component={HomeScreen} />
      <UserTab.Screen name="Bookings" component={BookingsScreen} />
      <UserTab.Screen name="Profile" component={ProfileScreen} />
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
        options={{ headerShown: true, title: 'Book a Slot' }}
      />
      <UserStack.Screen
        name="AllTurfs"
        component={AllTurfsScreen}
        options={{ headerShown: true, title: 'All Turfs' }}
      />
    </UserStack.Navigator>
  )
}

function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} />
    </AdminStack.Navigator>
  )
}

function OwnerNavigator() {
  return (
    <OwnerStack.Navigator screenOptions={{ headerShown: false }}>
      <OwnerStack.Screen name="OwnerDashboard" component={OwnerDashboard} />
    </OwnerStack.Navigator>
  )
}

export default function MainNavigator() {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const userStr = await AsyncStorage.getItem('authUser')
        if (token && userStr) {
          const savedUser = JSON.parse(userStr)
          dispatch(setCredentials({ user: savedUser, token }))
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E86DE" />
      </View>
    )
  }

  const renderNavigator = () => {
    if (!user) return <AuthNavigator />
    if (user.role === 'ADMIN') return <AdminNavigator />
    if (user.role === 'OWNER') return <OwnerNavigator />
    return <UserNavigator />
  }

  return (
    <NavigationContainer>
      {renderNavigator()}
    </NavigationContainer>
  )
}
