import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch } from "react-redux"
import { loginUser } from "../../../api/auth.api"
import { setCredentials } from "../../../redux/slices/authSlice"
import { saveData, getData } from "../../../lib/storage"
import RoleSelector, { Role } from "../../../components/RoleSelector"
import { User } from "../../../types/user.types"

const REMEMBER_ME_KEY = "turfora_remember_me"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState<Role>('USER')
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch()

  const handleLogin = async () => {
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)
      const res = await loginUser({ email: email.trim(), password, role })
      const token: string = res.data?.token ?? ""
      const userData: User = res.data?.user ?? { id: '', email: email.trim(), role }

      await AsyncStorage.setItem("authToken", token)
      await AsyncStorage.setItem("authUser", JSON.stringify(userData))
      dispatch(setCredentials({ user: userData, token }))

      if (rememberMe) {
        await saveData(REMEMBER_ME_KEY, { email: email.trim() })
      } else {
        await saveData(REMEMBER_ME_KEY, null)
      }
    } catch {
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
        <Text style={styles.tagline}>Book your perfect turf</Text>
      </View>

      {/* Role Selector */}
      <RoleSelector selectedRole={role} onSelectRole={setRole} />

      {/* Email */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Remember Me */}
      <TouchableOpacity
        style={styles.rememberMeContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <Text style={styles.rememberMeText}>Remember me</Text>
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={styles.footerContainer}
      >
        <Text style={styles.footer}>
          Don't have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 6
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8
  },
  tagline: {
    fontSize: 13,
    color: "#5B8DB8",
    marginTop: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#1A1A2E"
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9"
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A2E"
  },
  button: {
    backgroundColor: "#2E86DE",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  error: {
    color: "#D32F2F",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "500"
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#2E86DE",
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxChecked: {
    backgroundColor: "#2E86DE",
    borderColor: "#2E86DE"
  },
  rememberMeText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500"
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center"
  },
  footer: {
    color: "#666",
    fontSize: 14,
    textAlign: "center"
  },
  link: {
    color: "#2E86DE",
    fontWeight: "bold"
  }
})