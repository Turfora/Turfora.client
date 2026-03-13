import { View, Text, StyleSheet } from "react-native"
import Button from "../../../components/Button"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turfora App 🚀</Text>
      <Button title="Explore Turfs" onPress={() => {}} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 }
})