"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  getCurrentUser,
  signInWithEmail,
  signInWithPhone,
  signOut,
  signUp,
  type UserRole,
} from "@/lib/supabase"

// تعريف نوع سياق المصادقة
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    phone: string,
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  authError: string | null
  clearAuthError: () => void
}

// إنشاء سياق المصادقة
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// مزود المصادقة
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  // التحقق من المستخدم الحالي عند تحميل التطبيق
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  // وظيفة تسجيل الدخول
  const login = async (phoneOrEmail: string, password: string) => {
    try {
      console.log("Attempting login with:", phoneOrEmail)
      setAuthError(null)

      // التحقق مما إذا كان المدخل بريدًا إلكترونيًا أو رقم هاتف
      const isEmail = phoneOrEmail.includes("@")

      let result

      if (isEmail) {
        console.log("Logging in with email")
        result = await signInWithEmail(phoneOrEmail, password)
      } else {
        console.log("Logging in with phone")
        result = await signInWithPhone(phoneOrEmail, password)
      }

      console.log("Login result:", result)

      if (result.error) {
        console.error("Login error:", result.error)
        setAuthError(result.error.message || "فشل تسجيل الدخول")
        return { success: false, error: result.error.message || "فشل تسجيل الدخول" }
      }

      if (!result.data) {
        setAuthError("لم يتم العثور على بيانات المستخدم")
        return { success: false, error: "لم يتم العثور على بيانات المستخدم" }
      }

      setUser(result.data)
      return { success: true }
    } catch (error: any) {
      console.error("Login exception:", error)
      setAuthError(error.message || "حدث خطأ أثناء تسجيل الدخول")
      return { success: false, error: error.message || "حدث خطأ أثناء تسجيل الدخول" }
    }
  }

  // وظيفة إنشاء حساب
  const register = async (name: string, phone: string, email: string, password: string, role: UserRole = "user") => {
    try {
      console.log("Registering with:", { name, phone, email, role })
      setAuthError(null)

      const result = await signUp(email, password, phone, name, role)

      console.log("Registration result:", result)

      if (result.error) {
        console.error("Registration error:", result.error)
        setAuthError(result.error.message || "فشل إنشاء الحساب")
        return { success: false, error: result.error.message || "فشل إنشاء الحساب" }
      }

      if (!result.data) {
        setAuthError("لم يتم إنشاء الحساب بنجاح")
        return { success: false, error: "لم يتم إنشاء الحساب بنجاح" }
      }

      // تعيين المستخدم إذا كان التسجيل ناجحًا
      if (result.data.user) {
        setUser(result.data.user)
      }

      return { success: true }
    } catch (error: any) {
      console.error("Registration exception:", error)
      setAuthError(error.message || "حدث خطأ أثناء إنشاء الحساب")
      return { success: false, error: error.message || "حدث خطأ أثناء إنشاء الحساب" }
    }
  }

  // وظيفة تسجيل الخروج
  const logout = async () => {
    try {
      // تسجيل الخروج من supabase
      await signOut()
      // إعادة تعيين حالة المستخدم
      setUser(null)
      // توجيه المستخدم إلى صفحة تسجيل الدخول
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        authError,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// هوك استخدام سياق المصادقة
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
