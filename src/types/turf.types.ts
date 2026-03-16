export interface Turf {
  id: string
  name: string
  description?: string
  location?: string
  category?: string
  image_url?: string
  images?: string[]
  is_featured?: boolean
  is_active?: boolean
  rating?: number
  price_per_hour: number
<<<<<<< HEAD
  opening_time?: string
  closing_time?: string
  phone_number?: string
  amenities?: string[]
  owner_id?: string
  created_at?: string
  updated_at?: string
=======
  location?: string
  category?: string
  description?: string
  amenities?: string[]
>>>>>>> cc55b01fd53b497840054d4fac594d556d62524d
}
