import { View, Text, FlatList } from "react-native"
import TurfCard from "../../../components/turfCard"

const turfs = [
  { id: "1", name: "Arena Turf" },
  { id: "2", name: "Champions Ground" }
]

export default function UserHome() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Nearby Turfs</Text>

      <FlatList
        data={turfs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TurfCard name={item.name} />}
      />
    </View>
  )
}