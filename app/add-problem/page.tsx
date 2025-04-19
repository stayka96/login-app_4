"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProLogo } from "@/components/pro-logo"
import { useAuth } from "@/components/auth-provider"
import { createOrder } from "@/lib/supabase"
import { BottomNav } from "@/components/bottom-nav"
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { ImageUploader } from "@/components/image-uploader"
import { LocationPicker } from "@/components/location-picker"

export default function AddProblem() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [locationAddress, setLocationAddress] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // تحقق من تشغيل الكود في المتصفح فقط
  useEffect(() => {
    setIsClient(true)
  }, [])

  // التحقق من وجود المستخدم
  useEffect(() => {
    if (isClient && !user) {
      router.push("/login")
    }
  }, [user, router, isClient])

  if (!isClient) {
    return null // لا تعرض شيئًا أثناء عملية العرض على الخادم
  }

  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // التحقق من صحة البيانات
    if (!title) {
      setError("عنوان المشكلة مطلوب")
      return
    }
    if (!category) {
      setError("تصنيف المشكلة مطلوب")
      return
    }
    if (!description) {
      setError("وصف المشكلة مطلوب")
      return
    }
    if (!locationAddress) {
      setError("موقع المشكلة مطلوب")
      return
    }

    setIsLoading(true)

    try {
      console.log("Creating new order:", {
        title,
        description,
        category,
        location: locationAddress,
        user_id: user.id,
        images,
      })

      // إنشاء طلب جديد
      const { data, error } = await createOrder({
        title,
        description,
        category,
        location: locationAddress,
        user_id: user.id,
        images,
      })

      if (error) {
        console.error("Error creating order:", error)
        throw new Error(error.message || "حدث خطأ أثناء إنشاء الطلب")
      }

      console.log("Order created successfully:", data)

      // في حال نجاح العملية
      setSuccess(true)
      toast({
        title: "تم إضافة المشكلة بنجاح!",
        description: "سيتم توجيهك للصفحة الرئيسية خلال ثوان...",
        variant: "success",
      })

      // إعادة تعيين النموذج
      setTitle("")
      setDescription("")
      setCategory("")
      setLocationAddress("")
      setImages([])

      // الانتظار قليلاً قبل التوجيه
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error creating order:", error)
      setError(error.message || "حدث خطأ أثناء إنشاء الطلب")
      toast({
        title: "خطأ في إضافة المشكلة",
        description: error.message || "حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (locationData: { address: string; latitude: number; longitude: number }) => {
    setLocationAddress(locationData.address)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center justify-between">
        <Button variant="ghost" className="text-white p-0" onClick={() => router.back()}>
          <ArrowRight size={24} />
        </Button>
        <div className="flex items-center gap-2">
          <ProLogo size="sm" className="w-10 h-10" />
          <h1 className="text-xl font-bold">إضافة مشكلة جديدة</h1>
        </div>
        <div className="w-8"></div> {/* للمحافظة على التوازن */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-800">تم إضافة المشكلة بنجاح!</h2>
            <p className="text-green-600">سيتم توجيهك للصفحة الرئيسية خلال ثوان...</p>
            <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
              العودة للصفحة الرئيسية
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="block font-medium">
                عنوان المشكلة
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تسريب مياه في المطبخ"
                className="text-right"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block font-medium">
                التصنيف
              </label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر تصنيف المشكلة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">سباكة</SelectItem>
                  <SelectItem value="electricity">كهرباء</SelectItem>
                  <SelectItem value="carpentry">نجارة</SelectItem>
                  <SelectItem value="painting">دهان</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">الموقع</label>
              <LocationPicker onLocationSelect={handleLocationSelect} defaultAddress={locationAddress} />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                وصف المشكلة
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح المشكلة بالتفصيل..."
                className="text-right min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">صور المشكلة</label>
              <ImageUploader
                onImagesChange={(newImages) => setImages(newImages)}
                maxImages={4}
                initialImages={images}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال المشكلة"
              )}
            </Button>
          </form>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
