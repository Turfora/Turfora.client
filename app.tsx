import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import MainNavigator from "./src/app/navigation/mainNavigator"
import { store } from "./src/redux/store"

export default function App() {
  useEffect(() => {
    // Check auth on app load
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      console.log('[App] Auth token:', token ? 'exists' : 'not found')
    } catch (error) {
      console.error('[App] Error checking auth:', error)
    }
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <MainNavigator />
      </SafeAreaProvider>
    </Provider>
  )
}