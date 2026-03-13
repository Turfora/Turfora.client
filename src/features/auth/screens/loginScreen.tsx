import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch } from "react-redux"
import { loginUser } from "../../../api/auth.api"
import { setCredentials } from "../../../redux/slices/authSlice"
import { saveData, getData } from "../../../lib/storage"
import RoleSelector, { Role } from "../../../components/RoleSelector"

const REMEMBER_ME_KEY = "turfora_remember_me"

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role>("USER")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadSavedEmail = async () => {
      const saved = await getData(REMEMBER_ME_KEY)
      if (saved?.email) {
        setEmail(saved.email)
        setRememberMe(true)
      }
    }
    loadSavedEmail()
  }, [])

  const handleLogin = async () => {
    setError("")

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }
    if (!password) {
      setError("Please enter your password")
      return
    }

    try {
      setLoading(true)
      const res = await loginUser({ email: email.trim(), password, role })
      const token: string = res.data?.token ?? ""
      const userData: { email: string; role: Role } = res.data?.user ?? { email: email.trim(), role }

      await AsyncStorage.setItem("authToken", token)
      await AsyncStorage.setItem("authUser", JSON.stringify(userData))
      dispatch(setCredentials({ user: userData, token }))

      if (rememberMe) {
        await saveData(REMEMBER_ME_KEY, { email: email.trim() })
      } else {
        await saveData(REMEMBER_ME_KEY, null)
      }
    } catch {
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        
          <Text style={styles.tagline}>Book your perfect turf</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Role Selector */}
          <RoleSelector selectedRole={role} onSelectRole={setRole} />

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Email address"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#aaa"
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              style={[styles.input, styles.passwordInput]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#aaa"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* Remember me + Forgot password */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert("Reset Password", "Password reset instructions will be sent to your email address.")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#D32F2F" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Login"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Signup Link */}
          <TouchableOpacity
            style={styles.footerRow}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#EAF4FF"
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 25
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 20
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A5FA8",
    marginTop: 10,
    letterSpacing: 0.5
  },
  tagline: {
    fontSize: 13,
    color: "#5B8DB8",
    marginTop: 2
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: "#FAFAFA"
  },
  inputIcon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A1A2E"
  },
  passwordInput: {
    paddingRight: 8
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
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
  checkboxLabel: {
    fontSize: 13,
    color: "#555"
  },
  forgotText: {
    fontSize: 13,
    color: "#2E86DE",
    fontWeight: "600"
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
    flex: 1
  },
  button: {
    backgroundColor: "#2E86DE",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  footerText: {
    fontSize: 14,
    color: "#666"
  },
  link: {
    fontSize: 14,
    color: "#2E86DE",
    fontWeight: "700"
  }
})
