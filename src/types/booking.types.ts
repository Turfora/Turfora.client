export interface Booking {
  id: string
  user_id: string
  turf_id: string
  status: BookingStatus
  booking_date: string
  start_time: string
  end_time: string
  total_price: number
  notes?: string
  created_at?: string
  updated_at?: string
  turf?: {
    id: string
    name: string
    category?: string
    location?: string
    images?: string[]
    amenities?: string[]
  }
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface GetBookingsParams {
  status?: BookingStatus
  page?: number
  limit?: number
}

export interface GetBookingsResponse {
  data: Booking[]
  total: number
  page: number
  limit: number
}
