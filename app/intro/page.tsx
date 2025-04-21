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
"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import BricoolLogo from "@components/bricool-logo"

export default function IntroPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // تشغيل الصوت الترحيبي
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio error:", e))
    }

    // الانتقال التلقائي بعد 2.5 ثانية
    const timer = setTimeout(() => {
      router.push("/login")
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  const skipIntro = () => {
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0066FF] relative">
      {/* الصوت الترحيبي */}
      <audio ref={audioRef} src="/welcome.mp3" preload="auto" />

      {/* أنيميشن الشعار */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center"
      >
        <BricoolLogo size="xl" animate={true} showText={false} />
      </motion.div>

      {/* زر تجاوز المقدمة */}
      <button
        onClick={skipIntro}
        className="absolute bottom-6 right-6 text-white bg-black bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition"
      >
        ⏭️ تجاوز
      </button>
    </div>
  )
}
