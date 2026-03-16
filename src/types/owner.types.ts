export interface Turf {
  id: string
  name: string
  price_per_hour: number
  location: string
  image_url?: string
}

export interface Booking {
  id: string
  turfName: string
  userName: string
  startTime: string
  endTime: string
  amount: number
  status: "pending" | "completed" | "cancelled"
  bookingDate: string
}

export interface OwnerStats {
  totalRevenue: number
  totalBookings: number
  totalTurfs: number
  monthlyRevenue: number
}
