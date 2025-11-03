// Authentication utilities

import type { User } from "./types"
import {
  getUsers,
  saveUsers,
  getUserByEmail,
  getCurrentUser,
  setCurrentUser,
  getVerificationCodes,
  saveVerificationCodes,
} from "./storage"

export { getCurrentUser, setCurrentUser }

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = getUserByEmail(email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  if (user.password !== password) {
    return { success: false, error: "Invalid password" }
  }

  if (!user.verified) {
    return { success: false, error: "Please verify your email first" }
  }

  setCurrentUser(user)
  return { success: true, user }
}

export function signup(
  email: string,
  password: string,
  name: string,
): { success: boolean; verificationCode?: string; error?: string } {
  const existingUser = getUserByEmail(email)

  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role: "customer",
    verified: false,
    createdAt: new Date().toISOString(),
  }

  const users = getUsers()
  users.push(newUser)
  saveUsers(users)

  const verificationCode = Math.random().toString().slice(2, 8)
  const codes = getVerificationCodes()
  codes[email] = verificationCode
  saveVerificationCodes(codes)

  return { success: true, verificationCode }
}

export function verifyEmail(email: string, code: string): { success: boolean; error?: string } {
  const codes = getVerificationCodes()

  if (codes[email] !== code) {
    return { success: false, error: "Invalid verification code" }
  }

  const users = getUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  user.verified = true
  saveUsers(users)

  delete codes[email]
  saveVerificationCodes(codes)

  return { success: true }
}

export function logout() {
  setCurrentUser(null)
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}
