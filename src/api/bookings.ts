import api from './client'
import { GetBookingsParams } from '../types/booking.types'

export const createBooking = (data: any) =>
  api.post('/bookings', data)

export const getUserBookings = (params?: GetBookingsParams) =>
  api.get('/bookings/my-bookings', { params })