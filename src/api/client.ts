import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://10.142.91.221:5000/api' // ← Change this

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add token to every request
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error reading token:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken')
    }
    return Promise.reject(error)
  }
)

export default client