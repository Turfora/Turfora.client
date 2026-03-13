import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import { SafeAreaProvider } from "react-native-safe-area-context"

import MainNavigator from "./src/app/navigation/mainNavigator"
import { store } from "./src/redux/store"

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <MainNavigator />
      </SafeAreaProvider>
    </Provider>
  )
}