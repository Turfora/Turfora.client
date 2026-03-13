import { View, Text, Button } from "react-native"

export default function SlotScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Select Slot</Text>
      <Button title="Book 6–7 PM" onPress={() => alert("Booked")} />
    </View>
  )
}