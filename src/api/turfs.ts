import api from './client'

export const getTurfs = (filters?: { category?: string; featured?: boolean }) =>
  api.get('/turfs', { params: filters })

export const getTurfById = (id: string) =>
  api.get(`/turfs/${id}`)

export const createTurf = (data: any) =>
  api.post('/turfs', data)