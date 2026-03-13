import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch } from "react-redux"
import { registerUser } from "../../../api/auth.api"
import { setCredentials } from "../../../redux/slices/authSlice"
import RoleSelector, { Role } from "../../../components/RoleSelector"
import { User } from "../../../types/user.types"

export default function SignupScreen({ navigation }: any) {
  const dispatch = useDispatch()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<Role>("USER")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validate = (): string | null => {
    if (!fullName.trim()) return "Please enter your full name"
    if (!email.trim()) return "Please enter your email address"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address"
    }
    if (password.length < 8) return "Password must be at least 8 characters"
    if (password !== confirmPassword) return "Passwords do not match"
    if (!acceptedTerms) return "Please accept the terms & conditions"
    return null
  }

  const handleSignup = async () => {
    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      const res = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role
      })
      const token: string = res.data?.token ?? ""
      const userData: User = res.data?.user ?? { id: '', email: email.trim(), role }

      await AsyncStorage.setItem("authToken", token)
      await AsyncStorage.setItem("authUser", JSON.stringify(userData))
      dispatch(setCredentials({ user: userData, token }))
    } catch {
      setError("Registration failed. Please try again.")
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
          <Text style={styles.title}>Create Account 🚀</Text>
          <Text style={styles.subtitle}>Join Turfora today</Text>

          {/* Role Selector */}
          <RoleSelector selectedRole={role} onSelectRole={setRole} allowedRoles={["USER", "OWNER"]} />

          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Full name"
              style={styles.input}
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#aaa"
              returnKeyType="next"
            />
          </View>

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
              returnKeyType="next"
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

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm password"
              style={[styles.input, styles.passwordInput]}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#aaa"
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              accessibilityLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acceptedTerms }}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the{" "}
              <Text style={styles.termsLink}>Terms & Conditions</Text>
              {" "}and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#D32F2F" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.footerRow}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.link}>Login</Text>
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 20
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#2E86DE",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0
  },
  checkboxChecked: {
    backgroundColor: "#2E86DE",
    borderColor: "#2E86DE"
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#555",
    flex: 1,
    lineHeight: 20
  },
  termsLink: {
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
