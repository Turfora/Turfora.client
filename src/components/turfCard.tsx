import { View, Text, Image, StyleSheet } from "react-native"
import { Turf } from "../types/turf.types"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=300&fit=crop"

type TurfCardProps = Pick<Turf, "name" | "image_url" | "price_per_hour" | "rating" | "is_featured">

export default function TurfCard({ name, image_url, price_per_hour, rating, is_featured }: TurfCardProps) {
  return (
    <View style={styles.card}>
      {is_featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>
      )}
      <Image
        source={{ uri: image_url || FALLBACK_IMAGE }}
        style={styles.image}
      />
      <View style={styles.info}>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{rating || 4.6}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>₹{price_per_hour}/hr</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  featuredBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  featuredText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 140,
    backgroundColor: "#e0e0e0",
  },
  info: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  star: {
    fontSize: 13,
    color: "#FFB800",
    marginRight: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E86DE",
  },
})