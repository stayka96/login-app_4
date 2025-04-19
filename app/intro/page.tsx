"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BricoolLogo } from "@/components/bricool-logo"

export default function IntroPage() {
  const router = useRouter()

  useEffect(() => {
    // الانتقال إلى صفحة تسجيل الدخول بعد 2.5 ثانية
    const timer = setTimeout(() => {
      router.push("/login")
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0066FF]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <BricoolLogo size="xl" animate={true} showText={false} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-3xl font-bold text-white"
        >
          BRICOOL
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-2 text-white text-lg"
        >
          الحل الأمثل لخدمات الصيانة والإصلاح
        </motion.p>
      </motion.div>
    </div>
  )
}
