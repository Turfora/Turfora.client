import { TouchableOpacity, Text, StyleSheet } from "react-native"

export default function Button({
  title,
  onPress
}: {
  title: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2E86DE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  text: { color: "#fff", fontWeight: "bold" }
})