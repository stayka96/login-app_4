"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import LoginForm from "@/components/login-form"
import { WorkMoneyLogo } from "@/components/work-money-logo"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      // إعادة التوجيه بناءً على دور المستخدم
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "technician") {
        router.push("/dashboard?tab=jobs")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <WorkMoneyLogo size="md" animate={true} />
          <p className="mt-4 text-xl font-cairo">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm />
    </motion.main>
  )
}
