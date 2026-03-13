import api from "./client"

export const registerUser = (data: any) =>
  api.post("/users/register", data)

export const loginUser = (data: any) =>
  api.post("/auth/login", data)