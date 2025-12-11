"use client"

import {
  createSession,
  destroySession,
  getCurrentUser as getSessionUser,
  isAdmin as checkIsAdmin,
  isLoggedIn as checkIsLoggedIn,
} from "./session"

// Mock authentication functions for demonstration
// In a real implementation, these would make API calls to your backend

interface User {
  id: string
  studentId?: string
  email: string
  firstName: string
  lastName: string
  department: string
  level: string
  role: "student" | "admin"
  provider?: "local" | "google" | "microsoft"
  profilePicture?: string
  phone?: string
  yearOfStudy?: string
  program?: string
}

interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
}

// Mock user database
const mockUsers = [
  {
    id: "1",
    studentId: "TP12345",
    email: "student@apu.edu.my",
    firstName: "John",
    lastName: "Doe",
    department: "Computer Science",
    level: "Degree",
    password: "password123",
    role: "student" as const,
    provider: "local" as const,
  },
  {
    id: "2",
    studentId: "TP67890",
    email: "jane.smith@apu.edu.my",
    firstName: "Jane",
    lastName: "Smith",
    department: "Engineering",
    level: "Masters",
    password: "password123",
    role: "student" as const,
    provider: "local" as const,
  },
]

// Mock admin database
const mockAdmins = [
  {
    id: "admin1",
    email: "admin@apu.edu.my",
    firstName: "Admin",
    lastName: "User",
    department: "Administration",
    level: "Staff",
    password: "admin123",
    role: "admin" as const,
    provider: "local" as const,
  },
  {
    id: "admin2",
    email: "election@apu.edu.my",
    firstName: "Election",
    lastName: "Officer",
    department: "Student Affairs",
    level: "Staff",
    password: "election123",
    role: "admin" as const,
    provider: "local" as const,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock social login data
const mockSocialUsers = {
  google: [
    {
      id: "google_123",
      email: "student.google@apu.edu.my",
      firstName: "Google",
      lastName: "Student",
      department: "Computer Science",
      level: "Degree",
      role: "student" as const,
      provider: "google" as const,
      profilePicture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    },
    {
      id: "google_456",
      email: "another.student@apu.edu.my",
      firstName: "Sarah",
      lastName: "Johnson",
      department: "Engineering",
      level: "Masters",
      role: "student" as const,
      provider: "google" as const,
      profilePicture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    },
  ],
  microsoft: [
    {
      id: "ms_789",
      email: "student.microsoft@apu.edu.my",
      firstName: "Microsoft",
      lastName: "Student",
      department: "Business",
      level: "Degree",
      role: "student" as const,
      provider: "microsoft" as const,
      profilePicture: "https://graph.microsoft.com/v1.0/me/photo/$value",
    },
    {
      id: "ms_101",
      email: "mike.wilson@apu.edu.my",
      firstName: "Mike",
      lastName: "Wilson",
      department: "Arts",
      level: "Foundation",
      role: "student" as const,
      provider: "microsoft" as const,
      profilePicture: "https://graph.microsoft.com/v1.0/me/photo/$value",
    },
  ],
}

export const loginUser = async (credentials: { studentId: string; password: string }): Promise<AuthResponse> => {
  await delay(1000) // Simulate network delay

  const user = mockUsers.find((u) => u.studentId === credentials.studentId && u.password === credentials.password)

  if (user) {
    const { password, ...userWithoutPassword } = user
    const token = `student_token_${user.id}_${Date.now()}`
    
    // Create secure session
    createSession(userWithoutPassword, token)
    
    return {
      success: true,
      user: userWithoutPassword,
      token,
    }
  }

  return {
    success: false,
    message: "Invalid student ID or password.",
  }
}

export const loginAdmin = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  await delay(1200) // Simulate network delay

  const admin = mockAdmins.find((a) => a.email === credentials.email && a.password === credentials.password)

  if (admin) {
    const { password, ...adminWithoutPassword } = admin
    const token = `admin_token_${admin.id}_${Date.now()}`
    
    // Create secure session
    createSession(adminWithoutPassword, token)
    
    return {
      success: true,
      user: adminWithoutPassword,
      token,
    }
  }

  return {
    success: false,
    message: "Invalid admin credentials.",
  }
}

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  await delay(2000) // Simulate OAuth flow delay

  // In a real implementation, this would:
  // 1. Open Google OAuth popup
  // 2. Handle OAuth callback
  // 3. Exchange code for tokens
  // 4. Get user info from Google API
  // 5. Create or update user in database

  // Simulate random user selection for demo
  const randomUser = mockSocialUsers.google[Math.floor(Math.random() * mockSocialUsers.google.length)]

  // Check if user's email domain is allowed (university domain)
  if (!randomUser.email.endsWith("@apu.edu.my")) {
    return {
      success: false,
      message: "Please use your university Google account (@apu.edu.my) to sign in.",
    }
  }

  return {
    success: true,
    user: randomUser,
    token: `google_token_${randomUser.id}_${Date.now()}`,
  }
}

