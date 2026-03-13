import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const api = axios.create({
  baseURL: "http://10.142.91.221:5000/api"
})

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api