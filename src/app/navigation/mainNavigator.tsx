import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../../features/auth/screens/loginScreen"
import UserHome from "../../features/user/screens/userHome"

const Stack = createNativeStackNavigator()

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserHome" component={UserHome} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}