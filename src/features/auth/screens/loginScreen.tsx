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
import { loginUser } from "../../../api/auth.api"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)
      await loginUser({ email, password })
      navigation.replace("UserHome")
    } catch {
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/* Email */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
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
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.footer}>
          Don’t have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14
  },

  button: {
    backgroundColor: "#2E86DE",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },

  error: {
    color: "red",
    marginBottom: 10
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#666"
  },

  link: {
    color: "#2E86DE",
    fontWeight: "bold"
  }
})