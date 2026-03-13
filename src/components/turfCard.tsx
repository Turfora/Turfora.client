import { View, Text, StyleSheet } from "react-native"

export default function TurfCard({ name }: { name: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: "#eee", marginBottom: 10, borderRadius: 10 },
  title: { fontSize: 18 }
})