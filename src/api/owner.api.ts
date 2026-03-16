import client from './client'

// Revenue APIs
export const getOwnerRevenue = () => {
  console.log('[Owner API] Fetching revenue stats')
  return client.get('/revenue')
}

export const getTurfRevenue = (turfId: string) => {
  console.log('[Owner API] Fetching turf revenue:', turfId)
  return client.get(`/revenue/turf/${turfId}`)
}

// Turf APIs
export const createTurf = (data: any) => {
  console.log('[Owner API] Creating turf')
  return client.post('/turfs', data)
}

export const getTurfsByOwner = () => {
  console.log('[Owner API] Fetching owner turfs')
  return client.get('/turfs/owner/my-turfs')
}

export const getTurfsByOwnerId = (ownerId: string) => {
  console.log('[Owner API] Fetching turfs for owner:', ownerId)
  return client.get(`/turfs/owner/${ownerId}`)
}

export const getTurfById = (turfId: string) => {
  console.log('[Owner API] Fetching turf:', turfId)
  return client.get(`/turfs/${turfId}`)
}

export const updateTurf = (turfId: string, data: any) => {
  console.log('[Owner API] Updating turf:', turfId)
  return client.put(`/turfs/${turfId}`, data)
}

export const deleteTurf = (turfId: string) => {
  console.log('[Owner API] Deleting turf:', turfId)
  return client.delete(`/turfs/${turfId}`)
}

export const getTurfStats = (turfId: string) => {
  console.log('[Owner API] Getting turf stats:', turfId)
  return client.get(`/turfs/${turfId}/stats`)
}

// Booking APIs
export const getTodayBookings = () => {
  console.log('[Owner API] Fetching today bookings')
  return client.get('/bookings/owner/today')
}

export const getOwnerBookings = (limit?: number, offset?: number) => {
  console.log('[Owner API] Fetching owner bookings')
  return client.get('/bookings/owner/all', {
    params: { limit, offset },
  })
}

export const getBookingsByOwnerId = (ownerId: string) => {
  console.log('[Owner API] Fetching bookings for owner:', ownerId)
  return client.get(`/bookings/owner/${ownerId}`)
}

export const updateBookingStatus = (bookingId: string, status: string) => {
  console.log('[Owner API] Updating booking status:', bookingId)
  return client.put(`/bookings/${bookingId}/status`, { status })
}

export const getBookingDetails = (bookingId: string) => {
  console.log('[Owner API] Getting booking details:', bookingId)
  return client.get(`/bookings/${bookingId}`)
}