export const loginWithMicrosoft = async (): Promise<AuthResponse> => {
  await delay(2200) // Simulate OAuth flow delay

  // In a real implementation, this would:
  // 1. Open Microsoft OAuth popup
  // 2. Handle OAuth callback
  // 3. Exchange code for tokens
  // 4. Get user info from Microsoft Graph API
  // 5. Create or update user in database

  // Simulate random user selection for demo
  const randomUser = mockSocialUsers.microsoft[Math.floor(Math.random() * mockSocialUsers.microsoft.length)]

  // Check if user's email domain is allowed (university domain)
  if (!randomUser.email.endsWith("@apu.edu.my")) {
    return {
      success: false,
      message: "Please use your university Microsoft account (@apu.edu.my) to sign in.",
    }
  }

  return {
    success: true,
    user: randomUser,
    token: `microsoft_token_${randomUser.id}_${Date.now()}`,
  }
}

export const registerWithGoogle = async (): Promise<AuthResponse> => {
  await delay(2500) // Simulate OAuth flow + registration delay

  // Simulate Google OAuth registration
  const newUser = {
    id: `google_${Date.now()}`,
    email: `new.student.${Date.now()}@apu.edu.my`,
    firstName: "New",
    lastName: "GoogleUser",
    department: "Computer Science",
    level: "Degree",
    role: "student" as const,
    provider: "google" as const,
    profilePicture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
  }

  return {
    success: true,
    user: newUser,
    token: `google_token_${newUser.id}_${Date.now()}`,
  }
}

export const registerWithMicrosoft = async (): Promise<AuthResponse> => {
  await delay(2300) // Simulate OAuth flow + registration delay

  // Simulate Microsoft OAuth registration
  const newUser = {
    id: `ms_${Date.now()}`,
    email: `new.student.${Date.now()}@apu.edu.my`,
    firstName: "New",
    lastName: "MicrosoftUser",
    department: "Engineering",
    level: "Degree",
    role: "student" as const,
    provider: "microsoft" as const,
    profilePicture: "https://graph.microsoft.com/v1.0/me/photo/$value",
  }

  return {
    success: true,
    user: newUser,
    token: `microsoft_token_${newUser.id}_${Date.now()}`,
  }
}

export const registerUser = async (userData: any): Promise<AuthResponse> => {
  await delay(1500) // Simulate network delay

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.studentId === userData.studentId || u.email === userData.email)

  if (existingUser) {
    return {
      success: false,
      message: "A user with this student ID or email already exists.",
    }
  }

  // In a real implementation, you would:
  // 1. Hash the password
  // 2. Save to database
  // 3. Send verification email
  // 4. Return appropriate response

  const newUser = {
    id: `user_${Date.now()}`,
    studentId: userData.studentId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    department: userData.department,
    level: userData.level,
    role: "student" as const,
    provider: "local" as const,
  }

  // Add to mock database (in memory only)
  mockUsers.push({
    ...newUser,
    password: userData.password, // In real app, this would be hashed
  })

  return {
    success: true,
    user: newUser,
    token: `student_token_${newUser.id}_${Date.now()}`,
  }
}

export const getCurrentUser = (): User | null => {
  return getSessionUser()
}

export const isAdmin = (): boolean => {
  return checkIsAdmin()
}

export const isLoggedIn = (): boolean => {
  return checkIsLoggedIn()
}

export const logout = (): void => {
  destroySession()
}

// Update user profile
export const updateUserProfile = (userData: Partial<User>): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    // Update session storage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }
}

// Get demo credentials for testing
export const getDemoCredentials = () => {
  return {
    student: {
      studentId: "TP12345",
      password: "password123",
    },
    admin: {
      email: "admin@apu.edu.my",
      password: "admin123",
    },
    social: {
      google: "Click 'Continue with Google' to simulate Google login",
      microsoft: "Click 'Continue with Microsoft' to simulate Microsoft login",
    },
  }
}