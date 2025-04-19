"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { createRating, createNotification } from "@/lib/supabase"
import { StarRating } from "@/components/star-rating"

export default function RateServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!user || !params.id) {
      router.push("/orders")
      return
    }

    // تحميل معلومات الطلب
    // في التطبيق الحقيقي، يجب استرجاع معلومات الطلب من الخادم
    setOrder({
      id: params.id,
      title: "إصلاح تسريب مياه في المطبخ",
      date: "15 يونيو 2023",
      technician_id: "technician-id",
      technician: {
        id: "technician-id",
        name: "أحمد محمد",
        avatar: "/placeholder.svg?height=60&width=60",
        profession: "فني سباكة",
      },
    })
  }, [user, params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user || !order) return

    if (rating === 0) {
      setError("يرجى اختيار تقييم")
      return
    }

    setIsSubmitting(true)

    try {
      // إنشاء تقييم جديد
      const { data, error } = await createRating({
        order_id: order.id,
        user_id: user.id,
        technician_id: order.technician_id,
        rating,
        comment,
      })

      if (error) throw error

      // إرسال إشعار للحرفي
      await createNotification({
        user_id: order.technician_id,
        title: "تقييم جديد",
        message: `قام ${user.name} بتقييم خدمتك بـ ${rating} نجوم`,
        type: "system",
      })

      // العودة إلى صفحة الطلبات
      router.push("/orders")
    } catch (error: any) {
      console.error("Error creating rating:", error)
      setError(error.message || "حدث خطأ أثناء إرسال التقييم")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-[#0066FF] text-white p-4 flex items-center justify-between">
        <Button variant="ghost" className="text-white p-0" onClick={() => router.back()}>
          <ArrowRight size={24} />
        </Button>
        <h1 className="text-xl font-bold">تقييم الخدمة</h1>
        <div className="w-8"></div> {/* للمحافظة على التوازن */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={order.technician.avatar || "/placeholder.svg"}
              alt="صورة الفني"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-bold">{order.technician.name}</h2>
              <p className="text-gray-600">{order.technician.profession}</p>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <h3 className="font-bold mb-2">تفاصيل الخدمة</h3>
            <p className="text-gray-700">{order.title}</p>
            <p className="text-gray-500 text-sm mt-1">تاريخ الخدمة: {order.date}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-medium">كيف تقيم الخدمة؟</label>
              <div className="flex justify-center my-4">
                <StarRating initialRating={rating} size="lg" onChange={setRating} />
              </div>
              <p className="text-center font-medium">
                {rating === 1
                  ? "سيء"
                  : rating === 2
                    ? "مقبول"
                    : rating === 3
                      ? "جيد"
                      : rating === 4
                        ? "جيد جدًا"
                        : rating === 5
                          ? "ممتاز"
                          : "اختر تقييمك"}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="block font-medium">
                تعليقك (اختياري)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="أخبرنا المزيد عن تجربتك..."
                className="text-right min-h-[120px]"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-[#0066FF] hover:bg-[#0055DD]"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
