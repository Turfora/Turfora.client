import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../../features/auth/screens/loginScreen"
import SignupScreen from "../../features/auth/screens/signupScreen"
import UserHome from "../../features/user/screens/userHome"
import OwnerDashboard from "../../features/owner/screens/ownerDashboard"
import AdminDashboard from "../../features/admin/screens/adminDashboard"

const Stack = createNativeStackNavigator()

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
