import api from './client'

export const createBooking = (data: any) =>
  api.post('/bookings', data)

export const getUserBookings = () =>
  api.get('/bookings/my-bookings')