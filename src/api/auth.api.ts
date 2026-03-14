import client from './client'

export const loginUser = (data: any) => {
  return client.post('/auth/login', data)
}

export const registerUser = (data: any) => {
  return client.post('/users/register', data)
}